"use client";

import { useState, useTransition } from "react";
import { Shield, User, Trash2, Loader2, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeMember, updateMemberRole, revokeInvite } from "@/lib/workspace/member-actions";
import type { MemberRow, PendingInviteRow } from "@/lib/workspace/member-actions";
import type { WorkspaceMemberRole } from "@/types/supabase";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("") || "?";
}

interface MembersTableProps {
  members:        MemberRow[];
  pendingInvites: PendingInviteRow[];
  isAdmin:        boolean;
  plan:           "free" | "pro";
}

export function MembersTable({ members, pendingInvites, isAdmin, plan }: MembersTableProps) {
  const [, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleRemove(memberId: string) {
    setLoadingId(memberId);
    startTransition(async () => {
      await removeMember(memberId);
      setLoadingId(null);
    });
  }

  function handleRoleChange(memberId: string, newRole: WorkspaceMemberRole) {
    setLoadingId(memberId);
    startTransition(async () => {
      await updateMemberRole({ memberId, role: newRole });
      setLoadingId(null);
    });
  }

  function handleRevokeInvite(inviteId: string) {
    setLoadingId(`invite-${inviteId}`);
    startTransition(async () => {
      await revokeInvite(inviteId);
      setLoadingId(null);
    });
  }

  const memberLimit = plan === "free" ? 2 : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text">Membros</h2>
          <p className="text-sm text-text-subtle mt-0.5">
            {members.length} membro{members.length !== 1 ? "s" : ""}
            {memberLimit ? ` de ${memberLimit} no plano Free` : ""}
          </p>
        </div>
        {plan === "free" && (
          <Badge variant="secondary" className="text-xs">
            {members.length}/{memberLimit} membros
          </Badge>
        )}
      </div>

      {/* Active members */}
      <div className="rounded-lg border border-border divide-y divide-border">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3 px-4 py-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-[11px] font-medium">
                {getInitials(member.full_name || member.email)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {member.full_name || member.email}
                {member.isCurrentUser && (
                  <span className="ml-1.5 text-xs text-text-muted">(você)</span>
                )}
              </p>
              <p className="text-xs text-text-muted truncate">{member.email}</p>
            </div>

            <Badge
              variant={member.role === "admin" ? "default" : "secondary"}
              className="shrink-0 capitalize text-xs"
            >
              {member.role === "admin" ? "Admin" : "Membro"}
            </Badge>

            {isAdmin && !member.isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" disabled={loadingId === member.id}>
                    {loadingId === member.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="text-text-muted">•••</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {member.role === "member" ? (
                    <DropdownMenuItem
                      className="gap-2"
                      onSelect={() => handleRoleChange(member.id, "admin")}
                    >
                      <Shield className="h-4 w-4" />
                      Promover a Admin
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="gap-2"
                      onSelect={() => handleRoleChange(member.id, "member")}
                    >
                      <User className="h-4 w-4" />
                      Rebaixar para Membro
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 text-danger focus:text-danger focus:bg-danger/10"
                    onSelect={() => handleRemove(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover do workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text-subtle">Convites pendentes</h3>
          <div className="rounded-lg border border-border divide-y divide-border">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-overlay">
                  <Clock className="h-4 w-4 text-text-muted" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{invite.email}</p>
                  <p className="text-xs text-text-muted">
                    Expira em {new Date(invite.expires_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <Badge variant="outline" className="shrink-0 text-xs capitalize">
                  {invite.role === "admin" ? "Admin" : "Membro"}
                </Badge>

                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-text-muted hover:text-danger"
                    disabled={loadingId === `invite-${invite.id}`}
                    onClick={() => handleRevokeInvite(invite.id)}
                  >
                    {loadingId === `invite-${invite.id}` ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
