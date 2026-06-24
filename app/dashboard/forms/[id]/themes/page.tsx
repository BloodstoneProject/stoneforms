'use client'
import { useParams } from 'next/navigation'

import { useState, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Loader2, Check, ArrowRight } from 'lucide-react'
import {
  PRESET_THEMES, THEME_FONTS, normalizeTheme, fontStack, googleFontHref,
  buttonRadius, backgroundCss, type FormTheme, type ButtonStyle, type MediaLayout,
} from '@/lib/themes'

const MEDIA_LAYOUTS: { value: MediaLayout; label: string }[] = [
  { value: 'inline', label: 'Inline' },
  { value: 'split-left', label: 'Split left' },
  { value: 'split-right', label: 'Split right' },
  { value: 'cover', label: 'Cover' },
  { value: 'float', label: 'Float' },
  { value: 'wallpaper', label: 'Wallpaper' },
]

export default function DesignStudioPage() {
  const { id } = (useParams() as any)
  const [theme, setTheme] = useState<FormTheme>(PRESET_THEMES[0])
  // Default per-question media layout. Not part of the normalized FormTheme
  // shape, so it's tracked alongside and merged back into the saved theme JSON.
  const [defaultMediaLayout, setDefaultMediaLayout] = useState<MediaLayout>('inline')
  const [formTitle, setFormTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [customFont, setCustomFont] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch(`/api/forms/${id}`).then((r) => r.json()).then((data) => {
      if (data.form) {
        setFormTitle(data.form.title)
        setTheme(normalizeTheme(data.form.theme))
        const dml = data.form.theme?.defaultMediaLayout
        if (typeof dml === 'string') setDefaultMediaLayout(dml as MediaLayout)
      }
    }).finally(() => setLoading(false))
  }, [id])

  // Load the previewed font.
  useEffect(() => {
    const href = googleFontHref(theme.font)
    if (document.querySelector(`link[href="${href}"]`)) return
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href
    document.head.appendChild(link)
  }, [theme.font])

  const update = (patch: Partial<FormTheme>) => setTheme((t) => ({ ...t, ...patch, id: 'custom', name: 'Custom' }))
  const updateColor = (key: keyof FormTheme['colors'], val: string) =>
    setTheme((t) => ({ ...t, id: 'custom', name: 'Custom', colors: { ...t.colors, [key]: val } }))

  const save = async () => {
    setSaving(true); setSaved(false)
    // Merge the default media layout into the persisted theme JSON. It's stored
    // on forms.theme JSONB; normalizeTheme ignores it, the player reads it as a
    // fallback when a field has no explicit media.layout.
    const payload = { ...theme, defaultMediaLayout }
    const res = await fetch(`/api/forms/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme: payload }),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  // Upload a file to /api/upload and return its public URL.
  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      return res.ok && typeof data.url === 'string' ? data.url : null
    } finally {
      setUploading(false)
    }
  }

  const applyCustomFont = () => {
    const f = customFont.trim()
    if (f) update({ font: f })
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  }

  const c = theme.colors
  const radius = buttonRadius(theme.buttonStyle)

  // Compose the preview background: solid/gradient base, optional image on top,
  // optional dim overlay driven by backgroundBrightness (1 = full brightness).
  const brightness = typeof theme.backgroundBrightness === 'number' ? theme.backgroundBrightness : 1
  const dim = Math.max(0, Math.min(1, 1 - brightness))
  const previewBg: CSSProperties = theme.backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,${dim}), rgba(0,0,0,${dim})), url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: backgroundCss(theme) }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/forms/${id}`} aria-label="Back to form builder" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="text-xl heading-tight text-foreground">Design</h1>
              <p className="text-sm text-muted-foreground">{formTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/f/${id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary text-sm"><Eye className="w-4 h-4" /> Preview</Link>
            <button onClick={save} disabled={saving} className="px-5 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save design'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Presets */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Presets</h2>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_THEMES.map((p) => (
                <button key={p.id} onClick={() => setTheme(p)}
                  className="rounded-md border-2 p-3 text-left transition-all"
                  style={{ borderColor: theme.id === p.id ? p.colors.primary : '#e7e5e4', background: backgroundCss(p) }}>
                  <div className="flex gap-1 mb-2">
                    {[p.colors.primary, p.colors.button, p.colors.text].map((col, i) => (
                      <span key={i} className="w-4 h-4 rounded-full border border-white/50" style={{ backgroundColor: col }} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: p.colors.text, fontFamily: fontStack(p.font) }}>{p.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Colors */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Colors</h2>
            <div className="space-y-3">
              {([['primary', 'Primary'], ['background', 'Background'], ['text', 'Text'], ['button', 'Button'], ['buttonText', 'Button text']] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <input type="text" value={c[key]} onChange={(e) => updateColor(key, e.target.value)} aria-label={`${label} colour hex`} className="w-24 text-xs border border-input rounded-md px-2 py-1 font-mono bg-background text-foreground" />
                    <input type="color" value={c[key]} onChange={(e) => updateColor(key, e.target.value)} aria-label={`${label} colour picker`} className="w-9 h-9 rounded-md border border-input cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Font */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Font</h2>
            <div className="grid grid-cols-2 gap-2">
              {THEME_FONTS.map((f) => (
                <button key={f.family} onClick={() => update({ font: f.family })}
                  className="px-3 py-2 rounded-md border text-left text-sm transition-all"
                  style={{ borderColor: theme.font === f.family ? c.primary : '#e7e5e4', fontFamily: f.stack, fontWeight: theme.font === f.family ? 600 : 400 }}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Any Google Font</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyCustomFont() }}
                  placeholder="e.g. Montserrat"
                  className="flex-1 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                />
                <button onClick={applyCustomFont} className="px-3 py-2 border border-border rounded-md text-sm hover:bg-secondary">Use</button>
              </div>
              {!THEME_FONTS.some((f) => f.family === theme.font) && (
                <p className="text-xs text-muted-foreground mt-1.5">Active: <span className="font-semibold" style={{ fontFamily: fontStack(theme.font) }}>{theme.font}</span></p>
              )}
            </div>
          </section>

          {/* Brand */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Brand</h2>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Logo URL</label>
            <input
              type="text"
              value={theme.logoUrl ?? ''}
              onChange={(e) => update({ logoUrl: e.target.value })}
              className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              placeholder="https://example.com/logo.svg"
            />
            <p className="text-xs text-muted-foreground mt-1">Shown centered above the title on the form&apos;s welcome screen.</p>
            {theme.logoUrl ? (
              <div className="mt-3 flex items-center justify-center rounded-md border border-border p-3" style={{ background: backgroundCss(theme) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={theme.logoUrl} alt="" className="w-auto object-contain" style={{ maxHeight: '48px' }} />
              </div>
            ) : null}
          </section>

          {/* Buttons + Background */}
          <section className="card-surface p-5 space-y-4">
            <div>
              <h2 className="heading-tight text-foreground mb-3">Button shape</h2>
              <div className="flex gap-2">
                {(['rounded', 'pill', 'sharp'] as ButtonStyle[]).map((s) => (
                  <button key={s} onClick={() => update({ buttonStyle: s })}
                    className="flex-1 py-2 text-sm capitalize border-2 transition-all"
                    style={{ borderColor: theme.buttonStyle === s ? c.primary : '#e7e5e4', borderRadius: buttonRadius(s) }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="heading-tight text-foreground mb-3">Background</h2>
              <div className="flex gap-2 mb-3">
                {(['solid', 'gradient'] as const).map((s) => (
                  <button key={s} onClick={() => update({ backgroundStyle: s, backgroundGradient: theme.backgroundGradient || [c.background, c.primary] })}
                    className="flex-1 py-2 text-sm capitalize rounded-md border-2"
                    style={{ borderColor: theme.backgroundStyle === s ? c.primary : '#e7e5e4' }}>{s}</button>
                ))}
              </div>
              {theme.backgroundStyle === 'gradient' && (
                <div className="flex items-center gap-2">
                  <input type="color" value={theme.backgroundGradient?.[0] || c.background} onChange={(e) => update({ backgroundGradient: [e.target.value, theme.backgroundGradient?.[1] || c.primary] })} className="w-9 h-9 rounded-md border border-input cursor-pointer" />
                  <span className="text-xs text-muted-foreground">→</span>
                  <input type="color" value={theme.backgroundGradient?.[1] || c.primary} onChange={(e) => update({ backgroundGradient: [theme.backgroundGradient?.[0] || c.background, e.target.value] })} className="w-9 h-9 rounded-md border border-input cursor-pointer" />
                </div>
              )}
            </div>
          </section>

          {/* Background image */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Background image</h2>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={theme.backgroundImage ?? ''}
                onChange={(e) => update({ backgroundImage: e.target.value || undefined })}
                placeholder="https://example.com/bg.jpg"
                className="flex-1 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
              <label className="px-3 py-2 border border-border rounded-md text-sm hover:bg-secondary cursor-pointer whitespace-nowrap">
                {uploading ? '…' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const url = await uploadFile(file)
                    if (url) update({ backgroundImage: url })
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
            {theme.backgroundImage && (
              <button onClick={() => update({ backgroundImage: undefined })} className="text-xs text-muted-foreground mt-1.5 hover:text-foreground underline">Remove image</button>
            )}
            <div className="mt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Brightness ({Math.round((typeof theme.backgroundBrightness === 'number' ? theme.backgroundBrightness : 1) * 100)}%)
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round((typeof theme.backgroundBrightness === 'number' ? theme.backgroundBrightness : 1) * 100)}
                onChange={(e) => update({ backgroundBrightness: Number(e.target.value) / 100 })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Dim the image so question text stays readable.</p>
            </div>
          </section>

          {/* Media layout default */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Default question media layout</h2>
            <div className="grid grid-cols-3 gap-2">
              {MEDIA_LAYOUTS.map((m) => (
                <button key={m.value} onClick={() => setDefaultMediaLayout(m.value)}
                  className="py-2 text-sm rounded-md border-2 transition-all"
                  style={{ borderColor: defaultMediaLayout === m.value ? c.primary : '#e7e5e4' }}>
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Used when a question has media but no layout of its own.</p>
          </section>

          {/* Favicon */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Favicon</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={theme.faviconUrl ?? ''}
                onChange={(e) => update({ faviconUrl: e.target.value || undefined })}
                placeholder="https://example.com/favicon.png"
                className="flex-1 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
              <label className="px-3 py-2 border border-border rounded-md text-sm hover:bg-secondary cursor-pointer whitespace-nowrap">
                {uploading ? '…' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const url = await uploadFile(file)
                    if (url) update({ faviconUrl: url })
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Shown in the browser tab on hosted/public form pages.</p>
          </section>

          {/* Custom CSS */}
          <section className="card-surface p-5">
            <h2 className="heading-tight text-foreground mb-3">Custom CSS</h2>
            <textarea
              value={theme.customCss ?? ''}
              onChange={(e) => update({ customCss: e.target.value || undefined })}
              rows={6}
              spellCheck={false}
              placeholder={'.sf-cta { letter-spacing: 0.02em; }'}
              className="w-full text-xs font-mono border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Advanced. Injected into the public form. Avoid breaking layout.</p>
          </section>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2 bg-muted text-xs text-muted-foreground border-b border-border">Live preview</div>
            <div className="min-h-[460px] flex items-center justify-center p-10" style={{ ...previewBg, fontFamily: fontStack(theme.font) }}>
              <div className="w-full max-w-md">
                <div className="text-sm font-medium mb-4" style={{ color: c.primary }}>1 →</div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: c.text }}>How happy are you with our service?</h2>
                <p className="mb-6 opacity-60" style={{ color: c.text }}>Pick the option that fits best.</p>
                <div className="space-y-3 mb-8">
                  {['Very happy', 'It was fine', 'Could be better'].map((opt, i) => (
                    <div key={opt} className="flex items-center gap-3 p-4 rounded-xl border-2" style={{ borderColor: i === 0 ? c.primary : `${c.text}22`, backgroundColor: i === 0 ? `${c.primary}14` : 'transparent' }}>
                      <span className="w-7 h-7 rounded-md border-2 flex items-center justify-center text-sm font-bold" style={i === 0 ? { backgroundColor: c.primary, borderColor: c.primary, color: '#fff' } : { borderColor: `${c.text}33`, color: c.text }}>{String.fromCharCode(65 + i)}</span>
                      <span className="font-medium" style={{ color: c.text }}>{opt}</span>
                    </div>
                  ))}
                </div>
                <button className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-lg shadow-sm" style={{ backgroundColor: c.button, color: c.buttonText, borderRadius: radius }}>
                  OK <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
