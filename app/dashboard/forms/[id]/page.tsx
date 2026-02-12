'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Eye, Settings, Send } from 'lucide-react'
import { getFormById } from '@/lib/mock-data'

export default function FormEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const form = getFormById(id)
  
  const [formTitle, setFormTitle] = useState(form?.title || '')
  const [formDescription, setFormDescription] = useState(form?.description || '')
  const [questions, setQuestions] = useState([
    { id: 'q1', type: 'email', label: 'Email Address', required: true },
    { id: 'q2', type: 'short_text', label: 'Full Name', required: true },
    { id: 'q3', type: 'long_text', label: 'Tell us about yourself', required: false },
  ])

  const questionTypes = [
    { value: 'short_text', label: 'Short Text' },
    { value: 'long_text', label: 'Long Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'rating', label: 'Rating' },
    { value: 'yes_no', label: 'Yes/No' },
    { value: 'date', label: 'Date' },
    { value: 'file_upload', label: 'File Upload' },
  ]

  if (!form) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Form Not Found</h1>
          <Link href="/dashboard/forms" className="text-stone-600 hover:text-stone-900">
            ← Back to Forms
          </Link>
        </div>
      </div>
    )
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: `q${questions.length + 1}`, type: 'short_text', label: 'New Question', required: false }
    ])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Top Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/forms" className="text-stone-600 hover:text-stone-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-stone-900">Edit Form</h1>
                <p className="text-sm text-stone-600">{form.status} · {form.responseCount} responses</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/f/${form.id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <Link
                href={`/dashboard/forms/${form.id}/settings`}
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Form Settings */}
        <div className="bg-white rounded-lg border border-stone-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Form Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="e.g. Contact Form"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="Brief description of your form"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-900">Questions</h2>
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-stone-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="cursor-move mt-2">
                    <GripVertical className="w-5 h-5 text-stone-400" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Question {index + 1}
                        </label>
                        <input
                          type="text"
                          value={question.label}
                          onChange={(e) => {
                            const updated = [...questions]
                            updated[index].label = e.target.value
                            setQuestions(updated)
                          }}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                          placeholder="Enter your question"
                        />
                      </div>
                      <div className="w-48">
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => {
                            const updated = [...questions]
                            updated[index].type = e.target.value
                            setQuestions(updated)
                          }}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                        >
                          {questionTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => {
                            const updated = [...questions]
                            updated[index].required = e.target.checked
                            setQuestions(updated)
                          }}
                          className="rounded border-stone-300"
                        />
                        Required
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-lg">
                <p className="text-stone-600 mb-4">No questions yet</p>
                <button
                  onClick={addQuestion}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Question
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href={`/dashboard/forms/${form.id}/responses`}
            className="bg-white border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-stone-900 mb-1">View Responses</h3>
            <p className="text-sm text-stone-600">{form.responseCount} submissions</p>
          </Link>
          <Link
            href={`/dashboard/forms/${form.id}/analytics`}
            className="bg-white border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-stone-900 mb-1">Analytics</h3>
            <p className="text-sm text-stone-600">{form.completionRate?.toFixed(1)}% completion rate</p>
          </Link>
          <Link
            href={`/dashboard/forms/${form.id}/share`}
            className="bg-white border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-stone-900 mb-1">Share</h3>
            <p className="text-sm text-stone-600">Get embed code & link</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
