import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key'

// Server-side client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Client-side component client (for use in React components)
export const createClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authHelpers = {
  async signUp(email: string, password: string, userData?: { firstName?: string; lastName?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    return { session: data.session, error }
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    return { user: data.user, error }
  },
}
