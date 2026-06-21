// Notion integration. The owner pastes an internal integration token and a
// database id (the integration must be shared with that database in Notion).
// On each submission we create a page in the database, mapping answers to
// properties by case-insensitive label. We fetch the DB schema first so we only
// set properties that actually exist, which avoids Notion validation errors.

import type { AnswerPair } from './format'

const NOTION_VERSION = '2022-06-28'
const BASE = 'https://api.notion.com/v1'
const TIMEOUT_MS = 10000

export interface NotionConfig {
  token?: string
  databaseId?: string
  titleProperty?: string
}

interface NotionSendParams {
  token: string
  databaseId: string
  titleProperty?: string
  formTitle: string
  pairs: AnswerPair[]
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

async function notionFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

// Build a Notion property value from an answer, matched to the DB schema type.
function buildPropertyValue(notionType: string, value: string): any | null {
  const text = value.slice(0, 2000)
  switch (notionType) {
    case 'rich_text':
      return { rich_text: [{ type: 'text', text: { content: text } }] }
    case 'title':
      return { title: [{ type: 'text', text: { content: text.slice(0, 200) } }] }
    case 'number': {
      const n = Number(value.replace(/[^0-9.\-]/g, ''))
      return Number.isFinite(n) ? { number: n } : null
    }
    case 'select':
      return { select: { name: text.slice(0, 100) } }
    case 'multi_select':
      return {
        multi_select: value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
          .slice(0, 100)
          .map((name) => ({ name: name.slice(0, 100) })),
      }
    case 'email':
      return { email: text }
    case 'phone_number':
      return { phone_number: text }
    case 'url':
      return { url: text }
    case 'checkbox':
      return { checkbox: /^(yes|true|1|on)$/i.test(value.trim()) }
    case 'date': {
      const d = new Date(value)
      return Number.isNaN(d.getTime()) ? null : { date: { start: d.toISOString() } }
    }
    default:
      return null
  }
}

export async function createNotionPage({
  token,
  databaseId,
  titleProperty,
  formTitle,
  pairs,
}: NotionSendParams): Promise<void> {
  // 1. Fetch the database schema so we map answers onto real properties.
  let schema: Record<string, { id: string; type: string; name: string }> = {}
  let titleKey = titleProperty || ''
  try {
    const dbRes = await notionFetch(`${BASE}/databases/${databaseId}`, {
      method: 'GET',
      headers: headers(token),
    })
    if (dbRes.ok) {
      const db: any = await dbRes.json()
      const props = db?.properties || {}
      for (const [name, def] of Object.entries<any>(props)) {
        schema[name.toLowerCase()] = { id: def.id, type: def.type, name }
        if (def.type === 'title' && !titleKey) titleKey = name
      }
    }
  } catch {
    // Schema fetch failed; we'll fall back to a best-effort title-only page.
  }

  // Determine the title property name (default "Name").
  if (!titleKey) {
    const found = Object.values(schema).find((p) => p.type === 'title')
    titleKey = found?.name || titleProperty || 'Name'
  }

  const titleValue = `${formTitle} — ${new Date().toLocaleString('en-GB')}`

  const properties: Record<string, any> = {}
  properties[titleKey] = { title: [{ type: 'text', text: { content: titleValue.slice(0, 200) } }] }

  // Map each answer to a matching property by case-insensitive label.
  for (const pair of pairs) {
    const match = schema[pair.label.toLowerCase()]
    if (!match) continue
    if (match.type === 'title') continue // already set the title
    const built = buildPropertyValue(match.type, pair.value)
    if (built) properties[match.name] = built
  }

  // Mirror the full submission into the page body so nothing is lost even when
  // labels don't match DB columns.
  const children = pairs.slice(0, 90).map((p) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        { type: 'text', text: { content: `${p.label}: `.slice(0, 100) }, annotations: { bold: true } },
        { type: 'text', text: { content: p.value.slice(0, 1900) } },
      ],
    },
  }))

  const res = await notionFetch(`${BASE}/pages`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
      ...(children.length ? { children } : {}),
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Notion API returned HTTP ${res.status} ${detail.slice(0, 300)}`)
  }
}
