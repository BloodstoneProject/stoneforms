'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { getSiteUrl } from '@/lib/site'
import { LIME, INK, grotesk } from '@/components/marketing/brand'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/reset-password`,
    })
    setSending(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-6 text-white" style={{ backgroundColor: INK, ...grotesk }}>
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md text-[15px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
          <span className="text-base font-semibold tracking-tight text-white">Stoneforms</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Forgot password?</h1>
          <p className="mt-2 text-white/50">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
          <div className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-8" style={{ backgroundColor: '#141414' }}>
            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: LIME }}>
                  <CheckCircle2 className="h-7 w-7 text-black" />
                </div>
                <p className="font-medium text-white">Check your inbox</p>
                <p className="mt-2 text-sm text-white/50">
                  If an account exists for <strong className="font-medium text-white">{email}</strong>, a reset link is on its way.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={submit}>
                <div>
                  <label htmlFor="forgot-email" className="mb-2 block text-sm font-medium text-white/80">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-white placeholder:text-white/30 transition-colors focus-visible:border-[#C6F24E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E]/40"
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-300">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-black transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: LIME }}
                >
                  {sending ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
