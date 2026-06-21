// Mailchimp integration. The owner pastes an API key (the datacenter is the
// suffix after the last "-", e.g. "us21") and an audience/list id. On each
// submission, if we captured an email, we upsert the respondent as a member
// using PUT .../members/{md5(lowercased email)} so re-submissions update rather
// than duplicate.

import crypto from 'crypto'
import type { AnswerPair } from './format'
import { detectEmail, detectName, type FieldLike } from './format'

const TIMEOUT_MS = 10000

export interface MailchimpConfig {
  apiKey?: string
  audienceId?: string
  tags?: string[] | string
}

interface MailchimpSyncParams {
  apiKey: string
  audienceId: string
  tags?: string[] | string
  fields: FieldLike[]
  responses: Record<string, any>
  pairs: AnswerPair[]
}

function datacenter(apiKey: string): string | null {
  const idx = apiKey.lastIndexOf('-')
  if (idx === -1) return null
  const dc = apiKey.slice(idx + 1).trim()
  return dc || null
}

function md5Lower(email: string): string {
  return crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')
}

function normalizeTags(tags?: string[] | string): string[] {
  if (!tags) return []
  const arr = Array.isArray(tags) ? tags : tags.split(',')
  return arr.map((t) => t.trim()).filter(Boolean).slice(0, 50)
}

export async function syncMailchimpMember({
  apiKey,
  audienceId,
  tags,
  fields,
  responses,
  pairs,
}: MailchimpSyncParams): Promise<{ skipped?: boolean }> {
  const email = detectEmail(fields, responses)
  if (!email) {
    // No email captured — nothing to subscribe. Not an error.
    return { skipped: true }
  }

  const dc = datacenter(apiKey)
  if (!dc) throw new Error('Mailchimp API key is missing a datacenter suffix (expected "key-dcXX").')

  const { first, last } = detectName(fields, responses)
  const mergeFields: Record<string, string> = {}
  if (first) mergeFields.FNAME = first
  if (last) mergeFields.LNAME = last

  // Best-effort: map a phone answer into the common PHONE merge tag.
  const phonePair = pairs.find((p) => p.fieldType === 'phone' || /phone|mobile|tel/i.test(p.label))
  if (phonePair) mergeFields.PHONE = phonePair.value.slice(0, 64)

  const body: Record<string, any> = {
    email_address: email,
    status_if_new: 'subscribed',
    ...(Object.keys(mergeFields).length ? { merge_fields: mergeFields } : {}),
  }
  const tagList = normalizeTags(tags)
  if (tagList.length) body.tags = tagList

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${md5Lower(email)}`
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`Mailchimp API returned HTTP ${res.status} ${detail.slice(0, 300)}`)
    }
  } finally {
    clearTimeout(timer)
  }

  return {}
}
