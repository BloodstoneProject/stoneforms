// Complete fixed Supabase client using SSR package
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export auth helpers that were removed
export const authHelpers = {
  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }
}
