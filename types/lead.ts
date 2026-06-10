import { z } from 'zod'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'won'
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task'

export type Lead = {
  id: string
  workspace_id: string
  owner_id: string | null
  name: string
  company: string | null
  email: string | null
  phone: string | null
  status: LeadStatus
  source: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Activity = {
  id: string
  workspace_id: string
  deal_id: string | null
  lead_id: string | null
  user_id: string | null
  type: ActivityType
  title: string
  notes: string | null
  scheduled_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new:       'Novo',
  contacted: 'Contato Realizado',
  qualified: 'Qualificado',
  won:       'Ganho',
  lost:      'Perdido',
}

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  site:      'Site',
  linkedin:  'LinkedIn',
  indicacao: 'Indicação',
  evento:    'Evento',
  google:    'Google',
  outro:     'Outro',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call:    'Ligação',
  email:   'E-mail',
  meeting: 'Reunião',
  note:    'Nota',
  task:    'Tarefa',
}

export const leadSchema = z.object({
  name:    z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email:   z.string().email('E-mail inválido'),
  phone:   z.string(),
  company: z.string().min(1, 'Empresa obrigatória'),
  status:  z.enum(['new', 'contacted', 'qualified', 'lost', 'won']),
  source:  z.enum(['site', 'linkedin', 'indicacao', 'evento', 'google', 'outro']),
  notes:   z.string(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
