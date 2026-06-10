-- ============================================================
-- 008 — RLS Hardening (best practices)
-- Aplicado após 007_subscriptions.sql
--
-- Melhoras aplicadas:
--   1. TO authenticated em todas as policies → impede que a
--      role anon execute as expressões USING/WITH CHECK,
--      reduzindo surface de ataque e carga de execução.
--   2. FORCE ROW LEVEL SECURITY em todas as tabelas → garante
--      que mesmo o owner (postgres) respeite o RLS.
--      ⚠️ No SQL Editor do Supabase Studio a role é postgres;
--      com FORCE RLS as queries retornam 0 linhas sem SET ROLE
--      authenticated + SET request.jwt.claims.
--      Para inspecionar dados no Studio: desative FORCE RLS
--      temporariamente ou use o service_role.
--   3. Índice covering para is_workspace_member(workspace_id, role)
--      → evita heap fetch ao verificar role do membro.
--   4. Índice parcial para admins → acelera políticas que chamam
--      is_workspace_member(workspace_id, 'admin').
-- ============================================================

BEGIN;

-- ──────────────────────────────────────────────────────────────
-- workspaces
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "workspaces_insert" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_select" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_update" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_delete" ON public.workspaces;

CREATE POLICY "workspaces_insert"
  ON public.workspaces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "workspaces_select"
  ON public.workspaces FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(id));

CREATE POLICY "workspaces_update"
  ON public.workspaces FOR UPDATE
  TO authenticated
  USING  (public.is_workspace_member(id, 'admin'))
  WITH CHECK (public.is_workspace_member(id, 'admin'));

CREATE POLICY "workspaces_delete"
  ON public.workspaces FOR DELETE
  TO authenticated
  USING (public.is_workspace_member(id, 'admin'));

ALTER TABLE public.workspaces FORCE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- workspace_members
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "workspace_members_select" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete" ON public.workspace_members;

CREATE POLICY "workspace_members_select"
  ON public.workspace_members FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM   public.workspace_members
      WHERE  user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "workspace_members_insert"
  ON public.workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR public.is_workspace_member(workspace_id, 'admin')
  );

CREATE POLICY "workspace_members_update"
  ON public.workspace_members FOR UPDATE
  TO authenticated
  USING  (public.is_workspace_member(workspace_id, 'admin'))
  WITH CHECK (public.is_workspace_member(workspace_id, 'admin'));

CREATE POLICY "workspace_members_delete"
  ON public.workspace_members FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR public.is_workspace_member(workspace_id, 'admin')
  );

ALTER TABLE public.workspace_members FORCE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- leads
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "leads_select" ON public.leads;
DROP POLICY IF EXISTS "leads_insert" ON public.leads;
DROP POLICY IF EXISTS "leads_update" ON public.leads;
DROP POLICY IF EXISTS "leads_delete" ON public.leads;

CREATE POLICY "leads_select"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "leads_insert"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "leads_update"
  ON public.leads FOR UPDATE
  TO authenticated
  USING  (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "leads_delete"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- deals
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "deals_select" ON public.deals;
DROP POLICY IF EXISTS "deals_insert" ON public.deals;
DROP POLICY IF EXISTS "deals_update" ON public.deals;
DROP POLICY IF EXISTS "deals_delete" ON public.deals;

CREATE POLICY "deals_select"
  ON public.deals FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "deals_insert"
  ON public.deals FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "deals_update"
  ON public.deals FOR UPDATE
  TO authenticated
  USING  (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "deals_delete"
  ON public.deals FOR DELETE
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

ALTER TABLE public.deals FORCE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- activities
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "activities_select" ON public.activities;
DROP POLICY IF EXISTS "activities_insert" ON public.activities;
DROP POLICY IF EXISTS "activities_update" ON public.activities;
DROP POLICY IF EXISTS "activities_delete" ON public.activities;

CREATE POLICY "activities_select"
  ON public.activities FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "activities_insert"
  ON public.activities FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "activities_update"
  ON public.activities FOR UPDATE
  TO authenticated
  USING  (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "activities_delete"
  ON public.activities FOR DELETE
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

ALTER TABLE public.activities FORCE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- subscriptions
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "subscriptions_select" ON public.subscriptions;

CREATE POLICY "subscriptions_select"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- Covering index: evita heap fetch para verificação de role
-- is_workspace_member usa (workspace_id, user_id) → com INCLUDE(role)
-- o Postgres satisfaz o predicado inteiro só pelo índice
-- ──────────────────────────────────────────────────────────────

DROP INDEX IF EXISTS public.idx_wm_ws_user_role;
CREATE INDEX idx_wm_ws_user_role
  ON public.workspace_members (workspace_id, user_id)
  INCLUDE (role);

-- Índice parcial: acelera is_workspace_member(workspace_id, 'admin')
-- Usado nas policies UPDATE/DELETE de workspaces, leads, deals etc.
DROP INDEX IF EXISTS public.idx_wm_admins;
CREATE INDEX idx_wm_admins
  ON public.workspace_members (workspace_id)
  WHERE role = 'admin';

COMMIT;
