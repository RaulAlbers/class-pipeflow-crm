-- 009_workspace_invites.sql
-- Perfis de usuários (espelho de auth.users) + convites de workspace

-- profiles: espelho público de auth.users — permite joins a partir de
-- workspace_members sem precisar do admin client.
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text        NOT NULL,
  full_name  text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Qualquer membro autenticado pode ler perfis (necessário para listar membros)
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Usuário atualiza apenas o próprio perfil
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING  (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Trigger: cria perfil automaticamente ao criar usuário em auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Retroativo: garante perfil para usuários já existentes
INSERT INTO public.profiles (id, email, full_name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- workspace_invites

CREATE TABLE IF NOT EXISTS public.workspace_invites (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid        NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email        text        NOT NULL,
  role         text        NOT NULL DEFAULT 'member'
                           CHECK (role IN ('admin', 'member')),
  token        uuid        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  invited_by   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_at  timestamptz,
  expires_at   timestamptz NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Um único convite pendente por e-mail por workspace
CREATE UNIQUE INDEX IF NOT EXISTS idx_wi_workspace_email_pending
  ON public.workspace_invites (workspace_id, lower(email))
  WHERE accepted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_wi_token        ON public.workspace_invites (token);
CREATE INDEX IF NOT EXISTS idx_wi_workspace_id ON public.workspace_invites (workspace_id);

ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;

-- Membros do workspace veem convites pendentes
CREATE POLICY "workspace_invites_select"
  ON public.workspace_invites FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

-- Apenas admins podem criar convites
CREATE POLICY "workspace_invites_insert"
  ON public.workspace_invites FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id, 'admin'));

-- Apenas admins podem revogar convites pendentes
CREATE POLICY "workspace_invites_delete"
  ON public.workspace_invites FOR DELETE
  TO authenticated
  USING (public.is_workspace_member(workspace_id, 'admin'));

-- UPDATE apenas via service_role (aceite do convite) — sem policy pública
