'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Loader2, Plus, Trash2, Mail, Webhook, Copy, Check,
  Power, Bell, Reply, MessageSquare, FileText, Send as SendIcon,
} from 'lucide-react'
import GoogleSheetsConnect from '@/components/forms/GoogleSheetsConnect'
import IntegrationCard from '@/components/integrations/IntegrationCard'
import EmailBrandingSection from '@/components/integrations/EmailBrandingSection'
import ZapierCard from '@/components/integrations/ZapierCard'

interface WebhookRow {
  id: string
  url: string
  events: string[]
  secret: string | null
  is_active: boolean
}

export default function IntegrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = (useParams() as any)

  const [title, setTitle] = useState('')
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Notifications
  const [notifyOn, setNotifyOn] = useState(true)
  const [notifyEmails, setNotifyEmails] = useState('')
  const [savingNotif, setSavingNotif] = useState(false)
  const [notifSaved, setNotifSaved] = useState(false)

  // Auto-responder (stored in form.settings.autoResponder)
  const [autoEnabled, setAutoEnabled] = useState(false)
  const [autoSubject, setAutoSubject] = useState('')
  const [autoMessage, setAutoMessage] = useState('')
  const [savingAuto, setSavingAuto] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)

  // Webhooks
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [addingHook, setAddingHook] = useState(false)
  const [hookError, setHookError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Third-party integrations (Slack / Notion / Mailchimp), keyed by type.
  const [integrations, setIntegrations] = useState<Record<string, { config: any; enabled: boolean }>>({})

  useEffect(() => {
    async function load() {
      try {
        const [formData, notifData, hookData, integData] = await Promise.all([
          fetch(`/api/forms/${formId}`).then((r) => r.json()).catch(() => ({})),
          fetch(`/api/forms/${formId}/notifications`).then((r) => r.json()).catch(() => ({})),
          fetch(`/api/forms/${formId}/webhooks`).then((r) => r.json()).catch(() => ({})),
          fetch(`/api/forms/${formId}/integrations-config`).then((r) => r.json()).catch(() => ({})),
        ])
        if (formData.form) {
          setTitle(formData.form.title)
          const s = formData.form.settings || {}
          setSettings(s)
          setAutoEnabled(!!s.autoResponder?.enabled)
          setAutoSubject(s.autoResponder?.subject || '')
          setAutoMessage(s.autoResponder?.message || '')
        }
        if (notifData.settings) {
          setNotifyOn(notifData.settings.notify_on_submission ?? true)
          setNotifyEmails((notifData.settings.notification_emails || []).join(', '))
        }
        if (hookData.webhooks) setWebhooks(hookData.webhooks)
        if (Array.isArray(integData.integrations)) {
          const map: Record<string, { config: any; enabled: boolean }> = {}
          for (const row of integData.integrations) {
            map[row.type] = { config: row.config || {}, enabled: row.enabled }
          }
          setIntegrations(map)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [formId])

  const saveNotifications = async () => {
    setSavingNotif(true)
    setNotifSaved(false)
    try {
      const emails = notifyEmails.split(',').map((e) => e.trim()).filter(Boolean)
      const res = await fetch(`/api/forms/${formId}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notify_on_submission: notifyOn, notification_emails: emails }),
      })
      if (res.ok) { setNotifSaved(true); setTimeout(() => setNotifSaved(false), 2000) }
    } finally {
      setSavingNotif(false)
    }
  }

  const saveAutoResponder = async () => {
    setSavingAuto(true)
    setAutoSaved(false)
    try {
      const nextSettings = {
        ...settings,
        autoResponder: { enabled: autoEnabled, subject: autoSubject, message: autoMessage },
      }
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: nextSettings }),
      })
      if (res.ok) { setSettings(nextSettings); setAutoSaved(true); setTimeout(() => setAutoSaved(false), 2000) }
    } finally {
      setSavingAuto(false)
    }
  }

  const addWebhook = async () => {
    setHookError(null)
    setAddingHook(true)
    try {
      const res = await fetch(`/api/forms/${formId}/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setHookError(data.error || 'Failed to add webhook'); return }
      setWebhooks([data.webhook, ...webhooks])
      setNewUrl('')
    } finally {
      setAddingHook(false)
    }
  }

  const toggleWebhook = async (hook: WebhookRow) => {
    const res = await fetch(`/api/forms/${formId}/webhooks/${hook.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !hook.is_active }),
    })
    if (res.ok) setWebhooks(webhooks.map((w) => (w.id === hook.id ? { ...w, is_active: !w.is_active } : w)))
  }

  const deleteWebhook = async (id: string) => {
    if (!confirm('Delete this webhook?')) return
    const res = await fetch(`/api/forms/${formId}/webhooks/${id}`, { method: 'DELETE' })
    if (res.ok) setWebhooks(webhooks.filter((w) => w.id !== id))
  }

  const copySecret = (hook: WebhookRow) => {
    if (!hook.secret) return
    navigator.clipboard.writeText(hook.secret)
    setCopiedId(hook.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href={`/dashboard/forms/${formId}`} className="text-stone-600 hover:text-stone-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Integrations</h1>
            <p className="text-sm text-stone-600">{title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Email notifications */}
        <section className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-stone-700" />
            <h2 className="font-bold text-stone-900">Email notifications</h2>
          </div>
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input type="checkbox" checked={notifyOn} onChange={(e) => setNotifyOn(e.target.checked)} className="rounded" />
            <span className="text-sm text-stone-700">Email me when someone submits this form</span>
          </label>
          <label className="block text-xs font-medium text-stone-700 mb-1">Notify these emails (comma-separated)</label>
          <input
            type="text"
            value={notifyEmails}
            onChange={(e) => setNotifyEmails(e.target.value)}
            placeholder="you@example.com, team@example.com"
            className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 mb-4"
          />
          <button
            onClick={saveNotifications}
            disabled={savingNotif}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm disabled:opacity-50"
          >
            {savingNotif ? 'Saving…' : notifSaved ? 'Saved ✓' : 'Save notifications'}
          </button>
        </section>

        {/* Auto-responder */}
        <section className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Reply className="w-5 h-5 text-stone-700" />
            <h2 className="font-bold text-stone-900">Auto-responder</h2>
          </div>
          <p className="text-sm text-stone-500 mb-4">
            Send a confirmation email to the respondent. Requires an <strong>email</strong> field on the form.
          </p>
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input type="checkbox" checked={autoEnabled} onChange={(e) => setAutoEnabled(e.target.checked)} className="rounded" />
            <span className="text-sm text-stone-700">Send an auto-reply to respondents</span>
          </label>
          <label className="block text-xs font-medium text-stone-700 mb-1">Subject</label>
          <input
            type="text"
            value={autoSubject}
            onChange={(e) => setAutoSubject(e.target.value)}
            placeholder={`Thanks for your response to ${title}`}
            className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 mb-3"
          />
          <label className="block text-xs font-medium text-stone-700 mb-1">Message</label>
          <textarea
            value={autoMessage}
            onChange={(e) => setAutoMessage(e.target.value)}
            rows={3}
            placeholder="Thanks for your submission. We'll be in touch shortly."
            className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 mb-4 resize-none"
          />
          <button
            onClick={saveAutoResponder}
            disabled={savingAuto}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm disabled:opacity-50"
          >
            {savingAuto ? 'Saving…' : autoSaved ? 'Saved ✓' : 'Save auto-responder'}
          </button>
        </section>

        {/* Webhooks */}
        <section className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Webhook className="w-5 h-5 text-stone-700" />
            <h2 className="font-bold text-stone-900">Webhooks</h2>
          </div>
          <p className="text-sm text-stone-500 mb-4">
            POST each submission to an HTTPS endpoint. Payloads are signed with HMAC-SHA256 in the
            <code className="mx-1 px-1.5 py-0.5 bg-stone-100 rounded text-xs">X-Stoneforms-Signature</code> header.
          </p>

          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://your-endpoint.com/webhook"
              className="flex-1 text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
            />
            <button
              onClick={addWebhook}
              disabled={addingHook || !newUrl.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {hookError && <p className="text-sm text-red-600 mb-4">{hookError}</p>}

          {webhooks.length === 0 ? (
            <p className="text-sm text-stone-500 py-4 text-center border border-dashed border-stone-200 rounded-lg">
              No webhooks yet.
            </p>
          ) : (
            <div className="space-y-3">
              {webhooks.map((hook) => (
                <div key={hook.id} className="border border-stone-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{hook.url}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{(hook.events || []).join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleWebhook(hook)}
                        title={hook.is_active ? 'Active — click to pause' : 'Paused — click to activate'}
                        className={`p-2 rounded-lg ${hook.is_active ? 'text-green-600 hover:bg-green-50' : 'text-stone-400 hover:bg-stone-50'}`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteWebhook(hook.id)} className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {hook.secret && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                      <span className="text-xs text-stone-500 shrink-0">Signing secret</span>
                      <code className="flex-1 text-xs bg-stone-50 rounded px-2 py-1 font-mono truncate">{hook.secret}</code>
                      <button onClick={() => copySecret(hook)} className="p-1.5 text-stone-500 hover:text-stone-900">
                        {copiedId === hook.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <GoogleSheetsConnect formId={formId} />

        {/* Slack */}
        <IntegrationCard
          formId={formId}
          type="slack"
          title="Slack"
          description="Post a formatted message to a Slack channel on every submission. Create an Incoming Webhook in Slack and paste its URL below."
          icon={<MessageSquare className="w-5 h-5 text-stone-700" />}
          fields={[
            {
              key: 'webhookUrl',
              label: 'Incoming webhook URL',
              type: 'url',
              placeholder: 'https://hooks.slack.com/services/...',
              help: 'Slack → Apps → Incoming Webhooks → Add to Slack → copy the Webhook URL.',
            },
          ]}
          initialConfig={integrations.slack?.config}
          initialEnabled={integrations.slack?.enabled}
          connected={!!integrations.slack}
        />

        {/* Notion */}
        <IntegrationCard
          formId={formId}
          type="notion"
          title="Notion"
          description="Create a Notion database page for each submission. Answers are matched to database properties by label; everything is also written into the page body."
          icon={<FileText className="w-5 h-5 text-stone-700" />}
          fields={[
            {
              key: 'token',
              label: 'Internal integration token',
              type: 'password',
              placeholder: 'secret_xxx / ntn_xxx',
              help: 'Create an internal integration at notion.so/my-integrations, then share your database with it.',
            },
            {
              key: 'databaseId',
              label: 'Database ID',
              placeholder: '32-character database id',
              help: 'The ID in your database URL (the 32-char string before any ?v=).',
            },
            {
              key: 'titleProperty',
              label: 'Title property (optional)',
              placeholder: 'Name',
              help: 'Defaults to your database title column.',
            },
          ]}
          initialConfig={integrations.notion?.config}
          initialEnabled={integrations.notion?.enabled}
          connected={!!integrations.notion}
        />

        {/* Mailchimp */}
        <IntegrationCard
          formId={formId}
          type="mailchimp"
          title="Mailchimp"
          description="Add respondents to a Mailchimp audience. Requires an email field on the form; name fields map to FNAME/LNAME automatically."
          icon={<SendIcon className="w-5 h-5 text-stone-700" />}
          fields={[
            {
              key: 'apiKey',
              label: 'API key',
              type: 'password',
              placeholder: 'xxxxxxxxxxxxxxxx-us21',
              help: 'Account → Extras → API keys. The datacenter (e.g. us21) is the suffix after the dash.',
            },
            {
              key: 'audienceId',
              label: 'Audience / list ID',
              placeholder: 'e.g. a1b2c3d4e5',
              help: 'Audience → Settings → Audience name and defaults → Audience ID.',
            },
            {
              key: 'tags',
              label: 'Tags (optional, comma-separated)',
              placeholder: 'lead, stoneforms',
            },
          ]}
          initialConfig={integrations.mailchimp?.config}
          initialEnabled={integrations.mailchimp?.enabled}
          connected={!!integrations.mailchimp}
        />

        {/* Zapier / Make */}
        <ZapierCard formId={formId} formUrl={`/f/${formId}`} />

        {/* Per-form email branding */}
        <EmailBrandingSection formId={formId} />
      </div>
    </div>
  )
}
