'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createLead, updateLead } from '@/lib/leads/actions'
import {
  leadSchema,
  LEAD_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  type Lead,
  type LeadFormValues,
} from '@/types/lead'

interface LeadFormProps {
  lead?: Lead
  onSubmit?: (values: LeadFormValues) => Promise<void>
  onCancel?: () => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-danger mt-1">{message}</p>
}

export function LeadForm({ lead, onSubmit, onCancel }: LeadFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema) as Resolver<LeadFormValues>,
    defaultValues: {
      name:    lead?.name    ?? '',
      email:   lead?.email   ?? '',
      phone:   lead?.phone   ?? '',
      company: lead?.company ?? '',
      status:  lead?.status  ?? 'new',
      source:  (lead?.source as LeadFormValues['source']) ?? 'site',
      notes:   lead?.notes   ?? '',
    },
  })

  async function handleFormSubmit(values: LeadFormValues) {
    setServerError(null)

    if (onSubmit) {
      await onSubmit(values)
      return
    }

    // Standalone mode (new/page.tsx): call server action directly
    if (lead) {
      const result = await updateLead(lead.id, values)
      if ('error' in result) { setServerError(result.error ?? null); return }
    } else {
      const result = await createLead(values)
      if ('error' in result) { setServerError(result.error ?? null); return }
    }
    router.push('/leads')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-5">
      {serverError && (
        <p className="rounded-md bg-danger/10 border border-danger/30 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      {/* Nome + Empresa */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" placeholder="Nome completo" aria-invalid={!!errors.name} {...register('name')} />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Empresa *</Label>
          <Input id="company" placeholder="Nome da empresa" aria-invalid={!!errors.company} {...register('company')} />
          <FieldError message={errors.company?.message} />
        </div>
      </div>

      {/* E-mail + Telefone */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" type="email" placeholder="nome@empresa.com" aria-invalid={!!errors.email} {...register('email')} />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" type="tel" placeholder="(11) 99999-0000" {...register('phone')} />
        </div>
      </div>

      {/* Status + Origem */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status *</Label>
          <Select id="status" aria-invalid={!!errors.status} {...register('status')}>
            {(Object.entries(LEAD_STATUS_LABELS) as [string, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <FieldError message={errors.status?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="source">Origem *</Label>
          <Select id="source" aria-invalid={!!errors.source} {...register('source')}>
            {(Object.entries(LEAD_SOURCE_LABELS) as [string, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <FieldError message={errors.source?.message} />
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" rows={3} placeholder="Informações adicionais sobre o lead..." {...register('notes')} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting
            ? lead ? 'Salvando...' : 'Cadastrando...'
            : lead ? 'Salvar alterações' : 'Cadastrar lead'}
        </Button>
      </div>
    </form>
  )
}
