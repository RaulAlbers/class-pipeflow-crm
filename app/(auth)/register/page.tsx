"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/types/auth";
import { signUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setServerError(null);
    const result = await signUp(values);
    if (result && "checkEmail" in result) {
      setCheckEmail(true);
      setIsLoading(false);
      return;
    }
    if (result?.error) {
      setServerError(result.error);
      setIsLoading(false);
    }
    // On success (email confirmation disabled), signUp() calls redirect()
  }

  if (checkEmail) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text">Confirme seu e-mail</h2>
          <p className="text-sm text-text-subtle">
            Enviamos um link de confirmação para{" "}
            <span className="font-medium text-text">{getValues("email")}</span>.
            Clique no link para ativar sua conta.
          </p>
        </div>
        <p className="text-xs text-text-muted">
          Não recebeu?{" "}
          <button
            type="button"
            onClick={() => setCheckEmail(false)}
            className="text-primary hover:underline underline-offset-4"
          >
            Tentar novamente
          </button>
        </p>
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold text-text">Criar conta</h2>
        <p className="text-sm text-text-subtle">Comece grátis, sem cartão de crédito</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="João Silva"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-danger">{errors.name.message}</p>
          )}
        </div>

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

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
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
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-text-subtle">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline underline-offset-4 font-medium"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
