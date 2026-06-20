'use client'

import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function AccountSettingsPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || '')
        setFullName(data.user.user_metadata?.full_name || '')
      }
      setLoading(false)
    })
  }, [supabase])

  const saveProfile = async () => {
    setSavingProfile(true)
    setProfileMsg(null)
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
    setProfileMsg(error ? `Error: ${error.message}` : 'Saved')
    setSavingProfile(false)
    setTimeout(() => setProfileMsg(null), 2500)
  }

  const changePassword = async () => {
    setPasswordMsg(null)
    if (password.length < 8) {
      setPasswordMsg({ type: 'err', text: 'Password must be at least 8 characters.' })
      return
    }
    if (password !== confirmPassword) {
      setPasswordMsg({ type: 'err', text: 'Passwords do not match.' })
      return
    }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setPasswordMsg({ type: 'err', text: error.message })
    } else {
      setPasswordMsg({ type: 'ok', text: 'Password updated.' })
      setPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/dashboard/settings" className="text-stone-600 hover:text-stone-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Account</h1>
            <p className="text-stone-600 text-sm mt-1">Your email and password</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-bold text-stone-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2 border border-stone-200 rounded-lg bg-stone-50 text-stone-500"
              />
              <p className="text-xs text-stone-400 mt-1">Contact support to change your email.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="px-5 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm font-medium disabled:opacity-50"
              >
                {savingProfile ? 'Saving…' : 'Save'}
              </button>
              {profileMsg && <span className="text-sm text-stone-600">{profileMsg}</span>}
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-bold text-stone-900 mb-4">Change password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={changePassword}
                disabled={savingPassword}
                className="px-5 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm font-medium disabled:opacity-50"
              >
                {savingPassword ? 'Updating…' : 'Update password'}
              </button>
              {passwordMsg && (
                <span className={`text-sm ${passwordMsg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMsg.text}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
