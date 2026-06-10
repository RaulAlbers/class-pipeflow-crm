-- ================-- ============================================================
-- 003_workspace_members.sql
-- Associação usuário ↔ workspace com roles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid        NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         text        NOT NULL DEFAULT 'member'
                           CHECK (role IN ('admin', 'member')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);

-- Índices usados nas subqueries das policies RLS (crítico para performance)
CREATE INDEX IF NOT EXISTS idx_wm_workspace_id ON public.workspace_members (workspace_id);
CREATE INDEX IF NOT EXISTS idx_wm_user_id      ON public.workspace_members (user_id);
CREATE INDEX IF NOT EXISTS idx_wm_ws_user      ON public.workspace_members (workspace_id, user_id);

-- Helper SECURITY DEFINER: evita subquery por linha nas policies RLS.
-- p_role = NULL → qualquer role; p_role = 'admin' → somente admins.
-- Criada aqui porque referencia public.workspace_members (validação em tempo de criação no SQL puro).
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

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Membros veem todos os outros membros do mesmo workspace
CREATE POLICY "workspace_members_select"
  ON public.workspace_members FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE  user_id = (SELECT auth.uid())
    )
  );

-- Usuário pode se adicionar ao criar um workspace (primeiro membro/admin)
-- Admins podem adicionar outros membros
CREATE POLICY "workspace_members_insert"
  ON public.workspace_members FOR INSERT
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR public.is_workspace_member(workspace_id, 'admin')
  );

-- Apenas admins podem alterar roles
CREATE POLICY "workspace_members_update"
  ON public.workspace_members FOR UPDATE
  USING  (public.is_workspace_member(workspace_id, 'admin'))
  WITH CHECK (public.is_workspace_member(workspace_id, 'admin'));

-- Admins removem qualquer membro; usuário pode sair do workspace
CREATE POLICY "workspace_members_delete"
  ON public.workspace_members FOR DELETE
  USING (
    user_id = (SELECT auth.uid())
    OR public.is_workspace_member(workspace_id, 'admin')
  );

-- ── RLS de workspaces (depende de is_workspace_member, criada acima) ─────────

-- Apenas membros podem ler o workspace ao qual pertencem
CREATE POLICY "workspaces_select"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(id));

-- Apenas admins podem editar dados do workspace
CREATE POLICY "workspaces_update"
  ON public.workspaces FOR UPDATE
  USING  (public.is_workspace_member(id, 'admin'))
  WITH CHECK (public.is_workspace_member(id, 'admin'));

-- Apenas admins podem excluir o workspace
CREATE POLICY "workspaces_delete"
  ON public.workspaces FOR DELETE
  USING (public.is_workspace_member(id, 'admin'));
