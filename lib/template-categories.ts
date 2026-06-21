// Template categories shared by the library and the gallery pages.
// Keeping these in one place so the marketing gallery, the dashboard
// gallery and the seed data never drift apart.

export const TEMPLATE_CATEGORIES = [
  'Lead gen & contact',
  'Surveys & feedback',
  'Quizzes & assessments',
  'Registration & application',
] as const

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]

// Short blurb per category, used as section sub-headers in the gallery.
export const CATEGORY_BLURBS: Record<TemplateCategory, string> = {
  'Lead gen & contact':
    'Capture enquiries, quotes and demo requests that flow straight into your pipeline.',
  'Surveys & feedback':
    'Measure satisfaction, NPS and product sentiment with ready-made survey flows.',
  'Quizzes & assessments':
    'Engage and qualify with scored knowledge quizzes and outcome-based assessments.',
  'Registration & application':
    'Sign people up for events, courses, jobs and waitlists in a few clean steps.',
}
