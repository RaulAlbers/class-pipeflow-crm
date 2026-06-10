-- ============================================================
-- 004_leads.sql
-- Leads (contatos/oportunidades iniciais) por workspace
-- ============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid        NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  owner_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  name         text        NOT NULL,
  company      text,
  email        text,
  phone        text,
  status       text        NOT NULL DEFAULT 'new'
               CHECK (status IN ('new', 'contacted', 'qualified', 'lost', 'won')),
  source       text,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_leads_workspace_id ON public.leads (workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id     ON public.leads (owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status       ON public.leads (workspace_id, status);

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select"
  ON public.leads FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "leads_insert"
  ON public.leads FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "leads_update"
  ON public.leads FOR UPDATE
  USING  (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "leads_delete"
  ON public.leads FOR DELETE
  USING (public.is_workspace_member(workspace_id));
