import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { LeadDetailClient } from '@/components/leads/LeadDetailClient'
import type { Lead, Activity } from '@/types/lead'

export const metadata: Metadata = { title: 'Lead — PipeFlow' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const [leadResult, activitiesResult] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('activities')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!leadResult.data) notFound()

  return (
    <LeadDetailClient
      lead={leadResult.data as Lead}
      activities={(activitiesResult.data ?? []) as Activity[]}
    />
  )
}
