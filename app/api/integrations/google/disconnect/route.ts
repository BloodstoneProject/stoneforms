import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// POST /api/integrations/google/disconnect  { formId }
// Removes the Google Sheets connection for a form. Verifies ownership; the
// delete runs under the owner's session (RLS enforces user_id = auth.uid()).
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const formId = String(body.formId || '').trim()

  if (!formId) {
    return NextResponse.json({ error: 'Missing formId' }, { status: 400 })
  }

  // Verify form ownership.
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', formId)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('google_connections')
    .delete()
    .eq('form_id', formId)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
