'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { getSiteUrl } from '@/lib/site'

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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Forgot password?</h1>
          <p className="text-muted-foreground mt-2">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="card-surface rounded-lg p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">Check your inbox</p>
              <p className="text-muted-foreground text-sm mt-2">
                If an account exists for <strong className="text-foreground font-medium">{email}</strong>, a reset link is on its way.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={submit}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
