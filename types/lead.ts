import { z } from "zod";

export type LeadStatus =
  | "novo"
  | "contato"
  | "proposta"
  | "negociacao"
  | "ganho"
  | "perdido";

export type LeadSource =
  | "site"
  | "linkedin"
  | "indicacao"
  | "evento"
  | "google"
  | "outro";

export type ActivityType = "ligacao" | "email" | "reuniao" | "nota";

export type Activity = {
  id: string;
  type: ActivityType;
  description: string;
  author: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: LeadStatus;
  assignedTo: string;
  source: LeadSource;
  value: number;
  notes: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  contato: "Contato Realizado",
  proposta: "Proposta Enviada",
  negociacao: "Negociação",
  ganho: "Ganho",
  perdido: "Perdido",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  site: "Site",
  linkedin: "LinkedIn",
  indicacao: "Indicação",
  evento: "Evento",
  google: "Google",
  outro: "Outro",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  ligacao: "Ligação",
  email: "E-mail",
  reuniao: "Reunião",
  nota: "Nota",
};

export const leadSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  company: z.string().min(1, "Empresa obrigatória"),
  position: z.string(),
  status: z.enum(["novo", "contato", "proposta", "negociacao", "ganho", "perdido"]),
  assignedTo: z.string(),
  source: z.enum(["site", "linkedin", "indicacao", "evento", "google", "outro"]),
  value: z.number().min(0, "Valor deve ser positivo"),
  notes: z.string(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "Carlos Eduardo Mendes",
    email: "carlos.mendes@techbr.com.br",
    phone: "(11) 98234-5678",
    company: "TechBR Soluções",
    position: "CEO",
    status: "negociacao",
    assignedTo: "Ana Lima",
    source: "linkedin",
    value: 48000,
    notes: "Interessado em contrato anual. Reunião marcada para semana que vem.",
    activities: [
      {
        id: "a1",
        type: "reuniao",
        description: "Call de discovery — apresentou os 3 principais pontos de dor da equipe de vendas.",
        author: "Ana Lima",
        createdAt: "2024-05-20T14:00:00Z",
      },
      {
        id: "a2",
        type: "email",
        description: "Proposta enviada: Plano Pro anual com desconto de 15%.",
        author: "Ana Lima",
        createdAt: "2024-05-22T09:30:00Z",
      },
      {
        id: "a3",
        type: "ligacao",
        description: "Follow-up — cliente pediu ajuste no número de usuários da licença.",
        author: "Ana Lima",
        createdAt: "2024-05-28T11:00:00Z",
      },
    ],
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-28T11:00:00Z",
  },
  {
    id: "2",
    name: "Fernanda Rodrigues",
    email: "fernanda.rodrigues@logistica360.com",
    phone: "(21) 97654-3210",
    company: "Logística 360",
    position: "Diretora de Operações",
    status: "proposta",
    assignedTo: "Bruno Costa",
    source: "indicacao",
    value: 32000,
    notes: "Indicação do cliente Grupo Vitória. Precisa de integração com sistema legado.",
    activities: [
      {
        id: "a4",
        type: "ligacao",
        description: "Primeiro contato — apresentação do produto em 20 minutos.",
        author: "Bruno Costa",
        createdAt: "2024-05-18T09:00:00Z",
      },
      {
        id: "a5",
        type: "reuniao",
        description: "Demo completa do módulo de pipeline. Reação muito positiva.",
        author: "Bruno Costa",
        createdAt: "2024-05-25T15:30:00Z",
      },
    ],
    createdAt: "2024-05-18T09:00:00Z",
    updatedAt: "2024-05-25T15:30:00Z",
  },
  {
    id: "3",
    name: "Rafael Souza",
    email: "rsouza@innova.tech",
    phone: "(31) 99123-4567",
    company: "Innova Tech",
    position: "CTO",
    status: "ganho",
    assignedTo: "Ana Lima",
    source: "site",
    value: 24000,
    notes: "Assinou o Plano Pro mensal. Onboarding agendado com a equipe de CS.",
    activities: [
      {
        id: "a6",
        type: "nota",
        description: "Lead chegou via blog — artigo sobre CRM para equipes de tecnologia.",
        author: "Ana Lima",
        createdAt: "2024-04-10T08:00:00Z",
      },
      {
        id: "a7",
        type: "email",
        description: "Trial ativado. E-mail de boas-vindas enviado automaticamente.",
        author: "Sistema",
        createdAt: "2024-04-10T08:05:00Z",
      },
      {
        id: "a8",
        type: "reuniao",
        description: "Call de fechamento. Contrato assinado via DocuSign.",
        author: "Ana Lima",
        createdAt: "2024-04-30T16:00:00Z",
      },
    ],
    createdAt: "2024-04-10T08:00:00Z",
    updatedAt: "2024-04-30T16:00:00Z",
  },
  {
    id: "4",
    name: "Mariana Oliveira",
    email: "m.oliveira@construtora-maxima.com.br",
    phone: "(41) 98765-4321",
    company: "Construtora Máxima",
    position: "Gerente Comercial",
    status: "contato",
    assignedTo: "Bruno Costa",
    source: "evento",
    value: 18000,
    notes: "Conhecemos na feira de tecnologia em Curitiba. Equipe de 8 vendedores.",
    activities: [
      {
        id: "a9",
        type: "nota",
        description: "Contato feito no evento Tech Summit Curitiba 2024.",
        author: "Bruno Costa",
        createdAt: "2024-05-10T18:00:00Z",
      },
      {
        id: "a10",
        type: "email",
        description: "E-mail de follow-up enviado com material institucional e casos de uso.",
        author: "Bruno Costa",
        createdAt: "2024-05-12T09:00:00Z",
      },
    ],
    createdAt: "2024-05-10T18:00:00Z",
    updatedAt: "2024-05-12T09:00:00Z",
  },
  {
    id: "5",
    name: "Paulo Henrique Castro",
    email: "pcastro@distribuidorapalmas.com",
    phone: "(63) 99234-8765",
    company: "Distribuidora Palmas",
    position: "Proprietário",
    status: "perdido",
    assignedTo: "Ana Lima",
    source: "google",
    value: 9600,
    notes: "Escolheu concorrente por preço. Manter contato para revisão no próximo semestre.",
    activities: [
      {
        id: "a11",
        type: "ligacao",
        description: "Reunião de apresentação realizada. Cliente demonstrou interesse inicial.",
        author: "Ana Lima",
        createdAt: "2024-04-20T10:00:00Z",
      },
      {
        id: "a12",
        type: "email",
        description: "Proposta enviada com preços especiais para PMEs.",
        author: "Ana Lima",
        createdAt: "2024-04-22T14:00:00Z",
      },
      {
        id: "a13",
        type: "nota",
        description: "Cliente informou que vai fechar com concorrente. Preço foi o fator decisivo.",
        author: "Ana Lima",
        createdAt: "2024-05-02T11:00:00Z",
      },
    ],
    createdAt: "2024-04-15T09:00:00Z",
    updatedAt: "2024-05-02T11:00:00Z",
  },
  {
    id: "6",
    name: "Juliana Ferreira",
    email: "juliana.ferreira@studiomoda.com.br",
    phone: "(11) 97890-1234",
    company: "Studio Moda",
    position: "Sócia-Fundadora",
    status: "novo",
    assignedTo: "Bruno Costa",
    source: "outro",
    value: 7200,
    notes: "Pequena equipe de 3 vendedores. Procurando solução simples e acessível.",
    activities: [],
    createdAt: "2024-05-30T14:00:00Z",
    updatedAt: "2024-05-30T14:00:00Z",
  },
  {
    id: "7",
    name: "Roberto Almeida",
    email: "roberto.almeida@grupovitoria.com.br",
    phone: "(51) 99345-6789",
    company: "Grupo Vitória",
    position: "VP de Vendas",
    status: "negociacao",
    assignedTo: "Ana Lima",
    source: "linkedin",
    value: 60000,
    notes: "Grande conta — 40 vendedores. Processo de compra envolve TI e Jurídico.",
    activities: [
      {
        id: "a14",
        type: "reuniao",
        description: "Primeira reunião com o VP. Apresentação de ROI e casos de sucesso.",
        author: "Ana Lima",
        createdAt: "2024-05-05T10:00:00Z",
      },
      {
        id: "a15",
        type: "email",
        description: "Envio do contrato para análise do departamento jurídico.",
        author: "Ana Lima",
        createdAt: "2024-05-14T09:00:00Z",
      },
      {
        id: "a16",
        type: "ligacao",
        description: "Jurídico solicitou cláusula de SLA adicional. Enviado para aprovação interna.",
        author: "Ana Lima",
        createdAt: "2024-05-21T15:00:00Z",
      },
    ],
    createdAt: "2024-05-01T09:00:00Z",
    updatedAt: "2024-05-21T15:00:00Z",
  },
  {
    id: "8",
    name: "Camila Santos",
    email: "camila@csdigital.com.br",
    phone: "(85) 98567-2345",
    company: "CS Digital",
    position: "Fundadora & CEO",
    status: "proposta",
    assignedTo: "Bruno Costa",
    source: "indicacao",
    value: 14400,
    notes: "Agência de marketing digital em crescimento acelerado. Equipe de 12 pessoas.",
    activities: [
      {
        id: "a17",
        type: "ligacao",
        description: "Ligação de qualificação. Interesse em pipeline e gestão de clientes.",
        author: "Bruno Costa",
        createdAt: "2024-05-22T11:00:00Z",
      },
      {
        id: "a18",
        type: "email",
        description: "Proposta personalizada enviada — foco em módulo de atividades.",
        author: "Bruno Costa",
        createdAt: "2024-05-24T16:00:00Z",
      },
    ],
    createdAt: "2024-05-20T10:00:00Z",
    updatedAt: "2024-05-24T16:00:00Z",
  },
  {
    id: "9",
    name: "André Vieira",
    email: "a.vieira@agenciapixel.com",
    phone: "(48) 97123-4500",
    company: "Agência Pixel",
    position: "Diretor Criativo",
    status: "contato",
    assignedTo: "Ana Lima",
    source: "evento",
    value: 12000,
    notes: "Interesse em automação de follow-ups para equipe criativa.",
    activities: [
      {
        id: "a19",
        type: "email",
        description: "Primeiro contato via formulário do site após webinar.",
        author: "Sistema",
        createdAt: "2024-05-17T08:30:00Z",
      },
      {
        id: "a20",
        type: "ligacao",
        description: "Ligação de apresentação. Agendou demo para próxima semana.",
        author: "Ana Lima",
        createdAt: "2024-05-17T14:00:00Z",
      },
    ],
    createdAt: "2024-05-17T08:30:00Z",
    updatedAt: "2024-05-17T14:00:00Z",
  },
  {
    id: "10",
    name: "Beatriz Teixeira",
    email: "beatriz.teixeira@farmaciasbestar.com.br",
    phone: "(71) 99876-5432",
    company: "Farmácias Bem Estar",
    position: "Coordenadora Comercial",
    status: "novo",
    assignedTo: "Bruno Costa",
    source: "site",
    value: 8400,
    notes: "Rede com 6 unidades. Precisa de controle de pipeline para equipe de B2B.",
    activities: [],
    createdAt: "2024-05-29T16:00:00Z",
    updatedAt: "2024-05-29T16:00:00Z",
  },
  {
    id: "11",
    name: "Gustavo Prado",
    email: "gprado@pradoconstrucoes.com.br",
    phone: "(61) 98234-7890",
    company: "Prado Construções",
    position: "CEO",
    status: "negociacao",
    assignedTo: "Ana Lima",
    source: "linkedin",
    value: 36000,
    notes: "Empresa de médio porte em expansão. Avaliando PipeFlow vs Pipedrive.",
    activities: [
      {
        id: "a21",
        type: "reuniao",
        description: "Demo comparativa. Cliente ficou impressionado com UX vs concorrente.",
        author: "Ana Lima",
        createdAt: "2024-05-19T10:00:00Z",
      },
      {
        id: "a22",
        type: "email",
        description: "Tabela comparativa de features e preços enviada por e-mail.",
        author: "Ana Lima",
        createdAt: "2024-05-20T09:00:00Z",
      },
    ],
    createdAt: "2024-05-15T11:00:00Z",
    updatedAt: "2024-05-20T09:00:00Z",
  },
  {
    id: "12",
    name: "Tatiana Luz",
    email: "tatiana.luz@midiascriativas.com",
    phone: "(11) 96789-0123",
    company: "Mídias Criativas",
    position: "Gerente de Marketing",
    status: "proposta",
    assignedTo: "Bruno Costa",
    source: "google",
    value: 19200,
    notes: "Agência de publicidade com foco em performance. Time de 20 pessoas.",
    activities: [
      {
        id: "a23",
        type: "ligacao",
        description: "Qualificação inicial. Budget aprovado, decisão até fim do mês.",
        author: "Bruno Costa",
        createdAt: "2024-05-23T11:30:00Z",
      },
      {
        id: "a24",
        type: "reuniao",
        description: "Demo do módulo de dashboard e relatórios. Muito interesse.",
        author: "Bruno Costa",
        createdAt: "2024-05-26T14:00:00Z",
      },
      {
        id: "a25",
        type: "email",
        description: "Proposta formal enviada — R$ 1.600/mês no Plano Pro.",
        author: "Bruno Costa",
        createdAt: "2024-05-27T10:00:00Z",
      },
    ],
    createdAt: "2024-05-20T09:00:00Z",
    updatedAt: "2024-05-27T10:00:00Z",
  },
  {
    id: "13",
    name: "Lucas Nunes",
    email: "lucas@nunesecosta.adv.br",
    phone: "(21) 98456-1234",
    company: "Nunes & Costa Advocacia",
    position: "Sócio",
    status: "contato",
    assignedTo: "Ana Lima",
    source: "indicacao",
    value: 16800,
    notes: "Escritório com 25 advogados. Gestão de pipeline de clientes corporativos.",
    activities: [
      {
        id: "a26",
        type: "email",
        description: "Primeiro contato via e-mail. Recomendação de parceiro.",
        author: "Sistema",
        createdAt: "2024-05-26T10:00:00Z",
      },
      {
        id: "a27",
        type: "ligacao",
        description: "Ligação de apresentação. Agendou reunião para a semana seguinte.",
        author: "Ana Lima",
        createdAt: "2024-05-27T15:00:00Z",
      },
    ],
    createdAt: "2024-05-26T10:00:00Z",
    updatedAt: "2024-05-27T15:00:00Z",
  },
  {
    id: "14",
    name: "Aline Carvalho",
    email: "aline.carvalho@escolaeduplus.com.br",
    phone: "(19) 99234-5678",
    company: "Escola EduPlus",
    position: "Diretora Executiva",
    status: "ganho",
    assignedTo: "Bruno Costa",
    source: "site",
    value: 28800,
    notes: "Rede de escolas particulares. Assinou plano anual com desconto especial.",
    activities: [
      {
        id: "a28",
        type: "nota",
        description: "Lead inbound — baixou o e-book sobre gestão de matrículas.",
        author: "Sistema",
        createdAt: "2024-04-05T08:00:00Z",
      },
      {
        id: "a29",
        type: "ligacao",
        description: "Ligação de qualificação. Necessidade clara: gestão de leads de matrícula.",
        author: "Bruno Costa",
        createdAt: "2024-04-08T10:00:00Z",
      },
      {
        id: "a30",
        type: "reuniao",
        description: "Demo personalizada focada no setor educacional. Aprovação imediata.",
        author: "Bruno Costa",
        createdAt: "2024-04-15T14:00:00Z",
      },
      {
        id: "a31",
        type: "email",
        description: "Contrato assinado. Onboarding agendado para 3 de maio.",
        author: "Bruno Costa",
        createdAt: "2024-04-22T09:00:00Z",
      },
    ],
    createdAt: "2024-04-05T08:00:00Z",
    updatedAt: "2024-04-22T09:00:00Z",
  },
  {
    id: "15",
    name: "Henrique Mota",
    email: "henrique.mota@finantech.com.br",
    phone: "(11) 97654-3210",
    company: "FinanTech",
    position: "CTO",
    status: "novo",
    assignedTo: "Ana Lima",
    source: "linkedin",
    value: 42000,
    notes: "Fintech em série A. Equipe comercial de 15 pessoas crescendo rapidamente.",
    activities: [],
    createdAt: "2024-05-31T09:00:00Z",
    updatedAt: "2024-05-31T09:00:00Z",
  },
];
