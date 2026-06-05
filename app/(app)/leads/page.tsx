import type { Metadata } from "next";
import { Users } from "lucide-react";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 rounded-lg border border-dashed border-border text-center">
      <Users className="h-8 w-8 text-text-muted" />
      <p className="text-sm font-medium text-text-subtle">Leads</p>
      <p className="text-xs text-text-muted">Tabela de leads em breve — M2</p>
    </div>
  );
}
