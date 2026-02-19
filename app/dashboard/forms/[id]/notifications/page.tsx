'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Save, Plus, X } from 'lucide-react'

interface NotificationSettings {
  notify_on_submission: boolean
  notification_emails: string[]
  email_subject: string
}

export default function NotificationSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params)
  
  const [settings, setSettings] = useState<NotificationSettings>({
    notify_on_submission: true,
    notification_emails: [],
    email_subject: 'New form submission'
  })
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [formId])

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}/notifications`)
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch(`/api/forms/${formId}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      alert('Notification settings saved!')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const addEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      alert('Please enter a valid email')
      return
    }
    if (settings.notification_emails.includes(newEmail)) {
      alert('Email already added')
      return
    }
    setSettings({
      ...settings,
      notification_emails: [...settings.notification_emails, newEmail]
    })
    setNewEmail('')
  }

  const removeEmail = (email: string) => {
    setSettings({
      ...settings,
      notification_emails: settings.notification_emails.filter(e => e !== email)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/forms/${formId}`} className="text-stone-600 hover:text-stone-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-stone-900">Email Notifications</h1>
                <p className="text-stone-600 mt-1">Get notified when someone submits this form</p>
              </div>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-stone-200 p-8 space-y-8">
          {/* Enable/Disable */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_submission}
                onChange={(e) => setSettings({ ...settings, notify_on_submission: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <div>
                <span className="font-medium text-stone-900">Send email notifications</span>
                <p className="text-sm text-stone-600">Receive an email whenever someone submits this form</p>
              </div>
            </label>
          </div>

          {settings.notify_on_submission && (
            <>
              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={settings.email_subject}
                  onChange={(e) => setSettings({ ...settings, email_subject: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg"
                  placeholder="New form submission"
                />
              </div>

              {/* Notification Emails */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Send notifications to
                </label>
                
                {/* Email List */}
                <div className="space-y-2 mb-4">
                  {settings.notification_emails.map((email) => (
                    <div key={email} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <span className="text-stone-900">{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {settings.notification_emails.length === 0 && (
                    <p className="text-stone-600 text-sm">No notification emails added yet</p>
                  )}
                </div>

                {/* Add Email */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                    placeholder="email@example.com"
                    className="flex-1 px-4 py-3 border border-stone-300 rounded-lg"
                  />
                  <button
                    onClick={addEmail}
                    className="flex items-center gap-2 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <p className="text-sm text-stone-600 mt-2">
                  Add multiple email addresses to notify different people
                </p>
              </div>

              {/* Preview */}
              <div className="pt-6 border-t border-stone-200">
                <h3 className="font-medium text-stone-900 mb-4">Email Preview</h3>
                <div className="border border-stone-200 rounded-lg p-6 bg-stone-50">
                  <div className="text-sm text-stone-600 mb-2">Subject:</div>
                  <div className="font-medium text-stone-900 mb-4">{settings.email_subject}</div>
                  
                  <div className="bg-white p-4 rounded border border-stone-200">
                    <p className="text-stone-900">New Form Submission</p>
                    <p className="text-sm text-stone-600 mt-2">You have a new response to [Form Name]</p>
                    <div className="mt-4 text-sm">
                      <strong>Response Details</strong>
                      <p className="text-stone-600 mt-1">All form field answers will appear here...</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
