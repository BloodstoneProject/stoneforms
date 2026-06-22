'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

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
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <Link
            href="/dashboard/settings"
            aria-label="Back to settings"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Your email and password</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile */}
        <div className="card-surface p-6">
          <h2 className="font-semibold tracking-tight text-foreground mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="account-email" className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input
                id="account-email"
                type="email"
                value={email}
                readOnly
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Contact support to change your email.</p>
            </div>
            <div>
              <label htmlFor="account-name" className="block text-sm font-medium text-foreground mb-1">Full name</label>
              <Input
                id="account-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={saveProfile} disabled={savingProfile} size="sm">
                {savingProfile ? 'Saving…' : 'Save'}
              </Button>
              {profileMsg && <span className="text-sm text-muted-foreground">{profileMsg}</span>}
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="card-surface p-6">
          <h2 className="font-semibold tracking-tight text-foreground mb-4">Change password</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-1">New password</label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1">Confirm new password</label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={changePassword} disabled={savingPassword} size="sm">
                {savingPassword ? 'Updating…' : 'Update password'}
              </Button>
              {passwordMsg && (
                <span className={`text-sm ${passwordMsg.type === 'ok' ? 'text-foreground' : 'text-destructive'}`}>
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
