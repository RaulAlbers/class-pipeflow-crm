import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getActiveWorkspaceId } from '@/lib/workspace/active'
import { getLeads } from '@/lib/leads/actions'
import { LeadsView } from '@/components/leads/LeadsView'

export const metadata: Metadata = { title: 'Leads — PipeFlow' }

export default async function LeadsPage() {
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const leads = await getLeads(workspaceId)

  return <LeadsView initialLeads={leads} workspaceId={workspaceId} />
}
