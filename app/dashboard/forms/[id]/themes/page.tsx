'use client'
import { useParams } from 'next/navigation'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Loader2, Check, ArrowRight } from 'lucide-react'
import {
  PRESET_THEMES, THEME_FONTS, normalizeTheme, fontStack, googleFontHref,
  buttonRadius, backgroundCss, type FormTheme, type ButtonStyle,
} from '@/lib/themes'

export default function DesignStudioPage() {
  const { id } = (useParams() as any)
  const [theme, setTheme] = useState<FormTheme>(PRESET_THEMES[0])
  const [formTitle, setFormTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/forms/${id}`).then((r) => r.json()).then((data) => {
      if (data.form) { setFormTitle(data.form.title); setTheme(normalizeTheme(data.form.theme)) }
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
    const res = await fetch(`/api/forms/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme }),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  if (loading) {
    return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-stone-400" /></div>
  }

  const c = theme.colors
  const radius = buttonRadius(theme.buttonStyle)

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/forms/${id}`} className="text-stone-600 hover:text-stone-900"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="text-xl font-bold text-stone-900">Design</h1>
              <p className="text-sm text-stone-500">{formTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/f/${id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm"><Eye className="w-4 h-4" /> Preview</Link>
            <button onClick={save} disabled={saving} className="px-5 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save design'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Presets */}
          <section className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-bold text-stone-900 mb-3">Presets</h2>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_THEMES.map((p) => (
                <button key={p.id} onClick={() => setTheme(p)}
                  className="rounded-lg border-2 p-3 text-left transition-all hover:shadow-sm"
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
          <section className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-bold text-stone-900 mb-3">Colors</h2>
            <div className="space-y-3">
              {([['primary', 'Primary'], ['background', 'Background'], ['text', 'Text'], ['button', 'Button'], ['buttonText', 'Button text']] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-stone-700">{label}</span>
                  <div className="flex items-center gap-2">
                    <input type="text" value={c[key]} onChange={(e) => updateColor(key, e.target.value)} className="w-24 text-xs border border-stone-200 rounded px-2 py-1 font-mono" />
                    <input type="color" value={c[key]} onChange={(e) => updateColor(key, e.target.value)} className="w-9 h-9 rounded border border-stone-200 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Font */}
          <section className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-bold text-stone-900 mb-3">Font</h2>
            <div className="grid grid-cols-2 gap-2">
              {THEME_FONTS.map((f) => (
                <button key={f.family} onClick={() => update({ font: f.family })}
                  className="px-3 py-2 rounded-lg border text-left text-sm transition-all"
                  style={{ borderColor: theme.font === f.family ? c.primary : '#e7e5e4', fontFamily: f.stack, fontWeight: theme.font === f.family ? 600 : 400 }}>
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {/* Buttons + Background */}
          <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div>
              <h2 className="font-bold text-stone-900 mb-3">Button shape</h2>
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
              <h2 className="font-bold text-stone-900 mb-3">Background</h2>
              <div className="flex gap-2 mb-3">
                {(['solid', 'gradient'] as const).map((s) => (
                  <button key={s} onClick={() => update({ backgroundStyle: s, backgroundGradient: theme.backgroundGradient || [c.background, c.primary] })}
                    className="flex-1 py-2 text-sm capitalize rounded-lg border-2"
                    style={{ borderColor: theme.backgroundStyle === s ? c.primary : '#e7e5e4' }}>{s}</button>
                ))}
              </div>
              {theme.backgroundStyle === 'gradient' && (
                <div className="flex items-center gap-2">
                  <input type="color" value={theme.backgroundGradient?.[0] || c.background} onChange={(e) => update({ backgroundGradient: [e.target.value, theme.backgroundGradient?.[1] || c.primary] })} className="w-9 h-9 rounded border cursor-pointer" />
                  <span className="text-xs text-stone-400">→</span>
                  <input type="color" value={theme.backgroundGradient?.[1] || c.primary} onChange={(e) => update({ backgroundGradient: [theme.backgroundGradient?.[0] || c.background, e.target.value] })} className="w-9 h-9 rounded border cursor-pointer" />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-stone-100 text-xs text-stone-500 border-b border-stone-200">Live preview</div>
            <div className="min-h-[460px] flex items-center justify-center p-10" style={{ background: backgroundCss(theme), fontFamily: fontStack(theme.font) }}>
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
