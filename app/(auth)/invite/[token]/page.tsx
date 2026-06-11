import Link from "next/link";
import { XCircle, Clock, Building2 } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AcceptInviteForm } from "./AcceptInviteForm";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;
  const adminClient = getSupabaseAdminClient();
  const supabase    = await getSupabaseServerClient();

  // Fetch invite via admin client (bypasses RLS — user may not be a member yet)
  const { data: invite } = await adminClient
    .from("workspace_invites")
    .select("id, workspace_id, email, role, accepted_at, expires_at, invited_by")
    .eq("token", token)
    .maybeSingle();

  if (!invite) {
    return <InviteError message="Convite não encontrado ou inválido." />;
  }

  if (invite.accepted_at) {
    return <InviteError message="Este convite já foi aceito." />;
  }

  if (new Date(invite.expires_at) < new Date()) {
    return <InviteError message="Este convite expirou. Peça ao administrador um novo convite." />;
  }

  // Fetch workspace + inviter name (admin client, no RLS)
  const [wsResult, inviterResult] = await Promise.all([
    adminClient.from("workspaces").select("name").eq("id", invite.workspace_id).single(),
    adminClient.from("profiles").select("full_name, email").eq("id", invite.invited_by).single(),
  ]);

  const workspaceName = wsResult.data?.name ?? "um workspace";
  const inviterName   = inviterResult.data?.full_name ?? inviterResult.data?.email ?? "Alguém";
  const roleLabel     = invite.role === "admin" ? "Administrador" : "Membro";

  // Check current user
  const { data: { user } } = await supabase.auth.getUser();

  // Logged in but wrong email
  if (user && user.email?.toLowerCase() !== invite.email.toLowerCase()) {
    return (
      <div className="w-full max-w-md space-y-6">
        <InviteCard workspaceName={workspaceName} inviterName={inviterName} roleLabel={roleLabel} inviteEmail={invite.email} />
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 space-y-2">
          <p className="text-sm font-medium text-warning">Conta diferente</p>
          <p className="text-sm text-text-subtle">
            Você está logado como <strong className="text-text">{user.email}</strong>, mas este convite é para{" "}
            <strong className="text-text">{invite.email}</strong>.
          </p>
          <p className="text-sm text-text-subtle">Saia e faça login com o e-mail correto para aceitar.</p>
        </div>
        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Trocar de conta
        </Link>
      </div>
    );
  }

  // Logged in with matching email OR not logged in
  // The AcceptInviteForm renders the correct UI for each case
  return (
    <div className="w-full max-w-md space-y-6">
      <InviteCard workspaceName={workspaceName} inviterName={inviterName} roleLabel={roleLabel} inviteEmail={invite.email} />

      <AcceptInviteForm
        token={token}
        inviteEmail={invite.email}
        isLoggedIn={!!user}
        emailMatches={!!user && user.email?.toLowerCase() === invite.email.toLowerCase()}
      />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function InviteCard({
  workspaceName,
  inviterName,
  roleLabel,
  inviteEmail,
}: {
  workspaceName: string;
  inviterName:   string;
  roleLabel:     string;
  inviteEmail:   string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-white">P</span>
        </div>
        <span className="text-sm font-semibold text-text">PipeFlow</span>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text">{workspaceName}</h2>
            <p className="text-sm text-text-subtle mt-0.5">
              <strong className="text-text">{inviterName}</strong> convidou você como{" "}
              <span className="font-medium text-primary">{roleLabel}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted bg-overlay rounded-md px-3 py-2">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          Convite para <strong className="text-text-subtle ml-1">{inviteEmail}</strong>
        </div>
      </div>
    </div>
  );
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-white">P</span>
        </div>
        <span className="text-sm font-semibold text-text">PipeFlow</span>
      </div>

      <div className="rounded-lg border border-danger/30 bg-danger/10 p-5 space-y-3">
        <XCircle className="h-8 w-8 text-danger" />
        <div>
          <h2 className="text-base font-semibold text-text">Convite inválido</h2>
          <p className="text-sm text-text-subtle mt-1">{message}</p>
        </div>
      </div>

      <Link
        href="/login"
        className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text hover:bg-overlay transition-colors"
      >
        Ir para o login
      </Link>
    </div>
  );
}
