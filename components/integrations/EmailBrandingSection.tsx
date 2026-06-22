'use client'

import { useEffect, useState } from 'react'
import { Palette, Loader2 } from 'lucide-react'

interface Branding {
  fromName?: string
  replyTo?: string
  logoUrl?: string
  accentColor?: string
  signature?: string
}

// Per-form email branding form, backed by /api/forms/[id]/email-branding.
// Affects the owner notification + auto-responder emails.
export default function EmailBrandingSection({ formId }: { formId: string }) {
  const [branding, setBranding] = useState<Branding>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`/api/forms/${formId}/email-branding`)
      .then((r) => r.json())
      .then((d) => {
        if (active && d.branding) setBranding(d.branding)
      })
      .catch(() => {})
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [formId])

  const update = (key: keyof Branding, value: string) => setBranding((b) => ({ ...b, [key]: value }))

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(`/api/forms/${formId}/email-branding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branding }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-foreground" />
        <h2 className="heading-tight text-foreground">Email branding</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Customise the notification and auto-responder emails for this form. The sending address stays
        the same; only the display name, reply-to and template styling change.
      </p>

      {loading ? (
        <div className="py-6 text-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground inline" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">From name</label>
              <input
                type="text"
                value={branding.fromName || ''}
                onChange={(e) => update('fromName', e.target.value)}
                placeholder="Acme Co"
                className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Reply-to email</label>
              <input
                type="email"
                value={branding.replyTo || ''}
                onChange={(e) => update('replyTo', e.target.value)}
                placeholder="hello@acme.com"
                className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Logo URL</label>
              <input
                type="url"
                value={branding.logoUrl || ''}
                onChange={(e) => update('logoUrl', e.target.value)}
                placeholder="https://acme.com/logo.png"
                className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Accent colour</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(branding.accentColor || '') ? branding.accentColor : '#0a0a0a'}
                  onChange={(e) => update('accentColor', e.target.value)}
                  className="h-9 w-12 rounded-md border border-input bg-background p-1"
                />
                <input
                  type="text"
                  value={branding.accentColor || ''}
                  onChange={(e) => update('accentColor', e.target.value)}
                  placeholder="#0a0a0a"
                  className="flex-1 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-foreground mb-1">Signature / footer</label>
            <textarea
              value={branding.signature || ''}
              onChange={(e) => update('signature', e.target.value)}
              rows={3}
              placeholder="The Acme Team&#10;acme.com"
              className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none"
            />
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save branding'}
          </button>
        </>
      )}
    </section>
  )
}
