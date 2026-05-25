# PipeFlow CRM — Project Briefing for Claude Code

Full PRD: [docs/PRD.md](docs/PRD.md)

## What This Is

PipeFlow CRM is a multi-tenant SaaS for sales pipeline management — think a simpler, more affordable Pipedrive. Each company/team gets an isolated **workspace**. Users manage leads, move deals through a Kanban pipeline, log activities, and subscribe to a paid plan via Stripe.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 — App Router |
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Database + Auth | Supabase (PostgreSQL + RLS + Auth) |
| Payments | Stripe Checkout + Webhooks + Customer Portal |
| Email | Resend |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable |
| Charts | Recharts |
| Language | TypeScript 5 (strict mode) |
| Deploy | Vercel (frontend) + Supabase (backend) |

## Folder Structure

```
pipeflow-crm/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, register, forgot-password
│   ├── (app)/                  # Protected app shell (sidebar layout)
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── pipeline/
│   │   ├── activities/
│   │   └── settings/
│   ├── (marketing)/            # Landing page (public)
│   └── api/                    # API routes (webhooks, etc.)
│       └── webhooks/stripe/
├── components/
│   ├── ui/                     # shadcn/ui primitives (do not edit)
│   ├── kanban/                 # Kanban board + cards
│   ├── leads/                  # Lead forms, list, detail
│   ├── dashboard/              # Metric cards, funnel chart
│   └── shared/                 # Sidebar, navbar, workspace switcher
├── lib/
│   ├── supabase/               # Client, server, middleware helpers
│   ├── stripe/                 # Stripe client + helpers
│   └── resend/                 # Email templates + send helpers
├── hooks/                      # Custom React hooks
├── types/                      # Shared TypeScript types and Zod schemas
├── styles/                     # Global CSS (Tailwind base)
└── docs/                       # PRD and other documentation
```

## Key Architecture Decisions

- **Server Components by default.** Only add `"use client"` when interactivity requires it (forms, drag-and-drop, charts).
- **Multi-tenancy via RLS.** Every table has a `workspace_id` column. Supabase Row Level Security policies enforce tenant isolation — never filter by workspace_id in application code alone.
- **Stripe webhooks are the source of truth** for subscription status. Never trust client-side plan data.
- **Resend** for all transactional email (invites, notifications). Never use Nodemailer or SMTP directly.
- **@dnd-kit** for Kanban drag-and-drop. Optimistic UI updates, then persist to Supabase.

## Visual Identity

Inspired by HubSpot CRM and Pipedrive — clean, professional, data-dense without feeling overwhelming.

- **Color palette:** Neutral grays for surfaces; a single vibrant accent (blue or indigo) for CTAs and active states; green for "Fechado Ganho", red for "Fechado Perdido"
- **Typography:** Inter (system-ui fallback) — use Tailwind's default font stack
- **Components:** shadcn/ui with a custom theme; avoid heavy rounded corners or pastel gradients
- **Density:** Compact by default — users are looking at lots of data. Use `text-sm` in tables and cards.
- **Icons:** Lucide React (ships with shadcn/ui)

## Coding Conventions

- TypeScript strict mode — no `any`, no `as unknown as`
- Named exports everywhere — no default exports except page/layout files required by Next.js
- Zod for all external data validation (form inputs, API responses, webhook payloads)
- No barrel files (`index.ts` re-exports) — import directly from the source file
- Server Actions for form mutations; API routes only for webhooks and third-party callbacks
- `lib/supabase/server.ts` for server-side Supabase client, `lib/supabase/client.ts` for browser client
- Env vars: `NEXT_PUBLIC_` prefix only for values safe to expose to the browser

## Feature Milestones (Build Order)

1. **Auth** — Supabase Auth (email/password), workspace creation on first login, middleware-protected routes
2. **Leads** — CRUD with search/filter, lead detail page
3. **Kanban Pipeline** — drag-and-drop board with 6 stages, optimistic updates
4. **Activities** — timeline per lead (call, email, meeting, note)
5. **Dashboard** — metric cards + Recharts funnel chart
6. **Multi-company** — workspace switcher, email invites (Resend), Admin/Member roles
7. **Payments** — Stripe plans (Free/Pro), checkout, webhook, customer portal
8. **Onboarding** — post-signup guided flow
9. **Landing Page** — Hero, Features, Pricing, CTA (public route)

## Plans & Limits

| Plan | Price | Collaborators | Leads |
|---|---|---|---|
| Free | R$0 | up to 2 | up to 50 |
| Pro | R$49/mês | Unlimited | Unlimited |
