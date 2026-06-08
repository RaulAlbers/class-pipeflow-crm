import {
  Kanban,
  Users,
  BarChart3,
  Clock,
  Building2,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: Kanban,
    title: "Pipeline Kanban Visual",
    description:
      "Mova deals entre etapas com drag-and-drop. Visualize o funil de vendas completo num relance e identifique gargalos antes que virem problemas.",
    accent: "from-indigo-500/20 to-indigo-500/0",
  },
  {
    icon: Users,
    title: "Gestão Completa de Leads",
    description:
      "Centralize contatos, histórico de atividades e próximas ações de cada lead. Nunca mais perca o fio da conversa com um cliente.",
    accent: "from-blue-500/20 to-blue-500/0",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Métricas",
    description:
      "Taxa de conversão, valor do pipeline e deals em risco — atualizados em tempo real. Tome decisões com dados, não com intuição.",
    accent: "from-violet-500/20 to-violet-500/0",
  },
  {
    icon: Clock,
    title: "Atividades e Timeline",
    description:
      "Registre ligações, e-mails e reuniões diretamente no lead. Todo o histórico em ordem cronológica, acessível em segundos.",
    accent: "from-indigo-500/20 to-indigo-500/0",
  },
  {
    icon: Building2,
    title: "Multi-empresa",
    description:
      "Gerencie múltiplas empresas com isolamento total de dados. Convide membros por e-mail e defina papéis Admin ou Membro.",
    accent: "from-blue-500/20 to-blue-500/0",
  },
  {
    icon: ShieldCheck,
    title: "Segurança e Controle",
    description:
      "Dados isolados por workspace com Row Level Security. Cada time vê apenas o que é seu — sem configuração manual de permissões.",
    accent: "from-violet-500/20 to-violet-500/0",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 px-6">
      {/* Subtle section divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Funcionalidades
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Tudo que seu time precisa
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-muted">
            Uma plataforma integrada para gerenciar todo o ciclo de vendas,
            da prospecção ao fechamento.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.04] cursor-default"
              >
                {/* Hover gradient overlay */}
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${feature.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                {/* Icon */}
                <div className="relative mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:bg-primary/15 group-hover:ring-primary/35">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>

                {/* Text */}
                <h3 className="relative mb-2 text-sm font-semibold text-text">
                  {feature.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-text-muted">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
