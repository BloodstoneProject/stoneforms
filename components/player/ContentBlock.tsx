'use client'

// ContentBlock — renders ANY non-input content block (heading, text_block,
// image, video, embed, html, divider, spacer, quote, button, section) in the
// FORM'S theme. Shared by every presentation mode (conversational slide,
// classic stacked page, magazine spread). It NEVER collects an answer.
//
// SECURITY: the `html` block is author-supplied raw markup and is rendered in a
// sandboxed <iframe srcDoc> WITHOUT allow-same-origin, so author HTML/JS can
// never touch the form's DOM/origin or read other respondents' answers. text_block
// uses a tiny in-house safe markdown renderer (escape first, then a whitelist of
// bold/italic/link/linebreak) — never raw HTML injection.

import { Fragment, useEffect, useId, useState, type ReactNode } from 'react'
import type { FormTheme } from '@/lib/themes'
import { fontStack, buttonRadius } from '@/lib/themes'
import type { Question } from '@/types'

export interface ContentBlockProps {
  // The content block as a Question (its `properties` holds the block settings).
  block: Question
  theme: FormTheme
  // Visual scale hint. Magazine spreads run a touch tighter than full-page modes.
  density?: 'comfortable' | 'compact'
}

type Align = 'left' | 'center' | 'right'

const alignClass = (a?: Align): string =>
  a === 'center' ? 'text-center' : a === 'right' ? 'text-right' : 'text-left'
const alignItems = (a?: Align): string =>
  a === 'center' ? 'items-center' : a === 'right' ? 'items-end' : 'items-start'

// ----------------------------------------------------------------------------
// Tiny SAFE markdown renderer — to REACT NODES, never HTML injection. A strict
// whitelist of inline patterns is parsed: **bold**, *italic*/_italic_,
// [text](url), and line breaks. Author input is only ever placed as React text
// children (auto-escaped by React) or as href values that pass the safeUrl
// scheme allowlist, so no raw markup or unsafe URL scheme can execute.
// ----------------------------------------------------------------------------

// Allow only http(s) / mailto links; reject javascript:/data:/etc. Bare emails
// become mailto:; relative/anchor links pass through.
function safeUrl(raw: string): string {
  const url = (raw || '').trim()
  if (/^(https?:\/\/|mailto:)/i.test(url)) return url
  if (/^[^\s:]+@[^\s:]+\.[^\s:]+$/.test(url)) return `mailto:${url}`
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return '#' // reject other schemes
  return url || '#'
}

// Parse one line into inline React nodes (links, bold, italic). Operates on a
// regex sweep; everything that isn't a recognised token stays plain text.
function renderInline(line: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  // Ordered: link, **bold**, *italic*, _italic_.
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push(<Fragment key={`${keyBase}-t${i}`}>{line.slice(last, m.index)}</Fragment>)
    if (m[1] !== undefined) {
      out.push(
        <a
          key={`${keyBase}-a${i}`}
          href={safeUrl(m[2])}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="sf-md-link underline"
        >
          {m[1]}
        </a>
      )
    } else if (m[3] !== undefined) {
      out.push(<strong key={`${keyBase}-b${i}`}>{m[3]}</strong>)
    } else if (m[4] !== undefined) {
      out.push(<em key={`${keyBase}-i${i}`}>{m[4]}</em>)
    } else if (m[5] !== undefined) {
      out.push(<em key={`${keyBase}-u${i}`}>{m[5]}</em>)
    }
    last = re.lastIndex
    i++
  }
  if (last < line.length) out.push(<Fragment key={`${keyBase}-tend`}>{line.slice(last)}</Fragment>)
  return out
}

// Render light markdown text into safe React paragraphs. Double newline splits
// paragraphs; single newline is a <br/>.
export function SafeMarkdown({ text }: { text: string }): JSX.Element {
  const paras = String(text ?? '').split(/\n{2,}/)
  return (
    <>
      {paras.map((para, pi) => {
        const lines = para.split('\n')
        return (
          <p key={`p${pi}`} className={pi > 0 ? 'mt-4' : undefined}>
            {lines.map((ln, li) => (
              <Fragment key={`l${li}`}>
                {li > 0 && <br />}
                {renderInline(ln, `p${pi}l${li}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}

// ----------------------------------------------------------------------------
// Video provider detection
// ----------------------------------------------------------------------------
function parseVideo(url: string): { kind: 'youtube' | 'vimeo' | 'mp4' | 'iframe'; src: string } | null {
  const u = (url || '').trim()
  if (!u) return null
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i)
  if (yt) return { kind: 'youtube', src: `https://www.youtube.com/embed/${yt[1]}` }
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo) return { kind: 'vimeo', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(u)) return { kind: 'mp4', src: u }
  // Unknown URL — best-effort iframe (covers other embeddable players).
  if (/^https?:\/\//i.test(u)) return { kind: 'iframe', src: u }
  return null
}

const imgMaxWidth: Record<string, string> = {
  sm: '320px',
  md: '520px',
  lg: '760px',
  full: '100%',
}

// ----------------------------------------------------------------------------
// Sandboxed HTML block: srcDoc into an iframe with `sandbox` (NO allow-same-origin).
// Best-effort auto-height by listening for a postMessage the injected wrapper
// sends; falls back to a sensible min-height.
// ----------------------------------------------------------------------------
function SandboxedHtml({ html }: { html: string }) {
  const [height, setHeight] = useState(220)
  const channel = useId()

  // Wrap the author HTML so it reports its scrollHeight back to us. The iframe
  // has no same-origin access, so it talks to us via postMessage only.
  const srcDoc = `<!doctype html><html><head><meta charset="utf-8"/>
<style>html,body{margin:0;padding:0;font-family:system-ui,sans-serif;color:inherit}img,video,iframe{max-width:100%}</style>
</head><body><div id="sf-root">${html ?? ''}</div>
<script>
(function(){
  var ch=${JSON.stringify(channel)};
  function report(){try{var h=document.documentElement.scrollHeight||document.body.scrollHeight;parent.postMessage({__sfHtmlHeight:true,ch:ch,height:h},'*');}catch(e){}}
  window.addEventListener('load',report);
  setTimeout(report,60);setTimeout(report,300);setTimeout(report,1000);
  try{new ResizeObserver(report).observe(document.body);}catch(e){}
})();
<\/script></body></html>`

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data
      if (d && d.__sfHtmlHeight && d.ch === channel && typeof d.height === 'number') {
        setHeight(Math.max(80, Math.min(4000, Math.ceil(d.height) + 4)))
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [channel])

  return (
    <iframe
      title="Embedded content"
      srcDoc={srcDoc}
      // NO allow-same-origin: author script can run but cannot reach the form's
      // origin, cookies, storage, or DOM. allow-scripts lets the wrapper measure.
      sandbox="allow-scripts allow-popups allow-forms"
      className="w-full block"
      style={{ height, border: '0', borderRadius: '10px', background: 'transparent' }}
      loading="lazy"
    />
  )
}

export function ContentBlock({ block, theme, density = 'comfortable' }: ContentBlockProps) {
  const c = theme.colors
  const ff = fontStack(theme.font)
  const p = (block.properties || {}) as Record<string, any>
  const type = block.type
  const tight = density === 'compact'

  switch (type) {
    case 'heading': {
      const level = (p.level === 1 || p.level === 3 ? p.level : 2) as 1 | 2 | 3
      const align = (p.align || 'left') as Align
      const text = p.text ?? ''
      const sizes: Record<number, string> = {
        1: tight ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl',
        2: tight ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl',
        3: tight ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl',
      }
      const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements
      return (
        <Tag
          className={`font-bold leading-tight ${sizes[level]} ${alignClass(align)}`}
          style={{ color: c.text, fontFamily: ff }}
        >
          {text}
        </Tag>
      )
    }

    case 'text_block': {
      const align = (p.align || 'left') as Align
      return (
        <div
          className={`sf-md ${alignClass(align)} ${tight ? 'text-base md:text-lg' : 'text-lg'} leading-relaxed`}
          style={{ color: c.text, opacity: 0.92, fontFamily: ff }}
        >
          {/* SAFE: rendered as React nodes (no HTML injection); only a whitelist
              of bold/italic/link/linebreak is produced from the text. */}
          <SafeMarkdown text={String(p.text ?? '')} />
        </div>
      )
    }

    case 'quote': {
      const text = p.text ?? ''
      const author = p.author
      const role = p.role
      return (
        <figure
          className="border-l-4 pl-5 py-1"
          style={{ borderColor: c.primary }}
        >
          <blockquote
            className={`${tight ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} font-medium leading-snug`}
            style={{ color: c.text, fontFamily: ff }}
          >
            &ldquo;{text}&rdquo;
          </blockquote>
          {(author || role) && (
            <figcaption className="mt-3 text-sm font-medium" style={{ color: c.text, opacity: 0.65 }}>
              {author}
              {author && role ? ', ' : ''}
              {role}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'button': {
      const label = p.label || 'Button'
      const style = p.style === 'secondary' ? 'secondary' : 'primary'
      const href = safeUrl(String(p.url || ''))
      const radius = buttonRadius(theme.buttonStyle)
      const isPrimary = style === 'primary'
      return (
        <a
          href={href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="sf-block-btn inline-flex items-center gap-2 px-6 py-3 font-semibold transition-transform active:scale-95"
          style={
            isPrimary
              ? { backgroundColor: c.button, color: c.buttonText, borderRadius: radius }
              : {
                  backgroundColor: 'transparent',
                  color: c.button,
                  border: `2px solid ${c.button}`,
                  borderRadius: radius,
                }
          }
        >
          {label}
        </a>
      )
    }

    case 'image': {
      const url = String(p.url || '')
      const align = (p.align || 'center') as Align
      const width = (p.width || 'md') as keyof typeof imgMaxWidth
      if (!url) return null
      return (
        <figure className={`flex flex-col ${alignItems(align)}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={p.alt || ''}
            className="rounded-lg w-full h-auto"
            style={{ maxWidth: imgMaxWidth[width] || imgMaxWidth.md }}
            loading="lazy"
          />
          {p.caption && (
            <figcaption className="mt-2 text-sm" style={{ color: c.text, opacity: 0.6, fontFamily: ff }}>
              {p.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'video': {
      const v = parseVideo(String(p.url || ''))
      if (!v) return null
      return (
        <figure className="w-full">
          {v.kind === 'mp4' ? (
            <video
              src={v.src}
              controls
              playsInline
              className="w-full rounded-lg"
              style={{ maxHeight: '70vh', background: '#000' }}
            />
          ) : (
            <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16 / 9', background: '#000' }}>
              <iframe
                src={v.src}
                title="Video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
          {p.caption && (
            <figcaption className="mt-2 text-sm" style={{ color: c.text, opacity: 0.6, fontFamily: ff }}>
              {p.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'embed': {
      const url = String(p.url || '')
      const height = typeof p.height === 'number' && p.height > 0 ? Math.min(p.height, 4000) : 400
      if (!/^https?:\/\//i.test(url)) return null
      return (
        <div className="w-full rounded-lg overflow-hidden" style={{ border: `1px solid ${c.text}1a` }}>
          <iframe
            src={url}
            title="Embedded content"
            className="w-full block"
            style={{ height }}
            // External page in its own origin; sandbox keeps it from scripting the
            // parent while still allowing the embedded site to function.
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            loading="lazy"
          />
        </div>
      )
    }

    case 'html':
      return <SandboxedHtml html={String(p.html || '')} />

    case 'divider':
      return <hr className="border-0 border-t" style={{ borderColor: `${c.text}22` }} />

    case 'spacer': {
      const size = p.size === 'sm' ? 16 : p.size === 'lg' ? 64 : 32
      return <div aria-hidden style={{ height: size }} />
    }

    case 'section':
      return (
        <header className="space-y-2">
          {p.title && (
            <h2 className={`${tight ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-bold leading-tight`} style={{ color: c.text, fontFamily: ff }}>
              {p.title}
            </h2>
          )}
          {p.description && (
            <p className="text-lg" style={{ color: c.text, opacity: 0.7, fontFamily: ff }}>
              {p.description}
            </p>
          )}
          {(p.title || p.description) && (
            <div className="h-px w-full mt-3" style={{ background: `linear-gradient(90deg, ${c.primary}, transparent)` }} />
          )}
        </header>
      )

    default:
      return null
  }
}

export default ContentBlock
