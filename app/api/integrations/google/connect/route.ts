import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { getGoogleAuthUrl, isGoogleConfigured } from '@/lib/google-sheets'
import { getSiteUrl } from '@/lib/site'

// GET /api/integrations/google/connect?formId=...
// Starts the OAuth flow: verifies the caller owns the form, then redirects to
// Google's consent screen. The callback finishes the connection.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const formId = searchParams.get('formId')

  if (!formId) {
    return NextResponse.json({ error: 'Missing formId' }, { status: 400 })
  }

  const integrationsUrl = `${getSiteUrl()}/dashboard/forms/${formId}/integrations`

  const supabase = createServerSupabaseClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

  // Not configured yet — send the user back with an error flag rather than 500.
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(`${integrationsUrl}?google=not_configured`)
  }

  return NextResponse.redirect(getGoogleAuthUrl(formId))
}
