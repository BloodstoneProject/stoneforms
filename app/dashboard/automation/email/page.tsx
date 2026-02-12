'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Mail, 
  Users, 
  TrendingUp,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  Zap,
  MessageSquare,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

export default function EmailAutomationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const automations = [
    {
      id: '1',
      name: 'Welcome Email Sequence',
      description: 'Automated welcome series for new subscribers',
      trigger: 'Form Submission',
      status: 'active',
      emails: 3,
      subscribers: 1247,
      openRate: 68.5,
      clickRate: 24.3,
      sent: 3741,
      delivered: 3725,
      opened: 2551,
      clicked: 906,
      bounced: 16,
      unsubscribed: 12,
      lastRun: '2024-02-11T14:30:00',
      created: '2024-01-15',
    },
    {
      id: '2',
      name: 'Abandoned Cart Recovery',
      description: 'Re-engage users who didn\'t complete purchase',
      trigger: 'Cart Abandoned',
      status: 'active',
      emails: 2,
      subscribers: 834,
      openRate: 45.2,
      clickRate: 18.7,
      sent: 1668,
      delivered: 1660,
      opened: 750,
      clicked: 310,
      bounced: 8,
      unsubscribed: 5,
      lastRun: '2024-02-11T12:15:00',
      created: '2024-02-01',
    },
    {
      id: '3',
      name: 'Product Launch Drip',
      description: 'Pre-launch hype and education campaign',
      trigger: 'Manual',
      status: 'paused',
      emails: 5,
      subscribers: 2156,
      openRate: 0,
      clickRate: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      lastRun: null,
      created: '2024-02-05',
    },
  ]

  const stats = [
    { 
      label: 'Total Automations', 
      value: '12', 
      change: '+2 this month',
      icon: Zap,
      color: '#142c1c',
    },
    { 
      label: 'Active Campaigns', 
      value: '9', 
      change: '3 paused',
      icon: Play,
      color: '#3d5948',
    },
    { 
      label: 'Total Subscribers', 
      value: '8.4k', 
      change: '+234 this week',
      icon: Users,
      color: '#142c1c',
    },
    { 
      label: 'Avg Open Rate', 
      value: '52.3%', 
      change: '+5.2% vs last month',
      icon: Mail,
      color: '#770a19',
    },
  ]

  const recentActivity = [
    {
      automation: 'Welcome Email Sequence',
      action: 'Email sent',
      recipient: 'john@example.com',
      status: 'delivered',
      time: '2 minutes ago',
    },
    {
      automation: 'Abandoned Cart Recovery',
      action: 'Email opened',
      recipient: 'sarah@company.com',
      status: 'opened',
      time: '5 minutes ago',
    },
    {
      automation: 'Welcome Email Sequence',
      action: 'Link clicked',
      recipient: 'mike@startup.io',
      status: 'clicked',
      time: '8 minutes ago',
    },
  ]

  const triggers = [
    { id: 'form_submit', name: 'Form Submission', icon: MessageSquare, count: 5 },
    { id: 'quiz_complete', name: 'Quiz Completed', icon: CheckCircle2, count: 2 },
    { id: 'cart_abandon', name: 'Cart Abandoned', icon: AlertCircle, count: 1 },
    { id: 'contact_create', name: 'Contact Created', icon: UserPlus, count: 3 },
    { id: 'manual', name: 'Manual Trigger', icon: Play, count: 1 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#3d5948'
      case 'paused': return '#f59e0b'
      case 'draft': return '#6b7280'
      default: return '#142c1c'
    }
  }

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <Send className="w-4 h-4" style={{ color: '#3d5948' }} />
      case 'opened': return <Mail className="w-4 h-4" style={{ color: '#142c1c' }} />
      case 'clicked': return <Target className="w-4 h-4" style={{ color: '#770a19' }} />
      case 'unsubscribed': return <XCircle className="w-4 h-4" style={{ color: '#6b7280' }} />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredAutomations = automations.filter(auto => {
    const matchesSearch = auto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auto.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || auto.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>
            Email Automations
          </h1>
          <p className="mt-1" style={{ color: '#3d5948' }}>
            Automated email campaigns that engage your audience
          </p>
        </div>
        <Link href="/dashboard/automations/email/new">
          <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6 border-2" style={{ borderColor: '#e8e4db' }}>
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#f4f2ed' }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <TrendingUp className="w-5 h-5" style={{ color: '#3d5948' }} />
              </div>
              <p className="text-sm mb-1" style={{ color: '#3d5948' }}>
                {stat.label}
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: '#142c1c' }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: '#3d5948' }}>
                {stat.change}
              </p>
            </Card>
          )
        })}
      </div>

      {/* Triggers Overview */}
      <Card className="p-6 mb-8 border-2" style={{ borderColor: '#e8e4db' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#142c1c' }}>
          Automation Triggers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {triggers.map((trigger) => {
            const Icon = trigger.icon
            return (
              <div
                key={trigger.id}
                className="p-4 rounded-xl border-2"
                style={{ borderColor: '#e8e4db', backgroundColor: '#f4f2ed' }}
              >
                <Icon className="w-6 h-6 mb-2" style={{ color: '#142c1c' }} />
                <p className="font-semibold text-sm mb-1" style={{ color: '#142c1c' }}>
                  {trigger.name}
                </p>
                <p className="text-xs" style={{ color: '#3d5948' }}>
                  {trigger.count} automation{trigger.count !== 1 ? 's' : ''}
                </p>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Search & Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#3d5948' }} />
              <Input
                placeholder="Search automations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2"
                style={{ borderColor: '#e8e4db' }}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'paused'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                  style={filterStatus === status ? { backgroundColor: '#142c1c', color: 'white' } : {}}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Automations List */}
          <div className="space-y-4">
            {filteredAutomations.map((automation) => (
              <Card 
                key={automation.id} 
                className="p-6 border-2 hover:shadow-lg transition-all"
                style={{ borderColor: '#e8e4db' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold" style={{ color: '#142c1c' }}>
                        {automation.name}
                      </h3>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{ 
                          backgroundColor: automation.status === 'active' ? '#f4f2ed' : '#fef3c7',
                          color: getStatusColor(automation.status),
                        }}
                      >
                        {automation.status}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#3d5948' }}>
                      {automation.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#3d5948' }}>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        <span>{automation.trigger}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{automation.emails} emails</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{automation.subscribers.toLocaleString()} subscribers</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-5 h-5" style={{ color: '#3d5948' }} />
                  </button>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-4 gap-4 p-4 rounded-lg mb-4" style={{ backgroundColor: '#f4f2ed' }}>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#3d5948' }}>Open Rate</p>
                    <p className="text-xl font-bold" style={{ color: '#142c1c' }}>
                      {automation.openRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#3d5948' }}>Click Rate</p>
                    <p className="text-xl font-bold" style={{ color: '#142c1c' }}>
                      {automation.clickRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#3d5948' }}>Sent</p>
                    <p className="text-xl font-bold" style={{ color: '#142c1c' }}>
                      {automation.sent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#3d5948' }}>Delivered</p>
                    <p className="text-xl font-bold" style={{ color: '#142c1c' }}>
                      {automation.delivered.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: '#142c1c' }} />
                    <div>
                      <p style={{ color: '#3d5948' }}>Opened</p>
                      <p className="font-semibold" style={{ color: '#142c1c' }}>
                        {automation.opened.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" style={{ color: '#770a19' }} />
                    <div>
                      <p style={{ color: '#3d5948' }}>Clicked</p>
                      <p className="font-semibold" style={{ color: '#142c1c' }}>
                        {automation.clicked.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <div>
                      <p style={{ color: '#3d5948' }}>Bounced</p>
                      <p className="font-semibold" style={{ color: '#142c1c' }}>
                        {automation.bounced}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" style={{ color: '#6b7280' }} />
                    <div>
                      <p style={{ color: '#3d5948' }}>Unsubscribed</p>
                      <p className="font-semibold" style={{ color: '#142c1c' }}>
                        {automation.unsubscribed}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    {automation.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 text-red-600">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar - Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="p-6 border-2 sticky top-8" style={{ borderColor: '#e8e4db' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#142c1c' }}>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="pb-4 border-b last:border-0"
                  style={{ borderColor: '#e8e4db' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getActivityIcon(activity.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1" style={{ color: '#142c1c' }}>
                        {activity.action}
                      </p>
                      <p className="text-xs mb-1" style={{ color: '#3d5948' }}>
                        {activity.automation}
                      </p>
                      <p className="text-xs" style={{ color: '#3d5948' }}>
                        To: {activity.recipient}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
            >
              View All Activity
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
