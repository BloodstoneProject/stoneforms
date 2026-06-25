'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { LIME, INK, grotesk } from '@/components/marketing/brand'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Show success message
      setSuccess(true)

      // If email confirmation is disabled, redirect immediately
      if (data.session) {
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center p-6 text-white" style={{ backgroundColor: INK, ...grotesk }}>
        <div className="w-full max-w-md">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
            <div className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-8 text-center" style={{ backgroundColor: '#141414' }}>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: LIME }}>
                <CheckCircle className="h-8 w-8 text-black" />
              </div>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">Account created!</h2>
              <p className="mb-6 text-white/50">
                Check your email to verify your account, or you&apos;ll be redirected to the dashboard shortly.
              </p>
              <Link
                href="/dashboard"
                className="inline-block rounded-xl px-8 py-2.5 text-sm font-semibold text-black transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98]"
                style={{ backgroundColor: LIME }}
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] text-white lg:grid lg:grid-cols-2" style={{ backgroundColor: INK, ...grotesk }}>
      {/* Left brand panel — desktop only */}
      <aside className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <Link href="/" className="relative flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md text-[15px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
          <span className="text-base font-semibold tracking-tight text-white">Stoneforms</span>
        </Link>
        <div className="relative max-w-md">
          <h2 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white">
            Build forms that <span style={{ color: LIME }}>don&apos;t suck.</span>
          </h2>
          <p className="mt-5 text-base text-white/50">Typeform-grade forms, without the Typeform tax. Spin up your first form in minutes, free.</p>
        </div>
        <p className="relative text-sm text-white/35">© 2026 Stoneforms</p>
      </aside>

      {/* Auth column */}
      <main className="flex min-h-[100dvh] items-center justify-center p-6 lg:min-h-0">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-[15px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
            <span className="text-base font-semibold tracking-tight text-white">Stoneforms</span>
          </Link>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Create your account</h1>
            <p className="mt-2 text-white/50">Free to start. No card required.</p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
            <div className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-8" style={{ backgroundColor: '#141414' }}>
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-white/80">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      autoComplete="name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-white placeholder:text-white/30 transition-colors focus-visible:border-[#C6F24E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E]/40"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-white/80">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-white placeholder:text-white/30 transition-colors focus-visible:border-[#C6F24E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E]/40"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-white/80">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-11 text-white placeholder:text-white/30 transition-colors focus-visible:border-[#C6F24E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E]/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-sm text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E]/40"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-white/40">
                    Must be at least 6 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-black transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: LIME }}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/50">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="font-semibold transition-colors hover:opacity-80" style={{ color: LIME }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-white/35">
            <p>
              By signing up, you agree to our{' '}
              <Link href="/legal/terms" className="underline transition-colors hover:text-white">Terms</Link>
              {' '}and{' '}
              <Link href="/legal/privacy" className="underline transition-colors hover:text-white">Privacy</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
