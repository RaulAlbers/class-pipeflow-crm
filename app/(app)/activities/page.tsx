import type { Metadata } from "next";
import { Zap } from "lucide-react";

export const metadata: Metadata = { title: "Atividades" };

export default function ActivitiesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 rounded-lg border border-dashed border-border text-center">
      <Zap className="h-8 w-8 text-text-muted" />
      <p className="text-sm font-medium text-text-subtle">Atividades</p>
      <p className="text-xs text-text-muted">Timeline de atividades em breve — M8</p>
    </div>
  );
}
