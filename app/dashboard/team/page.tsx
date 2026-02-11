'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus,
  Mail,
  Search,
  MoreVertical,
  Shield,
  Edit,
  Trash2,
  Crown,
  User,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react'

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member')

  const teamMembers = [
    {
      id: '1',
      name: 'You',
      email: 'john@stoneforms.com',
      role: 'owner',
      status: 'active',
      joinedAt: '2024-01-15',
      lastActive: '2024-02-09T14:30:00',
      avatar: 'JD',
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      email: 'sarah@stoneforms.com',
      role: 'admin',
      status: 'active',
      joinedAt: '2024-01-20',
      lastActive: '2024-02-09T12:15:00',
      avatar: 'SM',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@stoneforms.com',
      role: 'member',
      status: 'active',
      joinedAt: '2024-02-01',
      lastActive: '2024-02-08T16:45:00',
      avatar: 'MC',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@external.com',
      role: 'viewer',
      status: 'active',
      joinedAt: '2024-02-05',
      lastActive: '2024-02-07T10:20:00',
      avatar: 'EW',
    },
    {
      id: '5',
      name: 'Alex Johnson',
      email: 'alex@pending.com',
      role: 'member',
      status: 'pending',
      joinedAt: '2024-02-08',
      lastActive: null,
      avatar: 'AJ',
    },
  ]

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    pending: teamMembers.filter(m => m.status === 'pending').length,
    admins: teamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length,
  }

  const roles = [
    {
      name: 'Owner',
      description: 'Full access, billing, and team management',
      permissions: ['All permissions', 'Manage billing', 'Delete workspace'],
      icon: Crown,
      color: '#770a19',
    },
    {
      name: 'Admin',
      description: 'Manage forms, contacts, and team members',
      permissions: ['Create/edit forms', 'Manage contacts', 'Invite members', 'View analytics'],
      icon: Shield,
      color: '#142c1c',
    },
    {
      name: 'Member',
      description: 'Create and edit assigned forms',
      permissions: ['Create forms', 'Edit assigned forms', 'View contacts', 'View analytics'],
      icon: User,
      color: '#3d5948',
    },
    {
      name: 'Viewer',
      description: 'Read-only access to forms and data',
      permissions: ['View forms', 'View submissions', 'Export data'],
      icon: Eye,
      color: '#3d5948',
    },
  ]

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Team</h1>
        <p style={{ color: '#3d5948' }} className="mt-1">
          Manage your team members and permissions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Members</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.total}</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Active</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.active}</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Pending</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.pending}</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Admins</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.admins}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Team Members */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invite Member */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Invite Team Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="rounded-md border p-3"
                  style={{ borderColor: '#e8e4db' }}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
                <Button className="text-white" style={{ backgroundColor: '#142c1c' }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Team Members ({teamMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => {
                  const RoleIcon = member.role === 'owner' ? Crown : member.role === 'admin' ? Shield : member.role === 'member' ? User : Eye
                  
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#e8e4db' }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
                          style={{ backgroundColor: '#142c1c' }}
                        >
                          {member.avatar}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold" style={{ color: '#142c1c' }}>
                              {member.name}
                            </h4>
                            {member.status === 'pending' && (
                              <span 
                                className="px-2 py-0.5 text-xs font-medium rounded-full"
                                style={{ backgroundColor: '#fff8e1', color: '#f57c00' }}
                              >
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: '#3d5948' }}>
                            {member.email}
                          </p>
                          {member.lastActive && (
                            <p className="text-xs mt-1" style={{ color: '#3d5948' }}>
                              Last active: {new Date(member.lastActive).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Role Badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
                          <RoleIcon className="w-4 h-4" style={{ color: member.role === 'owner' ? '#770a19' : '#142c1c' }} />
                          <span className="text-sm font-medium capitalize" style={{ color: '#142c1c' }}>
                            {member.role}
                          </span>
                        </div>

                        {/* Actions */}
                        {member.role !== 'owner' && (
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Roles & Permissions */}
        <div className="lg:col-span-1">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.name} className="p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: role.color }}
                      >
                        <role.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: '#142c1c' }}>
                          {role.name}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: '#3d5948' }}>
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {role.permissions.map((permission) => (
                        <li key={permission} className="flex items-center gap-2 text-xs" style={{ color: '#3d5948' }}>
                          <CheckCircle2 className="w-3 h-3" style={{ color: '#3d5948' }} />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
