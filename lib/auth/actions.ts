'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server'
import {
  loginSchema,
  registerSchema,
  onboardingSchema,
  type LoginFormValues,
  type RegisterFormValues,
  type OnboardingFormValues,
} from '@/types/auth'

type ErrorResult    = { error: string }
type CheckEmailResult = { checkEmail: true }

export async function signIn(values: LoginFormValues): Promise<ErrorResult | void> {
  const parsed = loginSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: 'E-mail ou senha incorretos' }

  redirect('/dashboard')
}

export async function signUp(values: RegisterFormValues): Promise<ErrorResult | CheckEmailResult | void> {
  const parsed = registerSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: `${siteUrl}/api/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message.toLowerCase().includes('already registered')
        ? 'E-mail já cadastrado. Tente fazer login.'
        : error.message,
    }
  }

  // Email confirmation disabled → session created immediately → proceed to onboarding
  // Email confirmation enabled → no session yet → ask user to check inbox
  if (!data.session) return { checkEmail: true }

  redirect('/onboarding')
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function createWorkspace(values: OnboardingFormValues): Promise<ErrorResult | void> {
  const parsed = onboardingSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const slug =
    parsed.data.workspaceName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 7)

  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name: parsed.data.workspaceName, slug })
    .select('id')
    .single()

  if (wsError || !workspace) return { error: 'Erro ao criar workspace. Tente novamente.' }

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: user.id, role: 'admin' })

  if (memberError) return { error: 'Erro ao configurar permissões.' }

  // subscriptions has no INSERT policy (source of truth = Stripe webhooks)
  // use service_role to seed the free plan on workspace creation
  const admin = getSupabaseAdminClient()
  await admin.from('subscriptions').insert({ workspace_id: workspace.id })

  redirect('/dashboard')
}
