import type { Metadata } from "next";
import { Settings } from "lucide-react";

export const metadata: Metadata = { title: "Configurações" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 rounded-lg border border-dashed border-border text-center">
      <Settings className="h-8 w-8 text-text-muted" />
      <p className="text-sm font-medium text-text-subtle">Configurações</p>
      <p className="text-xs text-text-muted">Workspace, membros e planos em breve — M10</p>
    </div>
  );
}
