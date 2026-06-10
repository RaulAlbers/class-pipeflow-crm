-- ============================================================
-- 002_workspaces.sql
-- Tabela principal de workspaces (tenants)
-- RLS policies ficam em 003_workspace_members.sql (após is_workspace_member existir)
-- ============================================================

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

-- RLS habilitado aqui; policies adicionadas em 003 após is_workspace_member ser criada
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- A única policy sem dependência de is_workspace_member pode ficar aqui
CREATE POLICY "workspaces_insert"
  ON public.workspaces FOR INSERT
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
