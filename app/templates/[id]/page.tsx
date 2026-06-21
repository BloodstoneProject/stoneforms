'use client'
import { useParams } from 'next/navigation'

import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { FORM_TEMPLATES, getTemplate } from '@/lib/form-templates'

export default function TemplateDetailPage() {
  const { id } = (useParams() as any)

  const template = getTemplate(id)

  if (!template) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Template Not Found</h1>
          <Link href="/templates" className="text-stone-600 hover:text-stone-900">
            ← Back to Templates
          </Link>
        </div>
      </div>
    )
  }

  const similar = FORM_TEMPLATES.filter(
    (t) => t.category === template.category && t.id !== template.id
  ).slice(0, 3)

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/templates" className="text-stone-600 hover:text-stone-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
                <span>{template.icon}</span>
                {template.name}
              </h1>
              <p className="text-stone-600 mt-1">{template.description}</p>
            </div>
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold"
            >
              Use This Template
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 text-sm mb-1">Form Fields</div>
              <div className="text-2xl font-bold text-blue-900">{template.fields.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 text-sm mb-1">Category</div>
              <div className="text-lg font-bold text-green-900">{template.category}</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-amber-700 text-sm mb-1">Type</div>
              <div className="text-lg font-bold text-amber-900">{template.quiz ? 'Scored quiz' : 'Standard form'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-stone-200 p-8">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Template Preview</h2>

              <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg p-8 border-2 border-dashed border-stone-300">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">{template.name}</h3>
                    <p className="text-stone-600">{template.description}</p>
                  </div>

                  {template.fields.map((field, i) => (
                    <div key={i}>
                      {field.field_type === 'statement' ? (
                        <p className="text-stone-700 font-medium">{field.label}</p>
                      ) : (
                        <>
                          <label className="block text-sm font-medium text-stone-700 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.options ? (
                            <div className="space-y-2">
                              {field.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2 text-sm text-stone-600">
                                  <span className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
                                  {opt}
                                </div>
                              ))}
                            </div>
                          ) : field.field_type === 'long_text' ? (
                            <div className="w-full h-24 bg-white border-2 border-stone-300 rounded-lg" />
                          ) : (
                            <div className="w-full h-12 bg-white border-2 border-stone-300 rounded-lg" />
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  <button className="w-full py-3 bg-stone-900 text-white rounded-lg font-semibold">
                    Submit
                  </button>
                </div>
              </div>

              {/* Quiz outcomes */}
              {template.quiz && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-stone-900 mb-3">Possible results</h3>
                  <div className="space-y-3">
                    {template.quiz.outcomes.map((o) => (
                      <div key={o.id} className="border border-stone-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-stone-900">{o.title}</h4>
                          <span className="text-xs text-stone-500">
                            {o.minScore}–{o.maxScore} pts
                          </span>
                        </div>
                        <p className="text-sm text-stone-600">{o.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="font-bold text-stone-900 mb-4">Included Features</h3>
              <ul className="space-y-3">
                {['Mobile optimized', 'Validation built in', 'Export responses', 'Analytics included'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-stone-700">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-lg p-6 text-white">
              <h3 className="font-bold text-xl mb-2">Ready to use?</h3>
              <p className="text-stone-300 mb-4 text-sm">
                Sign up free and start using this template in minutes
              </p>
              <Link
                href="/auth/signup"
                className="block w-full py-3 bg-white text-stone-900 rounded-lg text-center font-semibold hover:bg-stone-100"
              >
                Get Started Free
              </Link>
            </div>

            {/* Similar Templates */}
            {similar.length > 0 && (
              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <h3 className="font-bold text-stone-900 mb-4">Similar Templates</h3>
                <div className="space-y-3">
                  {similar.map((s) => (
                    <Link
                      key={s.id}
                      href={`/templates/${s.id}`}
                      className="block p-3 border border-stone-200 rounded-lg hover:bg-stone-50"
                    >
                      <h4 className="font-medium text-stone-900 text-sm flex items-center gap-2">
                        <span>{s.icon}</span>
                        {s.name}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">{s.fields.length} fields</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
