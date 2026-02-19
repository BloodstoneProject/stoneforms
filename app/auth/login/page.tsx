'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

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
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-light tracking-tight text-[#0a0a0a]">Stoneforms</h1>
          </Link>
          <p className="text-[#0a0a0a]/60 mt-2 font-light">Welcome back</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-[#8e1c1c]/10 border border-[#8e1c1c]/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#8e1c1c] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#8e1c1c] font-light">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#0a0a0a]/20" />
                <span className="text-sm text-[#0a0a0a]/60 font-light">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-[#0a0a0a] hover:text-[#8e1c1c] font-light transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0a0a0a] text-[#fafaf9] rounded-full hover:bg-[#8e1c1c] font-light text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#0a0a0a]/60 font-light">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#0a0a0a] font-normal hover:text-[#8e1c1c] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-[#0a0a0a]/40 font-light">
          <p>
            By signing in, you agree to our{' '}
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
