import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/ai/generate  { description, formType, questionCount }
// Calls Claude to generate real form questions from a natural-language description.
// Falls back gracefully (503) when no API key is configured so the client can use mock.

// The input field types the builder supports. Used both for the structured-output
// enum and for server-side coercion.
const ALLOWED_TYPES = [
  'short_text',
  'long_text',
  'email',
  'phone',
  'url',
  'number',
  'multiple_choice',
  'picture_choice',
  'checkboxes',
  'dropdown',
  'yes_no',
  'rating',
  'opinion_scale',
  'date',
] as const

type FieldType = (typeof ALLOWED_TYPES)[number]

// Only these field types carry selectable options.
const CHOICE_TYPES = new Set<FieldType>([
  'multiple_choice',
  'picture_choice',
  'checkboxes',
  'dropdown',
])

// Structured-output schema. Note the constraints that the model does NOT support
// are omitted (minLength/maxLength/minItems/etc.); the question-count target is
// expressed in the prompt instead. Every object has `additionalProperties: false`
// and a complete `required` array.
const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          type: { type: 'string', enum: ALLOWED_TYPES as unknown as string[] },
          label: { type: 'string' },
          required: { type: 'boolean' },
          choices: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                label: { type: 'string' },
                value: { type: 'string' },
              },
              required: ['label', 'value'],
            },
          },
        },
        required: ['type', 'label', 'required', 'choices'],
      },
    },
  },
  required: ['questions'],
}

function slugify(label: string): string {
  return (
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'option'
  )
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Not configured — let the client fall back to the local mock generator.
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const description = String(body.description || '').trim()
  const formType: 'form' | 'quiz' | 'survey' =
    body.formType === 'quiz' || body.formType === 'survey' ? body.formType : 'form'
  const requestedCount = Number(body.questionCount)
  const questionCount =
    Number.isFinite(requestedCount) && requestedCount > 0
      ? Math.min(Math.max(Math.round(requestedCount), 1), 30)
      : 5

  if (!description) {
    return NextResponse.json({ error: 'missing_description' }, { status: 400 })
  }

  const system = [
    'You are an expert form designer. Given a short description, design a high-quality form.',
    `Produce exactly ${questionCount} questions tailored to the description.`,
    'Choose the most appropriate field type for each question from the allowed set.',
    'Keep labels concise and natural (no trailing punctuation unless it is a question).',
    'For choice-style questions (multiple_choice, picture_choice, checkboxes, dropdown), provide sensible options in the choices array, each with a human label and a short machine-friendly value.',
    'For every NON-choice question type, return an empty choices array.',
    formType === 'quiz'
      ? 'This is a quiz: favor clear, scoreable single-answer questions (multiple_choice, dropdown, yes_no) so each has a correct option.'
      : '',
    formType === 'survey'
      ? 'This is a survey: favor rating, opinion_scale, and multiple_choice questions that capture opinions and satisfaction.'
      : '',
    'When this is a lead, contact, or registration style form, include a name question and an email question near the top.',
  ]
    .filter(Boolean)
    .join(' ')

  try {
    const client = new Anthropic()

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      system,
      messages: [
        {
          role: 'user',
          content: `Form description: ${description}\n\nForm type: ${formType}\nNumber of questions: ${questionCount}`,
        },
      ],
      output_config: {
        format: { type: 'json_schema', schema: SCHEMA },
      },
    })

    // A refusal means there is no usable content to read.
    if (response.stop_reason === 'refusal') {
      console.error('AI generate refusal:', response.stop_details)
      return NextResponse.json({ error: 'generation_failed' }, { status: 500 })
    }

    const textBlock = response.content.find((b) => b.type === 'text')
    const text = textBlock && 'text' in textBlock ? textBlock.text : ''
    const parsed = JSON.parse(text)
    const rawQuestions: any[] = Array.isArray(parsed?.questions) ? parsed.questions : []

    // Server-side normalization — do not trust the model blindly.
    const questions = rawQuestions.map((q, index) => {
      const type: FieldType = ALLOWED_TYPES.includes(q?.type) ? q.type : 'short_text'

      const normalized: {
        id: string
        type: string
        label: string
        required: boolean
        order: number
        choices?: { id: string; label: string; value: string }[]
      } = {
        id: crypto.randomUUID(),
        type,
        label: String(q?.label || '').trim() || 'Untitled question',
        required: !!q?.required,
        order: index,
      }

      if (CHOICE_TYPES.has(type)) {
        const rawChoices: any[] = Array.isArray(q?.choices) ? q.choices : []
        normalized.choices = rawChoices.map((c) => {
          const label = String(c?.label || '').trim() || 'Option'
          const value = String(c?.value || '').trim() || slugify(label)
          return { id: crypto.randomUUID(), label, value }
        })
      }

      return normalized
    })

    return NextResponse.json({ questions })
  } catch (err) {
    console.error('AI generate failed:', err)
    return NextResponse.json({ error: 'generation_failed' }, { status: 500 })
  }
}
