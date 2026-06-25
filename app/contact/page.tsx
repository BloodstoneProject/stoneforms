'use client'

import Link from 'next/link'
import { Mail, MessageSquare, HelpCircle } from 'lucide-react'
import { BrandShell, Reveal, Eyebrow, LIME, grotesk } from '@/components/marketing/brand'

export default function ContactPage() {
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
              <form
                className="space-y-5 rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-8"
                style={{ backgroundColor: '#131313' }}
              >
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white/80">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none"
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
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white/80">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    required
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full py-3 text-sm font-semibold text-black transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98]"
                  style={{ backgroundColor: LIME }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}
