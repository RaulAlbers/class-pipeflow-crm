# PipeFlow CRM — Plano de Aulas

Registro de entregas por aula. Cada item marca o que foi implementado, a branch usada e o PR mergeado.

---

## Módulo 1 — Fundação

### Aula 1.1 — Setup do Projeto ✅
**Branch:** `feat/m0-setup` → mergeado em `main`
- Criação do projeto Next.js 14 com App Router
- Configuração do TypeScript strict mode
- Tailwind CSS + shadcn/ui instalados
- Estrutura de pastas conforme CLAUDE.md (`app/`, `components/`, `lib/`, `hooks/`, `types/`)
- ESLint configurado

### Aula 1.2 — Shell da Aplicação ✅
**Branch:** `feat/m1-shell` → mergeado em `main`
- Layout do app com sidebar e navbar (`components/shared/`)
- Rotas protegidas estruturadas em `app/(app)/`
- Rotas públicas em `app/(marketing)/` e `app/(auth)/`
- Placeholder pages: dashboard, leads, pipeline, activities, settings

---

## Módulo 2 — UI Base

### Aula 2.4 — Kanban Board ✅
**Branch:** `feat/m3-kanban-ui` → PR #1 mergeado
- Board Kanban com 6 colunas (Novo Lead → Fechado Perdido)
- Cards de negócio com título, valor, responsável e prazo
- Drag-and-drop com `@dnd-kit/core` + `@dnd-kit/sortable`
- Atualizações otimistas de UI

### Aula 2.6 — Landing Page ✅
**Branch:** `feat/m13-landing` → PR #2 mergeado
- Página pública em `app/(marketing)/`
- Seções: Hero, Funcionalidades, Planos e preços, Footer
- CTA para registro

---

## Módulo 3 — Supabase & Auth

### Aula 3.1 — Setup Supabase & Chaves ✅
**Branch:** `feat/supabase-core` → PR #3 mergeado
- Instala `@supabase/supabase-js` e `@supabase/ssr`
- `lib/supabase/client.ts` — lazy singleton para uso no browser (`createBrowserClient`)
- `lib/supabase/server.ts` — client async com cookie store para Server Components e Server Actions (`createServerClient`)
- `.env.local` com as 3 chaves Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- `.gitignore` cobre `.env*` — chaves nunca commitadas
- Build TypeScript sem erros confirmado

### Aula 3.2 — Migrations & Segurança RLS ✅
**Branch:** `feat/supabase-migrations` → PR #4 mergeado
- `supabase/migrations/001_init.sql` — extensão uuid-ossp + função `handle_updated_at` + helper `is_workspace_member` (SECURITY DEFINER)
- `supabase/migrations/002_workspaces.sql` — tabela + RLS (insert autenticado, select/update/delete por membership)
- `supabase/migrations/003_workspace_members.sql` — tabela + índices compostos + RLS (admins gerenciam, usuário sai sozinho)
- `supabase/migrations/004_leads.sql` — tabela + índices + RLS por workspace
- `supabase/migrations/005_deals.sql` — tabela + índice Kanban (workspace, stage, position) + RLS
- `supabase/migrations/006_activities.sql` — tabela + índice timeline DESC + RLS
- `supabase/migrations/007_subscriptions.sql` — tabela + RLS read-only; writes apenas via service_role (webhook Stripe)
- `supabase/migrations/combined.sql` — SQL unificado para aplicar no SQL Editor do Supabase Studio
- `types/supabase.ts` — tipos `Database`, `Tables<T>`, `TablesInsert<T>`, `TablesUpdate<T>` + aliases de domínio
- `scripts/apply-migrations.mjs` — script de aplicação automática via Management API / Supabase CLI

### Aula 3.3 — Auth Real & Proteção de Rotas ✅
**Branch:** `feat/auth-real` → PR #5 mergeado em `main`
- `lib/supabase/middleware.ts` — `updateSession` com `getUser()` (valida token no servidor, nunca `getSession()`)
- `proxy.ts` — proteção de rotas: `/(app)/*` exige sessão; `/(auth)/*` redireciona autenticados para `/dashboard` (Next.js 16 renomeou `middleware.ts` → `proxy.ts`)
- `app/api/auth/callback/route.ts` — troca code PKCE por sessão; suporte a email confirmation
- `lib/auth/actions.ts` — Server Actions: `signIn`, `signUp`, `signOut`, `createWorkspace`
- `app/(auth)/login/page.tsx` e `register/page.tsx` — conectados ao Supabase Auth real; exibem erros inline; tela "confirme seu e-mail" quando confirmação está ativa
- `app/(app)/onboarding/page.tsx` — cria workspace + workspace_member (admin) + subscription free (via service_role) no banco
- `components/shared/WorkspaceSwitcher.tsx` — dados reais do banco (sem mocks)
- `components/shared/UserMenu.tsx` — usuário real + logout via `signOut` Server Action
- `app/(app)/layout.tsx` — async Server Component; busca usuário e workspaces com RLS
- `supabase/migrations/008_rls_hardening.sql` — best practices: `TO authenticated` em todas as policies; `FORCE ROW LEVEL SECURITY`; covering index + partial index em `workspace_members`

---

## Módulo 4 — Features Core

### Aula 3.4 — Leads & Pipeline com Dados Reais ✅
**Branch:** `feat/leads-data` → PR #6 mergeado em `main`

- `lib/workspace/active.ts` — `getActiveWorkspaceId()` lê cookie `pipeflow_workspace_id` (fallback: primeira workspace do usuário); `setActiveWorkspaceId()` grava o cookie (chamado em `createWorkspace`)
- `lib/leads/actions.ts` — Server Actions: `getLeads`, `searchLeads` (busca ilike no banco), `createLead`, `updateLead`, `deleteLead`
- `lib/deals/actions.ts` — Server Actions: `getDeals` (join com leads para `lead_name`), `createDeal`, `updateDealStage` (persiste stage + position), `deleteDeal`
- `types/lead.ts` — tipos alinhados com o DB (`LeadStatus`, `ActivityType`, `Lead`, `Activity`); mocks removidos
- `types/deal.ts` — tipos alinhados com o DB (`Stage`, `Deal`); mocks removidos; `dealSchema` com `lead_id` e `expected_close_date`
- `components/leads/` — todos os componentes atualizados: `StatusBadge`, `ActivityTimeline`, `LeadProfile`, `LeadForm`, `LeadTable`, `LeadFilters`, `LeadsView` (Server Actions + `useTransition` para filtros no banco)
- `components/leads/LeadDetailClient.tsx` — novo Client Component com edição/exclusão via Server Actions
- `components/kanban/DealCard.tsx` — usa `expected_close_date` e `lead_name`; sem campo de assignee
- `components/kanban/DealForm.tsx` — select de leads reais; campos alinhados com o DB
- `components/kanban/KanbanBoard.tsx` — recebe `initialDeals`, `leads`, `workspaceId`; drag-and-drop chama `updateDealStage` em background
- `app/(app)/leads/page.tsx` — Server Component; busca leads reais
- `app/(app)/leads/[id]/page.tsx` — Server Component; busca lead + atividades; passa para `LeadDetailClient`
- `app/(app)/pipeline/page.tsx` — Server Component; busca deals + leads em paralelo
- `app/(app)/dashboard/page.tsx` — métricas reais: total leads, pipeline ativo, fechados ganhos, funil por stage, breakdown por status

### Aula 4.x — Atividades 🔜
### Aula 4.x — Multi-empresa & Convites 🔜

---

## Módulo 5 — Multi-empresa & Pagamentos (a definir)

### Aula 5.x — Workspace Switcher & Convites 🔜
### Aula 5.x — Stripe Checkout & Webhooks 🔜
### Aula 5.x — Customer Portal 🔜

---

_Legenda: ✅ concluído · 🔜 próximo_
