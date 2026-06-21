// Google Sheets integration helpers.
//
// Talks to Google's OAuth2 + Sheets REST API directly via fetch (no googleapis
// SDK). One connection per form lives in public.google_connections; each form
// submission is appended as a row to the connected spreadsheet.
//
// Credentials come from env (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET). They are
// added later, so every function that needs them no-ops gracefully when missing
// rather than throwing — the form submit path must never break.

import { createAdminClient } from '@/lib/supabase-server'
import { getSiteUrl } from '@/lib/site'

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
]

function getClientId(): string | undefined {
  return process.env.GOOGLE_CLIENT_ID
}

function getClientSecret(): string | undefined {
  return process.env.GOOGLE_CLIENT_SECRET
}

export function getRedirectUri(): string {
  return `${getSiteUrl()}/api/integrations/google/callback`
}

export function isGoogleConfigured(): boolean {
  return Boolean(getClientId() && getClientSecret())
}

// Build the OAuth2 consent URL. state carries the formId so the callback knows
// which form to connect. Returns '' if not configured (caller should guard).
export function getGoogleAuthUrl(formId: string): string {
  const clientId = getClientId()
  if (!clientId) return ''

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: formId,
  })

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
}

// Exchange an authorization code for access + refresh tokens.
export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const clientId = getClientId()
  const clientSecret = getClientSecret()
  if (!clientId || !clientSecret) {
    throw new Error('Google integration is not configured')
  }

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(),
      grant_type: 'authorization_code',
    }).toString(),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Token exchange failed: ${res.status} ${detail}`)
  }

  const data = await res.json()
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  }
}

// Use a stored refresh token to mint a fresh access token. Google does not
// return a new refresh_token here, so callers keep the existing one.
export async function refreshAccessToken(
  refresh_token: string
): Promise<{ access_token: string; expires_in: number }> {
  const clientId = getClientId()
  const clientSecret = getClientSecret()
  if (!clientId || !clientSecret) {
    throw new Error('Google integration is not configured')
  }

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }).toString(),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Token refresh failed: ${res.status} ${detail}`)
  }

  const data = await res.json()
  return { access_token: data.access_token, expires_in: data.expires_in }
}

// Append a single row to the given spreadsheet/sheet via values:append.
export async function appendRow(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  values: string[]
): Promise<void> {
  const range = encodeURIComponent(`${sheetName || 'Sheet1'}!A1`)
  const url =
    `${SHEETS_API}/${spreadsheetId}/values/${range}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [values] }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Sheets append failed: ${res.status} ${detail}`)
  }
}

// Coerce any answer value into a single cell string.
function formatAnswer(value: any): string {
  if (value === undefined || value === null) return ''
  if (Array.isArray(value)) return value.map((v) => formatAnswer(v)).join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

// Best-effort: append a submission as a row to the form's connected sheet.
// Looks up the connection with the service-role client (runs on behalf of an
// anonymous respondent during submit). Refreshes the access token if expired.
// NEVER throws — every failure path is caught and logged.
export async function appendSubmissionToSheet(
  formId: string,
  answers: Record<string, any>,
  fields: { id: string; label: string }[]
): Promise<void> {
  try {
    if (!isGoogleConfigured()) return

    const admin = createAdminClient()
    const { data: connection } = await admin
      .from('google_connections')
      .select('*')
      .eq('form_id', formId)
      .single()

    if (!connection || !connection.spreadsheet_id) return

    // Refresh the access token if it is missing or within 60s of expiry.
    let accessToken: string | null = connection.access_token
    const expiry = connection.token_expiry ? new Date(connection.token_expiry).getTime() : 0
    const needsRefresh = !accessToken || expiry - Date.now() < 60_000

    if (needsRefresh) {
      if (!connection.refresh_token) return
      try {
        const refreshed = await refreshAccessToken(connection.refresh_token)
        accessToken = refreshed.access_token
        await admin
          .from('google_connections')
          .update({
            access_token: refreshed.access_token,
            token_expiry: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
          })
          .eq('id', connection.id)
      } catch (refreshErr) {
        console.error('Google Sheets token refresh error:', refreshErr)
        return
      }
    }

    if (!accessToken) return

    const row = [
      new Date().toISOString(),
      ...fields.map((f) => formatAnswer(answers?.[f.id])),
    ]

    await appendRow(accessToken, connection.spreadsheet_id, connection.sheet_name || 'Sheet1', row)
  } catch (err) {
    console.error('Google Sheets append error:', err)
  }
}
