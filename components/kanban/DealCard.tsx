'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, User, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Deal } from '@/types/deal'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getDeadlineState(date: string): 'overdue' | 'soon' | 'ok' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(date + 'T00:00:00')
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 3) return 'soon'
  return 'ok'
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

interface DealCardProps {
  deal: Deal
  isOverlay?: boolean
}

export function DealCard({ deal, isOverlay = false }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  const deadline = deal.expected_close_date
  const deadlineState = deadline ? getDeadlineState(deadline) : 'ok'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-overlay border border-border-subtle rounded-md p-3',
        'transition-all duration-150',
        'hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-zinc-600',
        isDragging && !isOverlay && 'opacity-40 scale-[0.98]',
        isOverlay && 'shadow-[0_8px_32px_rgba(0,0,0,0.6)] rotate-[1.5deg] cursor-grabbing',
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...listeners}
          {...attributes}
          className={cn(
            'mt-0.5 shrink-0 text-text-muted transition-colors',
            'cursor-grab active:cursor-grabbing',
            'group-hover:text-text-subtle',
            isOverlay && 'cursor-grabbing',
          )}
          aria-label="Arrastar deal"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-sm font-medium text-text leading-snug truncate">{deal.title}</p>

          <p className="text-sm font-bold text-primary tabular-nums">
            {formatCurrency(deal.value)}
          </p>

          {deal.lead_name && (
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-text-muted shrink-0" />
              <span className="text-xs text-text-muted truncate">{deal.lead_name}</span>
            </div>
          )}

          {deadline && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium tabular-nums',
                deadlineState === 'overdue' && 'text-red-400',
                deadlineState === 'soon'    && 'text-amber-400',
                deadlineState === 'ok'      && 'text-text-muted',
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(deadline)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
