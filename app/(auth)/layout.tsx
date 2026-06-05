import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Pipeline Kanban com drag-and-drop",
  "Gestão completa de leads e atividades",
  "Dashboard com métricas em tempo real",
  "Multi-empresa com convite por e-mail",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left — brand panel (desktop only) */}
      <div className="hidden lg:flex lg:w-[460px] shrink-0 flex-col justify-between bg-sidebar border-r border-border p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="text-base font-semibold text-text">PipeFlow</span>
        </div>

        {/* Headline + features */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-text leading-tight">
              Gerencie seu pipeline<br />de vendas com precisão
            </h1>
            <p className="text-sm text-text-subtle leading-relaxed">
              A plataforma de CRM para times de vendas que querem crescer sem
              complicação — do lead ao fechamento.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-text-subtle">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
            <p className="text-sm text-text-subtle italic leading-relaxed">
              &ldquo;O PipeFlow triplicou nossa visibilidade sobre o funil. Simples,
              rápido e sem as complicações dos CRMs corporativos.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                M
              </div>
              <span className="text-xs text-text-muted">Mariana Costa · Head de Vendas, Nexus</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} PipeFlow. Todos os direitos reservados.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-bg">
        {children}
      </div>
    </div>
  );
}
