"use client";

import { useTransition } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/actions";

export type UserInfo = {
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string;
};

interface UserMenuProps {
  user: UserInfo;
}

export function UserMenu({ user }: UserMenuProps) {
  const [, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-overlay transition-colors focus:outline-none">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
            <AvatarFallback className="text-[11px]">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden text-left">
            <span className="truncate text-sm font-medium text-text leading-none">
              {user.name}
            </span>
            <span className="truncate text-xs text-text-muted mt-0.5">
              {user.email}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" side="top" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text">{user.name}</span>
            <span className="text-xs text-text-muted mt-0.5">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <User className="h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Settings className="h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-danger focus:text-danger focus:bg-danger/10"
          onSelect={() => startTransition(() => signOut())}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
