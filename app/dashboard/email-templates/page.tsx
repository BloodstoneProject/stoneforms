'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Mail, Eye, Edit, Trash2, Copy, Send, Sparkles } from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  type: 'notification' | 'autoresponder' | 'welcome' | 'reminder'
  content: string
  variables: string[]
  lastEdited: string
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'New Response Notification',
      subject: 'New form response received',
      type: 'notification',
      content: 'You have a new response...',
      variables: ['{{form_name}}', '{{response_count}}'],
      lastEdited: '2 hours ago'
    },
    {
      id: '2',
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}',
      type: 'welcome',
      content: 'Thank you for signing up...',
      variables: ['{{user_name}}', '{{company_name}}'],
      lastEdited: '1 day ago'
    },
    {
      id: '3',
      name: 'Auto-Response',
      subject: 'Thanks for your submission!',
      type: 'autoresponder',
      content: 'We received your form...',
      variables: ['{{form_name}}', '{{submission_date}}'],
      lastEdited: '3 days ago'
    },
  ])

  const [showEditor, setShowEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)

  const templateTypes = [
    { value: 'notification', label: 'Notification', icon: Mail, color: 'blue' },
    { value: 'autoresponder', label: 'Auto-responder', icon: Sparkles, color: 'green' },
    { value: 'welcome', label: 'Welcome', icon: Mail, color: 'purple' },
    { value: 'reminder', label: 'Reminder', icon: Mail, color: 'amber' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Email Templates</h1>
              <p className="text-stone-600 mt-1">Create and manage email notifications</p>
            </div>
            <button
              onClick={() => {
                setEditingTemplate(null)
                setShowEditor(true)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Template
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {templateTypes.map((type) => (
            <div key={type.value} className={`bg-${type.color}-50 border border-${type.color}-200 rounded-lg p-6`}>
              <div className={`text-${type.color}-700 text-sm mb-1`}>{type.label}</div>
              <div className={`text-3xl font-bold text-${type.color}-900`}>
                {templates.filter(t => t.type === type.value).length}
              </div>
            </div>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const typeInfo = templateTypes.find(t => t.value === template.type)
            return (
              <div key={template.id} className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${typeInfo?.color}-100 rounded-lg flex items-center justify-center`}>
                    {typeInfo && <typeInfo.icon className={`w-6 h-6 text-${typeInfo.color}-600`} />}
                  </div>
                  <span className={`px-3 py-1 bg-${typeInfo?.color}-100 text-${typeInfo?.color}-700 text-xs font-medium rounded`}>
                    {typeInfo?.label}
                  </span>
                </div>

                <h3 className="font-bold text-stone-900 mb-2">{template.name}</h3>
                <p className="text-sm text-stone-600 mb-4">Subject: {template.subject}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.variables.slice(0, 2).map((variable, i) => (
                    <code key={i} className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded">
                      {variable}
                    </code>
                  ))}
                  {template.variables.length > 2 && (
                    <span className="text-xs text-stone-500">+{template.variables.length - 2} more</span>
                  )}
                </div>

                <div className="text-xs text-stone-500 mb-4">
                  Edited {template.lastEdited}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTemplate(template)
                      setShowEditor(true)
                    }}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Start */}
        <div className="mt-12 bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">Email Variables</h3>
          <p className="text-stone-300 mb-6">
            Use these variables in your templates to personalize emails
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              '{{user_name}}', '{{user_email}}', '{{form_name}}',
              '{{submission_date}}', '{{response_count}}', '{{company_name}}',
              '{{form_url}}', '{{unsubscribe_url}}', '{{support_email}}'
            ].map((variable, i) => (
              <code key={i} className="bg-white/10 px-3 py-2 rounded text-sm font-mono">
                {variable}
              </code>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full my-8">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">
                {editingTemplate ? 'Edit Template' : 'New Email Template'}
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 hover:bg-stone-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Editor */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTemplate?.name}
                    placeholder="e.g., Welcome Email"
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Template Type
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg">
                    {templateTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTemplate?.subject}
                    placeholder="e.g., Welcome to {{company_name}}"
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Email Content
                  </label>
                  <textarea
                    rows={12}
                    defaultValue={editingTemplate?.content}
                    placeholder="Hi {{user_name}},&#10;&#10;Thank you for..."
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900 font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold">
                    Save Template
                  </button>
                  <button className="px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Test Email
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <div className="bg-stone-50 rounded-lg border border-stone-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-stone-600" />
                    <h3 className="font-bold text-stone-900">Preview</h3>
                  </div>

                  <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                    <div className="bg-stone-100 px-4 py-3 border-b border-stone-200">
                      <div className="text-xs text-stone-600 mb-1">Subject:</div>
                      <div className="font-semibold text-stone-900">
                        {editingTemplate?.subject || 'Email subject will appear here'}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="prose prose-sm max-w-none text-stone-700">
                        {editingTemplate?.content || 'Email content preview will appear here...'}
                      </div>
                    </div>
                    <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 text-xs text-stone-500">
                      Powered by Stoneforms
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">Available Variables</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['{{user_name}}', '{{user_email}}', '{{form_name}}', '{{submission_date}}'].map((v, i) => (
                      <code key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {v}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
