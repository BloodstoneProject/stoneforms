// Email utilities using Resend

import { Resend } from 'resend'

// Initialize Resend (API key from env)
const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    const result = await resend.emails.send({
      from: from || 'Stoneforms <notifications@stoneforms.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
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
          .header { background: #fafaf9; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
          .content { background: white; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; }
          .button { display: inline-block; background: #0a0a0a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; }
          .footer { margin-top: 24px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Form Submission</h1>
            <p style="margin: 8px 0 0 0; color: #666;">You have a new response to <strong>${formTitle}</strong></p>
          </div>
          
          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0;">Response Details</h2>
            ${responseSummary}
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/${formId}/responses" class="button">
              View Full Response
            </a>
          </div>
          
          <div class="footer">
            <p>This email was sent by Stoneforms because you enabled notifications for this form.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/${formId}" style="color: #0a0a0a;">Manage notification settings</a></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: notificationEmails,
    subject: `New response to ${formTitle}`,
    html,
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
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms" class="button">
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
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" class="button">
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
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms" class="button">
            Start Using New Features
          </a>
          
          <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px;">
            Your next billing date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}<br/>
            Manage your subscription anytime in <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing">Billing Settings</a>.
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
