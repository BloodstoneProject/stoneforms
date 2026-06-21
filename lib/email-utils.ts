// Email utilities using Resend

import { Resend } from 'resend'
import { getSiteUrl } from '@/lib/site'
import { createAdminClient } from '@/lib/supabase-server'

// Lazy-initialize Resend to avoid build-time crash when API key is missing
let _resend: Resend | null = null
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

// Verified sending identity. Env-driven so it can point at whichever domain is
// verified in Resend (Bloodstone for now). Never hardcode an unverified domain.
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Stoneforms <notifications@bloodstone.co.uk>'

// Per-form email branding (forms.email_branding jsonb). All fields optional;
// when the column is null, emails behave exactly as before.
export interface EmailBranding {
  fromName?: string
  replyTo?: string
  logoUrl?: string
  accentColor?: string
  signature?: string
}

// Load a form's email_branding via the admin client. Runs in the public submit
// path, so it must bypass RLS to read the owner's branding config. Always
// returns an object (empty when unset) and never throws.
export async function getEmailBranding(formId?: string): Promise<EmailBranding> {
  if (!formId) return {}
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('forms')
      .select('email_branding')
      .eq('id', formId)
      .single()
    if (error || !data?.email_branding || typeof data.email_branding !== 'object') return {}
    return data.email_branding as EmailBranding
  } catch (err) {
    console.error('Email branding load error:', err)
    return {}
  }
}

// Split the env From into a display name + bare address, then override the
// display name with the form's `fromName` while keeping the verified address.
function applyFromName(branding: EmailBranding): string {
  const fromName = branding.fromName?.trim()
  if (!fromName) return DEFAULT_FROM

  const match = DEFAULT_FROM.match(/<([^>]+)>/)
  const address = match ? match[1] : DEFAULT_FROM
  // Quote the display name if it contains characters that would break parsing.
  const safeName = fromName.replace(/["\r\n]/g, '')
  return `${safeName} <${address}>`
}

// Render a branded HTML header (logo) given branding + accent.
function brandingHeaderHtml(branding: EmailBranding): string {
  if (!branding.logoUrl) return ''
  const safeLogo = String(branding.logoUrl).replace(/"/g, '')
  return `<div style="text-align:center;margin-bottom:24px;"><img src="${safeLogo}" alt="" style="max-height:48px;max-width:200px;height:auto;" /></div>`
}

// Render a branded HTML signature/footer block.
function brandingSignatureHtml(branding: EmailBranding): string {
  if (!branding.signature) return ''
  const safe = String(branding.signature).replace(/\n/g, '<br/>')
  return `<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e5e5;color:#666;font-size:14px;">${safe}</div>`
}

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, from, replyTo }: SendEmailParams) {
  try {
    const resend = getResend()
    if (!resend) {
      console.warn('RESEND_API_KEY not configured - skipping email send')
      return { success: false, error: 'Email not configured' }
    }
    const result = await resend.emails.send({
      from: from || DEFAULT_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// New submission notification
export async function sendSubmissionNotification(params: {
  formTitle: string
  formId: string
  submissionId: string
  responses: Record<string, string>
  notificationEmails: string[]
  formFields: Array<{ id: string; label: string }>
}) {
  const { formTitle, formId, responses, notificationEmails, formFields } = params

  const branding = await getEmailBranding(formId)
  const accent = branding.accentColor && /^#[0-9a-fA-F]{3,8}$/.test(branding.accentColor)
    ? branding.accentColor
    : '#0a0a0a'

  // Build response summary
  const responseSummary = formFields
    .map(field => {
      const value = responses[field.id] || '(No answer)'
      return `
        <div style="margin-bottom: 16px;">
          <strong style="color: #0a0a0a;">${field.label}</strong><br/>
          <span style="color: #666;">${value}</span>
        </div>
      `
    })
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #fafaf9; padding: 24px; border-radius: 12px; margin-bottom: 24px; border-top: 4px solid ${accent}; }
          .content { background: white; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; }
          .button { display: inline-block; background: ${accent}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; }
          .footer { margin-top: 24px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${brandingHeaderHtml(branding)}
          <div class="header">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Form Submission</h1>
            <p style="margin: 8px 0 0 0; color: #666;">You have a new response to <strong>${formTitle}</strong></p>
          </div>

          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0;">Response Details</h2>
            ${responseSummary}

            <a href="${getSiteUrl()}/dashboard/forms/${formId}/responses" class="button">
              View Full Response
            </a>
            ${brandingSignatureHtml(branding)}
          </div>

          <div class="footer">
            <p>This email was sent by Stoneforms because you enabled notifications for this form.</p>
            <p><a href="${getSiteUrl()}/dashboard/forms/${formId}" style="color: #0a0a0a;">Manage notification settings</a></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: notificationEmails,
    subject: `New response to ${formTitle}`,
    html,
    from: applyFromName(branding),
    replyTo: branding.replyTo,
  })
}

// Auto-responder sent to the person who submitted the form.
export async function sendAutoResponder(params: {
  to: string
  formTitle: string
  formId?: string
  subject?: string
  message?: string
}) {
  const { to, formTitle, formId, subject, message } = params

  const branding = await getEmailBranding(formId)
  const accent = branding.accentColor && /^#[0-9a-fA-F]{3,8}$/.test(branding.accentColor)
    ? branding.accentColor
    : '#0a0a0a'

  const safeMessage = (message || 'Thanks for your submission. We have received your response and will be in touch shortly.')
    .replace(/\n/g, '<br/>')

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #0a0a0a;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
          ${brandingHeaderHtml(branding)}
          <div style="background: white; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; border-top: 4px solid ${accent};">
            <h1 style="font-size: 20px; margin-top: 0; color: ${accent};">${formTitle}</h1>
            <p style="color: #444;">${safeMessage}</p>
            ${brandingSignatureHtml(branding)}
          </div>
          <p style="margin-top: 16px; text-align: center; color: #999; font-size: 12px;">Powered by Stoneforms</p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to,
    subject: subject || `Thanks for your response to ${formTitle}`,
    html,
    from: applyFromName(branding),
    replyTo: branding.replyTo,
  })
}

// Welcome email
export async function sendWelcomeEmail(params: {
  email: string
  name: string
}) {
  const { email, name } = params

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fafaf9 0%, #e5e5e5 100%); padding: 48px 24px; border-radius: 12px; text-align: center; margin-bottom: 24px; }
          .content { background: white; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; }
          .button { display: inline-block; background: #0a0a0a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; }
          .features { display: grid; gap: 16px; margin: 24px 0; }
          .feature { padding: 16px; background: #fafaf9; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 300;">Welcome to Stoneforms</h1>
            <p style="margin: 16px 0 0 0; font-size: 18px; color: #666;">Beautiful forms, powerful insights</p>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Welcome to Stoneforms! We're excited to have you on board.</p>
            
            <p>You're currently on the <strong>Free plan</strong>, which includes:</p>
            
            <div class="features">
              <div class="feature">
                <strong>✨ Up to 3 forms</strong><br/>
                <span style="color: #666;">Create beautiful, responsive forms</span>
              </div>
              <div class="feature">
                <strong>📊 100 responses per month</strong><br/>
                <span style="color: #666;">Collect and analyze submissions</span>
              </div>
              <div class="feature">
                <strong>📈 Basic analytics</strong><br/>
                <span style="color: #666;">Track your form performance</span>
              </div>
            </div>
            
            <p>Ready to create your first form?</p>
            
            <a href="${getSiteUrl()}/dashboard/forms" class="button">
              Create Your First Form
            </a>
            
            <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px;">
              Need more? Upgrade to <strong>Pro</strong> (£15/month) for unlimited forms, 10k responses, email notifications, and more.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Stoneforms! 🎉',
    html,
  })
}

// Quota warning email (80% of limit reached)
export async function sendQuotaWarningEmail(params: {
  email: string
  name: string
  limitType: 'forms' | 'responses'
  current: number
  limit: number
  plan: string
}) {
  const { email, name, limitType, current, limit, plan } = params

  const percentage = Math.round((current / limit) * 100)
  const limitName = limitType === 'forms' ? 'form' : 'response'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 24px 0; }
          .button { display: inline-block; background: #8e1c1c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>You're approaching your ${limitName} limit</h1>
          
          <p>Hi ${name},</p>
          
          <div class="warning">
            <strong>⚠️ ${percentage}% of your ${plan} plan limit reached</strong><br/>
            You've used ${current} of ${limit} ${limitName}s this month.
          </div>
          
          <p>To avoid hitting your limit, consider upgrading your plan:</p>
          
          <ul>
            <li><strong>Pro Plan (£15/month)</strong>: ${limitType === 'forms' ? 'Unlimited forms' : '10,000 responses/month'}</li>
            <li><strong>Business Plan (£25/month)</strong>: Unlimited everything</li>
          </ul>
          
          <a href="${getSiteUrl()}/dashboard/billing" class="button">
            Upgrade Your Plan
          </a>
          
          <p style="margin-top: 32px; color: #666; font-size: 14px;">
            Questions? Reply to this email and we'll help you choose the right plan.
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `⚠️ You're at ${percentage}% of your ${limitName} limit`,
    html,
  })
}

// Upgrade confirmation email
export async function sendUpgradeConfirmationEmail(params: {
  email: string
  name: string
  plan: string
  price: number
  currency: string
}) {
  const { email, name, plan, price, currency } = params

  const symbol = currency === 'GBP' ? '£' : '$'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin: 24px 0; }
          .button { display: inline-block; background: #0a0a0a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to ${plan}! 🎉</h1>
          
          <p>Hi ${name},</p>
          
          <div class="success">
            <strong>✅ Your upgrade to ${plan} is complete</strong><br/>
            You're now enjoying all ${plan} features at ${symbol}${price}/month.
          </div>
          
          <p><strong>What's new in your plan:</strong></p>
          
          <ul>
            ${plan === 'Pro' ? `
              <li>✨ Unlimited forms</li>
              <li>📊 10,000 responses per month</li>
              <li>📧 Email notifications</li>
              <li>📈 Advanced analytics</li>
              <li>🎨 Remove Stoneforms branding</li>
            ` : `
              <li>✨ Unlimited everything</li>
              <li>🌐 Custom domains</li>
              <li>👥 Team collaboration</li>
              <li>🔗 Webhooks</li>
              <li>🚀 Priority support</li>
            `}
          </ul>
          
          <a href="${getSiteUrl()}/dashboard/forms" class="button">
            Start Using New Features
          </a>
          
          <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px;">
            Your next billing date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}<br/>
            Manage your subscription anytime in <a href="${getSiteUrl()}/dashboard/billing">Billing Settings</a>.
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Welcome to Stoneforms ${plan}! 🎉`,
    html,
  })
}
