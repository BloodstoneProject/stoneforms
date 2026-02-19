'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

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
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-[#8e1c1c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#8e1c1c]" />
            </div>
            <h2 className="text-2xl font-light text-[#0a0a0a] mb-4">Account created!</h2>
            <p className="text-[#0a0a0a]/60 font-light mb-6">
              Check your email to verify your account, or you'll be redirected to the dashboard shortly.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-[#0a0a0a] text-[#fafaf9] rounded-full hover:bg-[#8e1c1c] font-light transition-all duration-300"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-light tracking-tight text-[#0a0a0a]">Stoneforms</h1>
          </Link>
          <p className="text-[#0a0a0a]/60 mt-2 font-light">Create your free account</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-[#8e1c1c]/10 border border-[#8e1c1c]/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#8e1c1c] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#8e1c1c] font-light">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-light text-[#0a0a0a] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0a0a0a]/40 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/60 border border-[#0a0a0a]/10 rounded-2xl focus:outline-none focus:border-[#8e1c1c] transition-colors font-light"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-[#0a0a0a] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0a0a0a]/40 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/60 border border-[#0a0a0a]/10 rounded-2xl focus:outline-none focus:border-[#8e1c1c] transition-colors font-light"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-[#0a0a0a] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0a0a0a]/40 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/60 border border-[#0a0a0a]/10 rounded-2xl focus:outline-none focus:border-[#8e1c1c] transition-colors font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0a0a0a]/40 hover:text-[#0a0a0a]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-[#0a0a0a]/40 font-light">
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0a0a0a] text-[#fafaf9] rounded-full hover:bg-[#8e1c1c] font-light text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#0a0a0a]/60 font-light">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#0a0a0a] font-normal hover:text-[#8e1c1c] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-[#0a0a0a]/40 font-light">
          <p>
            By signing up, you agree to our{' '}
            <Link href="/legal/terms" className="underline hover:text-[#0a0a0a]">Terms</Link>
            {' '}and{' '}
            <Link href="/legal/privacy" className="underline hover:text-[#0a0a0a]">Privacy</Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  )
}
