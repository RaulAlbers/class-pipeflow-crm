import type { Metadata } from "next"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"

export const metadata: Metadata = { title: "Pipeline" }

export default function PipelinePage() {
  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
      <KanbanBoard />
    </div>
  )
}
