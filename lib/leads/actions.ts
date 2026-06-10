'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/workspace/active'
import { leadSchema, type Lead, type LeadFormValues } from '@/types/lead'

type ActionOk<T>  = { data: T; error?: never }
type ActionErr    = { error: string; data?: never }
type ActionResult<T = undefined> = ActionOk<T> | ActionErr

async function requireWorkspace(): Promise<string> {
  const id = await getActiveWorkspaceId()
  if (!id) throw new Error('Nenhum workspace ativo')
  return id
}

export async function getLeads(workspaceId: string): Promise<Lead[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Lead[]
}

export async function searchLeads(
  workspaceId: string,
  q: string,
  status: string,
): Promise<Lead[]> {
  const supabase = await getSupabaseServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (q.trim()) {
    query = query.or(`name.ilike.%${q.trim()}%,company.ilike.%${q.trim()}%,email.ilike.%${q.trim()}%`)
  }
  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Lead[]
}

export async function createLead(values: LeadFormValues): Promise<ActionResult<Lead>> {
  const parsed = leadSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  try {
    const workspaceId = await requireWorkspace()
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('leads')
      .insert({
        workspace_id: workspaceId,
        owner_id:     user?.id ?? null,
        name:         parsed.data.name,
        email:        parsed.data.email || null,
        phone:        parsed.data.phone || null,
        company:      parsed.data.company || null,
        status:       parsed.data.status,
        source:       parsed.data.source || null,
        notes:        parsed.data.notes || null,
      })
      .select('*')
      .single()

    if (error) return { error: error.message }
    revalidatePath('/leads')
    return { data: data as Lead }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro desconhecido' }
  }
}

export async function updateLead(
  id: string,
  values: LeadFormValues,
): Promise<ActionResult<Lead>> {
  const parsed = leadSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('leads')
      .update({
        name:    parsed.data.name,
        email:   parsed.data.email || null,
        phone:   parsed.data.phone || null,
        company: parsed.data.company || null,
        status:  parsed.data.status,
        source:  parsed.data.source || null,
        notes:   parsed.data.notes || null,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { error: error.message }
    revalidatePath('/leads')
    revalidatePath(`/leads/${id}`)
    return { data: data as Lead }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro desconhecido' }
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/leads')
    return { data: undefined }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro desconhecido' }
  }
}
