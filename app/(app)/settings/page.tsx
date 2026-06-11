import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveWorkspaceId } from "@/lib/workspace/active";
import { listMembers, listPendingInvites } from "@/lib/workspace/member-actions";
import { WorkspaceSettingsForm } from "@/components/settings/WorkspaceSettingsForm";
import { MembersTable } from "@/components/settings/MembersTable";
import { InviteForm } from "@/components/settings/InviteForm";

export const metadata: Metadata = { title: "Configurações" };

const TABS = [
  { id: "workspace", label: "Workspace" },
  { id: "members",   label: "Membros"   },
] as const;

type Tab = (typeof TABS)[number]["id"];

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const { tab: rawTab = "workspace" } = await searchParams;
  const activeTab: Tab = (TABS.some(t => t.id === rawTab) ? rawTab : "workspace") as Tab;

  const supabase    = await getSupabaseServerClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-muted">Nenhuma workspace ativa.</p>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch workspace + subscription
  const { data: ws } = await supabase
    .from("workspaces")
    .select("id, name, subscriptions(plan)")
    .eq("id", workspaceId)
    .single();

  if (!ws) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-muted">Workspace não encontrada.</p>
      </div>
    );
  }

  const subs = ws.subscriptions as { plan: string }[] | null;
  const plan = (subs?.[0]?.plan ?? "free") as "free" | "pro";

  // Determine if current user is admin
  const { data: memberRow } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  const isAdmin = memberRow?.role === "admin";

  // Fetch members + pending invites (only needed for members tab but cheap)
  const [members, pendingInvites] = await Promise.all([
    listMembers(),
    isAdmin ? listPendingInvites() : Promise.resolve([]),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text">Configurações</h1>
        <p className="text-sm text-text-subtle mt-0.5">{ws.name}</p>
      </div>

      {/* Tab nav */}
      <nav className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={`/settings?tab=${tab.id}`}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-subtle hover:text-text hover:border-border"
            )}
          >
            {tab.label}
            {tab.id === "members" && (
              <span className="ml-1.5 rounded-full bg-overlay px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                {members.length}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Tab content */}
      <div>
        {activeTab === "workspace" && (
          <WorkspaceSettingsForm
            workspaceName={ws.name}
            plan={plan}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === "members" && (
          <div className="space-y-8">
            <MembersTable
              members={members}
              pendingInvites={pendingInvites}
              isAdmin={isAdmin}
              plan={plan}
            />

            {isAdmin && (
              <>
                <div className="border-t border-border" />
                <InviteForm plan={plan} memberCount={members.length} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
