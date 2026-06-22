'use client'

import { Badge } from '@/components/ui/badge'

// ============================================================================
// BlockEditor — per-type settings editor for CONTENT blocks in the builder.
//
// A content block is a form_fields row whose field_type is one of the
// CONTENT_BLOCK_TYPES (heading|text_block|image|video|embed|html|divider|
// spacer|quote|button|section). All of its presentational content lives in the
// JSONB `settings` column. This component renders the right inputs for the
// block's type and persists each change through the SAME field-settings PATCH
// flow questions already use (onUpdateSetting), which spreads existing settings
// so no keys are dropped.
//
// Settings shapes are the canonical ones from lib/blocks.ts.
// ============================================================================

interface BlockField {
  id: string
  field_type: string
  settings?: Record<string, any> | null
}

interface BlockEditorProps {
  field: BlockField
  // Merge a single key into the field's settings JSONB (spreads existing keys).
  onUpdateSetting: (field: BlockField, key: string, value: any) => void
}

// Shared input styling — matches the neutral tokens used across the builder's
// settings panels (bg-background / border-input / text-foreground, no hexes).
const inputClass =
  'w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground'
const labelClass = 'block text-xs font-medium text-muted-foreground mb-1'

function AlignPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (v: 'left' | 'center' | 'right') => void
}) {
  return (
    <div>
      <label className={labelClass}>Alignment</label>
      <div className="inline-flex rounded-md border border-input overflow-hidden">
        {(['left', 'center', 'right'] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => onChange(a)}
            className={`px-3 py-1.5 text-sm capitalize transition-colors ${
              (value || 'left') === a
                ? 'bg-secondary text-foreground'
                : 'bg-background text-muted-foreground hover:bg-secondary/60'
            }`}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function BlockEditor({ field, onUpdateSetting }: BlockEditorProps) {
  const s = field.settings || {}
  const set = (key: string, value: any) => onUpdateSetting(field, key, value)

  switch (field.field_type) {
    case 'heading':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Heading text</label>
            <input
              type="text"
              value={s.text ?? ''}
              onChange={(e) => set('text', e.target.value)}
              className={inputClass}
              placeholder="Heading"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Level</label>
              <select
                value={String(s.level ?? 2)}
                onChange={(e) => set('level', Number(e.target.value))}
                className={inputClass}
              >
                <option value="1">H1 (largest)</option>
                <option value="2">H2</option>
                <option value="3">H3 (smallest)</option>
              </select>
            </div>
            <AlignPicker value={s.align} onChange={(v) => set('align', v)} />
          </div>
        </div>
      )

    case 'text_block':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Text</label>
            <textarea
              value={s.text ?? ''}
              onChange={(e) => set('text', e.target.value)}
              rows={4}
              className={`${inputClass} resize-y`}
              placeholder="Write a paragraph. Light markdown supported: **bold**, *italic*, [link](https://…)."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Light markdown only: <code>**bold**</code>, <code>*italic*</code>,{' '}
              <code>[text](url)</code>, line breaks. Rendered safely (no raw HTML).
            </p>
          </div>
          <AlignPicker value={s.align} onChange={(v) => set('align', v)} />
        </div>
      )

    case 'image':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              value={s.url ?? ''}
              onChange={(e) => set('url', e.target.value)}
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className={labelClass}>Alt text (accessibility)</label>
            <input
              type="text"
              value={s.alt ?? ''}
              onChange={(e) => set('alt', e.target.value)}
              className={inputClass}
              placeholder="Describe the image"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Width</label>
              <select
                value={s.width ?? 'md'}
                onChange={(e) => set('width', e.target.value)}
                className={inputClass}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="full">Full width</option>
              </select>
            </div>
            <AlignPicker value={s.align ?? 'center'} onChange={(v) => set('align', v)} />
          </div>
          <div>
            <label className={labelClass}>Caption (optional)</label>
            <input
              type="text"
              value={s.caption ?? ''}
              onChange={(e) => set('caption', e.target.value)}
              className={inputClass}
              placeholder="Caption shown under the image"
            />
          </div>
        </div>
      )

    case 'video':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              type="text"
              value={s.url ?? ''}
              onChange={(e) => set('url', e.target.value)}
              className={inputClass}
              placeholder="YouTube, Vimeo or .mp4 URL"
            />
          </div>
          <div>
            <label className={labelClass}>Caption (optional)</label>
            <input
              type="text"
              value={s.caption ?? ''}
              onChange={(e) => set('caption', e.target.value)}
              className={inputClass}
              placeholder="Caption shown under the video"
            />
          </div>
        </div>
      )

    case 'embed':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Embed URL</label>
            <input
              type="text"
              value={s.url ?? ''}
              onChange={(e) => set('url', e.target.value)}
              className={inputClass}
              placeholder="https://example.com/widget"
            />
          </div>
          <div>
            <label className={labelClass}>Height (px)</label>
            <input
              type="number"
              min={100}
              value={s.height ?? 400}
              onChange={(e) => set('height', e.target.value === '' ? 400 : Number(e.target.value))}
              className="w-40 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              placeholder="400"
            />
          </div>
          <p className="text-xs text-muted-foreground">Rendered inside an iframe in the form.</p>
        </div>
      )

    case 'html':
      return (
        <div className="space-y-2">
          <label className={labelClass}>Custom HTML</label>
          <textarea
            value={s.html ?? ''}
            onChange={(e) => set('html', e.target.value)}
            rows={8}
            spellCheck={false}
            className={`${inputClass} font-mono resize-y`}
            placeholder={'<div>Your markup…</div>'}
          />
          <p className="text-xs text-muted-foreground">
            Renders sandboxed: your HTML runs inside an isolated iframe and cannot
            access the form or other respondents&apos; answers.
          </p>
        </div>
      )

    case 'divider':
      return (
        <p className="text-sm text-muted-foreground">
          A horizontal rule. No settings — it just draws a line between blocks.
        </p>
      )

    case 'spacer':
      return (
        <div>
          <label className={labelClass}>Size</label>
          <select
            value={s.size ?? 'md'}
            onChange={(e) => set('size', e.target.value)}
            className="w-40 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">Vertical empty space.</p>
        </div>
      )

    case 'quote':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Quote</label>
            <textarea
              value={s.text ?? ''}
              onChange={(e) => set('text', e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
              placeholder="The pull quote text"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Author (optional)</label>
              <input
                type="text"
                value={s.author ?? ''}
                onChange={(e) => set('author', e.target.value)}
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className={labelClass}>Role (optional)</label>
              <input
                type="text"
                value={s.role ?? ''}
                onChange={(e) => set('role', e.target.value)}
                className={inputClass}
                placeholder="CEO, Acme"
              />
            </div>
          </div>
        </div>
      )

    case 'button':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Label</label>
              <input
                type="text"
                value={s.label ?? ''}
                onChange={(e) => set('label', e.target.value)}
                className={inputClass}
                placeholder="Learn more"
              />
            </div>
            <div>
              <label className={labelClass}>Style</label>
              <select
                value={s.style ?? 'primary'}
                onChange={(e) => set('style', e.target.value)}
                className={inputClass}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Link URL</label>
            <input
              type="text"
              value={s.url ?? ''}
              onChange={(e) => set('url', e.target.value)}
              className={inputClass}
              placeholder="https://example.com"
            />
          </div>
        </div>
      )

    case 'section':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Section title (optional)</label>
            <input
              type="text"
              value={s.title ?? ''}
              onChange={(e) => set('title', e.target.value)}
              className={inputClass}
              placeholder="Section title"
            />
          </div>
          <div>
            <label className={labelClass}>Description (optional)</label>
            <textarea
              value={s.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              className={`${inputClass} resize-y`}
              placeholder="A grouping / page boundary"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Acts as a grouping or page boundary (a spread break in magazine mode).
          </p>
        </div>
      )

    default:
      return (
        <p className="text-sm text-muted-foreground">
          <Badge variant="outline" className="mr-2">
            Content
          </Badge>
          No editor for this block type.
        </p>
      )
  }
}

// A short one-line preview snippet for a content block, shown in the builder's
// collapsed block row. Reads the block's settings and returns human-readable
// text — never raw HTML.
export function blockPreview(field: BlockField): string {
  const s = field.settings || {}
  switch (field.field_type) {
    case 'heading':
      return s.text || 'Empty heading'
    case 'text_block':
      return s.text ? String(s.text).replace(/\s+/g, ' ').slice(0, 120) : 'Empty text'
    case 'image':
      return s.url ? s.url : 'No image URL yet'
    case 'video':
      return s.url ? s.url : 'No video URL yet'
    case 'embed':
      return s.url ? s.url : 'No embed URL yet'
    case 'html':
      return s.html ? 'Custom HTML (sandboxed)' : 'Empty HTML block'
    case 'divider':
      return 'Horizontal rule'
    case 'spacer':
      return `Spacer · ${s.size || 'md'}`
    case 'quote':
      return s.text ? `“${String(s.text).slice(0, 100)}”` : 'Empty quote'
    case 'button':
      return s.label ? `${s.label}${s.url ? ` → ${s.url}` : ''}` : 'Untitled button'
    case 'section':
      return s.title || s.description || 'Untitled section'
    default:
      return ''
  }
}
