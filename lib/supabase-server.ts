// Server-side Supabase client for API routes
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For API routes - creates a server client that reads auth from cookies
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Setting cookies in Server Components is not supported
        }
      },
    },
  })
}

// Admin client for trusted server-side operations that must bypass RLS
// (webhook delivery, cron jobs, Stripe reconciliation). Uses the service-role
// key when available; falls back to the anon key (RLS still applies) so local
// dev without the secret degrades gracefully instead of crashing.
let warnedAboutMissingServiceRole = false

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    // Graceful degradation is intended for local dev. In production it means
    // every "admin" client is really the anon client, so privileged writes are
    // silently refused by RLS with no error at the call site - webhooks and
    // cron jobs appear to succeed and save nothing. Say so, loudly and once,
    // rather than letting it stay invisible.
    if (process.env.NODE_ENV === 'production' && !warnedAboutMissingServiceRole) {
      warnedAboutMissingServiceRole = true
      console.error(
        '[supabase] SUPABASE_SERVICE_ROLE_KEY is not set in production. ' +
          'createAdminClient() is falling back to the anon key, so anything ' +
          'relying on bypassing RLS - webhook delivery, cron jobs, Stripe ' +
          'reconciliation - will fail silently. Set the variable in Vercel.'
      )
    }
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
