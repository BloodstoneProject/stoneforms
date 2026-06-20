// Real, ready-to-use form templates. Used by the templates gallery (display)
// and the from-template API (creation). Field types match lib/field-types.ts.

import type { FieldType } from '@/lib/field-types'

export interface TemplateField {
  field_type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: 'Lead gen' | 'Feedback' | 'Events' | 'HR' | 'Support'
  icon: string
  fields: TemplateField[]
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'contact-us',
    name: 'Contact Us',
    description: 'A simple contact form for your website.',
    category: 'Support',
    icon: '✉️',
    fields: [
      { field_type: 'short_text', label: 'Your name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'phone', label: 'Phone number' },
      { field_type: 'long_text', label: 'How can we help?', required: true },
    ],
  },
  {
    id: 'lead-gen',
    name: 'Quote / Lead Request',
    description: 'Capture qualified leads with budget and details.',
    category: 'Lead gen',
    icon: '🎯',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Work email', required: true },
      { field_type: 'short_text', label: 'Company' },
      { field_type: 'phone', label: 'Phone number' },
      { field_type: 'dropdown', label: 'Estimated budget', required: true, options: ['Under £1k', '£1k–£5k', '£5k–£20k', '£20k+'] },
      { field_type: 'long_text', label: 'Tell us about your project' },
    ],
  },
  {
    id: 'feedback',
    name: 'Customer Feedback',
    description: 'Measure satisfaction and collect comments.',
    category: 'Feedback',
    icon: '⭐',
    fields: [
      { field_type: 'rating', label: 'How satisfied are you?', required: true },
      { field_type: 'yes_no', label: 'Would you recommend us?', required: true },
      { field_type: 'long_text', label: 'What could we do better?' },
      { field_type: 'email', label: 'Email (optional, if you want a reply)' },
    ],
  },
  {
    id: 'event-rsvp',
    name: 'Event RSVP',
    description: 'Collect RSVPs and guest details for an event.',
    category: 'Events',
    icon: '🎟️',
    fields: [
      { field_type: 'short_text', label: 'Your name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'yes_no', label: 'Will you attend?', required: true },
      { field_type: 'number', label: 'Number of guests' },
      { field_type: 'checkboxes', label: 'Dietary requirements', options: ['Vegetarian', 'Vegan', 'Gluten-free', 'No requirements'] },
    ],
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'A clean application form for open roles.',
    category: 'HR',
    icon: '💼',
    fields: [
      { field_type: 'short_text', label: 'Full name', required: true },
      { field_type: 'email', label: 'Email address', required: true },
      { field_type: 'phone', label: 'Phone number', required: true },
      { field_type: 'url', label: 'LinkedIn / portfolio' },
      { field_type: 'date', label: 'Earliest start date' },
      { field_type: 'long_text', label: 'Why are you a good fit?', required: true },
    ],
  },
  {
    id: 'nps',
    name: 'NPS Survey',
    description: 'Net Promoter Score with a follow-up reason.',
    category: 'Feedback',
    icon: '📈',
    fields: [
      { field_type: 'rating', label: 'How likely are you to recommend us?', required: true },
      { field_type: 'long_text', label: 'What’s the main reason for your score?' },
    ],
  },
]

export function getTemplate(id: string): FormTemplate | undefined {
  return FORM_TEMPLATES.find((t) => t.id === id)
}
