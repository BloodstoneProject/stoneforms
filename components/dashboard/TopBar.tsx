'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Settings, CreditCard, LogOut } from 'lucide-react'
import { authHelpers } from '@/lib/supabase-client'

interface TopBarProps {
  user?: {
    email: string
    firstName?: string
    lastName?: string
  }
}

export function TopBar({ user }: TopBarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || 'User'

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U'

  const createForm = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Form' }),
      })
      const data = await res.json()
      if (res.ok && data.form) {
        window.location.href = `/dashboard/forms/${data.form.id}`
      } else {
        alert(data.error || 'Could not create form')
        setCreating(false)
      }
    } catch {
      setCreating(false)
    }
  }

  const signOut = async () => {
    await authHelpers.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="h-16 border-b bg-white flex items-center justify-end px-6 gap-3">
      <button
        onClick={createForm}
        disabled={creating}
        className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm font-medium disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        {creating ? 'Creating…' : 'Create form'}
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100"
        >
          <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-stone-100">
                <p className="text-sm font-medium text-stone-900 truncate">{displayName}</p>
                <p className="text-xs text-stone-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <Link href="/dashboard/settings/billing" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
                  <CreditCard className="w-4 h-4" /> Billing
                </Link>
              </div>
              <div className="border-t border-stone-100 pt-1">
                <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
