// Optional extra content blocks rendered above the embedded form on /p/{slug}.
// Renders a SAFE subset of the block types from lib/blocks.ts. Deliberately
// excludes `html`/`embed`/`video` here (those need the sandboxed player); keep
// the landing render minimal and safe. When sections grow, this converges with
// the player's block renderer.
import type { LandingBlock } from '@/lib/landing'

const alignClass = (a?: string) =>
  a === 'center' ? 'text-center' : a === 'right' ? 'text-right' : 'text-left'

function Block({ block, color }: { block: LandingBlock; color: string }) {
  const s: any = block.settings || {}
  switch (block.type) {
    case 'heading': {
      const level = s.level === 1 ? 1 : s.level === 3 ? 3 : 2
      const cls =
        level === 1
          ? 'text-3xl sm:text-4xl font-semibold tracking-tight'
          : level === 3
          ? 'text-lg sm:text-xl font-semibold'
          : 'text-2xl sm:text-3xl font-semibold tracking-tight'
      const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements
      return s.text ? <Tag className={`${cls} ${alignClass(s.align)}`}>{s.text}</Tag> : null
    }
    case 'text_block':
      return s.text ? (
        <p className={`text-base leading-relaxed opacity-80 whitespace-pre-line ${alignClass(s.align)}`}>{s.text}</p>
      ) : null
    case 'quote':
      return s.text ? (
        <blockquote className="border-l-2 pl-4 italic opacity-90" style={{ borderColor: color }}>
          <p className="text-lg">{s.text}</p>
          {(s.author || s.role) && (
            <footer className="mt-2 text-sm opacity-70 not-italic">
              {[s.author, s.role].filter(Boolean).join(' · ')}
            </footer>
          )}
        </blockquote>
      ) : null
    case 'image':
      // eslint-disable-next-line @next/next/no-img-element
      return s.url ? (
        <figure className={alignClass(s.align)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.url} alt={s.alt || ''} className="inline-block max-w-full rounded-lg" />
          {s.caption && <figcaption className="mt-2 text-sm opacity-60">{s.caption}</figcaption>}
        </figure>
      ) : null
    case 'button':
      return s.url && s.label ? (
        <div className={alignClass(s.align)}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {s.label}
          </a>
        </div>
      ) : null
    case 'divider':
      return <hr className="border-current opacity-15" />
    case 'spacer':
      return <div style={{ height: s.size === 'lg' ? 48 : s.size === 'sm' ? 16 : 32 }} />
    default:
      return null
  }
}

export default function LandingSections({
  sections,
  accent,
}: {
  sections: LandingBlock[]
  accent: string
}) {
  if (!sections?.length) return null
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">
      {sections.map((b, i) => (
        <Block key={b.id || i} block={b} color={accent} />
      ))}
    </div>
  )
}
