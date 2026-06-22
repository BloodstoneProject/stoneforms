'use client'
// ============================================================================
// Landing editor (dashboard) — APP CHROME, neutral design tokens.
// ============================================================================
// Configure the hosted /p/{slug} landing page: enable toggle, logo URL,
// headline, subheadline, background colour/image. Persists via
// PUT /api/forms/[id]/landing. Shows the public URL + a "View landing page"
// link + a copyable embed snippet.
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, ExternalLink, Copy, Check, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getSiteUrl } from '@/lib/site'
import { defaultLanding, type LandingConfig, type LandingBlock } from '@/lib/landing'
import LandingSectionEditor from '@/components/landing/LandingSectionEditor'

export default function LandingEditorPage() {
  const { id: formId } = useParams() as any

  const [config, setConfig] = useState<LandingConfig>(defaultLanding())
  const [slug, setSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState<'url' | 'embed' | null>(null)

  useEffect(() => {
    let active = true
    fetch(`/api/forms/${formId}/landing`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return
        if (d.landing) setConfig({ ...defaultLanding(), ...d.landing })
        setSlug(d.slug ?? null)
      })
      .catch(() => {})
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [formId])

  const set = (patch: Partial<LandingConfig>) => {
    setConfig((c) => ({ ...c, ...patch }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/forms/${formId}/landing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landing: config }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  const ref = slug || formId
  const publicUrl = `${getSiteUrl()}/p/${ref}`
  const embedSnippet = `<iframe src="${getSiteUrl()}/embed/${ref}" style="width:100%;border:none;min-height:640px" title="Form"></iframe>`

  const copy = (text: string, which: 'url' | 'embed') => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(which)
      setTimeout(() => setCopied(null), 1800)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card text-card-foreground border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/forms/${formId}`}
              aria-label="Back to form builder"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Landing page
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                A hosted page for this form at <code className="font-mono">/p/{ref}</code>
              </p>
            </div>
          </div>
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Enable */}
        <div className="rounded-lg border border-border bg-card p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-foreground">Enable landing page</p>
            <p className="text-sm text-muted-foreground">
              When on, anyone with the link sees this page with your form embedded.
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(v) => set({ enabled: v })}
          />
        </div>

        {/* Share */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div>
            <Label>Public link</Label>
            <div className="mt-2 flex gap-2">
              <Input readOnly value={publicUrl} className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={() => copy(publicUrl, 'url')}>
                {copied === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
            {!config.enabled && (
              <p className="mt-2 text-xs text-muted-foreground">
                Enable the page above for this link to go live.
              </p>
            )}
          </div>
          <div>
            <Label>Embed snippet</Label>
            <div className="mt-2 flex gap-2">
              <Textarea
                readOnly
                value={embedSnippet}
                className="font-mono text-xs min-h-[64px]"
              />
              <Button variant="outline" size="icon" onClick={() => copy(embedSnippet, 'embed')}>
                {copied === 'embed' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          <h2 className="font-medium text-foreground">Hero content</h2>

          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              placeholder="https://…/logo.png"
              value={config.logoUrl || ''}
              onChange={(e) => set({ logoUrl: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              placeholder="Get a free quote"
              value={config.headline || ''}
              onChange={(e) => set({ headline: e.target.value })}
              maxLength={160}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="sub">Subheadline</Label>
            <Textarea
              id="sub"
              placeholder="Tell visitors why they should fill in this form."
              value={config.subheadline || ''}
              onChange={(e) => set({ subheadline: e.target.value })}
              maxLength={320}
              className="mt-2"
            />
          </div>
        </div>

        {/* Background */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          <h2 className="font-medium text-foreground">Background</h2>

          <div className="flex items-center gap-4">
            <div>
              <Label htmlFor="bgcolor">Hero colour</Label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="bgcolor"
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(config.backgroundColor || '') ? config.backgroundColor : '#2563eb'}
                  onChange={(e) => set({ backgroundColor: e.target.value })}
                  className="h-10 w-14 rounded-md border border-input bg-card cursor-pointer"
                />
                <Input
                  value={config.backgroundColor || ''}
                  onChange={(e) => set({ backgroundColor: e.target.value })}
                  placeholder="#2563eb"
                  className="w-36 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="bgimg">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Background image URL (optional)
            </Label>
            <Input
              id="bgimg"
              placeholder="https://…/hero.jpg"
              value={config.backgroundImageUrl || ''}
              onChange={(e) => set({ backgroundImageUrl: e.target.value })}
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              When set, the image covers the hero (with a dark overlay for legible text).
            </p>
          </div>

          <div>
            <Label htmlFor="theme">Hero text contrast</Label>
            <select
              id="theme"
              value={config.theme || 'auto'}
              onChange={(e) => set({ theme: e.target.value as LandingConfig['theme'] })}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="auto">Auto (from background)</option>
              <option value="light">Light hero (dark text)</option>
              <option value="dark">Dark hero (light text)</option>
            </select>
          </div>
        </div>

        {/* Page sections */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div>
            <h2 className="font-medium text-foreground">Page sections</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Optional content blocks shown above your form on the landing page. They render
              in your form’s theme.
            </p>
          </div>
          <LandingSectionEditor
            sections={config.sections || []}
            onChange={(sections: LandingBlock[]) => set({ sections })}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: the form itself uses this form’s theme (Design tab). The landing page wraps it
          with the branding above.
        </p>
      </div>
    </div>
  )
}
