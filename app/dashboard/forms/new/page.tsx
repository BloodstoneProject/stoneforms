'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QuestionsList } from '@/components/forms/QuestionsList'
import { QuestionEditor } from '@/components/forms/QuestionEditor'
import { PropertiesPanel } from '@/components/forms/PropertiesPanel'
import { AIFormGenerator } from '@/components/forms/AIFormGenerator'
import { Question, QuestionType } from '@/types'
import { 
  Save, 
  Eye, 
  Share2,
  ArrowLeft,
  Palette
} from 'lucide-react'
import Link from 'next/link'

export default function NewFormPage() {
  const [formTitle, setFormTitle] = useState('Untitled Form')
  const [formDescription, setFormDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId)

  const handleAIGenerated = (aiQuestions: Question[]) => {
    setQuestions(aiQuestions)
    if (aiQuestions.length > 0) {
      setSelectedQuestionId(aiQuestions[0].id)
    }
  }

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      label: getDefaultLabel(type),
      description: '',
      required: false,
      order: questions.length,
    }
    setQuestions([...questions, newQuestion])
    setSelectedQuestionId(newQuestion.id)
  }

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ))
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
    if (selectedQuestionId === id) {
      setSelectedQuestionId(null)
    }
  }

  const handleDuplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id)
    if (!question) return
    
    const duplicate: Question = {
      ...question,
      id: `q_${Date.now()}`,
      order: questions.length,
    }
    setQuestions([...questions, duplicate])
  }

  const handleReorderQuestions = (reorderedQuestions: Question[]) => {
    setQuestions(reorderedQuestions)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Save to Supabase
    setTimeout(() => {
      setIsSaving(false)
      alert('Form saved successfully!')
    }, 1000)
  }

  const handlePreview = () => {
    // TODO: Open preview modal
    alert('Preview coming soon!')
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f4f2ed' }}>
      {/* Top Bar */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6" style={{ borderColor: '#e8e4db' }}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/forms">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="border-l h-6" style={{ borderColor: '#e8e4db' }}></div>
          <div>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
              style={{ color: '#142c1c' }}
            />
            <p className="text-xs" style={{ color: '#3d5948' }}>
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AIFormGenerator onFormGenerated={handleAIGenerated} />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handlePreview}
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Palette className="w-4 h-4" />
            Theme
          </Button>
          <Button
            size="sm"
            className="gap-2 text-white"
            style={{ backgroundColor: '#142c1c' }}
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            className="gap-2 text-white"
            style={{ backgroundColor: '#770a19' }}
          >
            <Share2 className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Questions List */}
        <div className="w-80 border-r bg-white overflow-y-auto" style={{ borderColor: '#e8e4db' }}>
          <QuestionsList
            questions={questions}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={setSelectedQuestionId}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onDuplicateQuestion={handleDuplicateQuestion}
            onReorderQuestions={handleReorderQuestions}
          />
        </div>

        {/* Center Panel - Question Editor */}
        <div className="flex-1 overflow-y-auto bg-white">
          <QuestionEditor
            question={selectedQuestion}
            onUpdateQuestion={handleUpdateQuestion}
          />
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 border-l bg-white overflow-y-auto" style={{ borderColor: '#e8e4db' }}>
          <PropertiesPanel
            question={selectedQuestion}
            onUpdateQuestion={handleUpdateQuestion}
          />
        </div>
      </div>
    </div>
  )
}

function getDefaultLabel(type: QuestionType): string {
  const labels: Record<QuestionType, string> = {
    short_text: 'What is your name?',
    long_text: 'Tell us more...',
    email: 'What is your email address?',
    number: 'Enter a number',
    multiple_choice: 'Choose one option',
    dropdown: 'Select an option',
    rating: 'How would you rate this?',
    yes_no: 'Yes or no?',
    date: 'Select a date',
    file_upload: 'Upload a file',
    video: 'Record a video response',
    audio: 'Record an audio response',
  }
  return labels[type]
}
