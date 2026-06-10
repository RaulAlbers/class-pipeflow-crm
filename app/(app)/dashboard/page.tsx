import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import {
  Users,
  TrendingUp,
  Trophy,
  Clock,
  XCircle,
  BarChart3,
} from 'lucide-react'
import { getActiveWorkspaceId } from '@/lib/workspace/active'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Lead, Deal } from '@/types/supabase'

export const metadata: Metadata = { title: 'Dashboard — PipeFlow' }

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 flex items-start gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent ?? '#3b82f6'}20` }}
      >
        <Icon className="h-5 w-5" style={{ color: accent ?? '#3b82f6' }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-2xl font-bold text-text mt-0.5 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function FunnelBar({
  label,
  count,
  value,
  color,
  maxCount,
}: {
  label: string
  count: number
  value: number
  color: string
  maxCount: number
}) {
  const widthPct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-xs text-text-muted truncate text-right">{label}</span>
      <div className="flex-1 h-5 bg-overlay rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{ width: `${widthPct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-16 shrink-0 text-xs text-text-muted tabular-nums text-right">
        {count} · {formatCurrency(value)}
      </span>
    </div>
  )
}

export default async function DashboardPage() {
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const supabase = await getSupabaseServerClient()

  const [leadsResult, dealsResult] = await Promise.all([
    supabase.from('leads').select('*').eq('workspace_id', workspaceId),
    supabase.from('deals').select('*').eq('workspace_id', workspaceId),
  ])

  const leads  = (leadsResult.data  ?? []) as Lead[]
  const deals  = (dealsResult.data  ?? []) as Deal[]

  // ── Lead metrics ────────────────────────────────────────────────────────────
  const totalLeads    = leads.length
  const newLeads      = leads.filter((l) => l.status === 'new').length
  const wonLeads      = leads.filter((l) => l.status === 'won').length
  const lostLeads     = leads.filter((l) => l.status === 'lost').length

  // ── Deal metrics ─────────────────────────────────────────────────────────────
  const activeDeals   = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
  const wonDeals      = deals.filter((d) => d.stage === 'won')
  const pipelineValue = activeDeals.reduce((s, d) => s + d.value, 0)
  const wonValue      = wonDeals.reduce((s, d) => s + d.value, 0)

  // ── Funnel per stage ─────────────────────────────────────────────────────────
  const stageOrder = ['new_lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] as const
  const stageMeta: Record<string, { label: string; color: string }> = {
    new_lead:    { label: 'Novo Lead',        color: '#64748b' },
    contacted:   { label: 'Contato Realizado', color: '#3b82f6' },
    proposal:    { label: 'Proposta Enviada',  color: '#8b5cf6' },
    negotiation: { label: 'Negociação',        color: '#f59e0b' },
    won:         { label: 'Fechado Ganho',     color: '#16a34a' },
    lost:        { label: 'Fechado Perdido',   color: '#dc2626' },
  }
  const funnelData = stageOrder.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage)
    return {
      stage,
      label: stageMeta[stage].label,
      color: stageMeta[stage].color,
      count: stageDeals.length,
      value: stageDeals.reduce((s, d) => s + d.value, 0),
    }
  })
  const maxCount = Math.max(...funnelData.map((f) => f.count), 1)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-text">Dashboard</h2>
        <p className="text-xs text-text-muted mt-0.5">Visão geral do pipeline e performance.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total de Leads"
          value={String(totalLeads)}
          sub={`${newLeads} novos`}
          accent="#3b82f6"
        />
        <MetricCard
          icon={TrendingUp}
          label="Pipeline Ativo"
          value={formatCurrency(pipelineValue)}
          sub={`${activeDeals.length} deal${activeDeals.length !== 1 ? 's' : ''}`}
          accent="#8b5cf6"
        />
        <MetricCard
          icon={Trophy}
          label="Fechados Ganhos"
          value={formatCurrency(wonValue)}
          sub={`${wonDeals.length} deal${wonDeals.length !== 1 ? 's' : ''}`}
          accent="#16a34a"
        />
        <MetricCard
          icon={XCircle}
          label="Leads Perdidos"
          value={String(lostLeads)}
          sub={`${wonLeads} ganhos`}
          accent="#dc2626"
        />
      </div>

      {/* Pipeline funnel */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="h-4 w-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text">Funil de Pipeline</h3>
        </div>

        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
            <Clock className="h-6 w-6 text-text-muted" />
            <p className="text-sm text-text-subtle">Nenhum deal criado ainda.</p>
            <p className="text-xs text-text-muted">Crie deals no Pipeline para ver o funil.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {funnelData.map((row) => (
              <FunnelBar
                key={row.stage}
                label={row.label}
                count={row.count}
                value={row.value}
                color={row.color}
                maxCount={maxCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lead status breakdown */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-text mb-4">Leads por Status</h3>

        {leads.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">Nenhum lead cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(
              [
                { key: 'new',       label: 'Novo',              color: '#3b82f6' },
                { key: 'contacted', label: 'Contato Realizado',  color: '#eab308' },
                { key: 'qualified', label: 'Qualificado',        color: '#8b5cf6' },
                { key: 'won',       label: 'Ganho',              color: '#16a34a' },
                { key: 'lost',      label: 'Perdido',            color: '#dc2626' },
              ] as const
            ).map(({ key, label, color }) => {
              const count = leads.filter((l) => l.status === key).length
              const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
              return (
                <div key={key} className="flex flex-col gap-1.5 p-3 rounded-md bg-overlay">
                  <span className="text-xs text-text-muted">{label}</span>
                  <span className="text-xl font-bold tabular-nums" style={{ color }}>{count}</span>
                  <span className="text-xs text-text-muted">{pct}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
