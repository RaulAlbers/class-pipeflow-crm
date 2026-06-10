import { cookies } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function getActiveWorkspaceId(): Promise<string | null> {
  const cookieStore = await cookies()
  const fromCookie = cookieStore.get('pipeflow_workspace_id')?.value
  if (fromCookie) return fromCookie

  // Fallback: find the first workspace the user belongs to
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .limit(1)
    .maybeSingle()

  return data?.workspace_id ?? null
}

export async function setActiveWorkspaceId(workspaceId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('pipeflow_workspace_id', workspaceId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: true,
  })
}
