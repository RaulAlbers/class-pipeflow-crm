'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ConfirmDialog } from '@/components/ui/dialog'
import { LeadFilters } from '@/components/leads/LeadFilters'
import { LeadTable } from '@/components/leads/LeadTable'
import { LeadForm } from '@/components/leads/LeadForm'
import { createLead, updateLead, deleteLead, searchLeads } from '@/lib/leads/actions'
import { type Lead, type LeadStatus, type LeadFormValues } from '@/types/lead'

type SheetMode = 'closed' | 'create' | 'edit'

interface LeadsViewProps {
  initialLeads: Lead[]
  workspaceId: string
}

export function LeadsView({ initialLeads, workspaceId }: LeadsViewProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [totalCount] = useState(initialLeads.length)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sheetMode, setSheetMode] = useState<SheetMode>('closed')
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSearch(value: string) {
    setSearch(value)
    startTransition(async () => {
      const results = await searchLeads(workspaceId, value, statusFilter)
      setLeads(results)
    })
  }

  function handleStatusFilter(value: LeadStatus | 'all') {
    setStatusFilter(value)
    startTransition(async () => {
      const results = await searchLeads(workspaceId, search, value)
      setLeads(results)
    })
  }

  function openCreate() {
    setEditingLead(null)
    setSheetMode('create')
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead)
    setSheetMode('edit')
  }

  function closeSheet() {
    setSheetMode('closed')
    setEditingLead(null)
    setServerError(null)
  }

  async function handleCreate(values: LeadFormValues) {
    setServerError(null)
    const result = await createLead(values)
    if ('error' in result) { setServerError(result.error ?? null); return }
    setLeads((prev) => [result.data, ...prev])
    closeSheet()
  }

  async function handleEdit(values: LeadFormValues) {
    if (!editingLead) return
    setServerError(null)
    const result = await updateLead(editingLead.id, values)
    if ('error' in result) { setServerError(result.error ?? null); return }
    setLeads((prev) => prev.map((l) => l.id === editingLead.id ? result.data : l))
    closeSheet()
  }

  async function handleDelete() {
    if (!deletingLead) return
    setIsDeleting(true)
    const result = await deleteLead(deletingLead.id)
    setIsDeleting(false)
    if ('error' in result) { setServerError(result.error ?? null); return }
    setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id))
    setDeletingLead(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text">Leads</h2>
          <p className="text-xs text-text-muted mt-0.5">Gerencie seus contatos e oportunidades.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {serverError && (
        <p className="rounded-md bg-danger/10 border border-danger/30 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      <LeadFilters
        search={search}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilter}
        totalCount={totalCount}
        filteredCount={leads.length}
        isPending={isPending}
      />

      <LeadTable
        leads={leads}
        isPending={isPending}
        onEdit={openEdit}
        onDelete={(lead) => setDeletingLead(lead)}
      />

      {/* Create / Edit Sheet */}
      <Sheet open={sheetMode !== 'closed'} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="right" className="w-full max-w-[520px] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <SheetTitle>
              {sheetMode === 'create' ? 'Novo Lead' : 'Editar Lead'}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === 'create'
                ? 'Preencha as informações do novo lead.'
                : `Editando ${editingLead?.name ?? ''}.`}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {serverError && (
              <p className="mb-4 rounded-md bg-danger/10 border border-danger/30 px-3 py-2 text-sm text-danger">
                {serverError}
              </p>
            )}
            <LeadForm
              key={editingLead?.id ?? 'create'}
              lead={editingLead ?? undefined}
              onSubmit={sheetMode === 'create' ? handleCreate : handleEdit}
              onCancel={closeSheet}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={deletingLead !== null}
        onOpenChange={(open) => !open && setDeletingLead(null)}
        title="Excluir lead"
        description={`Tem certeza que deseja excluir "${deletingLead?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
