import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 rounded-lg border border-dashed border-border text-center">
      <LayoutDashboard className="h-8 w-8 text-text-muted" />
      <p className="text-sm font-medium text-text-subtle">Dashboard</p>
      <p className="text-xs text-text-muted">Métricas e gráficos em breve — M4</p>
    </div>
  );
}
