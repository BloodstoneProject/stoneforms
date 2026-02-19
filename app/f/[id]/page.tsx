'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Loader } from 'lucide-react'

interface Form {
  id: string
  title: string
  description: string
  status: string
}

interface Field {
  id: string
  field_type: string
  label: string
  placeholder: string
  required: boolean
  options: string[] | null
}

export default function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params)
  
  const [form, setForm] = useState<Form | null>(null)
  const [fields, setFields] = useState<Field[]>([])
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchForm()
  }, [formId])

  const fetchForm = async () => {
    try {
      // Fetch form
      const formRes = await fetch(`/api/forms/${formId}`)
      const formData = await formRes.json()
      
      if (!formData.form || formData.form.status !== 'published') {
        setError('This form is not available')
        setLoading(false)
        return
      }

      setForm(formData.form)

      // Fetch fields
      const fieldsRes = await fetch(`/api/forms/${formId}/fields`)
      const fieldsData = await fieldsRes.json()
      
      if (fieldsData.fields) {
        setFields(fieldsData.fields)
      }
    } catch (err) {
      setError('Failed to load form')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit form')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError('Failed to submit form')
      setSubmitting(false)
    }
  }

  const renderField = (field: Field) => {
    const value = responses[field.id] || ''
    const onChange = (val: string) => setResponses({ ...responses, [field.id]: val })

    const baseInputClass = "w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"

    switch (field.field_type) {
      case 'short_text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        )

      case 'long_text':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={baseInputClass}
          />
        )

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        )

      case 'phone':
        return (
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        )

      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseInputClass}
          />
        )

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  required={field.required}
                  className="w-4 h-4"
                />
                <span className="text-stone-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'checkboxes':
        const selectedValues = value ? value.split(',') : []
        return (
          <div className="space-y-3">
            {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option]
                      : selectedValues.filter(v => v !== option)
                    onChange(newValues.join(','))
                  }}
                  className="w-4 h-4 rounded"
                />
                <span className="text-stone-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'dropdown':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseInputClass}
          >
            <option value="">Select an option...</option>
            {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'yes_no':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value="Yes"
                checked={value === 'Yes'}
                onChange={(e) => onChange(e.target.value)}
                required={field.required}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value="No"
                checked={value === 'No'}
                onChange={(e) => onChange(e.target.value)}
                required={field.required}
              />
              <span>No</span>
            </label>
          </div>
        )

      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating.toString())}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  value === rating.toString()
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'border-stone-300 hover:border-stone-900'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        )

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-stone-900" />
      </div>
    )
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">{error}</h1>
          <p className="text-stone-600">This form may have been deleted or is not published yet.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Thank you!</h1>
          <p className="text-stone-600 mb-6">Your response has been submitted successfully.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">{form?.title}</h1>
          {form?.description && (
            <p className="text-stone-600 mb-8">{form.description}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block mb-3">
                  <span className="text-stone-900 font-medium">
                    {field.label}
                    {field.required && <span className="text-red-600 ml-1">*</span>}
                  </span>
                </label>
                {renderField(field)}
              </div>
            ))}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 text-sm text-stone-500">
          <p>Powered by Stoneforms</p>
        </div>
      </div>
    </div>
  )
}
