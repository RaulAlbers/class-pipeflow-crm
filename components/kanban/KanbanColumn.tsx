"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { DealCard } from "@/components/kanban/DealCard"
import type { Deal, Stage, StageConfig } from "@/types/deal"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface KanbanColumnProps {
  stage: StageConfig
  deals: Deal[]
  onAddDeal: (stage: Stage) => void
  isAnyDragging: boolean
}

export function KanbanColumn({ stage, deals, onAddDeal, isAnyDragging }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const dealIds = deals.map((d) => d.id)

  return (
    <div className="w-72 shrink-0 flex flex-col rounded-md bg-surface border border-border overflow-hidden">
      {/* Column header */}
      <div
        className="shrink-0 px-3 py-3 border-b border-border"
        style={{ borderTopWidth: 3, borderTopStyle: "solid", borderTopColor: stage.accentColor }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-text truncate">{stage.label}</span>
            <span
              className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: stage.accentColor + "cc" }}
            >
              {deals.length}
            </span>
          </div>
          <button
            onClick={() => onAddDeal(stage.id)}
            className="shrink-0 h-5 w-5 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-overlay transition-colors"
            aria-label={`Adicionar deal em ${stage.label}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Total value */}
        <p className="mt-1.5 text-sm font-bold text-text-subtle tabular-nums">
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px] transition-colors duration-150 bg-bg",
          isOver && isAnyDragging && "bg-primary/5"
        )}
      >
        <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>

        {/* Empty state */}
        {deals.length === 0 && (
          <button
            onClick={() => onAddDeal(stage.id)}
            className={cn(
              "w-full h-20 rounded-md border border-dashed border-border-subtle",
              "flex flex-col items-center justify-center gap-1",
              "text-text-muted hover:text-text-subtle hover:border-zinc-600",
              "transition-colors duration-150 cursor-pointer",
              isOver && "border-primary/50 bg-primary/5"
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">Adicionar deal</span>
          </button>
        )}
      </div>
    </div>
  )
}
