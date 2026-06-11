"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/shared/Sidebar";
import { useState, useEffect } from "react";
import type { WorkspaceOption } from "@/components/shared/WorkspaceSwitcher";
import type { UserInfo } from "@/components/shared/UserMenu";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":   "Dashboard",
  "/leads":       "Leads",
  "/pipeline":    "Pipeline",
  "/activities":  "Atividades",
  "/settings":    "Configurações",
};

function getTitle(pathname: string): string {
  for (const [route, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === route || pathname.startsWith(route + "/")) return title;
  }
  return "PipeFlow";
}

interface TopBarProps {
  actions?:           React.ReactNode;
  user:               UserInfo;
  workspaces:         WorkspaceOption[];
  activeWorkspaceId?: string | null;
}

export function TopBar({ actions, user, workspaces, activeWorkspaceId }: TopBarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-sidebar px-4 lg:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-md p-1.5 text-text-muted hover:bg-overlay hover:text-text transition-colors lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile sidebar sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64" showClose={false}>
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <SidebarContent user={user} workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-text">
        {getTitle(pathname)}
      </h1>

      {/* Contextual actions (passed from page) */}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  );
}
