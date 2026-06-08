import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

const STATS = [
  { value: "+47%",  label: "em conversão",        sublabel: "vs. gestão por planilha" },
  { value: "3.2×",  label: "leads qualificados",   sublabel: "no primeiro trimestre"  },
  { value: "−62%",  label: "ciclo de venda",        sublabel: "do contato ao fechamento" },
  { value: "1200+", label: "times ativos",          sublabel: "em todo o Brasil"       },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden pt-15 pb-8">

      {/* ── Background layers ────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 select-none">
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #3f3f4680 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Main glow orb */}
        <div
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 h-[700px] w-[1000px] rounded-full bg-primary/[0.12] blur-[130px]"
          style={{ animation: "glow-breathe 7s ease-in-out infinite" }}
        />
        {/* Secondary smaller orb, offset right */}
        <div
          className="absolute right-[15%] top-[30%] h-[300px] w-[400px] rounded-full bg-indigo-400/[0.06] blur-[90px]"
          style={{ animation: "glow-breathe 10s 2s ease-in-out infinite" }}
        />
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg via-bg/60 to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">

        {/* Badge chip */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5"
          style={{ animation: "fade-up 0.55s ease-out both" }}
        >
          <Zap className="h-3 w-3 text-primary fill-primary" />
          <span className="text-xs font-medium tracking-wide text-primary">
            CRM para times de vendas modernos
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-5 text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[1.04] tracking-tight"
          style={{ animation: "fade-up 0.55s 0.08s ease-out both" }}
        >
          <span className="text-text">Feche mais negócios.</span>
          <br />
          <span className="text-text-muted">Perca menos tempo.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg"
          style={{ animation: "fade-up 0.55s 0.16s ease-out both" }}
        >
          PipeFlow é o CRM para times que querem crescer sem complicação —
          do primeiro contato ao fechamento, tudo em um só lugar.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col items-center gap-3 sm:flex-row"
          style={{ animation: "fade-up 0.55s 0.24s ease-out both" }}
        >
          <Link
            href="/register"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-7 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40"
          >
            Começar grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center gap-1.5 rounded-lg px-5 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Já tenho uma conta
            <ArrowRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </div>

        {/* ── Stats grid ─────────────────────────────────── */}
        <div
          className="mt-16 grid w-full max-w-3xl grid-cols-2 overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
          style={{ animation: "fade-up 0.55s 0.36s ease-out both", gap: "1px" }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="group flex flex-col items-center gap-1 bg-surface px-4 py-6 transition-colors hover:bg-primary/5"
            >
              <span className="text-[2.1rem] font-bold leading-none tracking-tight text-text tabular-nums">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-semibold text-text-subtle">
                {stat.label}
              </span>
              <span className="text-xs text-text-muted leading-tight text-center">
                {stat.sublabel}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
