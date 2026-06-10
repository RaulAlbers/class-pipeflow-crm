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

### Aula 3.3 — Auth UI (Login / Registro) 🔜
- Formulários de login e registro em `app/(auth)/`
- Validação com Zod + react-hook-form
- Server Actions para `signIn` e `signUp`
- Workspace criado automaticamente no primeiro login

### Aula 3.4 — Middleware & Proteção de Rotas 🔜
- `middleware.ts` para refresh de sessão Supabase
- Redirect para `/login` se não autenticado
- Redirect para `/dashboard` se já logado e acessar rota pública

---

## Módulo 4 — Features Core (a definir)

### Aula 4.x — Leads CRUD 🔜
### Aula 4.x — Pipeline com Persistência 🔜
### Aula 4.x — Atividades 🔜
### Aula 4.x — Dashboard com Dados Reais 🔜

---

## Módulo 5 — Multi-empresa & Pagamentos (a definir)

### Aula 5.x — Workspace Switcher & Convites 🔜
### Aula 5.x — Stripe Checkout & Webhooks 🔜
### Aula 5.x — Customer Portal 🔜

---

_Legenda: ✅ concluído · 🔜 próximo_
