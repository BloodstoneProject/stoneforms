'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { LIME, INK, grotesk } from '@/components/marketing/brand'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSaving(true)
    // The reset link establishes a recovery session, so updateUser works here.
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-6 text-white" style={{ backgroundColor: INK, ...grotesk }}>
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md text-[15px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
          <span className="text-base font-semibold tracking-tight text-white">Stoneforms</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Set a new password</h1>
          <p className="mt-2 text-white/50">Choose a new password for your account</p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
          <div className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-8" style={{ backgroundColor: '#141414' }}>
            {done ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: LIME }}>
                  <CheckCircle2 className="h-7 w-7 text-black" />
                </div>
                <p className="font-medium text-white">Password updated</p>
                <p className="mt-2 text-sm text-white/50">Taking you to your dashboard…</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={submit}>
                <div>
                  <label htmlFor="reset-password" className="mb-2 block text-sm font-medium text-white/80">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="reset-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-white placeholder:text-white/30 transition-colors focus-visible:border-[#C6F24E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E]/40"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="reset-confirm" className="mb-2 block text-sm font-medium text-white/80">Confirm new password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
                    <input
                      id="reset-confirm"
                      type="password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-white placeholder:text-white/30 transition-colors focus-visible:border-[#C6F24E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E]/40"
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-300">{error}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-black transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: LIME }}
                >
                  {saving ? 'Updating…' : 'Update password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
