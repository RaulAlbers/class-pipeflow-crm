'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ConfirmDialog } from '@/components/ui/dialog'
import { LeadProfile } from '@/components/leads/LeadProfile'
import { ActivityTimeline } from '@/components/leads/ActivityTimeline'
import { LeadForm } from '@/components/leads/LeadForm'
import { updateLead, deleteLead } from '@/lib/leads/actions'
import { type Lead, type Activity, type LeadFormValues } from '@/types/lead'

interface LeadDetailClientProps {
  lead: Lead
  activities: Activity[]
}

export function LeadDetailClient({ lead: initialLead, activities }: LeadDetailClientProps) {
  const router = useRouter()
  const [lead, setLead] = useState<Lead>(initialLead)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function handleEdit(values: LeadFormValues) {
    setServerError(null)
    const result = await updateLead(lead.id, values)
    if ('error' in result) { setServerError(result.error ?? null); return }
    setLead(result.data)
    setEditOpen(false)
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteLead(lead.id)
    setIsDeleting(false)
    if ('error' in result) { setServerError(result.error ?? null); return }
    setDeleteOpen(false)
    router.push('/leads')
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Leads
        </Link>

        <div className="flex items-center gap-2">
          {serverError && (
            <p className="text-xs text-danger">{serverError}</p>
          )}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Excluir</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <LeadProfile lead={lead} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">
              Atividades
              {activities.length > 0 && (
                <span className="ml-2 text-xs font-normal text-text-muted">
                  ({activities.length})
                </span>
              )}
            </h3>
          </div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="w-full max-w-[520px] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <SheetTitle>Editar Lead</SheetTitle>
            <SheetDescription>Editando {lead.name}.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <LeadForm key={lead.id} lead={lead} onSubmit={handleEdit} onCancel={() => setEditOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir lead"
        description={`Tem certeza que deseja excluir "${lead.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
