"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, User, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/deal"

const ASSIGNEE_COLORS: Record<string, string> = {
  AS: "bg-indigo-600",
  BC: "bg-emerald-600",
  CM: "bg-amber-600",
  DR: "bg-rose-600",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getDeadlineState(deadline: string): "overdue" | "soon" | "ok" {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(deadline + "T00:00:00")
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000)
  if (diffDays < 0) return "overdue"
  if (diffDays <= 3) return "soon"
  return "ok"
}

function formatDeadline(deadline: string) {
  const [year, month, day] = deadline.split("-")
  return `${day}/${month}/${year}`
}

interface DealCardProps {
  deal: Deal
  isOverlay?: boolean
}

export function DealCard({ deal, isOverlay = false }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const deadlineState = getDeadlineState(deal.deadline)
  const avatarColor = ASSIGNEE_COLORS[deal.assigneeInitials] ?? "bg-zinc-700"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-overlay border border-border-subtle rounded-md p-3",
        "transition-all duration-150",
        "hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-zinc-600",
        isDragging && !isOverlay && "opacity-40 scale-[0.98]",
        isOverlay && "shadow-[0_8px_32px_rgba(0,0,0,0.6)] rotate-[1.5deg] cursor-grabbing"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...listeners}
          {...attributes}
          className={cn(
            "mt-0.5 shrink-0 text-text-muted transition-colors",
            "cursor-grab active:cursor-grabbing",
            "group-hover:text-text-subtle",
            isOverlay && "cursor-grabbing"
          )}
          aria-label="Arrastar deal"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Title */}
          <p className="text-sm font-medium text-text leading-snug truncate">
            {deal.title}
          </p>

          {/* Value */}
          <p className="text-sm font-bold text-primary tabular-nums">
            {formatCurrency(deal.value)}
          </p>

          {/* Lead */}
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3 text-text-muted shrink-0" />
            <span className="text-xs text-text-muted truncate">{deal.leadName}</span>
          </div>

          {/* Footer: assignee + deadline */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                  avatarColor
                )}
              >
                <span className="text-[9px] font-semibold text-white leading-none">
                  {deal.assigneeInitials}
                </span>
              </div>
              <span className="text-xs text-text-muted truncate">
                {deal.assigneeName.split(" ")[0]}
              </span>
            </div>

            <div
              className={cn(
                "flex items-center gap-1 text-xs shrink-0 font-medium tabular-nums",
                deadlineState === "overdue" && "text-red-400",
                deadlineState === "soon"    && "text-amber-400",
                deadlineState === "ok"      && "text-text-muted"
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDeadline(deal.deadline)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
