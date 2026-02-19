import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Auth helpers for convenience
export const authHelpers = {
  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }
}
