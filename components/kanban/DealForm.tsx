"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  dealSchema,
  STAGES,
  ASSIGNEES,
  STAGE_LABELS,
  type DealFormValues,
  type Stage,
} from "@/types/deal"

interface DealFormProps {
  open: boolean
  defaultStage?: Stage
  onSubmit: (values: DealFormValues) => Promise<void>
  onClose: () => void
}

export function DealForm({ open, defaultStage = "novo-lead", onSubmit, onClose }: DealFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title:            "",
      value:            0,
      stage:            defaultStage,
      leadName:         "",
      assigneeName:     ASSIGNEES[0].name,
      assigneeInitials: ASSIGNEES[0].initials,
      deadline:         "",
    },
  })

  function handleClose() {
    reset()
    onClose()
  }

  async function handleFormSubmit(values: DealFormValues) {
    await onSubmit(values)
    reset()
  }

  function handleAssigneeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const found = ASSIGNEES.find((a) => a.name === e.target.value)
    if (found) {
      setValue("assigneeName", found.name)
      setValue("assigneeInitials", found.initials)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" className="w-full max-w-[440px] flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle>Novo Deal</SheetTitle>
          <SheetDescription>Preencha os dados do negócio.</SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col flex-1 overflow-y-auto"
        >
          <div className="flex-1 px-6 py-5 space-y-5">
            {/* Título */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Título do deal *</Label>
              <Input
                id="title"
                placeholder="ex: Plano Pro — Empresa XYZ"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-danger">{errors.title.message}</p>
              )}
            </div>

            {/* Valor */}
            <div className="space-y-1.5">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                min={0}
                step={100}
                placeholder="0"
                {...register("value", { valueAsNumber: true })}
              />
              {errors.value && (
                <p className="text-xs text-danger">{errors.value.message}</p>
              )}
            </div>

            {/* Lead */}
            <div className="space-y-1.5">
              <Label htmlFor="leadName">Lead vinculado *</Label>
              <Input
                id="leadName"
                placeholder="Nome do lead ou empresa"
                {...register("leadName")}
              />
              {errors.leadName && (
                <p className="text-xs text-danger">{errors.leadName.message}</p>
              )}
            </div>

            {/* Responsável */}
            <div className="space-y-1.5">
              <Label htmlFor="assigneeName">Responsável</Label>
              <Select
                id="assigneeName"
                defaultValue={ASSIGNEES[0].name}
                onChange={handleAssigneeChange}
              >
                {ASSIGNEES.map((a) => (
                  <option key={a.initials} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Etapa */}
            <div className="space-y-1.5">
              <Label htmlFor="stage">Etapa</Label>
              <Select id="stage" defaultValue={defaultStage} {...register("stage")}>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Prazo */}
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Prazo *</Label>
              <Input id="deadline" type="date" {...register("deadline")} />
              {errors.deadline && (
                <p className="text-xs text-danger">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando…" : "Criar deal"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
