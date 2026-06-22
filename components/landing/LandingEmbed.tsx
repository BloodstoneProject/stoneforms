'use client'
// Responsive iframe that hosts the existing chrome-less form (/embed/{ref}) on
// the public landing page. Listens for the `stoneforms:resize` postMessage the
// embed route already emits (see app/embed/[id]/page.tsx) and resizes the iframe
// to fit its content — so the form has no inner scrollbar. We DON'T touch the
// player: this is pure embedding for isolation.
import { useEffect, useRef, useState } from 'react'

export default function LandingEmbed({
  src,
  formRef,
  title,
}: {
  src: string
  formRef: string
  title: string
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(640)

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data
      if (!data || data.type !== 'stoneforms:resize') return
      // The embed reports its own formId (the param it loaded with) — accept any
      // resize from our iframe regardless of whether it used slug or id.
      if (typeof data.height === 'number' && data.height > 0) {
        setHeight(Math.ceil(data.height))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [formRef])

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      loading="lazy"
      className="w-full block"
      style={{ height, border: 'none' }}
      // Allow form submission + payment redirects, deny same-origin escape.
      sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-same-origin"
    />
  )
}
