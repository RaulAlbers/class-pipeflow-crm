import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LeadForm } from '@/components/leads/LeadForm'

export const metadata: Metadata = { title: 'Novo Lead — PipeFlow' }

export default function NewLeadPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Leads
        </Link>
        <h2 className="text-base font-semibold text-text mt-2">Novo Lead</h2>
        <p className="text-sm text-text-muted mt-0.5">Preencha as informações do novo lead.</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <LeadForm />
      </div>
    </div>
  )
}
