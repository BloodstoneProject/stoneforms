'use client'

import { ArrowRight, AlertTriangle, Flag } from 'lucide-react'
import type { LogicRule } from '@/lib/logic'

export interface LogicMapField {
  id: string
  label: string
  type?: string
}

interface LogicMapProps {
  fields: LogicMapField[]
  rules: LogicRule[]
  // Optional ending titles keyed by ending id (for nicer edge labels).
  endingTitles?: Record<string, string>
}

// Read-only flow view of a form's questions (nodes) and its jump-logic rules
// (edges). Purely presentational — it reads the same LogicRule[] the editor
// produces and surfaces basic "unreachable field" warnings. No persistence.
export function LogicMap({ fields, rules, endingTitles = {} }: LogicMapProps) {
  const order = fields.map((f) => f.id)
  const labelOf = (id: string) => fields.find((f) => f.id === id)?.label || id

  // Build outgoing edges per field. A rule is "attached" to a source field when
  // its legacy `field` matches, or (multi-condition) when `field` is unset.
  // Multi-condition rules with no `field` are treated as global (attached to
  // every node) for reachability — conservative, avoids false "unreachable".
  const edgesFrom = (fieldId: string): { rule: LogicRule; to: string }[] => {
    return (rules || [])
      .filter((r) => {
        if (r.conditions && r.conditions.length > 0) {
          return !r.field || r.field === fieldId
        }
        return r.field === fieldId
      })
      .map((r) => ({ rule: r, to: r.jumpTo }))
  }

  // Reachability: walk from the first field, following linear next + every rule
  // jump target. Any field never visited is flagged as potentially unreachable.
  const reachable = new Set<string>()
  if (order.length > 0) {
    const stack: string[] = [order[0]]
    while (stack.length) {
      const id = stack.pop() as string
      if (id === 'end' || reachable.has(id)) continue
      reachable.add(id)
      const idx = order.indexOf(id)
      // Linear fall-through to the next field (unless a rule unconditionally
      // jumps — we can't statically know, so we keep the linear edge too).
      if (idx >= 0 && idx < order.length - 1) stack.push(order[idx + 1])
      for (const e of edgesFrom(id)) if (e.to && e.to !== 'end') stack.push(e.to)
    }
  }

  const targetLabel = (to: string, rule: LogicRule) => {
    if (to === 'end') {
      if (rule.targetEndingId && endingTitles[rule.targetEndingId]) {
        return `End → ${endingTitles[rule.targetEndingId]}`
      }
      return 'End of form'
    }
    return labelOf(to)
  }

  const condSummary = (rule: LogicRule): string => {
    if (rule.conditions && rule.conditions.length > 0) {
      const comb = (rule.combinator || 'and').toUpperCase()
      return rule.conditions
        .map((c) => `${labelOf(c.fieldId)} ${c.operator.replace(/_/g, ' ')}${c.value ? ` “${c.value}”` : ''}`)
        .join(` ${comb} `)
    }
    return `${labelOf(rule.field)} ${rule.operator.replace(/_/g, ' ')}${rule.value ? ` “${rule.value}”` : ''}`
  }

  if (fields.length === 0) {
    return <div className="card-surface p-8 text-center text-muted-foreground text-sm">No fields yet — add some to see the map.</div>
  }

  return (
    <div className="space-y-3">
      {fields.map((f, idx) => {
        const out = edgesFrom(f.id)
        const unreachable = !reachable.has(f.id)
        return (
          <div key={f.id} className="card-surface p-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 shrink-0 rounded-full bg-secondary text-foreground text-xs font-semibold flex items-center justify-center">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{f.label || 'Untitled'}</p>
                {f.type && <p className="text-xs text-muted-foreground">{f.type.replace(/_/g, ' ')}</p>}
              </div>
              {unreachable && (
                <span className="flex items-center gap-1 text-xs text-amber-600" title="No rule or linear path reaches this field">
                  <AlertTriangle className="w-3.5 h-3.5" /> unreachable
                </span>
              )}
            </div>

            {out.length > 0 && (
              <div className="mt-3 pl-10 space-y-1.5">
                {out.map((e, i) => (
                  <div key={`${e.rule.id}-${i}`} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-foreground/70">if {condSummary(e.rule)}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      {e.to === 'end' && <Flag className="w-3 h-3" />}
                      {targetLabel(e.to, e.rule)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
