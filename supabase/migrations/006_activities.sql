-- ============================================================
-- 006_activities.sql
-- Timeline de atividades por lead/deal
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activities (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid        NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  deal_id      uuid        REFERENCES public.deals(id) ON DELETE CASCADE,
  lead_id      uuid        REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  type         text        NOT NULL
               CHECK (type IN ('call', 'email', 'meeting', 'note', 'task')),
  title        text        NOT NULL,
  notes        text,
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_activities_workspace_id ON public.activities (workspace_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal_id      ON public.activities (deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id      ON public.activities (lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id      ON public.activities (user_id);
-- Timeline cronológica
CREATE INDEX IF NOT EXISTS idx_activities_timeline     ON public.activities (workspace_id, created_at DESC);

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activities_select"
  ON public.activities FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "activities_insert"
  ON public.activities FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "activities_update"
  ON public.activities FOR UPDATE
  USING  (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "activities_delete"
  ON public.activities FOR DELETE
  USING (public.is_workspace_member(workspace_id));
