# PipeFlow CRM — Execution Plan

> **Abordagem:** UI primeiro, backend depois. Cada milestone entrega uma fatia vertical funcional — tela navegável antes de conectar dados reais. Branches seguem o padrão `feat/milestone-N-<slug>`.

---

## M0 — Project Setup

**Branch:** `feat/m0-setup`
**Objetivo:** Scaffoldar o projeto Next.js com todas as dependências e configurações base, sem nenhuma funcionalidade de negócio.

### Entregas

- [x] `npx create-next-app@latest` com TypeScript, Tailwind, App Router, src/ desligado
- [x] Instalar e inicializar shadcn/ui (`npx shadcn@latest init`)
- [x] Instalar dependências: `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities recharts @supabase/supabase-js @supabase/ssr stripe resend zod`
- [x] Configurar tema shadcn: cor primária indigo, bordas sutis (radius 0.5rem)
- [x] Criar `.env.local.example` com todas as variáveis necessárias documentadas
- [x] Configurar `tsconfig.json` com `strict: true` e alias `@/*`
- [x] Criar estrutura de pastas conforme CLAUDE.md (`app/`, `components/`, `lib/`, `hooks/`, `types/`)
- [x] Adicionar `middleware.ts` vazio com comentário de placeholder para proteção de rotas
- [x] Confirmar que `npm run dev` sobe sem erros em `localhost:3000`

**Commit final:** `feat: project scaffold with Next.js 14, shadcn/ui, and all dependencies`

---

## M1 — App Shell & Design System

**Branch:** `feat/m1-shell`
**Objetivo:** Construir o layout completo do app (sidebar, navbar, workspace switcher) com dados fictícios — sem autenticação real ainda. Define o design system visual de todo o produto.

### Entregas

- [ ] Layout `app/(app)/layout.tsx` com sidebar fixa à esquerda e área de conteúdo
- [ ] `components/shared/Sidebar.tsx` com navegação: Dashboard, Leads, Pipeline, Atividades, Configurações
- [ ] `components/shared/WorkspaceSwitcher.tsx` com dropdown de workspaces (mock)
- [ ] `components/shared/UserMenu.tsx` com avatar, nome e botão sair
- [ ] `components/shared/TopBar.tsx` com título da página atual e ações contextuais
- [ ] Definir tokens de cor no `globals.css`: `--primary` (indigo-600), `--success` (green-600), `--danger` (red-600), `--muted` (gray-500)
- [ ] Página placeholder para cada rota do app (`/dashboard`, `/leads`, `/pipeline`, `/activities`, `/settings`)
- [ ] Layout responsivo: sidebar colapsável em mobile (Sheet do shadcn/ui)
- [ ] Favicon e metadata base em `app/layout.tsx`

**Commit final:** `feat: app shell with sidebar, workspace switcher, and design tokens`

---

## M2 — Leads UI

**Branch:** `feat/m2-leads-ui`
**Objetivo:** Construir todas as telas de gestão de leads com dados mockados em memória. Nenhuma chamada ao Supabase ainda.

### Entregas

- [ ] `types/lead.ts` — tipo `Lead` com todos os campos do PRD + Zod schema
- [ ] `app/(app)/leads/page.tsx` — listagem com tabela compacta (`text-sm`)
- [ ] `components/leads/LeadTable.tsx` — colunas: nome, empresa, status, responsável, data, ações
- [ ] `components/leads/LeadFilters.tsx` — barra de busca + filtros por status e responsável
- [ ] `app/(app)/leads/new/page.tsx` + `components/leads/LeadForm.tsx` — formulário de criação (react-hook-form + Zod)
- [ ] `app/(app)/leads/[id]/page.tsx` — página de detalhe com perfil completo
- [ ] `components/leads/LeadProfile.tsx` — card com todos os dados do lead
- [ ] `components/leads/ActivityTimeline.tsx` — timeline cronológica (mock vazio por ora)
- [ ] Badge de status com cores: Novo (blue), Contato Realizado (yellow), Proposta (purple), Negociação (orange), Ganho (green), Perdido (red)
- [ ] Estado vazio ("Nenhum lead cadastrado") com CTA para criar

**Commit final:** `feat: leads UI with table, filters, form, and detail page (mock data)`

---

## M3 — Kanban UI

**Branch:** `feat/m3-kanban-ui`
**Objetivo:** Construir o board Kanban com drag-and-drop funcional em estado local — sem persistência ainda.

### Entregas

- [ ] `types/deal.ts` — tipo `Deal` com título, valor, lead vinculado, responsável, prazo, etapa
- [ ] `app/(app)/pipeline/page.tsx` — página do board
- [ ] `components/kanban/KanbanBoard.tsx` — container com `DndContext` do @dnd-kit
- [ ] `components/kanban/KanbanColumn.tsx` — coluna por etapa com `SortableContext`
- [ ] `components/kanban/DealCard.tsx` — card compacto com título, valor formatado (R$), avatar do responsável e prazo
- [ ] 6 colunas fixas: Novo Lead · Contato Realizado · Proposta Enviada · Negociação · Fechado Ganho · Fechado Perdido
- [ ] Drag-and-drop entre colunas com animação suave (`@dnd-kit/sortable`)
- [ ] Indicador de total de valor por coluna (soma dos deals)
- [ ] Modal/sheet de criação de deal (`components/kanban/DealForm.tsx`)
- [ ] Estado vazio por coluna com botão "+" para adicionar deal

**Commit final:** `feat: kanban board with drag-and-drop (local state, no persistence yet)`

---

## M4 — Dashboard UI

**Branch:** `feat/m4-dashboard-ui`
**Objetivo:** Construir o dashboard de métricas com dados fictícios, incluindo gráfico de funil.

### Entregas

- [ ] `app/(app)/dashboard/page.tsx` — página principal pós-login
- [ ] `components/dashboard/MetricCard.tsx` — card reutilizável com título, valor, variação e ícone
- [ ] 4 cards de métricas: Total de Leads, Negócios Abertos, Valor do Pipeline, Taxa de Conversão
- [ ] `components/dashboard/FunnelChart.tsx` — gráfico de funil com Recharts (BarChart horizontal)
- [ ] `components/dashboard/DealsDeadlineList.tsx` — lista de deals com prazo próximo (próximos 7 dias)
- [ ] Layout em grid responsivo: 4 cards em linha, funil + lista lado a lado
- [ ] Skeleton loaders para todos os componentes (preparar para dados reais)

**Commit final:** `feat: dashboard UI with metric cards and funnel chart (mock data)`

---

## M5 — Auth & Supabase Setup

**Branch:** `feat/m5-auth`
**Objetivo:** Conectar Supabase Auth, proteger rotas e criar workspace no primeiro login.

### Entregas

- [ ] Criar projeto no Supabase e configurar `.env.local` com URL e anon key
- [ ] `lib/supabase/client.ts` — browser client com `createBrowserClient`
- [ ] `lib/supabase/server.ts` — server client com `createServerClient` (cookies)
- [ ] `middleware.ts` — refresh de sessão + redirect para `/login` se não autenticado
- [ ] Schema SQL inicial: tabelas `profiles`, `workspaces`, `workspace_members`
- [ ] `app/(auth)/login/page.tsx` — tela de login com email/senha
- [ ] `app/(auth)/register/page.tsx` — tela de cadastro
- [ ] `app/(auth)/forgot-password/page.tsx` — recuperação de senha
- [ ] Server Action: criar workspace ao confirmar primeiro cadastro
- [ ] Substituir mock do `WorkspaceSwitcher` por dados reais do usuário logado
- [ ] RLS policies: `workspaces` e `workspace_members` isoladas por `user_id`

**Commit final:** `feat: Supabase Auth with workspace creation and route protection`

---

## M6 — Leads Backend

**Branch:** `feat/m6-leads-backend`
**Objetivo:** Conectar todas as telas de leads ao Supabase com RLS por workspace.

### Entregas

- [ ] Schema SQL: tabela `leads` com todos os campos + `workspace_id` + `assigned_to`
- [ ] RLS policy: membros só veem leads do próprio workspace
- [ ] Server Action `createLead` — validação Zod + insert no Supabase
- [ ] Server Action `updateLead` + `deleteLead`
- [ ] `app/(app)/leads/page.tsx` — substituir mock por `select` Server Component
- [ ] Filtros de busca via `searchParams` (URL state)
- [ ] `app/(app)/leads/[id]/page.tsx` — buscar lead real por ID
- [ ] Tratar erro 404 se lead não pertencer ao workspace ativo

**Commit final:** `feat: leads connected to Supabase with RLS and Server Actions`

---

## M7 — Kanban Backend

**Branch:** `feat/m7-kanban-backend`
**Objetivo:** Persistir deals e movimentações do Kanban no Supabase.

### Entregas

- [ ] Schema SQL: tabela `deals` com `stage`, `position` (ordem na coluna), `workspace_id`
- [ ] RLS policy: deals isolados por workspace
- [ ] Server Action `createDeal` + `updateDeal` + `deleteDeal`
- [ ] Server Action `moveDeal` — atualiza `stage` e `position` em uma transação
- [ ] `KanbanBoard` com fetch inicial via Server Component + hydratação client-side
- [ ] Optimistic update no drag: mover card visualmente antes do servidor confirmar
- [ ] Revert automático se a Server Action retornar erro

**Commit final:** `feat: kanban deals persisted in Supabase with optimistic drag-and-drop`

---

## M8 — Activities Backend

**Branch:** `feat/m8-activities`
**Objetivo:** Implementar registro de atividades com timeline real vinculada ao lead.

### Entregas

- [ ] Schema SQL: tabela `activities` com `type` (enum), `description`, `author_id`, `lead_id`, `created_at`
- [ ] RLS policy: atividades isoladas por workspace via join com leads
- [ ] `components/leads/ActivityTimeline.tsx` — substituir mock por dados reais
- [ ] `components/leads/AddActivityForm.tsx` — formulário com seleção de tipo (Ligação, E-mail, Reunião, Nota)
- [ ] Server Action `createActivity`
- [ ] Ordenação cronológica decrescente (mais recente no topo)
- [ ] Ícone e cor distintos por tipo de atividade

**Commit final:** `feat: activities timeline with Supabase persistence`

---

## M9 — Dashboard Backend

**Branch:** `feat/m9-dashboard-backend`
**Objetivo:** Conectar dashboard a queries reais no Supabase.

### Entregas

- [ ] Query: total de leads do workspace
- [ ] Query: negócios abertos (não Fechado Ganho/Perdido) + soma de valores
- [ ] Query: taxa de conversão (Fechado Ganho / total de negócios)
- [ ] Query: contagem de deals por etapa para o gráfico de funil
- [ ] Query: deals com `deadline` nos próximos 7 dias
- [ ] Remover todos os dados mock do dashboard
- [ ] Adicionar `loading.tsx` para cada seção com skeleton

**Commit final:** `feat: dashboard connected to real Supabase queries`

---

## M10 — Multi-company & Invites

**Branch:** `feat/m10-multi-company`
**Objetivo:** Workspace switcher funcional, convite de membros por e-mail e controle de papéis.

### Entregas

- [ ] Schema SQL: tabela `invites` com `email`, `workspace_id`, `role`, `token`, `expires_at`
- [ ] `app/(app)/settings/page.tsx` — página de configurações do workspace
- [ ] `components/shared/WorkspaceSwitcher.tsx` — trocar workspace ativo (salvo em cookie)
- [ ] Server Action `inviteMember` — gerar token único + enviar e-mail via Resend
- [ ] `lib/resend/invite-email.tsx` — template de e-mail de convite
- [ ] `app/(auth)/invite/[token]/page.tsx` — página de aceite de convite
- [ ] Server Action `acceptInvite` — criar entrada em `workspace_members`
- [ ] Controle de papel: Admin vê menu de configurações; Membro não
- [ ] Limite Free: bloquear convite ao atingir 2 membros (verificar na Server Action)

**Commit final:** `feat: multi-company with workspace switcher, email invites, and role-based access`

---

## M11 — Payments (Stripe)

**Branch:** `feat/m11-payments`
**Objetivo:** Integrar Stripe Checkout, webhook e Customer Portal para monetização.

### Entregas

- [ ] Configurar produtos e preços no Stripe Dashboard (Free e Pro R$49/mês)
- [ ] `lib/stripe/client.ts` — instância do Stripe server-side
- [ ] Schema SQL: coluna `stripe_customer_id` e `plan` em `workspaces`
- [ ] Server Action `createCheckoutSession` — redireciona para Stripe Checkout
- [ ] `app/api/webhooks/stripe/route.ts` — handler de webhooks (checkout.completed, subscription.deleted)
- [ ] Webhook atualiza `plan` em `workspaces` após pagamento confirmado
- [ ] Server Action `createPortalSession` — redireciona para Customer Portal do Stripe
- [ ] `app/(app)/settings/billing/page.tsx` — página de faturamento com plano atual e botão de gerenciar
- [ ] Enforcement de limites Free na UI: banner de upgrade ao atingir 50 leads ou 2 membros
- [ ] Página de sucesso e cancelamento pós-checkout (`/checkout/success`, `/checkout/cancel`)

**Commit final:** `feat: Stripe integration with checkout, webhooks, and customer portal`

---

## M12 — Onboarding

**Branch:** `feat/m12-onboarding`
**Objetivo:** Guiar novos usuários nos primeiros passos após o cadastro.

### Entregas

- [ ] `app/(app)/onboarding/page.tsx` — fluxo de 3 etapas: nome do workspace → convidar membro → criar primeiro lead
- [ ] Salvar flag `onboarding_completed` em `profiles`
- [ ] Middleware redireciona para `/onboarding` se flag for false após login
- [ ] Componente `OnboardingProgress` com steps visuais
- [ ] Skip option em cada etapa (marcar onboarding como completo)

**Commit final:** `feat: onboarding flow with workspace setup and first-run guidance`

---

## M13 — Landing Page

**Branch:** `feat/m13-landing`
**Objetivo:** Página pública de marketing para conversão de novos usuários.

### Entregas

- [ ] `app/(marketing)/page.tsx` — landing page principal
- [ ] `app/(marketing)/layout.tsx` — navbar pública com logo + CTA "Começar grátis"
- [ ] Seção Hero: headline, subheadline, screenshot do app, botão CTA
- [ ] Seção Funcionalidades: 3–4 cards com ícone, título e descrição (Kanban, Leads, Dashboard, Multi-empresa)
- [ ] Seção Planos e Preços: tabela Free vs Pro com toggle anual/mensal (visual apenas)
- [ ] Seção CTA final: "Comece grátis hoje" com link para `/register`
- [ ] Footer com links legais (placeholder)
- [ ] Metadata SEO: title, description, og:image

**Commit final:** `feat: public landing page with hero, features, pricing, and CTA sections`

---

## M14 — Deploy

**Branch:** `feat/m14-deploy` → merge em `main`
**Objetivo:** Colocar o produto em produção no Vercel + Supabase com todas as variáveis configuradas.

### Entregas

- [ ] Configurar projeto no Vercel com repositório GitHub
- [ ] Adicionar todas as env vars de produção no Vercel Dashboard
- [ ] Configurar `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` com domínio de produção
- [ ] Registrar webhook URL de produção no Stripe Dashboard
- [ ] Rodar migrations SQL no projeto Supabase de produção
- [ ] Habilitar confirmação de e-mail no Supabase Auth (produção)
- [ ] Testar fluxo completo: cadastro → onboarding → lead → kanban → pagamento
- [ ] Configurar domínio customizado (opcional)
- [ ] Adicionar `robots.txt` e `sitemap.xml` básicos

**Commit final:** `feat: production deployment on Vercel with all integrations configured`

---

## Resumo

| # | Milestone | Branch | Fase |
|---|---|---|---|
| 0 | Project Setup | `feat/m0-setup` | Infra |
| 1 | App Shell & Design System | `feat/m1-shell` | UI |
| 2 | Leads UI | `feat/m2-leads-ui` | UI |
| 3 | Kanban UI | `feat/m3-kanban-ui` | UI |
| 4 | Dashboard UI | `feat/m4-dashboard-ui` | UI |
| 5 | Auth & Supabase Setup | `feat/m5-auth` | Backend |
| 6 | Leads Backend | `feat/m6-leads-backend` | Backend |
| 7 | Kanban Backend | `feat/m7-kanban-backend` | Backend |
| 8 | Activities Backend | `feat/m8-activities` | Backend |
| 9 | Dashboard Backend | `feat/m9-dashboard-backend` | Backend |
| 10 | Multi-company & Invites | `feat/m10-multi-company` | Backend |
| 11 | Payments (Stripe) | `feat/m11-payments` | Backend |
| 12 | Onboarding | `feat/m12-onboarding` | Backend |
| 13 | Landing Page | `feat/m13-landing` | UI |
| 14 | Deploy | `feat/m14-deploy` | Infra |
