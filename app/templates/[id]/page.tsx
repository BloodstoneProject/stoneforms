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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-4">Template Not Found</h1>
          <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                <span>{template.icon}</span>
                {template.name}
              </h1>
              <p className="text-muted-foreground mt-1">{template.description}</p>
            </div>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Use This Template
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary border border-border rounded-md p-4">
              <div className="text-muted-foreground text-sm mb-1">Form Fields</div>
              <div className="text-2xl font-semibold tracking-tight text-foreground">{template.fields.length}</div>
            </div>
            <div className="bg-secondary border border-border rounded-md p-4">
              <div className="text-muted-foreground text-sm mb-1">Category</div>
              <div className="text-lg font-semibold tracking-tight text-foreground">{template.category}</div>
            </div>
            <div className="bg-secondary border border-border rounded-md p-4">
              <div className="text-muted-foreground text-sm mb-1">Type</div>
              <div className="text-lg font-semibold tracking-tight text-foreground">{template.quiz ? 'Scored quiz' : 'Standard form'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">Template Preview</h2>

              <div className="bg-secondary rounded-lg p-8 border border-dashed border-border">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-2">{template.name}</h3>
                    <p className="text-muted-foreground">{template.description}</p>
                  </div>

                  {template.fields.map((field, i) => (
                    <div key={i}>
                      {field.field_type === 'statement' ? (
                        <p className="text-foreground font-medium">{field.label}</p>
                      ) : (
                        <>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </label>
                          {field.options ? (
                            <div className="space-y-2">
                              {field.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
                                  {opt}
                                </div>
                              ))}
                            </div>
                          ) : field.field_type === 'long_text' ? (
                            <div className="w-full h-24 bg-card border border-border rounded-md" />
                          ) : (
                            <div className="w-full h-12 bg-card border border-border rounded-md" />
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                    Submit
                  </button>
                </div>
              </div>

              {/* Quiz outcomes */}
              {template.quiz && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">Possible results</h3>
                  <div className="space-y-3">
                    {template.quiz.outcomes.map((o) => (
                      <div key={o.id} className="border border-border rounded-md p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground">{o.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {o.minScore}–{o.maxScore} pts
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{o.message}</p>
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
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold tracking-tight text-foreground mb-4">Included Features</h3>
              <ul className="space-y-3">
                {['Mobile optimized', 'Validation built in', 'Export responses', 'Analytics included'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-secondary border border-border rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-3 h-3 text-foreground" />
                    </div>
                    <span className="text-muted-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-primary text-primary-foreground rounded-lg p-6">
              <h3 className="font-semibold tracking-tight text-xl mb-2">Ready to use?</h3>
              <p className="text-primary-foreground/70 mb-4 text-sm">
                Sign up free and start using this template in minutes
              </p>
              <Link
                href="/auth/signup"
                className="block w-full py-2.5 bg-background text-foreground border border-border rounded-md text-center text-sm font-medium hover:bg-secondary transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Similar Templates */}
            {similar.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold tracking-tight text-foreground mb-4">Similar Templates</h3>
                <div className="space-y-3">
                  {similar.map((s) => (
                    <Link
                      key={s.id}
                      href={`/templates/${s.id}`}
                      className="block p-3 border border-border rounded-md hover:bg-secondary transition-colors"
                    >
                      <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
                        <span>{s.icon}</span>
                        {s.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{s.fields.length} fields</p>
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
