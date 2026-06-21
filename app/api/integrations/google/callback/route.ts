import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { exchangeCodeForTokens, appendRow, isGoogleConfigured } from '@/lib/google-sheets'
import { getSiteUrl } from '@/lib/site'

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

// GET /api/integrations/google/callback?code=...&state=<formId>
// Finishes the OAuth flow: exchanges the code for tokens, creates a fresh
// spreadsheet for the form, stores the connection, writes a header row, and
// redirects back to the integrations page.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const formId = searchParams.get('state')
  const oauthError = searchParams.get('error')

  const baseUrl = getSiteUrl()
  const redirectFor = (status: string) =>
    `${baseUrl}/dashboard/forms/${formId || ''}/integrations?google=${status}`

  if (oauthError || !code || !formId) {
    return NextResponse.redirect(redirectFor('error'))
  }

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(redirectFor('not_configured'))
  }

  try {
    // 1. Exchange the code for tokens.
    const tokens = await exchangeCodeForTokens(code)

    // 2. Load the form (service-role: this runs outside the user's session) to
    //    get its owner and title, and the fields for the header row.
    const admin = createAdminClient()
    const { data: form } = await admin
      .from('forms')
      .select('id, title, user_id')
      .eq('id', formId)
      .single()

    if (!form) {
      return NextResponse.redirect(redirectFor('error'))
    }

    const { data: fields } = await admin
      .from('form_fields')
      .select('id, label')
      .eq('form_id', formId)
      .order('position')

    // 3. Create a new spreadsheet titled after the form.
    const title = `Stoneforms — ${form.title || formId}`
    const createRes = await fetch(SHEETS_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties: { title } }),
    })

    if (!createRes.ok) {
      const detail = await createRes.text().catch(() => '')
      console.error('Spreadsheet create failed:', createRes.status, detail)
      return NextResponse.redirect(redirectFor('error'))
    }

    const created = await createRes.json()
    const spreadsheetId: string = created.spreadsheetId
    const spreadsheetUrl: string =
      created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    const sheetName: string = created.sheets?.[0]?.properties?.title || 'Sheet1'

    // 4. Upsert the connection row (one per form via the UNIQUE on form_id).
    const { error: upsertError } = await admin.from('google_connections').upsert(
      {
        user_id: form.user_id,
        form_id: formId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        spreadsheet_id: spreadsheetId,
        spreadsheet_url: spreadsheetUrl,
        sheet_name: sheetName,
      },
      { onConflict: 'form_id' }
    )

    if (upsertError) {
      console.error('google_connections upsert error:', upsertError)
      return NextResponse.redirect(redirectFor('error'))
    }

    // 5. Write a header row (best-effort — never block the redirect).
    try {
      const header = ['Submitted at', ...(fields || []).map((f) => f.label || f.id)]
      await appendRow(tokens.access_token, spreadsheetId, sheetName, header)
    } catch (headerErr) {
      console.error('Header row write error:', headerErr)
    }

    return NextResponse.redirect(redirectFor('connected'))
  } catch (err) {
    console.error('Google callback error:', err)
    return NextResponse.redirect(redirectFor('error'))
  }
}
