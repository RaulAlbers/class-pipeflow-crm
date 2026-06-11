"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateWorkspaceName } from "@/lib/workspace/workspace-actions";

const schema = z.object({
  name: z.string().min(2, "Mínimo de 2 caracteres").max(60, "Máximo de 60 caracteres"),
});
type FormValues = z.infer<typeof schema>;

interface WorkspaceSettingsFormProps {
  workspaceName: string;
  plan:          "free" | "pro";
  isAdmin:       boolean;
}

export function WorkspaceSettingsForm({ workspaceName, plan, isAdmin }: WorkspaceSettingsFormProps) {
  const [, startTransition] = useTransition();
  const [serverError, setServerError]   = useState<string | null>(null);
  const [saved, setSaved]               = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: workspaceName },
  });

  function onSubmit(values: FormValues) {
    setServerError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateWorkspaceName(values);
      if ("error" in result) {
        setServerError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-text">Workspace</h2>
        <p className="text-sm text-text-subtle mt-0.5">Informações gerais do seu workspace.</p>
      </div>

      <div className="rounded-lg border border-border divide-y divide-border">
        {/* Plan info */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-medium text-text">Plano atual</p>
            <p className="text-xs text-text-muted mt-0.5">
              {plan === "free" ? "Free — até 2 membros, 50 leads" : "Pro — sem limites"}
            </p>
          </div>
          <Badge variant={plan === "pro" ? "default" : "secondary"} className="capitalize">
            {plan}
          </Badge>
        </div>

        {/* Workspace name */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name">Nome do workspace</Label>
            <div className="flex gap-2">
              <Input
                id="ws-name"
                placeholder="Nome do workspace"
                disabled={!isAdmin}
                aria-invalid={!!errors.name}
                className="max-w-sm"
                {...register("name")}
              />
              {isAdmin && (
                <Button type="submit" size="sm" disabled={!isDirty}>
                  Salvar
                </Button>
              )}
            </div>
            {errors.name && (
              <p className="text-xs text-danger">{errors.name.message}</p>
            )}
            {!isAdmin && (
              <p className="text-xs text-text-muted">Apenas administradores podem alterar o nome.</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-danger">{serverError}</p>
          )}
          {saved && (
            <p className="flex items-center gap-1.5 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Nome atualizado com sucesso.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
