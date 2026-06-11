"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { inviteMember } from "@/lib/workspace/member-actions";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  role:  z.enum(["admin", "member"]),
});
type FormValues = z.infer<typeof schema>;

const ROLE_LABELS: Record<"admin" | "member", string> = {
  admin:  "Administrador",
  member: "Membro",
};

interface InviteFormProps {
  plan:        "free" | "pro";
  memberCount: number;
}

const FREE_LIMIT = 2;

export function InviteForm({ plan, memberCount }: InviteFormProps) {
  const [, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent]               = useState(false);

  const atLimit = plan === "free" && memberCount >= FREE_LIMIT;

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "member" },
  });

  const selectedRole = watch("role");

  function onSubmit(values: FormValues) {
    setServerError(null);
    setSent(false);
    startTransition(async () => {
      const result = await inviteMember(values);
      if ("error" in result) {
        setServerError(result.error);
      } else {
        setSent(true);
        reset();
        setTimeout(() => setSent(false), 5000);
      }
    });
  }

  if (atLimit) {
    return (
      <div className="rounded-lg border border-border bg-overlay/50 p-5 flex gap-3 items-start">
        <Lock className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-text">Limite do plano Free atingido</p>
          <p className="text-sm text-text-subtle mt-0.5">
            O plano Free permite até {FREE_LIMIT} membros. Faça upgrade para Pro para convidar mais colaboradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text">Convidar por e-mail</h3>
        <p className="text-xs text-text-muted mt-0.5">
          O convidado receberá um link válido por 7 dias.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="invite-email">E-mail</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colaborador@empresa.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Função</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" type="button" className="w-36 justify-between">
                  {ROLE_LABELS[selectedRole]}
                  <span className="text-text-muted">▾</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setValue("role", "member")}>
                  Membro
                  <span className="ml-auto text-xs text-text-muted">Acesso padrão</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setValue("role", "admin")}>
                  Administrador
                  <span className="ml-auto text-xs text-text-muted">Acesso total</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {serverError && (
          <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {serverError}
          </p>
        )}

        {sent && (
          <p className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Convite enviado com sucesso!
          </p>
        )}

        <Button type="submit" className="gap-2">
          <Mail className="h-4 w-4" />
          Enviar convite
        </Button>
      </form>
    </div>
  );
}
