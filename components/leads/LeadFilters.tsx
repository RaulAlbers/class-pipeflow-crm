"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/types/lead";

const ALL_STATUSES: LeadStatus[] = [
  "novo",
  "contato",
  "proposta",
  "negociacao",
  "ganho",
  "perdido",
];

interface LeadFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeadStatus | "all";
  onStatusFilterChange: (value: LeadStatus | "all") => void;
  totalCount: number;
  filteredCount: number;
}

export function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount,
}: LeadFiltersProps) {
  const hasActiveFilters = search !== "" || statusFilter !== "all";

  function clearFilters() {
    onSearchChange("");
    onStatusFilterChange("all");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
          <Input
            placeholder="Buscar por nome ou empresa..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              statusFilter === "all"
                ? "bg-primary text-white border-primary"
                : "border-border text-text-muted hover:border-border-subtle hover:text-text"
            }`}
          >
            Todos
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "border-border text-text-muted hover:border-border-subtle hover:text-text"
              }`}
            >
              {LEAD_STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Limpar
          </Button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-text-muted">
        {filteredCount === totalCount
          ? `${totalCount} lead${totalCount !== 1 ? "s" : ""}`
          : `${filteredCount} de ${totalCount} lead${totalCount !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
