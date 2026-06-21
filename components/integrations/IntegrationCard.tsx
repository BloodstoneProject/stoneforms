'use client'

import { useState } from 'react'
import { Loader2, Power, Trash2, Send, CheckCircle2, AlertTriangle } from 'lucide-react'

export interface IntegrationField {
  key: string
  label: string
  placeholder?: string
  type?: 'text' | 'password' | 'url'
  help?: string
}

interface IntegrationCardProps {
  formId: string
  type: 'slack' | 'notion' | 'mailchimp'
  title: string
  description: string
  icon: React.ReactNode
  fields: IntegrationField[]
  initialConfig?: Record<string, any>
  initialEnabled?: boolean
  connected?: boolean
}

// Self-contained connect/disconnect card backed by the integrations-config
// route. Handles save, enable toggle, send-test and disconnect.
export default function IntegrationCard({
  formId,
  type,
  title,
  description,
  icon,
  fields,
  initialConfig,
  initialEnabled,
  connected: initialConnected,
}: IntegrationCardProps) {
  const [config, setConfig] = useState<Record<string, string>>(() => {
    const c: Record<string, string> = {}
    for (const f of fields) {
      const v = initialConfig?.[f.key]
      c[f.key] = Array.isArray(v) ? v.join(', ') : (v ?? '')
    }
    return c
  })
  const [enabled, setEnabled] = useState(initialEnabled ?? true)
  const [connected, setConnected] = useState(!!initialConnected)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const update = (key: string, value: string) => setConfig((c) => ({ ...c, [key]: value }))

  const buildConfig = () => {
    const out: Record<string, any> = {}
    for (const f of fields) {
      const v = (config[f.key] || '').trim()
      if (!v) continue
      out[f.key] = f.key === 'tags' ? v.split(',').map((t) => t.trim()).filter(Boolean) : v
    }
    return out
  }

  const save = async (nextEnabled = enabled) => {
    setSaving(true)
    setMsg(null)
    setSaved(false)
    try {
      const res = await fetch(`/api/forms/${formId}/integrations-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, config: buildConfig(), enabled: nextEnabled, action: 'save' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ kind: 'err', text: data.error || 'Failed to save' })
        return
      }
      setConnected(true)
      setEnabled(data.integration?.enabled ?? nextEnabled)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const sendTest = async () => {
    setTesting(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/forms/${formId}/integrations-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, config: buildConfig(), action: 'test' }),
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) {
        setMsg({ kind: 'err', text: data.error || 'Test failed' })
      } else {
        setMsg({ kind: 'ok', text: data.message || 'Test sent successfully.' })
      }
    } catch {
      setMsg({ kind: 'err', text: 'Test failed' })
    } finally {
      setTesting(false)
    }
  }

  const toggleEnabled = async () => {
    const next = !enabled
    setEnabled(next)
    await save(next)
  }

  const disconnect = async () => {
    if (!confirm(`Disconnect ${title}?`)) return
    setSaving(true)
    try {
      const res = await fetch(`/api/forms/${formId}/integrations-config?type=${type}`, { method: 'DELETE' })
      if (res.ok) {
        setConnected(false)
        setEnabled(true)
        const cleared: Record<string, string> = {}
        for (const f of fields) cleared[f.key] = ''
        setConfig(cleared)
        setMsg(null)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-white rounded-xl border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-bold text-stone-900">{title}</h2>
        </div>
        {connected && (
          <div className="flex items-center gap-1">
            <button
              onClick={toggleEnabled}
              disabled={saving}
              title={enabled ? 'Enabled — click to pause' : 'Paused — click to enable'}
              className={`p-2 rounded-lg ${enabled ? 'text-green-600 hover:bg-green-50' : 'text-stone-400 hover:bg-stone-50'}`}
            >
              <Power className="w-4 h-4" />
            </button>
            <button
              onClick={disconnect}
              disabled={saving}
              className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-stone-500 mb-4">{description}</p>

      {connected && (
        <div className="flex items-center gap-2 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{enabled ? 'Connected and active.' : 'Connected but paused.'}</span>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-stone-700 mb-1">{f.label}</label>
            <input
              type={f.type === 'password' ? 'password' : f.type === 'url' ? 'url' : 'text'}
              value={config[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              autoComplete="off"
              className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
            />
            {f.help && <p className="text-xs text-stone-400 mt-1">{f.help}</p>}
          </div>
        ))}
      </div>

      {msg && (
        <div
          className={`flex items-center gap-2 mb-4 text-sm rounded-lg px-3 py-2 border ${
            msg.kind === 'ok'
              ? 'text-green-700 bg-green-50 border-green-200'
              : 'text-red-700 bg-red-50 border-red-200'
          }`}
        >
          {msg.kind === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => save()}
          disabled={saving}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm disabled:opacity-50 inline-flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving…' : saved ? 'Saved ✓' : connected ? 'Update' : 'Connect'}
        </button>
        <button
          onClick={sendTest}
          disabled={testing || saving}
          className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 text-sm disabled:opacity-50 inline-flex items-center gap-2"
        >
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send test
        </button>
      </div>
    </section>
  )
}
