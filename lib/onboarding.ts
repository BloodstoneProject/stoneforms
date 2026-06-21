// Lightweight helpers for the first-run onboarding flow.
//
// Onboarding state lives entirely in Supabase auth user_metadata so it needs
// no schema migration. The single source of truth is the boolean
// `user_metadata.onboarded` (consumed by middleware.ts to gate /dashboard).

export type UseCase = 'lead_gen' | 'surveys' | 'quizzes' | 'contact_forms'

export interface OnboardingMetadata {
  onboarded?: boolean
  use_case?: UseCase
}

export const USE_CASES: {
  id: UseCase
  label: string
  description: string
  starterTitle: string
}[] = [
  {
    id: 'lead_gen',
    label: 'Lead generation',
    description: 'Capture leads and grow your pipeline.',
    starterTitle: 'Lead capture form',
  },
  {
    id: 'surveys',
    label: 'Surveys',
    description: 'Collect feedback and understand your audience.',
    starterTitle: 'Customer survey',
  },
  {
    id: 'quizzes',
    label: 'Quizzes',
    description: 'Build interactive, scored quizzes.',
    starterTitle: 'Untitled quiz',
  },
  {
    id: 'contact_forms',
    label: 'Contact forms',
    description: 'Let people get in touch with you.',
    starterTitle: 'Contact form',
  },
]

/** True once the user has finished (or skipped) onboarding. */
export function isOnboarded(metadata: OnboardingMetadata | undefined | null): boolean {
  return metadata?.onboarded === true
}

/** Resolve a sensible starter form title from the chosen use case. */
export function starterTitleFor(useCase: UseCase | null | undefined): string {
  const match = USE_CASES.find((u) => u.id === useCase)
  return match?.starterTitle || 'Untitled Form'
}
