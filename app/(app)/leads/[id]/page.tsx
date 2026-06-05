"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/dialog";
import { LeadProfile } from "@/components/leads/LeadProfile";
import { ActivityTimeline } from "@/components/leads/ActivityTimeline";
import { LeadForm } from "@/components/leads/LeadForm";
import { MOCK_LEADS, type Lead, type LeadFormValues } from "@/types/lead";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | undefined>(
    () => MOCK_LEADS.find((l) => l.id === params.id)
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="text-sm font-medium text-text-subtle">Lead não encontrado</p>
        <Link
          href="/leads"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Leads
        </Link>
      </div>
    );
  }

  async function handleEdit(values: LeadFormValues) {
    await new Promise((r) => setTimeout(r, 800));
    setLead((prev) =>
      prev
        ? {
            ...prev,
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
        : prev
    );
    setEditOpen(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsDeleting(false);
    setDeleteOpen(false);
    router.push("/leads");
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
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled
            title="Adicionar atividade — disponível em breve"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Atividade</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Excluir</span>
          </Button>
        </div>
      </div>

      {/* Main layout: profile (left) + timeline (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Left: profile */}
        <div>
          <LeadProfile lead={lead} />
        </div>

        {/* Right: activity timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">
              Atividades
              {lead.activities.length > 0 && (
                <span className="ml-2 text-xs font-normal text-text-muted">
                  ({lead.activities.length})
                </span>
              )}
            </h3>
          </div>
          <ActivityTimeline activities={lead.activities} />
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
            <LeadForm
              key={lead.id}
              lead={lead}
              onSubmit={handleEdit}
              onCancel={() => setEditOpen(false)}
            />
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
  );
}
