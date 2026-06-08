import Link from "next/link";

const LINKS = [
  {
    group: "Produto",
    items: [
      { label: "Funcionalidades", href: "#features" },
      { label: "Preços",          href: "#pricing"  },
      { label: "Changelog",       href: "#"         },
    ],
  },
  {
    group: "Empresa",
    items: [
      { label: "Sobre",   href: "#" },
      { label: "Blog",    href: "#" },
      { label: "Contato", href: "#" },
    ],
  },
  {
    group: "Legal",
    items: [
      { label: "Termos de Uso",     href: "#" },
      { label: "Privacidade",       href: "#" },
      { label: "Política de Dados", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-border px-6 pb-10 pt-14">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-md shadow-primary/30">
                <span className="text-xs font-bold text-white">P</span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-text">PipeFlow</span>
            </div>
            <p className="max-w-[200px] text-xs leading-relaxed text-text-muted">
              CRM para times de vendas que querem crescer sem complicação.
            </p>
          </div>

          {/* Link groups */}
          {LINKS.map((group) => (
            <div key={group.group}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
                {group.group}
              </p>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-text-muted transition-colors hover:text-text"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} PipeFlow. Todos os direitos reservados.
          </p>
          <p className="text-xs text-text-muted">
            Feito com dedicação no Brasil 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
