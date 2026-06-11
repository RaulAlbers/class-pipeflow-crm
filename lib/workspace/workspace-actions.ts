'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId, setActiveWorkspaceId } from '@/lib/workspace/active'

type ActionResult = { error: string } | { success: true }

// ── switchWorkspace ────────────────────────────────────────

export async function switchWorkspace(workspaceId: string): Promise<ActionResult> {
  if (!workspaceId) return { error: 'ID inválido.' }

  const supabase = await getSupabaseServerClient()

  // Validate user actually belongs to this workspace (RLS enforces it)
  const { data, error } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', workspaceId)
    .maybeSingle()

  if (error || !data) return { error: 'Sem acesso a este workspace.' }

  await setActiveWorkspaceId(workspaceId)
  revalidatePath('/', 'layout')
  return { success: true }
}

// ── updateWorkspaceName ────────────────────────────────────

const nameSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(60, 'Máximo de 60 caracteres'),
})

export async function updateWorkspaceName(
  values: { name: string }
): Promise<ActionResult> {
  const parsed = nameSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase    = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { error: 'Workspace não encontrada.' }

  const { error } = await supabase
    .from('workspaces')
    .update({ name: parsed.data.name })
    .eq('id', workspaceId)

  if (error) return { error: 'Erro ao atualizar nome. Verifique se você é administrador.' }

  revalidatePath('/', 'layout')
  revalidatePath('/settings')
  return { success: true }
}
