"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

type Plan = {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  period: string;
  annualNote: string;
  description: string;
  cta: string;
  ctaHref: string;
  highlight: boolean;
  badge: string | null;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Grátis",
    monthlyPrice: "R$0",
    annualPrice: "R$0",
    period: "/mês",
    annualNote: "para sempre",
    description: "Para times pequenos que querem começar a organizar o pipeline.",
    cta: "Criar conta grátis",
    ctaHref: "/register",
    highlight: false,
    badge: null,
    features: [
      "2 colaboradores",
      "Até 50 leads",
      "Pipeline Kanban completo",
      "Dashboard básico",
      "Histórico de atividades",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: "R$49",
    annualPrice: "R$39",
    period: "/mês",
    annualNote: "cobrado anualmente",
    description: "Para times de vendas que precisam de escala e colaboração sem limites.",
    cta: "Começar 14 dias grátis",
    ctaHref: "/register?plan=pro",
    highlight: true,
    badge: "Mais popular",
    features: [
      "Colaboradores ilimitados",
      "Leads ilimitados",
      "Tudo do plano Grátis",
      "Dashboard avançado",
      "Multi-empresa (workspaces)",
      "Convite de membros por e-mail",
      "Suporte prioritário",
    ],
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-28 px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Preços
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Planos simples, sem surpresas
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-text-muted">
            Comece grátis e faça upgrade quando seu time crescer.
            Sem contratos longos, cancele quando quiser.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium transition-colors ${!annual ? "text-text" : "text-text-muted"}`}>
            Mensal
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none ${
              annual ? "bg-primary" : "bg-overlay"
            }`}
            role="switch"
            aria-checked={annual}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                annual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? "text-text" : "text-text-muted"}`}>
            Anual
          </span>
          {annual && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
              <Sparkles className="h-3 w-3" />
              −20%
            </span>
          )}
        </div>

        {/* Plans */}
        <div className="grid gap-5 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col gap-6 rounded-2xl border p-7 transition-shadow ${
                plan.highlight
                  ? "border-primary/60 bg-primary/[0.06] shadow-2xl shadow-primary/10"
                  : "border-border bg-surface"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-white shadow-lg shadow-primary/30">
                  {plan.badge}
                </span>
              )}

              {/* Header */}
              <div>
                <div className="mb-3 text-sm font-semibold text-text-subtle">
                  {plan.name}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold tracking-tight text-text tabular-nums">
                    {annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <div className="mb-1 flex flex-col leading-tight">
                    <span className="text-sm text-text-muted">{plan.period}</span>
                    {annual && (
                      <span className="text-[11px] text-text-muted">{plan.annualNote}</span>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {plan.description}
                </p>
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-primary/40"
                    : "border border-border-subtle text-text hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                        plan.highlight ? "bg-primary/15" : "bg-overlay"
                      }`}
                    >
                      <Check
                        className={`h-2.5 w-2.5 ${plan.highlight ? "text-primary" : "text-text-subtle"}`}
                      />
                    </div>
                    <span className="text-sm text-text-subtle">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="mt-8 text-center text-xs text-text-muted">
          Sem cartão de crédito necessário · Cancele a qualquer momento · Dados protegidos com RLS
        </p>
      </div>
    </section>
  );
}
