"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Kanban,
  Zap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { WorkspaceSwitcher, type WorkspaceOption } from "@/components/shared/WorkspaceSwitcher";
import { UserMenu, type UserInfo } from "@/components/shared/UserMenu";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { href: "/leads",       label: "Leads",         icon: Users           },
  { href: "/pipeline",    label: "Pipeline",      icon: Kanban          },
  { href: "/activities",  label: "Atividades",    icon: Zap             },
];

const BOTTOM_ITEMS = [
  { href: "/settings",  label: "Configurações", icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-text-subtle hover:bg-overlay hover:text-text"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary" : "text-text-muted"
        )}
      />
      {label}
    </Link>
  );
}

interface SidebarContentProps {
  user:               UserInfo;
  workspaces:         WorkspaceOption[];
  activeWorkspaceId?: string | null;
}

export function SidebarContent({ user, workspaces, activeWorkspaceId }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-border shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-white">P</span>
        </div>
        <span className="text-sm font-semibold text-text tracking-tight">
          PipeFlow
        </span>
        <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          PRO
        </span>
      </div>

      {/* Workspace Switcher */}
      <div className="px-2 pt-3 pb-2 shrink-0">
        <WorkspaceSwitcher workspaces={workspaces} activeWorkspaceId={activeWorkspaceId ?? null} />
      </div>

      <Separator />

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
      </nav>

      <Separator />

      {/* Bottom Navigation */}
      <div className="px-2 py-3 space-y-0.5 shrink-0">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </div>

      <Separator />

      {/* User Menu */}
      <div className="px-2 py-3 shrink-0">
        <UserMenu user={user} />
      </div>
    </div>
  );
}
