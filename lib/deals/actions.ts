'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/workspace/active'
import { dealSchema, type Deal, type DealFormValues, type Stage } from '@/types/deal'

type ActionOk<T>  = { data: T; error?: never }
type ActionErr    = { error: string; data?: never }
type ActionResult<T = undefined> = ActionOk<T> | ActionErr

type DealRow = Omit<Deal, 'lead_name'> & { leads: { name: string } | null }

function mapDealRow(row: DealRow): Deal {
  const { leads, ...rest } = row
  return { ...rest, lead_name: leads?.name ?? null }
}

async function requireWorkspace(): Promise<string> {
  const id = await getActiveWorkspaceId()
  if (!id) throw new Error('Nenhum workspace ativo')
  return id
}

export async function getDeals(workspaceId: string): Promise<Deal[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('deals')
    .select('*, leads(name)')
    .eq('workspace_id', workspaceId)
    .order('stage')
    .order('position')

  if (error) throw error
  return (data ?? []).map((d) => mapDealRow(d as unknown as DealRow))
}

export async function createDeal(values: DealFormValues): Promise<ActionResult<Deal>> {
  const parsed = dealSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  try {
    const workspaceId = await requireWorkspace()
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Position = end of target stage column
    const { data: last } = await supabase
      .from('deals')
      .select('position')
      .eq('workspace_id', workspaceId)
      .eq('stage', parsed.data.stage)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle()

    const position = (last?.position ?? -1) + 1

    const { data, error } = await supabase
      .from('deals')
      .insert({
        workspace_id:        workspaceId,
        owner_id:            user?.id ?? null,
        lead_id:             parsed.data.lead_id,
        title:               parsed.data.title,
        value:               parsed.data.value,
        stage:               parsed.data.stage,
        position,
        expected_close_date: parsed.data.expected_close_date || null,
      })
      .select('*, leads(name)')
      .single()

    if (error) return { error: error.message }
    revalidatePath('/pipeline')
    return { data: mapDealRow(data as unknown as DealRow) }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro desconhecido' }
  }
}

export async function updateDealStage(
  id: string,
  stage: Stage,
  position: number,
): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
      .from('deals')
      .update({ stage, position })
      .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/pipeline')
    return { data: undefined }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro desconhecido' }
  }
}

export async function deleteDeal(id: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.from('deals').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/pipeline')
    return { data: undefined }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro desconhecido' }
  }
}
