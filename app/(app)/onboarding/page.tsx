"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Building2, ArrowRight } from "lucide-react";
import { onboardingSchema, type OnboardingFormValues } from "@/types/auth";
import { createWorkspace } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { workspaceName: "" },
  });

  async function onSubmit(values: OnboardingFormValues) {
    setIsLoading(true);
    setServerError(null);
    const result = await createWorkspace(values);
    if (result?.error) {
      setServerError(result.error);
      setIsLoading(false);
    }
    // On success, createWorkspace() calls redirect('/dashboard')
  }

  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
            1
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-[11px] font-medium text-text-muted">
            2
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-[11px] font-medium text-text-muted">
            3
          </div>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Passo 1 de 3
            </p>
            <h1 className="text-2xl font-bold text-text">
              Configure seu workspace
            </h1>
            <p className="text-sm text-text-subtle">
              Dê um nome para o seu time ou empresa. Você pode alterar isso depois
              em Configurações.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="workspaceName">Nome do workspace</Label>
            <Input
              id="workspaceName"
              type="text"
              placeholder="Ex: Acme Corp, Time de Vendas..."
              autoFocus
              aria-invalid={!!errors.workspaceName}
              {...register("workspaceName")}
            />
            {errors.workspaceName ? (
              <p className="text-xs text-danger">{errors.workspaceName.message}</p>
            ) : (
              <p className="text-xs text-text-muted">
                Visível para todos os membros do workspace.
              </p>
            )}
          </div>

          {serverError && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
