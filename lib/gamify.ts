// Stoneforms gamification — PURE helpers (no React, no DOM, no side effects).
// Powers the "form-as-a-game" player experience: XP math, levels, streaks, and
// milestone-crossing detection. Everything here is deterministic and unit-safe.

// XP awarded per answered question (the steady drip that makes progress feel
// rewarding). Milestone bonuses stack on top of this.
export const XP_PER_ANSWER = 10

// Bonus XP granted the first time a given progress milestone is crossed.
export const MILESTONE_BONUS = 50

// Bonus XP for reaching the finish line.
export const COMPLETION_BONUS = 100

// Progress thresholds (percent) that trigger a celebration as they're crossed.
export const MILESTONES = [25, 50, 75] as const
export type Milestone = (typeof MILESTONES)[number]

// The emoji whitelist shared with the reaction bar + submit contract. Keep this
// the single source of truth so we never send anything the route doesn't expect.
export const REACTION_EMOJIS = ['👍', '❤️', '😮', '🔥'] as const
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number]

// ---- Levels -------------------------------------------------------------
// A gentle curve: each level costs a bit more than the last. Level 1 starts at
// 0 XP. We use a quadratic-ish requirement so levels keep pace with a typical
// 5-15 question form without ever feeling unreachable.

// Total XP required to have *reached* a given level (level 1 => 0).
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level))
  if (l <= 1) return 0
  // 100, 250, 450, 700, ... (each step grows by 50 more than the previous)
  return 50 * (l - 1) * l
}

export interface LevelState {
  level: number
  // XP accumulated inside the current level.
  xpIntoLevel: number
  // XP needed to span the current level (current floor -> next floor).
  xpForThisLevel: number
  // 0..1 progress through the current level (for the journey bar fill).
  progress: number
}

// Derive the full level state from a total XP figure. Always safe for xp <= 0.
export function levelFromXp(xp: number): LevelState {
  const total = Math.max(0, Math.floor(xp || 0))
  let level = 1
  // Walk up while the next level's floor is still affordable. Bounded so a
  // runaway xp value can never spin forever.
  while (level < 999 && total >= xpForLevel(level + 1)) level++
  const floor = xpForLevel(level)
  const next = xpForLevel(level + 1)
  const span = Math.max(1, next - floor)
  const into = total - floor
  return {
    level,
    xpIntoLevel: into,
    xpForThisLevel: span,
    progress: Math.min(1, Math.max(0, into / span)),
  }
}

// ---- Milestone crossing -------------------------------------------------
// Returns the milestones in MILESTONES that lie in (prevProgress, currProgress].
// This is how the player fires a celebration exactly once per threshold: pass the
// previous progress and the new progress, then mark the returned ones as done.
export function milestonesCrossed(
  prevProgress: number,
  currProgress: number,
  alreadyCelebrated: readonly number[] = []
): Milestone[] {
  const lo = Math.min(prevProgress, currProgress)
  const hi = Math.max(prevProgress, currProgress)
  return MILESTONES.filter(
    (m) => m > lo && m <= hi && !alreadyCelebrated.includes(m)
  )
}

// Human-friendly milestone copy for the banner.
export function milestoneLabel(m: number): string {
  if (m >= 100) return 'Complete! 🎉'
  if (m === 75) return 'Almost there! 🚀'
  if (m === 50) return 'Halfway there! 🎉'
  if (m === 25) return 'Off to a great start! ✨'
  return `${m}% there!`
}

// ---- Streak -------------------------------------------------------------
// A streak counts consecutive forward answers. Going Back breaks it (resets to
// 0). These are trivial but centralised so the HUD and FormPlayer agree.
export function bumpStreak(streak: number): number {
  return Math.max(0, Math.floor(streak || 0)) + 1
}
export function resetStreak(): number {
  return 0
}

// ---- XP aggregation -----------------------------------------------------
// Compute total XP from the parts the player tracks. Kept pure so the end-reward
// screen and the HUD never disagree.
export interface XpParts {
  answered: number // count of distinct questions answered/advanced past
  milestonesHit: number // how many of the 25/50/75 milestones fired
  completed: boolean
}
export function totalXp({ answered, milestonesHit, completed }: XpParts): number {
  return (
    Math.max(0, answered) * XP_PER_ANSWER +
    Math.max(0, milestonesHit) * MILESTONE_BONUS +
    (completed ? COMPLETION_BONUS : 0)
  )
}

// A small, friendly badge label keyed off the final level. Used on the reward
// screen. Purely cosmetic.
export function badgeForLevel(level: number): string {
  if (level >= 6) return 'Legend'
  if (level >= 5) return 'Champion'
  if (level >= 4) return 'Pro'
  if (level >= 3) return 'Rising Star'
  if (level >= 2) return 'Explorer'
  return 'Rookie'
}
