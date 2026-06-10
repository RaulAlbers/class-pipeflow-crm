"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/types/auth";
import { signIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setServerError(null);
    const result = await signIn(values);
    if (result?.error) {
      setServerError(result.error);
      setIsLoading(false);
    }
    // On success, signIn() calls redirect() — no need to handle here
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
        <h2 className="text-2xl font-bold text-text">Bem-vindo de volta</h2>
        <p className="text-sm text-text-subtle">Entre com sua conta para continuar</p>
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline underline-offset-4"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-danger">{errors.password.message}</p>
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
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-text-subtle">
        Não tem conta?{" "}
        <Link
          href="/register"
          className="text-primary hover:underline underline-offset-4 font-medium"
        >
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}
