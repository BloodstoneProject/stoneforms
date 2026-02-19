import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Client-side Supabase client (for use in 'use client' components)
export const createClient = () => {
  return createClientComponentClient()
}

// Server-side Supabase client (for use in server components)
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Auth helper functions
export const getUser = async () => {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
