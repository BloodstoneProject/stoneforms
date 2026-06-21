// Slack incoming-webhook integration. The owner pastes a webhook URL
// (https://hooks.slack.com/services/...) into the UI; on each submission we POST
// a Block Kit message with the form title and every answer.

import type { AnswerPair } from './format'

const TIMEOUT_MS = 8000

export interface SlackConfig {
  webhookUrl?: string
}

interface SlackSendParams {
  webhookUrl: string
  formTitle: string
  pairs: AnswerPair[]
}

// Slack section text fields are capped at 3000 chars; keep individual values
// short so the message is always accepted.
function truncate(s: string, max = 1800): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s
}

export async function sendSlackMessage({ webhookUrl, formTitle, pairs }: SlackSendParams): Promise<void> {
  const blocks: any[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: truncate(`New response: ${formTitle}`, 150), emoji: true },
    },
  ]

  if (pairs.length === 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '_No answers captured._' },
    })
  } else {
    // Group up to 10 fields per section (Slack limits each section to 10 fields).
    for (let i = 0; i < pairs.length; i += 10) {
      const chunk = pairs.slice(i, i + 10)
      blocks.push({
        type: 'section',
        fields: chunk.map((p) => ({
          type: 'mrkdwn',
          text: truncate(`*${p.label}*\n${p.value}`),
        })),
      })
    }
  }

  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: 'Sent by Stoneforms' }],
  })

  const summary = pairs.length
    ? pairs.map((p) => `${p.label}: ${p.value}`).join(' | ')
    : 'New response'

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: truncate(`New response: ${formTitle} — ${summary}`, 2900), blocks }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`Slack webhook returned HTTP ${res.status} ${detail.slice(0, 200)}`)
    }
  } finally {
    clearTimeout(timer)
  }
}
