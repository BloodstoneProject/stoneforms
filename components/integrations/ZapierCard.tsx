'use client'

import { useState } from 'react'
import { Zap, Copy, Check } from 'lucide-react'

// Zapier / Make guidance card. No new transport: it points owners at the
// existing signed-webhook feature on this page. Shows the endpoint usage and a
// sample payload they can paste into a Catch Hook / Custom Webhook trigger.
export default function ZapierCard({ formId, formUrl }: { formId: string; formUrl: string }) {
  const [copied, setCopied] = useState<string | null>(null)

  const samplePayload = JSON.stringify(
    {
      event: 'submission.created',
      form_id: formId,
      submission_id: '00000000-0000-0000-0000-000000000000',
      data: {
        'field-id-1': 'Sample answer',
        'field-id-2': 'sample@example.com',
      },
      timestamp: new Date().toISOString(),
    },
    null,
    2
  )

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="bg-white rounded-xl border border-stone-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-stone-700" />
        <h2 className="font-bold text-stone-900">Zapier / Make</h2>
      </div>
      <p className="text-sm text-stone-500 mb-4">
        Connect to 7,000+ apps via Zapier or Make using the <strong>Webhooks</strong> section above.
        Stoneforms POSTs a signed JSON payload to your endpoint on every submission.
      </p>

      <ol className="text-sm text-stone-700 space-y-2 mb-4 list-decimal pl-5">
        <li>
          In Zapier create a Zap with the <em>Webhooks by Zapier → Catch Hook</em> trigger (or in Make,
          a <em>Custom webhook</em> module). Copy the URL it gives you.
        </li>
        <li>
          Paste that URL into the <strong>Webhooks</strong> section above and click <strong>Add</strong>.
        </li>
        <li>
          Submit a test response{formUrl ? ' to your form' : ''} so Zapier/Make can capture the sample
          payload and map the fields.
        </li>
      </ol>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-stone-700">Sample payload</span>
          <button
            onClick={() => copy(samplePayload, 'payload')}
            className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
          >
            {copied === 'payload' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy
          </button>
        </div>
        <pre className="text-xs bg-stone-50 border border-stone-200 rounded-lg p-3 overflow-x-auto font-mono text-stone-700">
{samplePayload}
        </pre>
      </div>

      <p className="text-xs text-stone-400">
        Each request includes an <code className="px-1 py-0.5 bg-stone-100 rounded">X-Stoneforms-Signature</code>{' '}
        header (HMAC-SHA256 of the body using your webhook&apos;s signing secret) so you can verify authenticity.
      </p>
    </section>
  )
}
