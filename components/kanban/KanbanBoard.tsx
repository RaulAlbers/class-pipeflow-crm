"use client"

import { useState, useMemo, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { KanbanColumn } from "@/components/kanban/KanbanColumn"
import { DealCard } from "@/components/kanban/DealCard"
import { DealForm } from "@/components/kanban/DealForm"
import {
  STAGES,
  ASSIGNEES,
  MOCK_DEALS,
  type Deal,
  type Stage,
  type DealFormValues,
} from "@/types/deal"

export function KanbanBoard() {
  const [mounted, setMounted] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([...MOCK_DEALS])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [formStage, setFormStage] = useState<Stage>("novo-lead")

  useEffect(() => { setMounted(true) }, [])

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) ?? null : null

  const filteredDeals = useMemo(() => {
    const q = search.trim().toLowerCase()
    return deals.filter((d) => {
      const matchesSearch =
        q === "" ||
        d.title.toLowerCase().includes(q) ||
        d.leadName.toLowerCase().includes(q)
      const matchesAssignee =
        assigneeFilter === "all" || d.assigneeName === assigneeFilter
      return matchesSearch && matchesAssignee
    })
  }, [deals, search, assigneeFilter])

  function getStageDeals(stageId: Stage) {
    return filteredDeals.filter((d) => d.stage === stageId)
  }

  function openForm(stage: Stage) {
    setFormStage(stage)
    setFormOpen(true)
  }

  async function handleCreateDeal(values: DealFormValues) {
    await new Promise((r) => setTimeout(r, 600))
    const newDeal: Deal = {
      id: `d${Date.now()}`,
      title:            values.title,
      value:            values.value,
      stage:            values.stage,
      leadName:         values.leadName,
      assigneeName:     values.assigneeName,
      assigneeInitials: values.assigneeInitials,
      deadline:         values.deadline,
      createdAt:        new Date().toISOString(),
    }
    setDeals((prev) => [newDeal, ...prev])
    setFormOpen(false)
  }

  // ─── DnD handlers ──────────────────────────────────────────────────

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const sourceStage = deals.find((d) => d.id === activeId)?.stage
    const overIsStage = STAGES.some((s) => s.id === overId)
    const targetStage: Stage | undefined = overIsStage
      ? (overId as Stage)
      : deals.find((d) => d.id === overId)?.stage

    if (!sourceStage || !targetStage || sourceStage === targetStage) return

    setDeals((prev) =>
      prev.map((d) => (d.id === activeId ? { ...d, stage: targetStage } : d))
    )
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const sourceStage = deals.find((d) => d.id === activeId)?.stage
    const overIsStage = STAGES.some((s) => s.id === overId)

    // If dropped on a stage droppable directly, no reorder needed
    if (overIsStage) return

    const targetStage = deals.find((d) => d.id === overId)?.stage

    if (!sourceStage || !targetStage || sourceStage !== targetStage) return

    // Same-column reorder
    setDeals((prev) => {
      const stageDeals = prev.filter((d) => d.stage === sourceStage)
      const otherDeals = prev.filter((d) => d.stage !== sourceStage)
      const oldIndex = stageDeals.findIndex((d) => d.id === activeId)
      const newIndex = stageDeals.findIndex((d) => d.id === overId)
      if (oldIndex === -1 || newIndex === -1) return prev
      return [...otherDeals, ...arrayMove(stageDeals, oldIndex, newIndex)]
    })
  }

  const totalPipelineValue = deals
    .filter((d) => d.stage !== "fechado-perdido")
    .reduce((sum, d) => sum + d.value, 0)

  const openDealsCount = deals.filter(
    (d) => d.stage !== "fechado-ganho" && d.stage !== "fechado-perdido"
  ).length

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-3 px-6 py-3 border-b border-border bg-sidebar">
        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-text-muted mr-2">
          <span>
            <span className="font-semibold text-text">{openDealsCount}</span> abertos
          </span>
          <span>
            <span className="font-semibold text-primary">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalPipelineValue)}
            </span>{" "}
            em pipeline
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
          <Input
            placeholder="Buscar deal…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Assignee filter */}
        <Select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="w-36 h-8 text-xs"
        >
          <option value="all">Todos</option>
          {ASSIGNEES.map((a) => (
            <option key={a.initials} value={a.name}>
              {a.name.split(" ")[0]}
            </option>
          ))}
        </Select>

        {/* New deal button */}
        <Button size="sm" onClick={() => openForm("novo-lead")}>
          <Plus className="h-4 w-4" />
          Novo Deal
        </Button>
      </div>

      {/* Board */}
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full px-6 py-4 min-w-max">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                deals={getStageDeals(stage.id)}
                onAddDeal={openForm}
                isAnyDragging={activeId !== null}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
          {activeDeal && <DealCard deal={activeDeal} isOverlay />}
        </DragOverlay>
      </DndContext>

      {/* Deal form sheet */}
      <DealForm
        open={formOpen}
        defaultStage={formStage}
        onSubmit={handleCreateDeal}
        onClose={() => setFormOpen(false)}
      />
    </div>
  )
}
