'use client'
// ============================================================================
// LandingSectionEditor — APP CHROME (neutral tokens). Manage landing.sections.
// ============================================================================
// Add / edit / reorder / delete the extra content blocks that render above the
// embedded form on /p/{slug}. It is intentionally GENERIC: the "Add section"
// menu is sourced from BLOCK_LIBRARY and each block's settings form is derived
// from defaultBlockSettings(type), so new block types added to lib/blocks.ts
// (cover_image, testimonial, logo_strip, logo, …) appear automatically with a
// best-effort editor and render via ContentBlock on the public page.
//
// This is dashboard chrome, so it uses neutral design tokens (bg-card, border,
// <Button>/<Input>/<Textarea>/<Select>) and is fully dark-aware.
import { useMemo } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  BLOCK_LIBRARY,
  defaultBlockSettings,
  type BlockLibraryEntry,
} from '@/lib/blocks'
import type { LandingBlock } from '@/lib/landing'

// The subset of block types that make sense on a marketing landing page. We
// intersect this with whatever BLOCK_LIBRARY actually exposes (so new media
// blocks like cover_image / testimonial / logo_strip / logo show up
// automatically, and removed types silently drop out). We deliberately exclude
// the sandboxed/interactive types (html, embed, video, section) from the
// landing menu — those need the player and aren't useful as page sections here.
const LANDING_BLOCK_ALLOW = new Set([
  'heading',
  'text_block',
  'image',
  'cover_image',
  'testimonial',
  'logo_strip',
  'logo',
  'quote',
  'button',
  'divider',
  'spacer',
])

// Heuristics for rendering a generic settings input from a settings key.
const LONG_TEXT_KEYS = new Set(['text', 'description', 'caption', 'html'])
const URL_KEYS = new Set(['url', 'logoUrl', 'imageUrl', 'href', 'src', 'backgroundImageUrl'])
const ALIGN_OPTIONS = ['left', 'center', 'right']
const HEADING_LEVELS = [1, 2, 3]
const SPACER_SIZES = ['sm', 'md', 'lg']
const IMAGE_WIDTHS = ['sm', 'md', 'lg', 'full']
const BUTTON_STYLES = ['primary', 'secondary']

function prettyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\burl\b/i, 'URL')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}

function genId(): string {
  return `sec_${Math.random().toString(36).slice(2, 10)}`
}

// A single settings field, chosen generically from the key name + value type.
function SettingField({
  blockType,
  fieldKey,
  value,
  onChange,
}: {
  blockType: string
  fieldKey: string
  value: any
  onChange: (v: any) => void
}) {
  const label = prettyKey(fieldKey)

  // Enum-style selects for well-known keys.
  if (fieldKey === 'align') {
    return (
      <FieldShell label={label}>
        <Select value={value ?? 'left'} onChange={(e) => onChange(e.target.value)}>
          {ALIGN_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {prettyKey(o)}
            </option>
          ))}
        </Select>
      </FieldShell>
    )
  }
  if (fieldKey === 'level' && blockType === 'heading') {
    return (
      <FieldShell label={label}>
        <Select
          value={String(value ?? 2)}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {HEADING_LEVELS.map((l) => (
            <option key={l} value={l}>
              Heading {l}
            </option>
          ))}
        </Select>
      </FieldShell>
    )
  }
  if (fieldKey === 'size' && blockType === 'spacer') {
    return (
      <FieldShell label={label}>
        <Select value={value ?? 'md'} onChange={(e) => onChange(e.target.value)}>
          {SPACER_SIZES.map((s) => (
            <option key={s} value={s}>
              {prettyKey(s)}
            </option>
          ))}
        </Select>
      </FieldShell>
    )
  }
  if (fieldKey === 'width' && (blockType === 'image' || blockType === 'cover_image')) {
    return (
      <FieldShell label={label}>
        <Select value={value ?? 'md'} onChange={(e) => onChange(e.target.value)}>
          {IMAGE_WIDTHS.map((w) => (
            <option key={w} value={w}>
              {prettyKey(w)}
            </option>
          ))}
        </Select>
      </FieldShell>
    )
  }
  if (fieldKey === 'style' && blockType === 'button') {
    return (
      <FieldShell label={label}>
        <Select value={value ?? 'primary'} onChange={(e) => onChange(e.target.value)}>
          {BUTTON_STYLES.map((s) => (
            <option key={s} value={s}>
              {prettyKey(s)}
            </option>
          ))}
        </Select>
      </FieldShell>
    )
  }

  // Numeric fields (heuristic: default value was a number).
  if (typeof value === 'number') {
    return (
      <FieldShell label={label}>
        <Input
          type="number"
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        />
      </FieldShell>
    )
  }

  // Long-form text.
  if (LONG_TEXT_KEYS.has(fieldKey)) {
    return (
      <FieldShell label={label}>
        <Textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fieldKey === 'html' ? '<!-- custom markup -->' : ''}
          className="min-h-[80px]"
        />
      </FieldShell>
    )
  }

  // URL inputs (with a sensible placeholder).
  if (URL_KEYS.has(fieldKey) || /url$/i.test(fieldKey)) {
    return (
      <FieldShell label={label}>
        <Input
          type="url"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
        />
      </FieldShell>
    )
  }

  // Default: single-line text.
  return (
    <FieldShell label={label}>
      <Input value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </FieldShell>
  )
}

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

// A single section card: type label, reorder/delete controls, settings form.
function SectionCard({
  index,
  total,
  section,
  onChange,
  onMove,
  onRemove,
}: {
  index: number
  total: number
  section: LandingBlock
  onChange: (next: LandingBlock) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}) {
  const entry = BLOCK_LIBRARY.find((b) => b.type === section.type)
  const label = entry?.label || prettyKey(section.type)

  // The editable keys = the union of this type's default keys and any keys the
  // stored settings already carry (so we never lose unknown persisted values).
  const keys = useMemo(() => {
    const defaults = defaultBlockSettings(section.type) as Record<string, any>
    const set = new Set<string>([...Object.keys(defaults), ...Object.keys(section.settings || {})])
    return Array.from(set)
  }, [section.type, section.settings])

  const setKey = (key: string, value: any) => {
    const next = { ...(section.settings || {}) }
    if (value === undefined || value === '') delete next[key]
    else next[key] = value
    onChange({ ...section, settings: next })
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">{label}</span>
          <span className="text-xs text-muted-foreground font-mono shrink-0">{section.type}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label="Delete section"
          >
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="px-3 py-3 space-y-3">
        {keys.length === 0 ? (
          <p className="text-xs text-muted-foreground">This block has no settings.</p>
        ) : (
          keys.map((key) => (
            <SettingField
              key={key}
              blockType={section.type}
              fieldKey={key}
              value={(section.settings || {})[key]}
              onChange={(v) => setKey(key, v)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function LandingSectionEditor({
  sections,
  onChange,
}: {
  sections: LandingBlock[]
  onChange: (next: LandingBlock[]) => void
}) {
  // The menu of addable blocks: BLOCK_LIBRARY filtered to the landing allow-list.
  // Reading from BLOCK_LIBRARY means new types appear without code changes here.
  const addable: BlockLibraryEntry[] = useMemo(
    () => BLOCK_LIBRARY.filter((b) => LANDING_BLOCK_ALLOW.has(b.type)),
    []
  )

  const add = (type: string) => {
    const block: LandingBlock = {
      id: genId(),
      type,
      settings: defaultBlockSettings(type) as Record<string, any>,
    }
    onChange([...(sections || []), block])
  }

  const update = (i: number, next: LandingBlock) => {
    const copy = sections.slice()
    copy[i] = next
    onChange(copy)
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= sections.length) return
    const copy = sections.slice()
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    onChange(copy)
  }

  const remove = (i: number) => {
    onChange(sections.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      {(!sections || sections.length === 0) && (
        <p className="text-sm text-muted-foreground">
          No sections yet. Add content blocks below to build out the page above your form.
        </p>
      )}

      <div className="space-y-3">
        {sections?.map((section, i) => (
          <SectionCard
            key={section.id || i}
            index={i}
            total={sections.length}
            section={section}
            onChange={(next) => update(i, next)}
            onMove={(dir) => move(i, dir)}
            onRemove={() => remove(i)}
          />
        ))}
      </div>

      {/* Add menu — grouped, sourced from BLOCK_LIBRARY. */}
      <div className="rounded-lg border border-dashed border-border bg-background p-3">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Add section</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {addable.map((b) => (
            <Button
              key={b.type}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => add(b.type)}
              title={b.description}
            >
              <Plus className="w-3.5 h-3.5" />
              {b.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
