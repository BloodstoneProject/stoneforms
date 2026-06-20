// Outbound webhook delivery worker.
//
// Runs in a trusted server context (the submit route) on behalf of an anonymous
// respondent, so it uses the service-role admin client to read the form's
// webhooks and write delivery logs (both are owner-only under RLS). Payloads are
// signed with HMAC-SHA256 using each webhook's secret so receivers can verify
// authenticity.

import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase-server'

interface DeliverParams {
  formId: string
  submissionId: string
  event: string // e.g. 'submission.created'
  data: Record<string, any>
}

const TIMEOUT_MS = 8000

export async function deliverWebhooks({ formId, submissionId, event, data }: DeliverParams) {
  const admin = createAdminClient()

  const { data: webhooks } = await admin
    .from('webhooks')
    .select('*')
    .eq('form_id', formId)
    .eq('is_active', true)

  if (!webhooks || webhooks.length === 0) return

  const targets = webhooks.filter((w) => (w.events || ['submission.created']).includes(event))

  await Promise.allSettled(
    targets.map((webhook) => deliverOne(admin, webhook, submissionId, event, formId, data))
  )
}

async function deliverOne(
  admin: ReturnType<typeof createAdminClient>,
  webhook: any,
  submissionId: string,
  event: string,
  formId: string,
  data: Record<string, any>
) {
  const bodyStr = JSON.stringify({
    event,
    form_id: formId,
    submission_id: submissionId,
    data,
    timestamp: new Date().toISOString(),
  })

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Stoneforms-Event': event,
  }

  // Sign the raw body so receivers can verify it came from us.
  if (webhook.secret) {
    const signature = crypto.createHmac('sha256', webhook.secret).update(bodyStr).digest('hex')
    headers['X-Stoneforms-Signature'] = `sha256=${signature}`
  }

  let status: 'success' | 'failed' = 'failed'
  let responseCode: number | null = null
  let responseBody: string | null = null
  let errorMessage: string | null = null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: bodyStr,
      signal: controller.signal,
    })
    responseCode = res.status
    status = res.ok ? 'success' : 'failed'
    if (!res.ok) {
      errorMessage = `HTTP ${res.status}`
      responseBody = (await res.text().catch(() => '')).slice(0, 1000)
    }
  } catch (err: any) {
    errorMessage = err?.name === 'AbortError' ? 'Request timed out' : (err?.message || 'Request failed')
  } finally {
    clearTimeout(timer)
  }

  await admin.from('webhook_deliveries').insert({
    webhook_id: webhook.id,
    submission_id: submissionId,
    status,
    response_code: responseCode,
    response_body: responseBody,
    error_message: errorMessage,
    attempts: 1,
    delivered_at: status === 'success' ? new Date().toISOString() : null,
  })
}
