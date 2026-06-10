import { z } from 'zod'

export type Stage =
  | 'new_lead'
  | 'contacted'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export type Deal = {
  id: string
  workspace_id: string
  lead_id: string | null
  owner_id: string | null
  title: string
  value: number
  stage: Stage
  position: number
  expected_close_date: string | null
  created_at: string
  updated_at: string
  lead_name?: string | null
}

export type StageConfig = {
  id: Stage
  label: string
  accentColor: string
}

export const STAGES: StageConfig[] = [
  { id: 'new_lead',     label: 'Novo Lead',        accentColor: '#64748b' },
  { id: 'contacted',   label: 'Contato Realizado', accentColor: '#3b82f6' },
  { id: 'proposal',    label: 'Proposta Enviada',  accentColor: '#8b5cf6' },
  { id: 'negotiation', label: 'Negociação',        accentColor: '#f59e0b' },
  { id: 'won',         label: 'Fechado Ganho',     accentColor: '#16a34a' },
  { id: 'lost',        label: 'Fechado Perdido',   accentColor: '#dc2626' },
]

export const STAGE_LABELS: Record<Stage, string> = {
  new_lead:    'Novo Lead',
  contacted:   'Contato Realizado',
  proposal:    'Proposta Enviada',
  negotiation: 'Negociação',
  won:         'Fechado Ganho',
  lost:        'Fechado Perdido',
}

export const dealSchema = z.object({
  title:               z.string().min(1, 'Título obrigatório'),
  value:               z.number().min(0, 'Valor deve ser positivo'),
  stage:               z.enum(['new_lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost']),
  lead_id:             z.string().nullable(),
  expected_close_date: z.string().min(1, 'Prazo obrigatório'),
})

export type DealFormValues = z.infer<typeof dealSchema>
