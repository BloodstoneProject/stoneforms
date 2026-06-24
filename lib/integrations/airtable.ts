// Airtable integration. The owner pastes a personal access token (PAT), a base
// id and a table name. On each submission we map answers to a record (keyed by
// the field label, which must match an Airtable column name) and POST it to the
// table. We send `typecast: true` so Airtable coerces values into the matching
// column types where possible. Best-effort: errors are surfaced as thrown errors
// to the dispatcher, which catches and logs them.

import type { AnswerPair } from './format'

const BASE = 'https://api.airtable.com/v0'
const TIMEOUT_MS = 10000

export interface AirtableConfig {
  token?: string
  baseId?: string
  tableName?: string
}

interface AirtableSendParams {
  token: string
  baseId: string
  tableName: string
  formTitle: string
  pairs: AnswerPair[]
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function airtableFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

// Build the record's fields object from answer pairs, keyed by label. Airtable
// matches these to columns by name; unknown column names would error, so we rely
// on typecast plus the owner naming their columns to match the form labels.
function buildFields(pairs: AnswerPair[]): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const pair of pairs) {
    const key = (pair.label || '').toString().trim()
    if (!key) continue
    // Last write wins on duplicate labels; cap length to keep the request small.
    fields[key] = pair.value.slice(0, 100000)
  }
  return fields
}

export async function createAirtableRecord({
  token,
  baseId,
  tableName,
  formTitle,
  pairs,
}: AirtableSendParams): Promise<void> {
  const fields = buildFields(pairs)

  const url = `${BASE}/${baseId}/${encodeURIComponent(tableName)}`
  const res = await airtableFetch(url, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ fields, typecast: true }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Airtable API returned HTTP ${res.status} ${detail.slice(0, 300)}`)
  }
}
