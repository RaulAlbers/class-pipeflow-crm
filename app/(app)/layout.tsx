import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SidebarContent } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import type { WorkspaceOption } from "@/components/shared/WorkspaceSwitcher";
import type { UserInfo } from "@/components/shared/UserMenu";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch workspaces the user belongs to, with their subscription plan
  // RLS ensures only accessible workspaces are returned
  const { data: rawWorkspaces } = await supabase
    .from("workspaces")
    .select("id, name, subscriptions(plan)");

  const workspaces: WorkspaceOption[] = (rawWorkspaces ?? []).map((ws) => {
    const subs = ws.subscriptions as { plan: string }[] | null;
    return {
      id: ws.id,
      name: ws.name,
      plan: subs?.[0]?.plan ?? "free",
    };
  });

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Usuário";

  const userInfo: UserInfo = {
    name: displayName,
    email: user.email ?? "",
    initials: getInitials(displayName),
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? "",
  };

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col bg-sidebar border-r border-border">
        <SidebarContent user={userInfo} workspaces={workspaces} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar user={userInfo} workspaces={workspaces} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
