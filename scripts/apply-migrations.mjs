#!/usr/bin/env node
/**
 * Aplica supabase/migrations/combined.sql diretamente no projeto Supabase
 * via Management API (requer SUPABASE_ACCESS_TOKEN no .env.local).
 *
 * Uso: node scripts/apply-migrations.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Lê variáveis de ambiente de .env.local ────────────────────────────────────
function loadEnv() {
  try {
    const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    for (const line of env.split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length && !key.startsWith('#')) {
        process.env[key.trim()] ??= rest.join('=').trim()
      }
    }
  } catch {
    // .env.local opcional
  }
}

loadEnv()

const PROJECT_REF   = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
const ACCESS_TOKEN  = process.env.SUPABASE_ACCESS_TOKEN    // PAT gerado em app.supabase.com/account/tokens
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!PROJECT_REF) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL não encontrada em .env.local')
  process.exit(1)
}

const SQL = readFileSync(resolve(__dirname, '../supabase/migrations/combined.sql'), 'utf8')

// ── Tentativa 1: Management API (requer PAT) ──────────────────────────────────
async function tryManagementApi() {
  const token = ACCESS_TOKEN || SERVICE_KEY
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${token}`,
      },
      body: JSON.stringify({ query: SQL }),
    }
  )

  if (res.ok) {
    const json = await res.json().catch(() => ({}))
    console.log('✅  Migrations aplicadas via Management API.')
    if (json) console.log(json)
    return true
  }

  const text = await res.text()
  console.warn(`⚠️   Management API retornou ${res.status}: ${text.slice(0, 200)}`)
  return false
}

// ── Tentativa 2: Supabase CLI (npx) ───────────────────────────────────────────
async function trySupabaseCli() {
  const { execSync } = await import('child_process')
  try {
    execSync(
      `npx --yes supabase db execute --project-ref ${PROJECT_REF} --file supabase/migrations/combined.sql`,
      { stdio: 'inherit', cwd: resolve(__dirname, '..') }
    )
    console.log('✅  Migrations aplicadas via Supabase CLI.')
    return true
  } catch (err) {
    console.warn('⚠️   Supabase CLI falhou:', err.message?.slice(0, 200))
    return false
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log(`🚀  Aplicando migrations no projeto ${PROJECT_REF}…\n`)

const ok = await tryManagementApi() || await trySupabaseCli()

if (!ok) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌  Não foi possível aplicar automaticamente.

Aplique manualmente:
  1. Acesse https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new
  2. Cole o conteúdo de supabase/migrations/combined.sql
  3. Clique em "Run"

Ou adicione SUPABASE_ACCESS_TOKEN ao .env.local:
  Gere em: https://app.supabase.com/account/tokens
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
  process.exit(1)
}
