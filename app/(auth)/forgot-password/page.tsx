"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setSubmittedEmail(values.email);
  }

  /* ── Success state ── */
  if (submittedEmail) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <Mail className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-text">Verifique seu e-mail</h2>
          <p className="text-sm text-text-subtle">
            Enviamos um link de recuperação para{" "}
            <span className="font-medium text-text">{submittedEmail}</span>.
          </p>
        </div>

        <p className="text-xs text-text-muted">
          Não recebeu? Verifique a pasta de spam ou{" "}
          <button
            type="button"
            onClick={() => setSubmittedEmail(null)}
            className="text-primary hover:underline underline-offset-4"
          >
            tente novamente
          </button>
          .
        </p>

        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Button>
        </Link>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-white">P</span>
        </div>
        <span className="text-sm font-semibold text-text">PipeFlow</span>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-text">Recuperar senha</h2>
        <p className="text-sm text-text-subtle">
          Informe seu e-mail e enviaremos um link para redefinir sua senha
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="você@empresa.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar link de recuperação"
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-text-subtle hover:text-text transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
