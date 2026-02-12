'use client'

import { useState } from 'react'
import { Plus, Code, Play, Trash2, Check, X } from 'lucide-react'

export default function WebhooksPage() {
  const [webhooks] = useState([
    { id: '1', name: 'Send to Zapier', url: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/', events: ['form.submitted'], status: 'active' },
    { id: '2', name: 'Slack Notifications', url: 'https://hooks.slack.com/services/T00/B00/XXX', events: ['form.submitted'], status: 'active' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)

  const availableEvents = [
    { value: 'form.submitted', label: 'Form Submitted' },
    { value: 'contact.created', label: 'Contact Created' },
    { value: 'deal.won', label: 'Deal Won' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Webhooks</h1>
              <p className="text-stone-600 mt-1">Send real-time data to external services</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Webhook
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900">Your Webhooks</h2>
          </div>
          <div className="divide-y divide-stone-200">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-stone-900 mb-2">{webhook.name}</h3>
                    <code className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded">
                      {webhook.url}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border border-stone-300 rounded-lg hover:bg-stone-50">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50 text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map((event, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Add Webhook</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                <input type="text" placeholder="e.g., Send to Zapier" className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Webhook URL</label>
                <input type="url" placeholder="https://your-server.com/webhook" className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Trigger Events</label>
                <div className="space-y-2">
                  {availableEvents.map((event) => (
                    <label key={event.value} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" />
                      <span>{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-stone-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-stone-900 text-white rounded-lg">Create Webhook</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
