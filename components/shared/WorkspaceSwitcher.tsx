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

const MOCK_WORKSPACES = [
  { id: "1", name: "Acme Corp",      plan: "Pro",   initials: "AC" },
  { id: "2", name: "Beta Ventures",  plan: "Free",  initials: "BV" },
  { id: "3", name: "Gamma Solutions",plan: "Pro",   initials: "GS" },
];

export function WorkspaceSwitcher() {
  const [current, setCurrent] = useState(MOCK_WORKSPACES[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-overlay transition-colors focus:outline-none group">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-white">
            {current.initials}
          </span>
          <span className="flex-1 truncate text-left font-medium text-text">
            {current.name}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-text-muted shrink-0 group-hover:text-text-subtle transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={8}>
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {MOCK_WORKSPACES.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onSelect={() => setCurrent(ws)}
            className="gap-2.5"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/80 text-[10px] font-bold text-white">
              {ws.initials}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-sm leading-none">{ws.name}</span>
              <span className="mt-0.5 text-xs text-text-muted">{ws.plan}</span>
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
