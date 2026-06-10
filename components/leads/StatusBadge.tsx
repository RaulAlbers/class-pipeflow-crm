import { cn } from '@/lib/utils'
import { LEAD_STATUS_LABELS, type LeadStatus } from '@/types/lead'

const STATUS_CLASSES: Record<LeadStatus, string> = {
  new:       'bg-blue-500/15 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  qualified: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  won:       'bg-green-500/15 text-green-400 border-green-500/30',
  lost:      'bg-red-500/15 text-red-400 border-red-500/30',
}

interface StatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        STATUS_CLASSES[status],
        className,
      )}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  )
}
