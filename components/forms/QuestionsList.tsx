'use client'

import { Question, QuestionType } from '@/types'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  GripVertical,
  Type,
  Mail,
  Hash,
  List,
  ChevronDown,
  Star,
  CheckSquare,
  Calendar,
  FileUp,
  Video,
  Mic,
  AlignLeft,
  Phone,
  Link as LinkIcon,
  ListChecks,
  BarChart3,
  MessageSquare,
  EyeOff,
  ShieldCheck,
  Calculator,
  CreditCard,
  SeparatorHorizontal,
  Copy,
  Trash2,
  Heading,
  Image as ImageIcon,
  Code2,
  Quote as QuoteIcon,
  MousePointerClick,
  Minus,
  MoveVertical,
  LayoutGrid,
  AppWindow,
  ImagePlus,
  MessageSquareQuote,
  Images,
  BadgeCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface QuestionsListProps {
  questions: Question[]
  selectedQuestionId: string | null
  onSelectQuestion: (id: string) => void
  onAddQuestion: (type: QuestionType) => void
  onDeleteQuestion: (id: string) => void
  onDuplicateQuestion: (id: string) => void
  onReorderQuestions: (questions: Question[]) => void
}

const questionTypeIcons: Record<QuestionType, any> = {
  short_text: Type,
  long_text: AlignLeft,
  email: Mail,
  number: Hash,
  phone: Phone,
  url: LinkIcon,
  multiple_choice: List,
  checkboxes: ListChecks,
  dropdown: ChevronDown,
  rating: Star,
  opinion_scale: BarChart3,
  ranking: ListChecks,
  yes_no: CheckSquare,
  date: Calendar,
  statement: MessageSquare,
  hidden: EyeOff,
  file_upload: FileUp,
  picture_choice: List,
  signature: Type,
  address: Type,
  consent: ShieldCheck,
  calculator: Calculator,
  payment: CreditCard,
  page_break: SeparatorHorizontal,
  video: Video,
  audio: Mic,
  // ---- Content blocks ----
  heading: Heading,
  text_block: AlignLeft,
  image: ImageIcon,
  embed: AppWindow,
  html: Code2,
  divider: Minus,
  spacer: MoveVertical,
  quote: QuoteIcon,
  button: MousePointerClick,
  section: LayoutGrid,
  // ---- Media & branding ----
  cover_image: ImagePlus,
  testimonial: MessageSquareQuote,
  logo_strip: Images,
  logo: BadgeCheck,
}

const questionTypes: { type: QuestionType; label: string }[] = [
  { type: 'short_text', label: 'Short Text' },
  { type: 'long_text', label: 'Long Text' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'multiple_choice', label: 'Multiple Choice' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'rating', label: 'Rating' },
  { type: 'yes_no', label: 'Yes/No' },
]

export function QuestionsList({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onReorderQuestions,
}: QuestionsListProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="heading-tight mb-3 text-foreground">
          Questions
        </h2>
        <div className="relative">
          <Button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </Button>

          {/* Add Question Dropdown */}
          {showAddMenu && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-2">
                {questionTypes.map(({ type, label }) => {
                  const Icon = questionTypeIcons[type]
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        onAddQuestion(type)
                        setShowAddMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-secondary transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-2">
        {questions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-secondary">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No questions yet. Click "Add Question" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions
              .sort((a, b) => a.order - b.order)
              .map((question, index) => {
                const Icon = questionTypeIcons[question.type]
                const isSelected = question.id === selectedQuestionId
                
                return (
                  <div
                    key={question.id}
                    onClick={() => onSelectQuestion(question.id)}
                    className={cn(
                      'group relative p-3 rounded-lg border cursor-pointer transition-all',
                      isSelected
                        ? 'border-foreground bg-secondary'
                        : 'border-border bg-card'
                    )}
                  >
                    {/* Drag Handle */}
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Content */}
                    <div className="ml-4">
                      <div className="flex items-start gap-2 mb-1">
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">
                            {question.label || 'Untitled question'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Question {index + 1} • {question.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDuplicateQuestion(question.id)
                          }}
                          className="p-1 rounded hover:bg-secondary"
                          title="Duplicate"
                          aria-label="Duplicate question"
                        >
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Delete this question?')) {
                              onDeleteQuestion(question.id)
                            }
                          }}
                          className="p-1 rounded hover:bg-secondary"
                          title="Delete"
                          aria-label="Delete question"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    </div>

                    {/* Required Badge */}
                    {question.required && (
                      <div
                        className="absolute top-2 right-2 px-1.5 py-0.5 text-xs font-medium rounded bg-secondary text-foreground"
                      >
                        Required
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
