'use client'

import { useMemo, useState } from 'react'
import { Copy, Check, Code, LayoutTemplate, PanelRight, SquareMousePointer } from 'lucide-react'
import {
  buildInlineSnippet,
  buildPopupSnippet,
  buildSliderSnippet,
  buildIframeSnippet,
  type SnippetOptions,
} from '@/lib/embed'

interface EmbedCodeGeneratorProps {
  formId: string
  formTitle: string
}

type EmbedType = 'inline' | 'popup' | 'slider' | 'iframe'

const TABS: { key: EmbedType; label: string; sub: string; icon: any }[] = [
  { key: 'inline', label: 'Inline', sub: 'Auto-resize', icon: LayoutTemplate },
  { key: 'popup', label: 'Popup', sub: 'Button → modal', icon: SquareMousePointer },
  { key: 'slider', label: 'Slide-over', sub: 'Button → panel', icon: PanelRight },
  { key: 'iframe', label: 'Iframe', sub: 'No JavaScript', icon: Code },
]

export default function EmbedCodeGenerator({ formId, formTitle }: EmbedCodeGeneratorProps) {
  const [embedType, setEmbedType] = useState<EmbedType>('inline')
  const [copied, setCopied] = useState(false)
  const [height, setHeight] = useState(600)
  const [buttonLabel, setButtonLabel] = useState('Open form')

  // Build snippets from this browser's origin (lib/embed → getSiteUrl falls back
  // to window.location.origin client-side), so the pasted code points back here.
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined

  const opts: SnippetOptions = useMemo(
    () => ({ id: formId, title: formTitle, origin, height, buttonLabel }),
    [formId, formTitle, origin, height, buttonLabel]
  )

  const snippet = useMemo(() => {
    switch (embedType) {
      case 'popup':
        return buildPopupSnippet(opts)
      case 'slider':
        return buildSliderSnippet(opts)
      case 'iframe':
        return buildIframeSnippet(opts)
      default:
        return buildInlineSnippet(opts)
    }
  }, [embedType, opts])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const usesButton = embedType === 'popup' || embedType === 'slider'

  return (
    <div className="space-y-6">
      {/* Embed Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = embedType === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setEmbedType(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-all ${
                active ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">{tab.label}</div>
                <div className="text-xs text-muted-foreground">{tab.sub}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Per-mode options */}
      <div className="flex flex-wrap gap-4">
        {(embedType === 'inline' || embedType === 'iframe') && (
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Default height (px)
            </label>
            <input
              type="number"
              value={height}
              min={200}
              onChange={(e) => setHeight(Math.max(200, parseInt(e.target.value, 10) || 600))}
              className="w-32 px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>
        )}
        {usesButton && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-foreground mb-1">
              Button label
            </label>
            <input
              type="text"
              value={buttonLabel}
              onChange={(e) => setButtonLabel(e.target.value)}
              placeholder="Open form"
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="text-sm text-muted-foreground">
        {embedType === 'inline' && (
          <p>
            Drops the form straight into your page and grows/shrinks to fit its content
            automatically. Needs the one-line Stoneforms script (included below).
          </p>
        )}
        {embedType === 'popup' && (
          <p>
            Renders a button. Clicking it opens the form in a centered modal overlay.
            Great for landing pages and call-to-action sections.
          </p>
        )}
        {embedType === 'slider' && (
          <p>
            Renders a button. Clicking it slides the form in as a panel from the right
            edge of the screen, leaving your page visible behind it.
          </p>
        )}
        {embedType === 'iframe' && (
          <p>
            A plain iframe that works even where scripts are blocked. Fixed height (no
            auto-resize) — adjust the height above to suit your form.
          </p>
        )}
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="bg-muted text-foreground border border-border p-6 pr-32 rounded-md overflow-x-auto text-sm">
          <code>{snippet}</code>
        </pre>
        <button
          onClick={() => copyToClipboard(snippet)}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Live Preview */}
      <div>
        <div className="text-xs font-medium text-foreground mb-2">Live preview</div>
        <div className="border border-border rounded-lg p-4 bg-secondary">
          {embedType === 'iframe' && origin && (
            <iframe
              src={`${origin}/embed/${formId}`}
              width="100%"
              height={Math.min(height, 480)}
              style={{ border: 'none', borderRadius: 12 }}
              title={formTitle}
            />
          )}
          {embedType === 'inline' && origin && (
            <iframe
              src={`${origin}/embed/${formId}`}
              width="100%"
              height={Math.min(height, 480)}
              style={{ border: 'none', borderRadius: 12 }}
              title={formTitle}
            />
          )}
          {usesButton && (
            <div className="flex items-center justify-center py-8">
              <PreviewButton
                label={buttonLabel || 'Open form'}
                mode={embedType === 'popup' ? 'popup' : 'slider'}
                src={origin ? `${origin}/embed/${formId}` : ''}
                title={formTitle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">How to use</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>1. Copy the code above.</p>
          {embedType === 'iframe' ? (
            <p>2. Paste it into your page's HTML where the form should appear.</p>
          ) : (
            <>
              <p>2. Paste it into your page's HTML where you want the form/button.</p>
              <p>
                3. The <code className="bg-muted px-1 rounded">embed.js</code> script can be
                included once per page even if you embed several forms.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple in-modal preview so users can see popup/slider behaviour without leaving
// the share dialog. Mirrors embed.js visuals at a high level.
function PreviewButton({
  label,
  mode,
  src,
  title,
}: {
  label: string
  mode: 'popup' | 'slider'
  src: string
  title: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
      >
        {label}
      </button>
      {open && src && (
        <div
          className="fixed inset-0 z-[60] bg-black/55 flex items-stretch justify-center"
          onClick={() => setOpen(false)}
        >
          {mode === 'popup' ? (
            <div className="m-auto p-4 w-full max-w-2xl">
              <div
                className="relative bg-card border border-border rounded-2xl overflow-hidden h-[80vh] max-h-[760px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-3 z-10 w-9 h-9 rounded-full bg-black/5 text-2xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
                <iframe src={src} title={title} className="flex-1 w-full border-none" />
              </div>
            </div>
          ) : (
            <div
              className="ml-auto bg-card border-l border-border h-full w-full max-w-md flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-3 z-10 w-9 h-9 rounded-full bg-black/5 text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
              <iframe src={src} title={title} className="flex-1 w-full border-none" />
            </div>
          )}
        </div>
      )}
    </>
  )
}
