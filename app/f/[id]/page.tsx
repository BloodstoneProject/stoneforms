'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect } from 'react'
import Script from 'next/script'
import { Loader2 } from 'lucide-react'
import FormPlayer from '@/components/player/FormPlayer'
import { dbFieldsToQuestions, type DbField } from '@/lib/form-mapping'
import { normalizeTheme, type FormTheme } from '@/lib/themes'

// ---------------------------------------------------------------------------
// Public-surface injection (favicon, custom CSS, GA4 + Meta Pixel, OG/title).
// Pure client-side, additive: nothing here runs unless the form configures it,
// so existing forms behave exactly as before. Defined inline (no new shared
// module) to stay within this page's ownership.
// ---------------------------------------------------------------------------
interface TrackingConfig { ga4MeasurementId?: string; metaPixelId?: string }

function readTracking(settings: Record<string, any> | undefined): TrackingConfig {
  const t = settings?.tracking
  if (!t || typeof t !== 'object') return {}
  return {
    ga4MeasurementId: typeof t.ga4MeasurementId === 'string' && t.ga4MeasurementId.trim() ? t.ga4MeasurementId.trim() : undefined,
    metaPixelId: typeof t.metaPixelId === 'string' && t.metaPixelId.trim() ? t.metaPixelId.trim() : undefined,
  }
}

// Apply favicon + per-form document <title>/description + author CSS. Returns a
// cleanup that removes only the nodes it created so SPA navigation stays clean.
function usePublicHead(opts: {
  theme: FormTheme | null
  title?: string
  metaTitle?: string
  metaDescription?: string
}) {
  const { theme, title, metaTitle, metaDescription } = opts
  useEffect(() => {
    if (typeof document === 'undefined') return
    const created: HTMLElement[] = []

    // Per-form <title> override.
    const wantTitle = (metaTitle && metaTitle.trim()) || (title && title.trim())
    const prevTitle = document.title
    if (wantTitle) document.title = wantTitle

    // Favicon.
    if (theme?.faviconUrl) {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = theme.faviconUrl
      link.setAttribute('data-sf-public', 'favicon')
      document.head.appendChild(link)
      created.push(link)
    }

    // Meta description.
    if (metaDescription && metaDescription.trim()) {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = metaDescription.trim()
      meta.setAttribute('data-sf-public', 'description')
      document.head.appendChild(meta)
      created.push(meta)
    }

    // Author-supplied custom CSS (scoped to a tagged <style>).
    if (theme?.customCss && theme.customCss.trim()) {
      const style = document.createElement('style')
      style.setAttribute('data-sf-public', 'custom-css')
      style.textContent = theme.customCss
      document.head.appendChild(style)
      created.push(style)
    }

    return () => {
      document.title = prevTitle
      created.forEach((n) => n.parentNode?.removeChild(n))
    }
  }, [theme, title, metaTitle, metaDescription])
}

// GA4 (gtag.js) + Meta Pixel loaders via next/script. Render nothing when unset.
function TrackingScripts({ tracking }: { tracking: TrackingConfig }) {
  return (
    <>
      {tracking.ga4MeasurementId && (
        <>
          <Script
            id="sf-ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${tracking.ga4MeasurementId}`}
          />
          <Script id="sf-ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tracking.ga4MeasurementId}');`}
          </Script>
        </>
      )}
      {tracking.metaPixelId && (
        <Script id="sf-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tracking.metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  )
}

interface PublicForm {
  id: string
  title: string
  description?: string
  theme?: any
  logic?: any[]
  settings?: {
    showProgressBar?: boolean
    redirectUrl?: string
    customEndingMessage?: string
    quiz?: any
    tracking?: { ga4MeasurementId?: string; metaPixelId?: string }
    metaTitle?: string
    metaDescription?: string
    [key: string]: any
  }
}

export default function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = (useParams() as any)

  const [form, setForm] = useState<PublicForm | null>(null)
  const [fields, setFields] = useState<DbField[]>([])
  const [hideBranding, setHideBranding] = useState(false)
  const [paymentsEnabled, setPaymentsEnabled] = useState(false)
  const [availability, setAvailability] = useState<{ open: boolean; reason?: string; message?: string }>({ open: true })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetch(`/api/public/forms/${formId}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!active) return
        if (!res.ok) {
          setError(data.error || 'This form is not available.')
        } else {
          setForm(data.form)
          setFields(data.fields || [])
          setHideBranding(!!data.branding?.hide)
          setPaymentsEnabled(!!data.payments?.enabled)
          if (data.availability) setAvailability(data.availability)
        }
      })
      .catch(() => active && setError('Failed to load form.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [formId])

  // Public-surface head injection (runs unconditionally; no-op until configured).
  const surfaceTheme = form ? normalizeTheme(form.theme) : null
  usePublicHead({
    theme: surfaceTheme,
    title: form?.title,
    metaTitle: form?.settings?.metaTitle,
    metaDescription: form?.settings?.metaDescription,
  })
  const tracking = readTracking(form?.settings)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-2">Form unavailable</h1>
          <p className="text-neutral-600">{error || 'This form may have been unpublished or removed.'}</p>
        </div>
      </div>
    )
  }

  const questions = dbFieldsToQuestions(fields)
  const theme = surfaceTheme ?? normalizeTheme(form.theme)

  return (
    <>
      <TrackingScripts tracking={tracking} />
      <FormPlayer
        formId={form.id}
        formTitle={form.title}
        formDescription={form.description}
        questions={questions}
        settings={form.settings || {}}
        theme={theme}
        logic={form.logic || []}
        hideBranding={hideBranding}
        availability={availability as any}
        paymentsEnabled={paymentsEnabled}
      />
    </>
  )
}
