-- ============================================================
-- 007_subscriptions.sql
-- Plano Stripe por workspace — escrito apenas via webhook (service role)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          uuid        NOT NULL UNIQUE REFERENCES public.workspaces(id) ON DELETE CASCADE,
  stripe_customer_id    text,
  stripe_subscription_id text,
  plan                  text        NOT NULL DEFAULT 'free'
                        CHECK (plan IN ('free', 'pro')),
  status                text        NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  cancel_at_period_end  boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace_id      ON public.subscriptions (workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer   ON public.subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub        ON public.subscriptions (stripe_subscription_id);

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Qualquer membro pode consultar o plano do workspace
CREATE POLICY "subscriptions_select"
  ON public.subscriptions FOR SELECT
  USING (public.is_workspace_member(workspace_id));

-- INSERT/UPDATE/DELETE apenas via service role (webhook Stripe)
-- Sem políticas para mutações → apenas service_role (bypassa RLS) pode escrever
