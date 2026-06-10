'use client'

import Link from 'next/link'
import { MoreHorizontal, Pencil, Trash2, Eye, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/leads/StatusBadge'
import { LEAD_SOURCE_LABELS, type Lead } from '@/types/lead'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

interface LeadTableProps {
  leads: Lead[]
  isPending?: boolean
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadTable({ leads, isPending = false, onEdit, onDelete }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 gap-3 text-center">
        <Users className="h-8 w-8 text-text-muted" />
        <div>
          <p className="text-sm font-medium text-text-subtle">Nenhum lead encontrado</p>
          <p className="text-xs text-text-muted mt-1">Tente ajustar os filtros ou cadastre um novo lead.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border border-border overflow-hidden transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide">
              Lead
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide hidden sm:table-cell">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide hidden lg:table-cell">
              Origem
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide hidden lg:table-cell">
              Cadastro
            </th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-surface/50 transition-colors group">
              <td className="px-4 py-3">
                <Link href={`/leads/${lead.id}`} className="block">
                  <p className="font-medium text-text group-hover:text-primary transition-colors leading-tight">
                    {lead.name}
                  </p>
                  {lead.company && (
                    <p className="text-xs text-text-muted mt-0.5">{lead.company}</p>
                  )}
                </Link>
              </td>

              <td className="px-4 py-3 hidden sm:table-cell">
                <StatusBadge status={lead.status} />
              </td>

              <td className="px-4 py-3 hidden lg:table-cell">
                <span className="text-text-muted">
                  {lead.source ? (LEAD_SOURCE_LABELS[lead.source] ?? lead.source) : '—'}
                </span>
              </td>

              <td className="px-4 py-3 hidden lg:table-cell">
                <span className="text-text-muted">{formatDate(lead.created_at)}</span>
              </td>

              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Ações"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/leads/${lead.id}`} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Ver detalhes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => onEdit(lead)}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-danger focus:text-danger"
                      onClick={() => onDelete(lead)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
