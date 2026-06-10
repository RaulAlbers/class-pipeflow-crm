-- ============================================================
-- 005_deals.sql
-- Deals — negócios no pipeline Kanban
-- ============================================================

CREATE TABLE IF NOT EXISTS public.deals (
  id                  uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        uuid           NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id             uuid           REFERENCES public.leads(id) ON DELETE SET NULL,
  owner_id            uuid           REFERENCES auth.users(id) ON DELETE SET NULL,
  title               text           NOT NULL,
  value               numeric(12, 2) NOT NULL DEFAULT 0,
  stage               text           NOT NULL DEFAULT 'new_lead'
                      CHECK (stage IN (
                        'new_lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'
                      )),
  position            integer        NOT NULL DEFAULT 0,
  expected_close_date date,
  created_at          timestamptz    NOT NULL DEFAULT now(),
  updated_at          timestamptz    NOT NULL DEFAULT now()
);

CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_deals_workspace_id ON public.deals (workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_lead_id      ON public.deals (lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_owner_id     ON public.deals (owner_id);
-- Índice composto para ordenação do Kanban por coluna
CREATE INDEX IF NOT EXISTS idx_deals_stage_pos    ON public.deals (workspace_id, stage, position);

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deals_select"
  ON public.deals FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "deals_insert"
  ON public.deals FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "deals_update"
  ON public.deals FOR UPDATE
  USING  (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "deals_delete"
  ON public.deals FOR DELETE
  USING (public.is_workspace_member(workspace_id));
