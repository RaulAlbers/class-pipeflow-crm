"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type WorkspaceOption = {
  id: string;
  name: string;
  plan: string;
};

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceOption[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function WorkspaceSwitcher({ workspaces }: WorkspaceSwitcherProps) {
  const [current, setCurrent] = useState<WorkspaceOption | null>(
    workspaces[0] ?? null,
  );

  if (!current) {
    return (
      <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-text-muted">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-overlay text-[10px]">
          ?
        </span>
        <span className="flex-1 truncate text-left">Sem workspace</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-overlay transition-colors focus:outline-none group">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-white">
            {getInitials(current.name)}
          </span>
          <span className="flex-1 truncate text-left font-medium text-text">
            {current.name}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-text-muted shrink-0 group-hover:text-text-subtle transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" side="bottom" sideOffset={4}>
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onSelect={() => setCurrent(ws)}
            className="gap-2.5"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/80 text-[10px] font-bold text-white">
              {getInitials(ws.name)}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-sm leading-none">{ws.name}</span>
              <span className="mt-0.5 text-xs text-text-muted capitalize">
                {ws.plan}
              </span>
            </div>
            {ws.id === current.id && (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem className={cn("gap-2 text-text-muted")}>
          <Plus className="h-4 w-4" />
          Criar workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
