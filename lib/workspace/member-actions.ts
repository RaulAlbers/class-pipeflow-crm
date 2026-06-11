'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId, setActiveWorkspaceId } from '@/lib/workspace/active'
import { getResendClient } from '@/lib/resend/client'
import { buildInviteEmailHtml, buildInviteEmailSubject } from '@/lib/resend/invite-email'
import type { WorkspaceMemberRole } from '@/types/supabase'

// Free plan allows at most 2 active members
const FREE_PLAN_MEMBER_LIMIT = 2

const inviteSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role:  z.enum(['admin', 'member']),
})

type ActionResult = { error: string } | { success: true }

// ── Types returned to the UI ──────────────────────────────

export type MemberRow = {
  id:          string
  user_id:     string
  role:        WorkspaceMemberRole
  email:       string
  full_name:   string
  created_at:  string
  isCurrentUser: boolean
}

export type PendingInviteRow = {
  id:          string
  email:       string
  role:        WorkspaceMemberRole
  invited_by:  string
  expires_at:  string
  created_at:  string
}

// ── listMembers ────────────────────────────────────────────

export async function listMembers(): Promise<MemberRow[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data: { user } } = await supabase.auth.getUser()

  const { data: members, error } = await supabase
    .from('workspace_members')
    .select('id, user_id, role, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })

  if (error || !members?.length) return []

  const userIds = members.map(m => m.user_id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds)

  const profileMap = new Map(
    (profiles ?? []).map(p => [p.id, p])
  )

  return members.map(m => {
    const profile = profileMap.get(m.user_id)
    return {
      id:            m.id,
      user_id:       m.user_id,
      role:          m.role,
      email:         profile?.email ?? '',
      full_name:     profile?.full_name ?? profile?.email?.split('@')[0] ?? '',
      created_at:    m.created_at,
      isCurrentUser: m.user_id === user?.id,
    }
  })
}

// ── listPendingInvites ─────────────────────────────────────

export async function listPendingInvites(): Promise<PendingInviteRow[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data, error } = await supabase
    .from('workspace_invites')
    .select('id, email, role, invited_by, expires_at, created_at')
    .eq('workspace_id', workspaceId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as PendingInviteRow[]
}

// ── inviteMember ───────────────────────────────────────────

export async function inviteMember(values: {
  email: string
  role: 'admin' | 'member'
}): Promise<ActionResult> {
  const parsed = inviteSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase    = await getSupabaseServerClient()
  const adminClient = getSupabaseAdminClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { error: 'Workspace não encontrada.' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  // Fetch workspace name + subscription plan
  const { data: ws } = await supabase
    .from('workspaces')
    .select('name, subscriptions(plan)')
    .eq('id', workspaceId)
    .single()

  if (!ws) return { error: 'Workspace não encontrada.' }

  const subs = ws.subscriptions as { plan: string }[] | null
  const plan = subs?.[0]?.plan ?? 'free'

  // Enforce Free plan limit: count active members
  if (plan === 'free') {
    const { count } = await supabase
      .from('workspace_members')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)

    if ((count ?? 0) >= FREE_PLAN_MEMBER_LIMIT) {
      return {
        error: `O plano Free permite no máximo ${FREE_PLAN_MEMBER_LIMIT} membros. Faça upgrade para Pro para convidar mais pessoas.`,
      }
    }
  }

  // Check if email is already an active member
  const emailLower = parsed.data.email.toLowerCase()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', emailLower)
    .maybeSingle()

  if (profiles?.id) {
    const { data: existing } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', profiles.id)
      .maybeSingle()

    if (existing) return { error: 'Este usuário já é membro do workspace.' }
  }

  // Get inviter's profile name
  const { data: inviterProfile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const inviterName = inviterProfile?.full_name ?? user.email ?? 'Alguém'

  // Create invite record (INSERT policy checks admin role via RLS)
  const { data: invite, error: insertError } = await supabase
    .from('workspace_invites')
    .insert({
      workspace_id: workspaceId,
      email:        emailLower,
      role:         parsed.data.role,
      invited_by:   user.id,
    })
    .select('token')
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return { error: 'Já existe um convite pendente para este e-mail.' }
    }
    return { error: 'Erro ao criar convite. Verifique se você tem permissão de administrador.' }
  }

  // Send email via Resend
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const inviteUrl = `${siteUrl}/invite/${invite.token}`

  try {
    const resend = getResendClient()
    await resend.emails.send({
      from:    process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
      to:      [parsed.data.email],
      subject: buildInviteEmailSubject(ws.name),
      html:    buildInviteEmailHtml({
        workspaceName: ws.name,
        inviterName,
        role:          parsed.data.role,
        inviteUrl,
      }),
    })
  } catch {
    // Email failed — revoke the invite so state stays consistent
    await adminClient
      .from('workspace_invites')
      .delete()
      .eq('token', invite.token)
    return { error: 'Erro ao enviar e-mail de convite. Tente novamente.' }
  }

  revalidatePath('/settings')
  return { success: true }
}

// ── revokeInvite ───────────────────────────────────────────

export async function revokeInvite(inviteId: string): Promise<ActionResult> {
  if (!inviteId) return { error: 'ID inválido.' }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('workspace_invites')
    .delete()
    .eq('id', inviteId)

  if (error) return { error: 'Erro ao revogar convite.' }

  revalidatePath('/settings')
  return { success: true }
}

// ── removeMember ───────────────────────────────────────────

export async function removeMember(memberId: string): Promise<ActionResult> {
  if (!memberId) return { error: 'ID inválido.' }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('id', memberId)

  if (error) return { error: 'Erro ao remover membro.' }

  revalidatePath('/settings')
  return { success: true }
}

// ── updateMemberRole ───────────────────────────────────────

const updateRoleSchema = z.object({
  memberId: z.string().uuid(),
  role:     z.enum(['admin', 'member']),
})

export async function updateMemberRole(values: {
  memberId: string
  role: 'admin' | 'member'
}): Promise<ActionResult> {
  const parsed = updateRoleSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('workspace_members')
    .update({ role: parsed.data.role })
    .eq('id', parsed.data.memberId)

  if (error) return { error: 'Erro ao atualizar função do membro.' }

  revalidatePath('/settings')
  return { success: true }
}

// ── acceptInvite (called from the invite page) ────────────

export async function acceptInvite(token: string): Promise<ActionResult> {
  if (!token) return { error: 'Token inválido.' }

  const adminClient = getSupabaseAdminClient()
  const supabase    = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Você precisa estar autenticado para aceitar o convite.' }

  // Load invite bypassing RLS (user may not be a member yet)
  const { data: invite, error: fetchError } = await adminClient
    .from('workspace_invites')
    .select('id, workspace_id, email, role, accepted_at, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (fetchError || !invite) return { error: 'Convite não encontrado ou inválido.' }
  if (invite.accepted_at)     return { error: 'Este convite já foi aceito.' }
  if (new Date(invite.expires_at) < new Date()) return { error: 'Este convite expirou.' }

  // Guard: email match (case-insensitive)
  if (user.email?.toLowerCase() !== invite.email.toLowerCase()) {
    return {
      error: `Este convite é para ${invite.email}. Faça login com essa conta para aceitar.`,
    }
  }

  // Check if already a member
  const { data: existingMember } = await adminClient
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', invite.workspace_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingMember) {
    // Already a member — just mark the invite as accepted
    await adminClient
      .from('workspace_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id)
    return { success: true }
  }

  // Enforce Free plan limit
  const { data: wsSub } = await adminClient
    .from('subscriptions')
    .select('plan')
    .eq('workspace_id', invite.workspace_id)
    .maybeSingle()

  const plan = wsSub?.plan ?? 'free'

  if (plan === 'free') {
    const { count } = await adminClient
      .from('workspace_members')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', invite.workspace_id)

    if ((count ?? 0) >= FREE_PLAN_MEMBER_LIMIT) {
      return {
        error: 'O workspace atingiu o limite do plano Free (2 membros). Peça ao administrador para fazer upgrade.',
      }
    }
  }

  // Add as member
  const { error: memberError } = await adminClient
    .from('workspace_members')
    .insert({ workspace_id: invite.workspace_id, user_id: user.id, role: invite.role })

  if (memberError) return { error: 'Erro ao adicionar você ao workspace.' }

  // Mark invite as accepted
  await adminClient
    .from('workspace_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  // Switch the active workspace so the user lands in the right place
  await setActiveWorkspaceId(invite.workspace_id)

  return { success: true }
}
