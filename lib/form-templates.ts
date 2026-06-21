// Real, ready-to-use form templates. Used by the templates gallery (display)
// and the from-template API (creation). Field types match lib/field-types.ts.
//
// IMPORTANT: the /api/forms/from-template route currently persists only the
// fields below (field_type, label, placeholder, required, options) plus the
// form title/description. It does NOT yet persist per-field `settings` or
// form-level `settings.quiz`. The optional `quiz` block on a template is
// therefore display/seed metadata only — quiz templates are built from
// standard fields so they render and submit perfectly today. Once the route
// is taught to forward `settings`, the scoring data here can be wired through
// without changing any template definitions.

import type { FieldType } from '@/lib/field-types'
import type { TemplateCategory } from '@/lib/template-categories'

export interface TemplateField {
  field_type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  // Display/seed-only. Choice fields map option label -> points; numeric
  // fields use { weight }. Not yet persisted by the from-template route.
  scoring?: Record<string, number> | { weight: number }
}

export interface TemplateQuizOutcome {
  id: string
  minScore: number
  maxScore: number
  title: string
  message: string
}

export interface TemplateQuizConfig {
  enabled: true
  showResults: boolean
  outcomes: TemplateQuizOutcome[]
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  icon: string
  fields: TemplateField[]
  // Display/seed-only quiz configuration (see file header note).
  quiz?: TemplateQuizConfig
}

export const FORM_TEMPLATES: FormTemplate[] = [
  // ───────────────────────────── Lead gen & contact ─────────────────────────
  {
    id: 'contact-us',
    name: 'Contact Us',
    description: 'A clean general-purpose contact form for your website.',
    category: 'Lead gen & contact',
    icon: '✉️',
    fields: [
      { field_type: 'short_text', label: 'Your name', placeholder: 'Jane Smith', required: true },
      { field_type: 'email', label: 'Email address', placeholder: 'you@company.com', required: true },
      { field_type: 'phone', label: 'Phone number', placeholder: '+44 7700 900000' },
      { field_type: 'dropdown', label: 'What is this about?', options: ['Sales', 'Support', 'Partnership', 'Something else'] },
      { field_type: 'long_text', label: 'How can we help?', placeholder: 'Tell us a little more…', required: true },
    ],
  },
  {
    id: 'quote-request',
    name: 'Quote / Estimate Request',
    description: 'Capture qualified leads with budget, timeline and scope.',
    category: 'Lead gen & contact',
    icon: '🧾',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Work email', placeholder: 'you@company.com', required: true },
      { field_type: 'short_text', label: 'Company' },
      { field_type: 'phone', label: 'Phone number' },
      { field_type: 'dropdown', label: 'Service required', required: true, options: ['Design', 'Development', 'Marketing', 'Consulting', 'Other'] },
      { field_type: 'dropdown', label: 'Estimated budget', required: true, options: ['Under £1k', '£1k–£5k', '£5k–£20k', '£20k+'] },
      { field_type: 'dropdown', label: 'Ideal timeline', options: ['ASAP', 'Within a month', '1–3 months', 'Just exploring'] },
      { field_type: 'long_text', label: 'Tell us about your project' },
    ],
  },
  {
    id: 'demo-booking',
    name: 'Book a Demo',
    description: 'Let prospects request a product demo with the right context.',
    category: 'Lead gen & contact',
    icon: '🖥️',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Work email', placeholder: 'you@company.com', required: true },
      { field_type: 'short_text', label: 'Company', required: true },
      { field_type: 'dropdown', label: 'Company size', options: ['1–10', '11–50', '51–200', '201–1000', '1000+'] },
      { field_type: 'dropdown', label: 'Your role', options: ['Founder / C-level', 'Manager', 'Individual contributor', 'Other'] },
      { field_type: 'date', label: 'Preferred date' },
      { field_type: 'long_text', label: 'What would you like to see?' },
    ],
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    description: 'A frictionless email capture with optional interests.',
    category: 'Lead gen & contact',
    icon: '📧',
    fields: [
      { field_type: 'email', label: 'Email address', placeholder: 'you@email.com', required: true },
      { field_type: 'short_text', label: 'First name' },
      { field_type: 'checkboxes', label: 'What are you interested in?', options: ['Product updates', 'Industry tips', 'Events', 'Offers'] },
    ],
  },
  {
    id: 'get-a-callback',
    name: 'Request a Callback',
    description: 'Let visitors ask for a call at a time that suits them.',
    category: 'Lead gen & contact',
    icon: '📞',
    fields: [
      { field_type: 'short_text', label: 'Your name', required: true },
      { field_type: 'phone', label: 'Phone number', placeholder: '+44 7700 900000', required: true },
      { field_type: 'dropdown', label: 'Best time to call', required: true, options: ['Morning', 'Afternoon', 'Evening'] },
      { field_type: 'short_text', label: 'What is it regarding?' },
    ],
  },
  {
    id: 'service-enquiry',
    name: 'Service Enquiry',
    description: 'A versatile enquiry form for service businesses.',
    category: 'Lead gen & contact',
    icon: '🛠️',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'phone', label: 'Phone number' },
      { field_type: 'multiple_choice', label: 'Which service do you need?', required: true, options: ['New project', 'Maintenance / support', 'Quote only', 'General question'] },
      { field_type: 'address', label: 'Your address (if relevant)' },
      { field_type: 'long_text', label: 'Describe what you need' },
    ],
  },

  // ───────────────────────────── Surveys & feedback ─────────────────────────
  {
    id: 'nps-survey',
    name: 'NPS Survey',
    description: 'Net Promoter Score with a follow-up reason.',
    category: 'Surveys & feedback',
    icon: '📈',
    fields: [
      { field_type: 'opinion_scale', label: 'How likely are you to recommend us to a friend or colleague?', required: true },
      { field_type: 'long_text', label: "What's the main reason for your score?" },
      { field_type: 'email', label: 'Email (optional, if you’d like a reply)' },
    ],
  },
  {
    id: 'csat-survey',
    name: 'CSAT Survey',
    description: 'Customer satisfaction score after an interaction.',
    category: 'Surveys & feedback',
    icon: '😊',
    fields: [
      { field_type: 'rating', label: 'How satisfied were you with your experience?', required: true },
      { field_type: 'multiple_choice', label: 'How easy was it to get what you needed?', options: ['Very easy', 'Easy', 'Neutral', 'Difficult', 'Very difficult'] },
      { field_type: 'long_text', label: 'Anything we could improve?' },
    ],
  },
  {
    id: 'product-feedback',
    name: 'Product Feedback',
    description: 'Understand what users love and what to fix next.',
    category: 'Surveys & feedback',
    icon: '🧪',
    fields: [
      { field_type: 'rating', label: 'Overall, how would you rate the product?', required: true },
      { field_type: 'multiple_choice', label: 'How often do you use it?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
      { field_type: 'long_text', label: 'What is the most valuable thing for you?' },
      { field_type: 'long_text', label: "What's missing or frustrating?" },
      { field_type: 'yes_no', label: 'Can we contact you about your feedback?' },
    ],
  },
  {
    id: 'event-feedback',
    name: 'Event Feedback',
    description: 'Gather attendee impressions after an event.',
    category: 'Surveys & feedback',
    icon: '🎤',
    fields: [
      { field_type: 'rating', label: 'How would you rate the event overall?', required: true },
      { field_type: 'opinion_scale', label: 'How likely are you to attend again?', required: true },
      { field_type: 'checkboxes', label: 'What did you enjoy most?', options: ['Speakers', 'Networking', 'Venue', 'Catering', 'Content'] },
      { field_type: 'long_text', label: 'What would have made it better?' },
    ],
  },
  {
    id: 'market-research',
    name: 'Market Research',
    description: 'Validate an idea and learn about your audience.',
    category: 'Surveys & feedback',
    icon: '🔍',
    fields: [
      { field_type: 'dropdown', label: 'Which best describes you?', required: true, options: ['Individual / consumer', 'Small business', 'Mid-market', 'Enterprise'] },
      { field_type: 'multiple_choice', label: 'How do you currently solve this problem?', options: ['A competitor product', 'A manual workaround', 'I don’t solve it yet', 'Other'] },
      { field_type: 'opinion_scale', label: 'How painful is this problem for you?', required: true },
      { field_type: 'ranking', label: 'Rank these features by importance', options: ['Price', 'Ease of use', 'Integrations', 'Support', 'Speed'] },
      { field_type: 'long_text', label: 'Anything else we should know?' },
    ],
  },
  {
    id: 'post-purchase-survey',
    name: 'Post-Purchase Survey',
    description: 'Capture sentiment right after a purchase.',
    category: 'Surveys & feedback',
    icon: '🛍️',
    fields: [
      { field_type: 'rating', label: 'How happy are you with your purchase?', required: true },
      { field_type: 'multiple_choice', label: 'How did you hear about us?', options: ['Search', 'Social media', 'Friend / referral', 'Advert', 'Other'] },
      { field_type: 'opinion_scale', label: 'How likely are you to buy again?', required: true },
      { field_type: 'long_text', label: 'Any comments on your order or delivery?' },
    ],
  },

  // ─────────────────────────── Quizzes & assessments ───────────────────────
  {
    id: 'knowledge-quiz',
    name: 'Knowledge Quiz',
    description: 'A scored quiz that grades answers and shows a result.',
    category: 'Quizzes & assessments',
    icon: '🧠',
    fields: [
      { field_type: 'statement', label: 'Test your knowledge — 5 quick questions. Good luck!' },
      { field_type: 'multiple_choice', label: 'What does HTML stand for?', required: true, options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Mode Language'], scoring: { 'Hyper Text Markup Language': 1, 'High Tech Modern Language': 0, 'Hyperlink Text Mode Language': 0 } },
      { field_type: 'multiple_choice', label: 'Which planet is known as the Red Planet?', required: true, options: ['Venus', 'Mars', 'Jupiter'], scoring: { Venus: 0, Mars: 1, Jupiter: 0 } },
      { field_type: 'yes_no', label: 'True or false: water boils at 100°C at sea level.', required: true, scoring: { true: 1, false: 0 } },
      { field_type: 'dropdown', label: 'How many continents are there?', required: true, options: ['5', '6', '7', '8'], scoring: { '5': 0, '6': 0, '7': 1, '8': 0 } },
      { field_type: 'multiple_choice', label: 'Who wrote "Romeo and Juliet"?', required: true, options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen'], scoring: { 'Charles Dickens': 0, 'William Shakespeare': 1, 'Jane Austen': 0 } },
    ],
    quiz: {
      enabled: true,
      showResults: true,
      outcomes: [
        { id: 'low', minScore: 0, maxScore: 2, title: 'Keep learning!', message: 'You got a few right — there’s room to grow. Try again!' },
        { id: 'mid', minScore: 3, maxScore: 4, title: 'Nicely done!', message: 'A solid score. You clearly know your stuff.' },
        { id: 'high', minScore: 5, maxScore: 5, title: 'Genius!', message: 'A perfect score. Impressive!' },
      ],
    },
  },
  {
    id: 'personality-quiz',
    name: 'Personality / Outcome Quiz',
    description: 'Map answers to a personality-style outcome (great for engagement).',
    category: 'Quizzes & assessments',
    icon: '🪄',
    fields: [
      { field_type: 'statement', label: 'What kind of founder are you? Answer 4 questions to find out.' },
      { field_type: 'multiple_choice', label: 'Your ideal workday is…', required: true, options: ['Shipping fast and breaking things', 'Planning carefully', 'Talking to customers all day'], scoring: { 'Shipping fast and breaking things': 2, 'Planning carefully': 1, 'Talking to customers all day': 0 } },
      { field_type: 'multiple_choice', label: 'A new opportunity appears. You…', required: true, options: ['Jump in immediately', 'Make a spreadsheet', 'Ask your network first'], scoring: { 'Jump in immediately': 2, 'Make a spreadsheet': 1, 'Ask your network first': 0 } },
      { field_type: 'multiple_choice', label: 'Your biggest strength is…', required: true, options: ['Speed', 'Strategy', 'Relationships'], scoring: { Speed: 2, Strategy: 1, Relationships: 0 } },
      { field_type: 'multiple_choice', label: 'When things go wrong you…', required: true, options: ['Pivot fast', 'Analyse the data', 'Rally the team'], scoring: { 'Pivot fast': 2, 'Analyse the data': 1, 'Rally the team': 0 } },
    ],
    quiz: {
      enabled: true,
      showResults: true,
      outcomes: [
        { id: 'connector', minScore: 0, maxScore: 2, title: 'The Connector', message: 'You build through people and relationships. Your network is your superpower.' },
        { id: 'strategist', minScore: 3, maxScore: 5, title: 'The Strategist', message: 'You win by thinking ahead and making deliberate moves.' },
        { id: 'hustler', minScore: 6, maxScore: 8, title: 'The Hustler', message: 'You move fast, ship constantly and learn by doing.' },
      ],
    },
  },
  {
    id: 'lead-scoring-quiz',
    name: 'Lead-Scoring Quiz',
    description: 'Qualify leads by scoring fit, then capture their details.',
    category: 'Quizzes & assessments',
    icon: '🎯',
    fields: [
      { field_type: 'statement', label: 'See if we’re a fit — 4 quick questions, then we’ll be in touch.' },
      { field_type: 'dropdown', label: 'Company size', required: true, options: ['Just me', '2–10', '11–50', '51–200', '200+'], scoring: { 'Just me': 0, '2–10': 1, '11–50': 2, '51–200': 3, '200+': 3 } },
      { field_type: 'dropdown', label: 'Monthly budget for this', required: true, options: ['< £500', '£500–£2k', '£2k–£10k', '£10k+'], scoring: { '< £500': 0, '£500–£2k': 1, '£2k–£10k': 2, '£10k+': 3 } },
      { field_type: 'multiple_choice', label: 'When are you looking to start?', required: true, options: ['This week', 'This month', 'This quarter', 'Just researching'], scoring: { 'This week': 3, 'This month': 2, 'This quarter': 1, 'Just researching': 0 } },
      { field_type: 'yes_no', label: 'Are you the decision maker?', required: true, scoring: { true: 2, false: 0 } },
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Work email', required: true },
    ],
    quiz: {
      enabled: true,
      showResults: true,
      outcomes: [
        { id: 'nurture', minScore: 0, maxScore: 4, title: 'Thanks!', message: 'We’ll send over some resources to help you decide.' },
        { id: 'warm', minScore: 5, maxScore: 8, title: 'Let’s talk soon', message: 'You look like a great fit — we’ll reach out to book a call.' },
        { id: 'hot', minScore: 9, maxScore: 11, title: 'Priority lead', message: 'Perfect fit. Our team will contact you within one business day.' },
      ],
    },
  },
  {
    id: 'readiness-assessment',
    name: 'Readiness Assessment',
    description: 'Score how ready someone is and recommend next steps.',
    category: 'Quizzes & assessments',
    icon: '🚦',
    fields: [
      { field_type: 'statement', label: 'How ready are you? Answer honestly for the best result.' },
      { field_type: 'opinion_scale', label: 'How clear are your goals?', required: true, scoring: { weight: 1 } },
      { field_type: 'opinion_scale', label: 'How strong is your current process?', required: true, scoring: { weight: 1 } },
      { field_type: 'opinion_scale', label: 'How confident is your team?', required: true, scoring: { weight: 1 } },
      { field_type: 'yes_no', label: 'Do you have budget approved?', required: true, scoring: { true: 5, false: 0 } },
      { field_type: 'email', label: 'Email to send your results' },
    ],
    quiz: {
      enabled: true,
      showResults: true,
      outcomes: [
        { id: 'early', minScore: 0, maxScore: 10, title: 'Getting started', message: 'You’re early in the journey — focus on clarity and quick wins first.' },
        { id: 'building', minScore: 11, maxScore: 25, title: 'Building momentum', message: 'You have good foundations. A clear plan will take you far.' },
        { id: 'ready', minScore: 26, maxScore: 40, title: 'Ready to scale', message: 'You’re in great shape — it’s time to move fast.' },
      ],
    },
  },

  // ───────────────────────── Registration & application ────────────────────
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Collect attendee details and preferences for an event.',
    category: 'Registration & application',
    icon: '🎟️',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'phone', label: 'Phone number' },
      { field_type: 'short_text', label: 'Company / organisation' },
      { field_type: 'dropdown', label: 'Ticket type', required: true, options: ['General', 'VIP', 'Student', 'Press'] },
      { field_type: 'number', label: 'Number of guests' },
      { field_type: 'checkboxes', label: 'Dietary requirements', options: ['Vegetarian', 'Vegan', 'Gluten-free', 'No requirements'] },
    ],
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'A clean application form for open roles.',
    category: 'Registration & application',
    icon: '💼',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'phone', label: 'Phone number', required: true },
      { field_type: 'short_text', label: 'Role you’re applying for', required: true },
      { field_type: 'url', label: 'LinkedIn / portfolio' },
      { field_type: 'date', label: 'Earliest start date' },
      { field_type: 'file_upload', label: 'Upload your CV / resume', required: true },
      { field_type: 'long_text', label: 'Why are you a good fit?', required: true },
    ],
  },
  {
    id: 'webinar-signup',
    name: 'Course / Webinar Signup',
    description: 'Register people for a course or live webinar.',
    category: 'Registration & application',
    icon: '🎓',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'dropdown', label: 'Which session?', required: true, options: ['Morning session', 'Afternoon session', 'On-demand recording'] },
      { field_type: 'multiple_choice', label: 'Experience level', options: ['Beginner', 'Intermediate', 'Advanced'] },
      { field_type: 'long_text', label: 'Anything you’re hoping to learn?' },
    ],
  },
  {
    id: 'waitlist',
    name: 'Product Waitlist',
    description: 'Build hype and capture early demand before launch.',
    category: 'Registration & application',
    icon: '⏳',
    fields: [
      { field_type: 'statement', label: 'Join the waitlist and be first to know when we launch.' },
      { field_type: 'email', label: 'Email address', placeholder: 'you@email.com', required: true },
      { field_type: 'short_text', label: 'First name' },
      { field_type: 'multiple_choice', label: 'How excited are you?', options: ['Mildly curious', 'Pretty keen', 'Take my money already'] },
    ],
  },
  {
    id: 'membership-application',
    name: 'Membership Application',
    description: 'Vet and onboard new members for a club or community.',
    category: 'Registration & application',
    icon: '🪪',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'phone', label: 'Phone number' },
      { field_type: 'address', label: 'Address' },
      { field_type: 'dropdown', label: 'Membership tier', required: true, options: ['Standard', 'Premium', 'Lifetime'] },
      { field_type: 'multiple_choice', label: 'How did you hear about us?', options: ['A current member', 'Online search', 'Social media', 'Event'] },
      { field_type: 'long_text', label: 'Why would you like to join?', required: true },
    ],
  },
]

export function getTemplate(id: string): FormTemplate | undefined {
  return FORM_TEMPLATES.find((t) => t.id === id)
}
