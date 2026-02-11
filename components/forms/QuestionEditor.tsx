'use client'

import { Question } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

interface QuestionEditorProps {
  question?: Question
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void
}

export function QuestionEditor({ question, onUpdateQuestion }: QuestionEditorProps) {
  if (!question) {
    return (
      <div className="h-full flex items-center justify-center p-12 text-center">
        <div>
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: '#f4f2ed' }}
          >
            <svg className="w-12 h-12" style={{ color: '#3d5948' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#142c1c' }}>
            No Question Selected
          </h3>
          <p style={{ color: '#3d5948' }}>
            Select a question from the left panel to edit it,
            <br />
            or add a new question to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-12 max-w-3xl mx-auto">
      {/* Preview Card - Shows how it will look to respondents */}
      <div 
        className="rounded-xl p-8 mb-8 shadow-lg"
        style={{ backgroundColor: '#f4f2ed' }}
      >
        <div className="mb-6">
          <Input
            value={question.label}
            onChange={(e) => onUpdateQuestion(question.id, { label: e.target.value })}
            className="text-2xl font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0 placeholder:opacity-50"
            style={{ color: '#142c1c' }}
            placeholder="Type your question here..."
          />
        </div>

        {question.description && (
          <p className="mb-6" style={{ color: '#3d5948' }}>
            {question.description}
          </p>
        )}

        {/* Question Type Specific Preview */}
        <QuestionTypePreview question={question} onUpdateQuestion={onUpdateQuestion} />
      </div>

      {/* Editing Hints */}
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#142c1c' }}>
            <span className="text-xs font-bold text-white">?</span>
          </div>
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#142c1c' }}>
              How to use the question editor
            </p>
            <p className="text-sm" style={{ color: '#3d5948' }}>
              Click on the question text to edit. Use the properties panel on the right to configure validation, 
              make it required, or add logic.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestionTypePreview({ 
  question, 
  onUpdateQuestion 
}: { 
  question: Question
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void
}) {
  const [choices, setChoices] = useState(question.choices || [
    { id: '1', label: 'Option 1', value: 'option_1' },
    { id: '2', label: 'Option 2', value: 'option_2' },
  ])

  const handleAddChoice = () => {
    const newChoice = {
      id: Date.now().toString(),
      label: `Option ${choices.length + 1}`,
      value: `option_${choices.length + 1}`,
    }
    const newChoices = [...choices, newChoice]
    setChoices(newChoices)
    onUpdateQuestion(question.id, { choices: newChoices })
  }

  const handleUpdateChoice = (id: string, label: string) => {
    const newChoices = choices.map(c => 
      c.id === id ? { ...c, label, value: label.toLowerCase().replace(/\s+/g, '_') } : c
    )
    setChoices(newChoices)
    onUpdateQuestion(question.id, { choices: newChoices })
  }

  const handleDeleteChoice = (id: string) => {
    const newChoices = choices.filter(c => c.id !== id)
    setChoices(newChoices)
    onUpdateQuestion(question.id, { choices: newChoices })
  }

  switch (question.type) {
    case 'short_text':
      return (
        <Input
          placeholder="Your answer here..."
          disabled
          style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
        />
      )

    case 'long_text':
      return (
        <textarea
          placeholder="Your detailed answer here..."
          disabled
          rows={4}
          className="w-full rounded-md border p-3 text-sm"
          style={{ backgroundColor: 'white', borderColor: '#e8e4db', color: '#3d5948' }}
        />
      )

    case 'email':
      return (
        <Input
          type="email"
          placeholder="name@example.com"
          disabled
          style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
        />
      )

    case 'number':
      return (
        <Input
          type="number"
          placeholder="Enter a number..."
          disabled
          style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
        />
      )

    case 'multiple_choice':
      return (
        <div className="space-y-3">
          {choices.map((choice) => (
            <div key={choice.id} className="flex items-center gap-3 group">
              <div className="w-5 h-5 rounded-full border-2 flex-shrink-0" style={{ borderColor: '#142c1c' }}></div>
              <Input
                value={choice.label}
                onChange={(e) => handleUpdateChoice(choice.id, e.target.value)}
                className="flex-1"
                style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
                placeholder="Option text..."
              />
              {choices.length > 2 && (
                <button
                  onClick={() => handleDeleteChoice(choice.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddChoice}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Choice
          </Button>
        </div>
      )

    case 'dropdown':
      return (
        <select 
          disabled 
          className="w-full rounded-md border p-3 text-sm"
          style={{ backgroundColor: 'white', borderColor: '#e8e4db', color: '#3d5948' }}
        >
          <option>Select an option...</option>
          {choices.map((choice) => (
            <option key={choice.id}>{choice.label}</option>
          ))}
        </select>
      )

    case 'rating':
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled
              className="w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl"
              style={{ borderColor: '#e8e4db', color: '#3d5948' }}
            >
              ⭐
            </button>
          ))}
        </div>
      )

    case 'yes_no':
      return (
        <div className="flex gap-4">
          <button
            disabled
            className="flex-1 py-4 px-6 rounded-lg border-2 font-medium"
            style={{ borderColor: '#142c1c', color: '#142c1c' }}
          >
            Yes
          </button>
          <button
            disabled
            className="flex-1 py-4 px-6 rounded-lg border-2 font-medium"
            style={{ borderColor: '#e8e4db', color: '#3d5948' }}
          >
            No
          </button>
        </div>
      )

    case 'date':
      return (
        <Input
          type="date"
          disabled
          style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
        />
      )

    case 'file_upload':
      return (
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center"
          style={{ borderColor: '#e8e4db' }}
        >
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#f4f2ed' }}>
            <svg className="w-6 h-6" style={{ color: '#3d5948' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: '#142c1c' }}>
            Click to upload or drag and drop
          </p>
          <p className="text-xs mt-1" style={{ color: '#3d5948' }}>
            Max file size: 10MB
          </p>
        </div>
      )

    default:
      return (
        <Input
          placeholder="Answer preview..."
          disabled
          style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
        />
      )
  }
}
