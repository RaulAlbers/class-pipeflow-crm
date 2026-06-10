import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getActiveWorkspaceId } from '@/lib/workspace/active'
import { getDeals } from '@/lib/deals/actions'
import { getLeads } from '@/lib/leads/actions'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'

export const metadata: Metadata = { title: 'Pipeline — PipeFlow' }

export default async function PipelinePage() {
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const [deals, leads] = await Promise.all([
    getDeals(workspaceId),
    getLeads(workspaceId),
  ])

  return (
    <div className="-m-6 flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <KanbanBoard initialDeals={deals} workspaceId={workspaceId} leads={leads} />
    </div>
  )
}
