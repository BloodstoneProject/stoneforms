// Bridges the database shape (form_fields rows, forms.theme JSONB) to the
// shapes the polished player components expect (Question, player theme).
// Keeps the DB normalized while letting the Typeform-style player stay simple.

import type { Question, QuestionType, Choice } from '@/types'

// A raw form_fields row as returned by the API / Supabase.
export interface DbField {
  id: string
  field_type: string
  label: string
  placeholder?: string | null
  required?: boolean | null
  options?: string[] | null
  position?: number | null
  settings?: Record<string, any> | null
}

function optionToChoice(option: string, index: number): Choice {
  return {
    id: `${index}-${option}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label: option,
    value: option,
  }
}

export function dbFieldToQuestion(field: DbField): Question {
  const settings = field.settings || {}
  return {
    id: field.id,
    type: field.field_type as QuestionType,
    label: field.label,
    description: settings.description || undefined,
    placeholder: field.placeholder || undefined,
    required: !!field.required,
    choices: field.options?.map(optionToChoice),
    validation: {
      min: settings.min,
      max: settings.max,
      pattern: settings.pattern,
      message: settings.message,
    },
    properties: settings,
    order: field.position ?? 0,
  }
}

export function dbFieldsToQuestions(fields: DbField[]): Question[] {
  return [...fields]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(dbFieldToQuestion)
}

// The player components render with a flat theme object. Map forms.theme JSONB
// (which stores colors as a nested object) into that flat shape, with safe
// fallbacks so a partially-configured theme never breaks the player.
export interface PlayerTheme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  buttonColor: string
  buttonTextColor: string
  fontFamily: string
}

const DEFAULT_THEME: PlayerTheme = {
  primaryColor: '#3B82F6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  buttonColor: '#3B82F6',
  buttonTextColor: '#FFFFFF',
  fontFamily: 'Inter',
}

export function dbThemeToPlayerTheme(theme: any): PlayerTheme {
  const colors = theme?.colors || {}
  const fonts = theme?.fonts || {}
  return {
    primaryColor: colors.primary || DEFAULT_THEME.primaryColor,
    backgroundColor: colors.background || DEFAULT_THEME.backgroundColor,
    textColor: colors.text || DEFAULT_THEME.textColor,
    buttonColor: colors.button || colors.primary || DEFAULT_THEME.buttonColor,
    buttonTextColor: colors.buttonText || DEFAULT_THEME.buttonTextColor,
    fontFamily: fonts.body || fonts.heading || DEFAULT_THEME.fontFamily,
  }
}
