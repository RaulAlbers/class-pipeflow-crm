-- ============================================================
-- PipeFlow CRM — Migration completa
-- Cole este arquivo no SQL Editor do Supabase Studio
-- ou execute via: scripts/apply-migrations.mjs
-- ============================================================

BEGIN;

-- ──────────────────────────────────────────────────────────────
-- 001 — Extensions & helpers
-- ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Nota: is_workspace_member é criada após workspace_members (seção 003).

-- ──────────────────────────────────────────────────────────────
-- 002 — workspaces (DDL + insert policy; select/update/delete após 003)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.workspaces (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  slug       text        NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Única policy sem dependência de is_workspace_member
CREATE POLICY "workspaces_insert"
  ON public.workspaces FOR INSERT
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- ──────────────────────────────────────────────────────────────
-- 003 — workspace_members
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid        NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         text        NOT NULL DEFAULT 'member'
               CHECK (role IN ('admin', 'member')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_wm_workspace_id ON public.workspace_members (workspace_id);
CREATE INDEX IF NOT EXISTS idx_wm_user_id      ON public.workspace_members (user_id);
CREATE INDEX IF NOT EXISTS idx_wm_ws_user      ON public.workspace_members (workspace_id, user_id);

-- Helper criado aqui pois referencia public.workspace_members (SQL valida em tempo de criação)
CREATE OR REPLACE FUNCTION public.is_workspace_member(
  p_workspace_id uuid,
  p_role         text DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.workspace_members
    WHERE  workspace_id = p_workspace_id
      AND  user_id      = (SELECT auth.uid())
      AND  (p_role IS NULL OR role = p_role)
  );
$$;

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select"
  ON public.workspace_members FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE  user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "workspace_members_insert"
  ON public.workspace_members FOR INSERT
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR public.is_workspace_member(workspace_id, 'admin')
  );

CREATE POLICY "workspace_members_update"
  ON public.workspace_members FOR UPDATE
  USING  (public.is_workspace_member(workspace_id, 'admin'))
  WITH CHECK (public.is_workspace_member(workspace_id, 'admin'));

CREATE POLICY "workspace_members_delete"
  ON public.workspace_members FOR DELETE
  USING (
    user_id = (SELECT auth.uid())
    OR public.is_workspace_member(workspace_id, 'admin')
  );

-- RLS de workspaces (select/update/delete) — depende de is_workspace_member criada acima
CREATE POLICY "workspaces_select"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(id));

CREATE POLICY "workspaces_update"
  ON public.workspaces FOR UPDATE
  USING  (public.is_workspace_member(id, 'admin'))
  WITH CHECK (public.is_workspace_member(id, 'admin'));

CREATE POLICY "workspaces_delete"
  ON public.workspaces FOR DELETE
  USING (public.is_workspace_member(id, 'admin'));

-- ──────────────────────────────────────────────────────────────
-- 004 — leads
-- ──────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────
-- 005 — deals
-- ──────────────────────────────────────────────────────────────

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
CREATE INDEX IF NOT EXISTS idx_deals_stage_pos    ON public.deals (workspace_id, stage, position);

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

-- ──────────────────────────────────────────────────────────────
-- 006 — activities
-- ──────────────────────────────────────────────────────────────

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
CREATE INDEX IF NOT EXISTS idx_activities_timeline     ON public.activities (workspace_id, created_at DESC);

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

-- ──────────────────────────────────────────────────────────────
-- 007 — subscriptions
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id           uuid        NOT NULL UNIQUE REFERENCES public.workspaces(id) ON DELETE CASCADE,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text        NOT NULL DEFAULT 'free'
                         CHECK (plan IN ('free', 'pro')),
  status                 text        NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     NOT NULL DEFAULT false,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace_id    ON public.subscriptions (workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub      ON public.subscriptions (stripe_subscription_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Qualquer membro consulta o plano; mutações apenas via service_role (webhook Stripe)
CREATE POLICY "subscriptions_select"
  ON public.subscriptions FOR SELECT
  USING (public.is_workspace_member(workspace_id));

COMMIT;
