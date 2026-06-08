import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MarketingNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className="border-b border-border/40 bg-bg/75 backdrop-blur-xl"
        style={{ WebkitBackdropFilter: "blur(20px)" }}
      >
        {/* Gradient line under nav */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="mx-auto flex h-15 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <span className="text-xs font-bold text-white tracking-tight">P</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-text">
              PipeFlow
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#features"
              className="px-3.5 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-md hover:bg-overlay"
            >
              Funcionalidades
            </a>
            <a
              href="#pricing"
              className="px-3.5 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-md hover:bg-overlay"
            >
              Preços
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className="hidden sm:inline-flex h-8 items-center px-3.5 text-sm font-medium text-text-muted hover:text-text transition-colors rounded-md hover:bg-overlay"
            >
              Fazer login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-md shadow-primary/20 hover:shadow-primary/35"
            >
              Começar grátis
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
