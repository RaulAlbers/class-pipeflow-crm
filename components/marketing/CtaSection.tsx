import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative px-6 pb-28 pt-8">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.07] px-8 py-16 text-center">

          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-48 w-96 bg-primary/20 blur-[80px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Comece hoje
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Pronto para fechar
              <br />
              mais negócios?
            </h2>
            <p className="mx-auto mb-8 max-w-sm leading-relaxed text-text-muted">
              Crie sua conta grátis e organize seu pipeline em menos de 2 minutos.
              Sem cartão de crédito necessário.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-8 text-sm font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-primary/50"
              >
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-11 items-center px-6 text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                Ver funcionalidades
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
