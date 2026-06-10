'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { dealSchema, STAGES, STAGE_LABELS, type DealFormValues, type Stage } from '@/types/deal'
import type { Lead } from '@/types/lead'

interface DealFormProps {
  open: boolean
  defaultStage?: Stage
  leads: Lead[]
  onSubmit: (values: DealFormValues) => Promise<void>
  onClose: () => void
}

export function DealForm({ open, defaultStage = 'new_lead', leads, onSubmit, onClose }: DealFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title:               '',
      value:               0,
      stage:               defaultStage,
      lead_id:             null,
      expected_close_date: '',
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
              <Input id="title" placeholder="ex: Plano Pro — Empresa XYZ" {...register('title')} />
              {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
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
                {...register('value', { valueAsNumber: true })}
              />
              {errors.value && <p className="text-xs text-danger">{errors.value.message}</p>}
            </div>

            {/* Lead vinculado */}
            <div className="space-y-1.5">
              <Label htmlFor="lead_id">Lead vinculado</Label>
              <Select id="lead_id" {...register('lead_id')}>
                <option value="">— Nenhum —</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}{l.company ? ` · ${l.company}` : ''}
                  </option>
                ))}
              </Select>
            </div>

            {/* Etapa */}
            <div className="space-y-1.5">
              <Label htmlFor="stage">Etapa</Label>
              <Select id="stage" defaultValue={defaultStage} {...register('stage')}>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Select>
            </div>

            {/* Prazo */}
            <div className="space-y-1.5">
              <Label htmlFor="expected_close_date">Prazo *</Label>
              <Input id="expected_close_date" type="date" {...register('expected_close_date')} />
              {errors.expected_close_date && (
                <p className="text-xs text-danger">{errors.expected_close_date.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando…' : 'Criar deal'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
