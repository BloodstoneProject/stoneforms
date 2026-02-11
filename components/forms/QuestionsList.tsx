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
  Copy,
  Trash2
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
  multiple_choice: List,
  dropdown: ChevronDown,
  rating: Star,
  yes_no: CheckSquare,
  date: Calendar,
  file_upload: FileUp,
  video: Video,
  audio: Mic,
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
      <div className="p-4 border-b" style={{ borderColor: '#e8e4db' }}>
        <h2 className="font-semibold mb-3" style={{ color: '#142c1c' }}>
          Questions
        </h2>
        <div className="relative">
          <Button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full gap-2 text-white"
            style={{ backgroundColor: '#142c1c' }}
          >
            <Plus className="w-4 h-4" />
            Add Question
          </Button>

          {/* Add Question Dropdown */}
          {showAddMenu && (
            <div 
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto"
              style={{ borderColor: '#e8e4db' }}
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
                      className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors text-left"
                    >
                      <Icon className="w-4 h-4" style={{ color: '#3d5948' }} />
                      <span style={{ color: '#142c1c' }}>{label}</span>
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
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#f4f2ed' }}>
              <Plus className="w-8 h-8" style={{ color: '#3d5948' }} />
            </div>
            <p className="text-sm" style={{ color: '#3d5948' }}>
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
                      isSelected && 'ring-2'
                    )}
                    style={isSelected 
                      ? { borderColor: '#142c1c', backgroundColor: '#f4f2ed' }
                      : { borderColor: '#e8e4db', backgroundColor: 'white' }
                    }
                  >
                    {/* Drag Handle */}
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab">
                      <GripVertical className="w-4 h-4" style={{ color: '#3d5948' }} />
                    </div>

                    {/* Content */}
                    <div className="ml-4">
                      <div className="flex items-start gap-2 mb-1">
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#3d5948' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#142c1c' }}>
                            {question.label || 'Untitled question'}
                          </p>
                          <p className="text-xs" style={{ color: '#3d5948' }}>
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
                          className="p-1 rounded hover:bg-gray-100"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" style={{ color: '#3d5948' }} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Delete this question?')) {
                              onDeleteQuestion(question.id)
                            }
                          }}
                          className="p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Required Badge */}
                    {question.required && (
                      <div 
                        className="absolute top-2 right-2 px-1.5 py-0.5 text-xs font-medium rounded"
                        style={{ backgroundColor: '#770a19', color: '#f4f2ed' }}
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
