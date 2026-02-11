'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  TrendingUp, 
  Settings, 
  Zap,
  BarChart3,
  Webhook,
  LogOut,
  Award,
  Calendar,
  Palette,
  FileBarChart,
  UserPlus,
  Library,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authHelpers } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Forms', href: '/dashboard/forms', icon: FileText },
  { name: 'Quizzes', href: '/dashboard/quizzes', icon: Award },
  { name: 'Publications', href: '/dashboard/publications', icon: BookOpen },
  { name: 'Templates', href: '/dashboard/templates', icon: Library },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Deals', href: '/dashboard/deals', icon: TrendingUp },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
  { name: 'Automations', href: '/dashboard/automations', icon: Zap },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Webhook },
  { name: 'Team', href: '/dashboard/team', icon: UserPlus },
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
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
