'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Settings, CreditCard, LogOut, Menu } from 'lucide-react'
import { authHelpers } from '@/lib/supabase-client'
import { ThemeToggle } from '@/components/theme-toggle'

interface TopBarProps {
  user?: {
    email: string
    firstName?: string
    lastName?: string
  }
  /** Opens the mobile navigation drawer. */
  onOpenNav?: () => void
}

export function TopBar({ user, onOpenNav }: TopBarProps) {
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
    <div className="flex h-16 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
      {/* Mobile nav trigger */}
      <button
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Right-side actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
      <button
        onClick={createForm}
        disabled={creating}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 sm:px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">{creating ? 'Creating…' : 'Create form'}</span>
        <span className="sr-only sm:hidden">{creating ? 'Creating form' : 'Create form'}</span>
      </button>

      <ThemeToggle />

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials}
          </div>
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 z-50 mt-2 w-60 rounded-lg border border-border bg-popover py-2 text-popover-foreground shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <Link
                  href="/dashboard/settings/billing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <CreditCard className="h-4 w-4" /> Billing
                </Link>
              </div>
              <div className="border-t border-border pt-1">
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  )
}
