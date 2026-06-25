'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { LIME, INK, grotesk } from '@/components/marketing/brand'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to dashboard on success
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
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
          <p className="mt-5 text-base text-white/50">Typeform-grade forms, without the Typeform tax. Sign in and pick up where you left off.</p>
        </div>
        <p className="relative text-sm text-white/35">© 2026 Stoneforms</p>
      </aside>

      {/* Auth column */}
      <main className="flex min-h-[100dvh] items-center justify-center p-6 lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Brand mark — shown on small screens, hidden where panel carries it */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-[15px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
            <span className="text-base font-semibold tracking-tight text-white">Stoneforms</span>
          </Link>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="mt-2 text-white/50">Sign in to your account</p>
          </div>

          {/* Double-bezel card */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
            <div className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-8" style={{ backgroundColor: '#141414' }}>
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-white/80">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="login-email"
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
                  <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-white/80">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
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
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" className="rounded border-white/20 bg-white/[0.03] accent-[#C6F24E]" />
                    <span className="text-sm text-white/50">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-white/60 transition-colors hover:text-white">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-black transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: LIME }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/50">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="font-semibold transition-colors hover:opacity-80" style={{ color: LIME }}>
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-white/35">
            <p>
              By signing in, you agree to our{' '}
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
