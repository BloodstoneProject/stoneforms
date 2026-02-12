'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Chrome, Github, Apple } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-stone-900">Stoneforms</h1>
          </Link>
          <p className="text-stone-600 mt-2">Welcome back! Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
          <div className="space-y-3 mb-8">
            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-stone-300 rounded-xl hover:bg-stone-50 font-medium transition-all">
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-stone-300 rounded-xl hover:bg-stone-50 font-medium transition-all">
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-stone-500">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-stone-300" />
                <span className="text-sm text-stone-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-stone-900 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Link
              href="/dashboard"
              className="block w-full py-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 font-semibold text-lg shadow-lg text-center"
            >
              Sign In
            </Link>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-stone-900 font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-stone-600">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/legal/terms" className="underline hover:text-stone-900">Terms</Link>
            {' '}and{' '}
            <Link href="/legal/privacy" className="underline hover:text-stone-900">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
