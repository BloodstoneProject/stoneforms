// Custom endings — Typeform-style multiple "thank you" / outcome screens. A form
// can define several endings (e.g. "qualified", "not a fit", default), and logic
// rules route to a specific one via targetEndingId. Stored on
// forms.settings.endings. Pure module: NO React. Ending copy can contain recall
// tokens (resolve with lib/recall.ts at render time).

export type Ending = {
  id: string
  title: string
  message?: string
  redirectUrl?: string
  buttonText?: string
}

// Pick the ending to show. Precedence:
//   1. The ending whose id === opts.endingId (when provided and found).
//   2. Otherwise the first ending in the list.
//   3. Otherwise null (no custom endings -> caller falls back to its default
//      thank-you screen, fully backward-compatible).
export function resolveEnding(
  endings: Ending[] | undefined,
  opts: { endingId?: string | null }
): Ending | null {
  if (!endings || endings.length === 0) return null
  const wanted = opts?.endingId
  if (wanted) {
    const found = endings.find((e) => e && e.id === wanted)
    if (found) return found
  }
  return endings[0] ?? null
}
