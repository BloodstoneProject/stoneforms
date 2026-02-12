'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TopBarProps {
  user?: {
    email: string
    firstName?: string
    lastName?: string
  }
}

export function TopBar({ user }: TopBarProps) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)

  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || 'User'

  const initials = user?.firstName 
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    : user?.email?.[0].toUpperCase() || 'U'

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-6">
      {/* Left: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search forms, contacts, deals..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-4">
        {/* Create New Button */}
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create New
        </Button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">
              W
            </div>
            <span>My Workspace</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isWorkspaceOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase">Your Workspaces</p>
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-sm font-bold">
                  W
                </div>
                <div>
                  <p className="text-sm font-medium">My Workspace</p>
                  <p className="text-xs text-gray-500">Personal</p>
                </div>
              </button>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-blue-600">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Create Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {initials}
            </div>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="py-2">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Billing
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Help & Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
