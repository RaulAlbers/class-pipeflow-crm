import { z } from "zod"

export type Stage =
  | "novo-lead"
  | "contato-realizado"
  | "proposta-enviada"
  | "negociacao"
  | "fechado-ganho"
  | "fechado-perdido"

export type Deal = {
  id: string
  title: string
  value: number
  stage: Stage
  leadName: string
  assigneeName: string
  assigneeInitials: string
  deadline: string
  createdAt: string
}

export type StageConfig = {
  id: Stage
  label: string
  accentColor: string
}

export const STAGES: StageConfig[] = [
  { id: "novo-lead",         label: "Novo Lead",         accentColor: "#64748b" },
  { id: "contato-realizado", label: "Contato Realizado", accentColor: "#3b82f6" },
  { id: "proposta-enviada",  label: "Proposta Enviada",  accentColor: "#8b5cf6" },
  { id: "negociacao",        label: "Negociação",        accentColor: "#f59e0b" },
  { id: "fechado-ganho",     label: "Fechado Ganho",     accentColor: "#16a34a" }, // --color-success
  { id: "fechado-perdido",   label: "Fechado Perdido",   accentColor: "#dc2626" }, // --color-danger
]

export const STAGE_LABELS: Record<Stage, string> = {
  "novo-lead":         "Novo Lead",
  "contato-realizado": "Contato Realizado",
  "proposta-enviada":  "Proposta Enviada",
  "negociacao":        "Negociação",
  "fechado-ganho":     "Fechado Ganho",
  "fechado-perdido":   "Fechado Perdido",
}

export const ASSIGNEES = [
  { name: "Ana Silva",    initials: "AS" },
  { name: "Bruno Costa",  initials: "BC" },
  { name: "Carla Mendes", initials: "CM" },
  { name: "Diego Rocha",  initials: "DR" },
] as const

export const dealSchema = z.object({
  title:            z.string().min(1, "Título obrigatório"),
  value:            z.number().min(0, "Valor deve ser positivo"),
  stage:            z.enum(["novo-lead", "contato-realizado", "proposta-enviada", "negociacao", "fechado-ganho", "fechado-perdido"]),
  leadName:         z.string().min(1, "Lead obrigatório"),
  assigneeName:     z.string().min(1, "Responsável obrigatório"),
  assigneeInitials: z.string(),
  deadline:         z.string().min(1, "Prazo obrigatório"),
})

export type DealFormValues = z.infer<typeof dealSchema>

export const MOCK_DEALS: Deal[] = [
  // novo-lead
  {
    id: "d1",
    title: "Licença Pro — TechBR Soluções",
    value: 48000,
    stage: "novo-lead",
    leadName: "Carlos Eduardo Mendes",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-06-25",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "d2",
    title: "CRM para equipe de 30 vendedores",
    value: 72000,
    stage: "novo-lead",
    leadName: "Beatriz Teixeira",
    assigneeName: "Bruno Costa",
    assigneeInitials: "BC",
    deadline: "2026-07-10",
    createdAt: "2026-05-29T16:00:00Z",
  },
  {
    id: "d3",
    title: "Plano Anual — FinanTech",
    value: 58800,
    stage: "novo-lead",
    leadName: "Henrique Mota",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-06-30",
    createdAt: "2026-05-31T09:00:00Z",
  },
  {
    id: "d4",
    title: "Expansão de licenças — Studio Moda",
    value: 9600,
    stage: "novo-lead",
    leadName: "Juliana Ferreira",
    assigneeName: "Bruno Costa",
    assigneeInitials: "BC",
    deadline: "2026-07-15",
    createdAt: "2026-05-30T14:00:00Z",
  },

  // contato-realizado
  {
    id: "d5",
    title: "Gestão de pipeline — Construtora Máxima",
    value: 18000,
    stage: "contato-realizado",
    leadName: "Mariana Oliveira",
    assigneeName: "Bruno Costa",
    assigneeInitials: "BC",
    deadline: "2026-06-09",
    createdAt: "2026-05-10T18:00:00Z",
  },
  {
    id: "d6",
    title: "Automação de follow-ups — Agência Pixel",
    value: 14400,
    stage: "contato-realizado",
    leadName: "André Vieira",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-06-08",
    createdAt: "2026-05-17T08:30:00Z",
  },
  {
    id: "d7",
    title: "CRM para escritório jurídico",
    value: 16800,
    stage: "contato-realizado",
    leadName: "Lucas Nunes",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-06-20",
    createdAt: "2026-05-26T10:00:00Z",
  },

  // proposta-enviada
  {
    id: "d8",
    title: "Plano Pro — Logística 360",
    value: 32000,
    stage: "proposta-enviada",
    leadName: "Fernanda Rodrigues",
    assigneeName: "Bruno Costa",
    assigneeInitials: "BC",
    deadline: "2026-06-05",
    createdAt: "2026-05-18T09:00:00Z",
  },
  {
    id: "d9",
    title: "Pipeline + Atividades — CS Digital",
    value: 19200,
    stage: "proposta-enviada",
    leadName: "Camila Santos",
    assigneeName: "Bruno Costa",
    assigneeInitials: "BC",
    deadline: "2026-06-12",
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "d10",
    title: "Plano Pro — Mídias Criativas",
    value: 23040,
    stage: "proposta-enviada",
    leadName: "Tatiana Luz",
    assigneeName: "Carla Mendes",
    assigneeInitials: "CM",
    deadline: "2026-06-15",
    createdAt: "2026-05-20T09:00:00Z",
  },

  // negociacao
  {
    id: "d11",
    title: "Contrato anual — TechBR",
    value: 48000,
    stage: "negociacao",
    leadName: "Carlos Eduardo Mendes",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-06-04",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "d12",
    title: "Licença Enterprise — Grupo Vitória",
    value: 144000,
    stage: "negociacao",
    leadName: "Roberto Almeida",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-06-18",
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "d13",
    title: "CRM vs Pipedrive — Prado Construções",
    value: 36000,
    stage: "negociacao",
    leadName: "Gustavo Prado",
    assigneeName: "Diego Rocha",
    assigneeInitials: "DR",
    deadline: "2026-06-10",
    createdAt: "2026-05-15T11:00:00Z",
  },

  // fechado-ganho
  {
    id: "d14",
    title: "Plano Pro — Innova Tech",
    value: 28800,
    stage: "fechado-ganho",
    leadName: "Rafael Souza",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-04-30",
    createdAt: "2026-04-10T08:00:00Z",
  },
  {
    id: "d15",
    title: "Plano Anual — Escola EduPlus",
    value: 28800,
    stage: "fechado-ganho",
    leadName: "Aline Carvalho",
    assigneeName: "Bruno Costa",
    assigneeInitials: "BC",
    deadline: "2026-04-22",
    createdAt: "2026-04-05T08:00:00Z",
  },
  {
    id: "d16",
    title: "Licença Pro + Suporte — IndústriaNet",
    value: 62400,
    stage: "fechado-ganho",
    leadName: "Marcos Pereira",
    assigneeName: "Carla Mendes",
    assigneeInitials: "CM",
    deadline: "2026-05-10",
    createdAt: "2026-03-20T09:00:00Z",
  },
  {
    id: "d17",
    title: "CRM para 15 vendedores — GreenBiz",
    value: 43200,
    stage: "fechado-ganho",
    leadName: "Larissa Fonseca",
    assigneeName: "Diego Rocha",
    assigneeInitials: "DR",
    deadline: "2026-05-28",
    createdAt: "2026-04-15T11:00:00Z",
  },

  // fechado-perdido
  {
    id: "d18",
    title: "Plano PME — Distribuidora Palmas",
    value: 9600,
    stage: "fechado-perdido",
    leadName: "Paulo Henrique Castro",
    assigneeName: "Ana Silva",
    assigneeInitials: "AS",
    deadline: "2026-05-02",
    createdAt: "2026-04-15T09:00:00Z",
  },
  {
    id: "d19",
    title: "Pipeline básico — SoftHouse RJ",
    value: 14400,
    stage: "fechado-perdido",
    leadName: "Rodrigo Bastos",
    assigneeName: "Diego Rocha",
    assigneeInitials: "DR",
    deadline: "2026-05-15",
    createdAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "d20",
    title: "CRM para varejo — Rede Clima Frio",
    value: 21600,
    stage: "fechado-perdido",
    leadName: "Sônia Ramos",
    assigneeName: "Carla Mendes",
    assigneeInitials: "CM",
    deadline: "2026-05-20",
    createdAt: "2026-04-10T08:00:00Z",
  },
]
