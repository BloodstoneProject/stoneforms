'use client'
import { useParams } from 'next/navigation'

import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { FORM_TEMPLATES, getTemplate } from '@/lib/form-templates'
import { BrandShell, Reveal, LimeCTA, LIME, grotesk } from '@/components/marketing/brand'

export default function TemplateDetailPage() {
  const { id } = (useParams() as any)
  const template = getTemplate(id)

  if (!template) {
    return (
      <BrandShell active="/templates">
        <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Template not found</h1>
            <Link href="/templates" className="mt-4 inline-block text-sm text-white/50 transition-colors hover:text-white">
              ← Back to templates
            </Link>
          </div>
        </div>
      </BrandShell>
    )
  }

  const similar = FORM_TEMPLATES.filter(
    (t) => t.category === template.category && t.id !== template.id
  ).slice(0, 3)

  return (
    <BrandShell active="/templates">
      <section className="relative z-10 px-4 pt-32 sm:pt-36">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All templates
            </Link>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  <span>{template.icon}</span>
                  {template.name}
                </h1>
                <p className="mt-3 max-w-xl text-white/55">{template.description}</p>
              </div>
              <LimeCTA href="/auth/signup">Use this template</LimeCTA>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: 'Form fields', value: String(template.fields.length) },
                { label: 'Category', value: template.category },
                { label: 'Type', value: template.quiz ? 'Scored quiz' : 'Standard form' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/40">{s.label}</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight" style={grotesk}>{s.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Preview */}
          <Reveal className="md:col-span-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
              <div className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-8" style={{ backgroundColor: '#131313' }}>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: LIME }}>Preview</p>
                <div className="mt-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold tracking-tight">{template.name}</h3>
                    <p className="mt-2 text-white/50">{template.description}</p>
                  </div>
                  {template.fields.map((field, i) => (
                    <div key={i}>
                      {field.field_type === 'statement' ? (
                        <p className="font-medium text-white/90">{field.label}</p>
                      ) : (
                        <>
                          <label className="mb-2 block text-sm font-medium text-white/80">
                            {field.label}
                            {field.required && <span className="ml-1" style={{ color: LIME }}>*</span>}
                          </label>
                          {field.options ? (
                            <div className="space-y-2">
                              {field.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2 text-sm text-white/55">
                                  <span className="h-4 w-4 flex-shrink-0 rounded-full border border-white/15" />
                                  {opt}
                                </div>
                              ))}
                            </div>
                          ) : field.field_type === 'long_text' ? (
                            <div className="h-24 w-full rounded-xl border border-white/10 bg-white/[0.03]" />
                          ) : (
                            <div className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03]" />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <div className="w-full rounded-full py-3 text-center text-sm font-semibold text-black" style={{ backgroundColor: LIME }}>
                    Submit
                  </div>
                </div>

                {template.quiz && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold tracking-tight">Possible results</h3>
                    <div className="mt-3 space-y-3">
                      {template.quiz.outcomes.map((o) => (
                        <div key={o.id} className="rounded-xl border border-white/10 p-4">
                          <div className="mb-1 flex items-center justify-between">
                            <h4 className="font-medium text-white/90">{o.title}</h4>
                            <span className="text-xs text-white/40">{o.minScore}–{o.maxScore} pts</span>
                          </div>
                          <p className="text-sm text-white/50">{o.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Sidebar */}
          <Reveal delay={120} className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-semibold tracking-tight">Included</h3>
              <ul className="mt-4 space-y-3">
                {['Mobile optimized', 'Validation built in', 'Export responses', 'Analytics included'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-white/60">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: LIME }}>
                      <Check className="h-3 w-3 text-black" strokeWidth={2.5} />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6" style={{ backgroundColor: 'rgba(198,242,78,0.1)' }}>
              <h3 className="text-xl font-semibold tracking-tight">Ready to use?</h3>
              <p className="mb-5 mt-2 text-sm text-white/55">Sign up free and start with this template in minutes.</p>
              <LimeCTA href="/auth/signup">Get started — free</LimeCTA>
            </div>

            {similar.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="font-semibold tracking-tight">Similar templates</h3>
                <div className="mt-4 space-y-3">
                  {similar.map((s) => (
                    <Link
                      key={s.id}
                      href={`/templates/${s.id}`}
                      className="block rounded-xl border border-white/10 p-3 transition-colors hover:border-white/20"
                    >
                      <h4 className="flex items-center gap-2 text-sm font-medium text-white/90">
                        <span>{s.icon}</span>
                        {s.name}
                      </h4>
                      <p className="mt-1 text-xs text-white/40">{s.fields.length} fields</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}
