'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authHelpers } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

// Only sections backed by real data are linked here. Demo modules from the
// original scaffold have been removed so every link leads to a working page.
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Forms', href: '/dashboard/forms', icon: FileText },
  { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Deals', href: '/dashboard/deals', icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authHelpers.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex flex-col h-full text-white w-64" style={{ backgroundColor: '#142c1c' }}>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b" style={{ borderColor: '#1f3d28' }}>
        <Link href="/dashboard" className="flex items-center">
          <span className="text-2xl font-bold" style={{ color: '#f4f2ed' }}>
            Stoneforms
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'text-white'
                  : 'hover:text-white'
              )}
              style={isActive ? { backgroundColor: '#3d5948' } : { color: '#a8b5ad' }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t" style={{ borderColor: '#1f3d28' }}>
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-2',
            pathname === '/dashboard/settings'
              ? 'text-white'
              : ''
          )}
          style={pathname === '/dashboard/settings' ? { backgroundColor: '#3d5948' } : { color: '#a8b5ad' }}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
        
        <Button
          variant="ghost"
          className="w-full justify-start hover:text-white"
          style={{ color: '#a8b5ad' }}
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
