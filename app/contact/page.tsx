'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, HelpCircle, Check } from 'lucide-react'
import { BrandShell, Reveal, Eyebrow, LIME, grotesk } from '@/components/marketing/brand'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      message: String(fd.get('message') || ''),
      company: String(fd.get('company') || ''), // honeypot
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <BrandShell>
      <section className="relative z-10 px-6 pt-40 pb-16 sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>Contact</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
              style={grotesk}
            >
              Get in touch.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 text-lg text-white/55">
              Have a question? We&apos;d love to hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-28 sm:px-12">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20">
                <div className="rounded-xl border border-white/5 p-6 text-center" style={{ backgroundColor: '#131313' }}>
                  <Mail className="mx-auto mb-3 h-6 w-6" strokeWidth={1.75} style={{ color: LIME }} />
                  <h3 className="text-sm font-semibold text-white" style={grotesk}>Email</h3>
                  <a
                    href="mailto:hello@bloodstone.co.uk"
                    className="mt-1 inline-block text-sm text-white/50 transition-colors hover:text-white"
                  >
                    hello@bloodstone.co.uk
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20">
                <div className="rounded-xl border border-white/5 p-6 text-center" style={{ backgroundColor: '#131313' }}>
                  <MessageSquare className="mx-auto mb-3 h-6 w-6" strokeWidth={1.75} style={{ color: LIME }} />
                  <h3 className="text-sm font-semibold text-white" style={grotesk}>Chat</h3>
                  <p className="mt-1 text-sm text-white/50">Live chat support</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20">
                <div className="rounded-xl border border-white/5 p-6 text-center" style={{ backgroundColor: '#131313' }}>
                  <HelpCircle className="mx-auto mb-3 h-6 w-6" strokeWidth={1.75} style={{ color: LIME }} />
                  <h3 className="text-sm font-semibold text-white" style={grotesk}>Help</h3>
                  <Link href="/help" className="mt-1 inline-block text-sm text-white/50 transition-colors hover:text-white">
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
              {status === 'sent' ? (
                <div
                  className="flex flex-col items-center rounded-[calc(1.75rem-0.5rem)] border border-white/5 px-6 py-16 text-center"
                  style={{ backgroundColor: '#131313' }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: LIME }}>
                    <Check className="h-6 w-6 text-black" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white" style={grotesk}>Message sent.</h3>
                  <p className="mt-2 max-w-sm text-sm text-white/55">
                    Thanks for reaching out — we&apos;ll get back to you at the email you provided.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-8"
                  style={{ backgroundColor: '#131313' }}
                >
                  {/* Honeypot — hidden from humans, catches bots. */}
                  <div className="absolute h-0 w-0 overflow-hidden" aria-hidden>
                    <label>
                      Company
                      <input name="company" type="text" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white/80">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      disabled={status === 'sending'}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-white/80">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={status === 'sending'}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white/80">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      required
                      disabled={status === 'sending'}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-sm text-red-400" role="alert">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full rounded-full py-3 text-sm font-semibold text-black transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] disabled:opacity-70"
                    style={{ backgroundColor: LIME }}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}
