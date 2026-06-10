import { Phone, Mail, Users, FileText, CheckSquare, type LucideIcon } from 'lucide-react'
import { ACTIVITY_TYPE_LABELS, type Activity, type ActivityType } from '@/types/lead'

const TYPE_CONFIG: Record<ActivityType, { icon: LucideIcon; color: string; bg: string }> = {
  call:    { icon: Phone,       color: 'text-blue-400',   bg: 'bg-blue-500/15' },
  email:   { icon: Mail,        color: 'text-purple-400', bg: 'bg-purple-500/15' },
  meeting: { icon: Users,       color: 'text-green-400',  bg: 'bg-green-500/15' },
  note:    { icon: FileText,    color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  task:    { icon: CheckSquare, color: 'text-orange-400', bg: 'bg-orange-500/15' },
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center rounded-lg border border-dashed border-border">
        <FileText className="h-6 w-6 text-text-muted" />
        <p className="text-sm text-text-subtle font-medium">Nenhuma atividade registrada</p>
        <p className="text-xs text-text-muted">As atividades do lead aparecerão aqui.</p>
      </div>
    )
  }

  return (
    <ol className="relative flex flex-col gap-0">
      {activities.map((activity, index) => {
        const config = TYPE_CONFIG[activity.type]
        const Icon = config.icon
        const isLast = index === activities.length - 1

        return (
          <li key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border mt-1 mb-1" />}
            </div>

            <div className={`pb-5 min-w-0 flex-1 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <span className="text-xs font-medium text-text-subtle">
                  {ACTIVITY_TYPE_LABELS[activity.type]}
                </span>
                <span className="text-xs text-text-muted shrink-0">
                  {formatDateTime(activity.created_at)}
                </span>
              </div>
              <p className="text-sm text-text leading-snug">{activity.title}</p>
              {activity.notes && (
                <p className="text-xs text-text-muted mt-1 leading-snug">{activity.notes}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
