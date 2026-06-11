"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { acceptInvite } from "@/lib/workspace/member-actions";

interface AcceptInviteFormProps {
  token:         string;
  inviteEmail:   string;
  isLoggedIn:    boolean;
  emailMatches:  boolean;
}

export function AcceptInviteForm({ token, inviteEmail, isLoggedIn, emailMatches }: AcceptInviteFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Not logged in → show login/register links
  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <Link
          href={`/login?invite=${token}`}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Entrar para aceitar
        </Link>
        <Link
          href={`/register?invite=${token}`}
          className="flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text hover:bg-overlay transition-colors"
        >
          Criar conta e aceitar
        </Link>
        <p className="text-center text-xs text-text-muted">
          Use o e-mail <strong className="text-text-subtle">{inviteEmail}</strong> para aceitar.
        </p>
      </div>
    );
  }

  // Logged in with matching email → show Accept button (Server Action)
  function handleAccept() {
    setError(null);
    setLoading(true);
    startTransition(async () => {
      const result = await acceptInvite(token);
      if ("error" in result) {
        setError(result.error);
        setLoading(false);
      } else {
        // Server Action set the cookie → navigate to dashboard
        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <button
        onClick={handleAccept}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Aceitando...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Aceitar convite
          </>
        )}
      </button>
    </div>
  );
}
