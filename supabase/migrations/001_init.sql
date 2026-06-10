-- ============================================================
-- 001_init.sql
-- Extensions e função utilitária de updated_at
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reutilizada por todas as tabelas via trigger BEFORE UPDATE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Nota: is_workspace_member é criada em 003_workspace_members.sql,
-- após a tabela que ela referencia existir.
