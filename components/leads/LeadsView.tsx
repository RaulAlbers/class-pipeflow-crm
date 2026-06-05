"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/dialog";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadForm } from "@/components/leads/LeadForm";
import {
  MOCK_LEADS,
  type Lead,
  type LeadStatus,
  type LeadFormValues,
} from "@/types/lead";

type SheetMode = "closed" | "create" | "edit";

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([...MOCK_LEADS]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sheetMode, setSheetMode] = useState<SheetMode>("closed");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        q === "" ||
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  function openCreate() {
    setEditingLead(null);
    setSheetMode("create");
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead);
    setSheetMode("edit");
  }

  function closeSheet() {
    setSheetMode("closed");
    setEditingLead(null);
  }

  async function handleCreate(values: LeadFormValues) {
    await new Promise((r) => setTimeout(r, 800));
    const newLead: Lead = {
      id: Date.now().toString(),
      name:       values.name,
      email:      values.email,
      phone:      values.phone,
      company:    values.company,
      position:   values.position,
      status:     values.status,
      assignedTo: values.assignedTo,
      source:     values.source,
      value:      values.value,
      notes:      values.notes,
      activities: [],
      createdAt:  new Date().toISOString(),
      updatedAt:  new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    closeSheet();
  }

  async function handleEdit(values: LeadFormValues) {
    if (!editingLead) return;
    await new Promise((r) => setTimeout(r, 800));
    setLeads((prev) =>
      prev.map((l) =>
        l.id === editingLead.id
          ? {
              ...l,
              name:       values.name,
              email:      values.email,
              phone:      values.phone,
              company:    values.company,
              position:   values.position,
              status:     values.status,
              assignedTo: values.assignedTo,
              source:     values.source,
              value:      values.value,
              notes:      values.notes,
              updatedAt:  new Date().toISOString(),
            }
          : l
      )
    );
    closeSheet();
  }

  async function handleDelete() {
    if (!deletingLead) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id));
    setIsDeleting(false);
    setDeletingLead(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text">Leads</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Gerencie seus contatos e oportunidades.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Filters */}
      <LeadFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
      />

      {/* Table */}
      <LeadTable
        leads={filteredLeads}
        onEdit={openEdit}
        onDelete={(lead) => setDeletingLead(lead)}
      />

      {/* Create / Edit Sheet */}
      <Sheet open={sheetMode !== "closed"} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="right" className="w-full max-w-[520px] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <SheetTitle>
              {sheetMode === "create" ? "Novo Lead" : "Editar Lead"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "create"
                ? "Preencha as informações do novo lead."
                : `Editando ${editingLead?.name ?? ""}.`}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <LeadForm
              key={editingLead?.id ?? "create"}
              lead={editingLead ?? undefined}
              onSubmit={sheetMode === "create" ? handleCreate : handleEdit}
              onCancel={closeSheet}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
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
  );
}
