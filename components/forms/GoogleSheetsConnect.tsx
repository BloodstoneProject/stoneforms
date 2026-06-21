'use client'

import { useEffect, useState } from 'react'
import { Sheet, ExternalLink, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

interface GoogleSheetsConnectProps {
  formId: string
}

// Google Sheets section for the integrations page. We can't add a status GET
// endpoint (no edits to existing files), so connection state is derived from the
// ?google= query param the OAuth callback redirects back with.
export default function GoogleSheetsConnect({ formId }: GoogleSheetsConnectProps) {
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const google = params.get('google')
    if (google) {
      setStatus(google)
      setConnected(google === 'connected')
    }
  }, [])

  const disconnect = async () => {
    if (!confirm('Disconnect Google Sheets? New submissions will no longer be added to the sheet.')) {
      return
    }
    setDisconnecting(true)
    try {
      const res = await fetch('/api/integrations/google/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId }),
      })
      if (res.ok) {
        window.location.href = `/dashboard/forms/${formId}/integrations`
      }
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <section className="bg-white rounded-xl border border-stone-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sheet className="w-5 h-5 text-stone-700" />
        <h2 className="font-bold text-stone-900">Google Sheets</h2>
      </div>
      <p className="text-sm text-stone-500 mb-4">
        Connect a Google account and we&apos;ll create a spreadsheet for this form. Every new
        submission is appended as a row automatically.
      </p>

      {status === 'connected' && (
        <div className="flex items-center gap-2 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Google Sheets connected. Submissions are being synced.</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Something went wrong connecting Google Sheets. Please try again.</span>
        </div>
      )}
      {status === 'not_configured' && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Google Sheets isn&apos;t configured on this server yet.</span>
        </div>
      )}

      {connected ? (
        <button
          onClick={disconnect}
          disabled={disconnecting}
          className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 text-sm disabled:opacity-50 inline-flex items-center gap-2"
        >
          {disconnecting && <Loader2 className="w-4 h-4 animate-spin" />}
          {disconnecting ? 'Disconnecting…' : 'Disconnect'}
        </button>
      ) : (
        <a
          href={`/api/integrations/google/connect?formId=${formId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Connect Google Sheets
        </a>
      )}
    </section>
  )
}
