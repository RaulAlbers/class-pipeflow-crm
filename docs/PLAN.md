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

- [x] Layout `app/(app)/layout.tsx` com sidebar fixa à esquerda e área de conteúdo
- [x] `components/shared/Sidebar.tsx` com navegação: Dashboard, Leads, Pipeline, Atividades, Configurações
- [x] `components/shared/WorkspaceSwitcher.tsx` com dropdown de workspaces (mock)
- [x] `components/shared/UserMenu.tsx` com avatar, nome e botão sair
- [x] `components/shared/TopBar.tsx` com título da página atual e ações contextuais
- [x] Definir tokens de cor no `globals.css`: `--primary` (indigo-500), `--success` (green-700), `--danger` (red-600), `--muted` (zinc-500)
- [x] Página placeholder para cada rota do app (`/dashboard`, `/leads`, `/pipeline`, `/activities`, `/settings`)
- [x] Layout responsivo: sidebar colapsável em mobile (Sheet do shadcn/ui)
- [x] Favicon e metadata base em `app/layout.tsx`

**Commit final:** `feat: app shell with sidebar, workspace switcher, and design tokens`

---

## Aula 2.2 — Auth & Onboarding UI

**Branch:** `feat/m2-auth-onboarding-ui` → merged em `main`
**Objetivo:** Construir as telas de autenticação e onboarding como UI pura — sem Supabase ainda. Navegação fake para validar fluxo visual.

### Entregas

- [x] `types/auth.ts` — schemas Zod: loginSchema, registerSchema, forgotPasswordSchema, onboardingSchema
- [x] `components/ui/input.tsx` e `components/ui/label.tsx` — primitivas de formulário
- [x] `app/(auth)/layout.tsx` — layout split-screen: painel de brand (desktop) + área de formulário
- [x] `app/(auth)/login/page.tsx` — email/senha, validação, loading, redirect fake → `/dashboard`
- [x] `app/(auth)/register/page.tsx` — 4 campos, validação de mismatch de senhas, redirect → `/onboarding`
- [x] `app/(auth)/forgot-password/page.tsx` — campo de e-mail, loading, estado de sucesso com "tente novamente"
- [x] `app/(app)/onboarding/page.tsx` — step 1/3: nome do workspace, stepper visual, redirect → `/dashboard`
- [x] `app/page.tsx` — redirect `/` → `/login`

**Commit final:** `feat: auth UI and onboarding with form validation and fake navigation`

---

## Aula 2.3 — Gestão de Leads UI

**Branch:** `feat/m2-leads-ui` → merged em `main`
**Objetivo:** Construir todas as telas de gestão de leads com dados mockados em memória. Nenhuma chamada ao Supabase ainda.

### Entregas

- [x] `types/lead.ts` — tipo `Lead` com todos os campos + Zod schema + 15 mock leads brasileiros
- [x] `app/(app)/leads/page.tsx` — listagem com tabela compacta (`text-sm`)
- [x] `components/leads/LeadTable.tsx` — colunas: nome, empresa, status, responsável, data, ações
- [x] `components/leads/LeadFilters.tsx` — busca por nome/empresa + filtros por status (chips)
- [x] `app/(app)/leads/new/page.tsx` + `components/leads/LeadForm.tsx` — formulário de criação (react-hook-form + Zod)
- [x] `app/(app)/leads/[id]/page.tsx` — página de detalhe com perfil completo
- [x] `components/leads/LeadProfile.tsx` — card com todos os dados do lead
- [x] `components/leads/ActivityTimeline.tsx` — timeline cronológica (mock com atividades reais)
- [x] Badge de status com cores: Novo (blue), Contato Realizado (yellow), Proposta (purple), Negociação (orange), Ganho (green), Perdido (red)
- [x] Estado vazio ("Nenhum lead encontrado") com mensagem contextual
- [x] CRUD completo em estado local: criar via Sheet, editar via Sheet, excluir via ConfirmDialog
- [x] Primitivas: `components/ui/select.tsx`, `textarea.tsx`, `dialog.tsx`

**Commit final:** `feat: leads UI with table, filters, form, and detail page (mock data)`

---

## Aula 2.4 — Kanban UI

**Branch:** `feat/m3-kanban-ui` → merged em `main`
**Objetivo:** Construir o board Kanban com drag-and-drop funcional em estado local — sem persistência ainda.

### Entregas

- [x] `types/deal.ts` — tipo `Deal` com título, valor, lead vinculado, responsável, prazo, etapa
- [x] `app/(app)/pipeline/page.tsx` — página do board
- [x] `components/kanban/KanbanBoard.tsx` — container com `DndContext` do @dnd-kit
- [x] `components/kanban/KanbanColumn.tsx` — coluna por etapa com `SortableContext`
- [x] `components/kanban/DealCard.tsx` — card compacto com título, valor formatado (R$), avatar do responsável e prazo
- [x] 6 colunas fixas: Novo Lead · Contato Realizado · Proposta Enviada · Negociação · Fechado Ganho · Fechado Perdido
- [x] Drag-and-drop entre colunas com animação suave (`@dnd-kit/sortable`)
- [x] Indicador de total de valor por coluna (soma dos deals)
- [x] Modal/sheet de criação de deal (`components/kanban/DealForm.tsx`)
- [x] Estado vazio por coluna com botão "+" para adicionar deal

**Commit final:** `feat: kanban board with drag-and-drop (local state, no persistence yet)`

---

## M4 — Dashboard UI

**Branch:** `feat/m4-dashboard-ui` → implementado, aguardando merge
**Objetivo:** Construir o dashboard de métricas com dados fictícios, incluindo gráfico de funil.

### Entregas

- [x] `app/(app)/dashboard/page.tsx` — página principal pós-login
- [x] `components/dashboard/MetricCard.tsx` — card reutilizável com título, valor, variação e ícone
- [x] `components/dashboard/DashboardView.tsx` — server component container com cálculo de métricas
- [x] 4 cards de métricas: Total de Leads (15), Negócios Abertos (13), Valor do Pipeline (R$703k), Taxa de Conversão (57%)
- [x] `components/dashboard/FunnelChart.tsx` — gráfico de funil com Recharts (BarChart horizontal, 6 etapas coloridas)
- [x] `components/dashboard/DeadlineDeals.tsx` — lista de deals com prazo próximo, ordenados por urgência, badges vermelho/amarelo/cinza _(nomeado `DeadlineDeals` em vez de `DealsDeadlineList`)_
- [x] Layout em grid responsivo: 4 cards em linha, funil (60%) + lista (40%) lado a lado
- [ ] Skeleton loaders para todos os componentes _(adiado para M9 — será feito junto com `loading.tsx` ao conectar Supabase)_

**Commit final:** `feat: dashboard de métricas UI (aula 2.5)` — `4066d12`

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
- [x] `app/(auth)/login/page.tsx` — tela de login com email/senha _(UI criada na Aula 2.2 — conectar Supabase aqui)_
- [x] `app/(auth)/register/page.tsx` — tela de cadastro _(UI criada na Aula 2.2 — conectar Supabase aqui)_
- [x] `app/(auth)/forgot-password/page.tsx` — recuperação de senha _(UI criada na Aula 2.2 — conectar Supabase aqui)_
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

- [x] `app/(app)/onboarding/page.tsx` — step 1 (nome do workspace) UI criada na Aula 2.2 — completar steps 2 e 3 + persistência aqui
- [ ] Salvar flag `onboarding_completed` em `profiles`
- [ ] Middleware redireciona para `/onboarding` se flag for false após login
- [ ] Componente `OnboardingProgress` com steps visuais
- [ ] Skip option em cada etapa (marcar onboarding como completo)

**Commit final:** `feat: onboarding flow with workspace setup and first-run guidance`

---

## M13 — Landing Page

**Branch:** `feat/m13-landing` → merged em `main` via [PR #2](https://github.com/RaulAlbers/class-pipeflow-crm/pull/2)
**Objetivo:** Página pública de marketing para conversão de novos usuários.

### Entregas

- [x] `app/page.tsx` — landing page principal (substituiu redirect para `/login`)
- [x] `app/(marketing)/layout.tsx` — layout para futuras páginas de marketing
- [x] `components/marketing/MarketingNav.tsx` — navbar fixa com logo, links âncora e CTAs
- [x] `components/marketing/HeroSection.tsx` — headline, subheadline, 2 CTAs e grid de 4 stats (+47% conversão, 3.2× leads, −62% ciclo, 1200+ times)
- [x] `components/marketing/FeaturesSection.tsx` — 6 cards (Kanban, Leads, Dashboard, Atividades, Multi-empresa, Segurança) com hover luminoso
- [x] `components/marketing/PricingSection.tsx` — Free vs Pro com toggle mensal/anual (−20%)
- [x] `components/marketing/CtaSection.tsx` — "Pronto para fechar mais negócios?" com link `/register`
- [x] `components/marketing/MarketingFooter.tsx` — logo + 3 grupos de links (Produto, Empresa, Legal)
- [x] Metadata SEO: title, description, og:title, og:description

**Commit final:** `feat: landing page pública — hero, features, pricing e footer (aula 2.6)` — `1cf2e0a`

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
