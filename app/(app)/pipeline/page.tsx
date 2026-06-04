import type { Metadata } from "next";
import { Kanban } from "lucide-react";

export const metadata: Metadata = { title: "Pipeline" };

export default function PipelinePage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 rounded-lg border border-dashed border-border text-center">
      <Kanban className="h-8 w-8 text-text-muted" />
      <p className="text-sm font-medium text-text-subtle">Pipeline</p>
      <p className="text-xs text-text-muted">Board Kanban com drag-and-drop em breve — M3</p>
    </div>
  );
}
