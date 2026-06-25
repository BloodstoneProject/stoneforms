import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-utils'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Where contact submissions are delivered. Falls back to the Bloodstone owner
// inbox; override with CONTACT_TO in env.
const CONTACT_TO = process.env.CONTACT_TO || 'lewis@bloodstone.co.uk'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// POST /api/contact  { name, email, message, subject? }
export async function POST(request: Request) {
  // Light per-IP spam guard: 5 messages / 10 min.
  const ip = getClientIp(request)
  const { allowed, retryAfter } = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  const body = await request.json().catch(() => ({}))
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const message = String(body.message || '').trim()
  const subject = String(body.subject || '').trim()
  // Honeypot — bots fill hidden fields; humans don't.
  if (String(body.company || '').trim()) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please fill in your name, email, and message.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
  }

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;color:#111;line-height:1.6;">
      <h2 style="margin:0 0 16px;">New contact message</h2>
      <p style="margin:0 0 6px;"><strong>Name:</strong> ${esc(name)}</p>
      <p style="margin:0 0 6px;"><strong>Email:</strong> ${esc(email)}</p>
      ${subject ? `<p style="margin:0 0 6px;"><strong>Subject:</strong> ${esc(subject)}</p>` : ''}
      <p style="margin:16px 0 6px;"><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;padding:12px 16px;background:#f6f6f4;border-radius:8px;">${esc(message)}</div>
    </div>
  `

  const result = await sendEmail({
    to: CONTACT_TO,
    subject: subject ? `Contact: ${subject}` : `New contact message from ${name}`,
    html,
    replyTo: email,
  })

  if (!result.success) {
    return NextResponse.json(
      { error: 'Could not send your message right now. Please email us directly.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
