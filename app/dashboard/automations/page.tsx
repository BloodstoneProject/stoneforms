'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Mail,
  Zap,
  Clock,
  Search,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Send,
  CheckCircle2
} from 'lucide-react'

// Mock data
const mockAutomations = [
  {
    id: '1',
    name: 'Welcome Email - New Customers',
    type: 'auto_responder',
    trigger: 'Form Submitted',
    formName: 'Lead Capture Form',
    template: 'Welcome Email Template',
    sent: 234,
    openRate: 78,
    clickRate: 34,
    enabled: true,
    delay: 0,
  },
  {
    id: '2',
    name: 'Quiz Results - Passed',
    type: 'conditional',
    trigger: 'Quiz Passed (>80%)',
    formName: 'Product Knowledge Quiz',
    template: 'Congratulations Template',
    sent: 89,
    openRate: 92,
    clickRate: 45,
    enabled: true,
    delay: 0,
  },
  {
    id: '3',
    name: 'Follow-up Sequence',
    type: 'sequence',
    trigger: 'Form Submitted',
    formName: 'Event Registration',
    template: '3-Email Drip Campaign',
    sent: 156,
    openRate: 65,
    clickRate: 28,
    enabled: true,
    delay: 1440, // 24 hours
  },
  {
    id: '4',
    name: 'Abandoned Form Recovery',
    type: 'conditional',
    trigger: 'Form Started, Not Completed',
    formName: 'Customer Feedback Survey',
    template: 'Come Back Template',
    sent: 45,
    openRate: 41,
    clickRate: 18,
    enabled: false,
    delay: 60, // 1 hour
  },
]

const mockTemplates = [
  { id: '1', name: 'Welcome Email Template', subject: 'Welcome to Stoneforms!' },
  { id: '2', name: 'Congratulations Template', subject: 'You passed! 🎉' },
  { id: '3', name: '3-Email Drip Campaign', subject: 'Getting started...' },
  { id: '4', name: 'Come Back Template', subject: 'We noticed you didn\'t finish' },
]

export default function AutomationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredAutomations = mockAutomations.filter(auto => {
    const matchesSearch = auto.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || auto.type === selectedType
    return matchesSearch && matchesType
  })

  const stats = {
    totalAutomations: mockAutomations.length,
    activeAutomations: mockAutomations.filter(a => a.enabled).length,
    totalSent: mockAutomations.reduce((sum, a) => sum + a.sent, 0),
    avgOpenRate: Math.round(mockAutomations.reduce((sum, a) => sum + a.openRate, 0) / mockAutomations.length),
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Email Automations</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Set up automated email campaigns and responses
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/automations/templates">
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Email Templates
            </Button>
          </Link>
          <Link href="/dashboard/automations/new">
            <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
              <Plus className="w-4 h-4" />
              New Automation
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Automations</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.totalAutomations}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#142c1c' }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Active</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.activeAutomations}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Emails Sent</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.totalSent}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#770a19' }}>
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Avg. Open Rate</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.avgOpenRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3d5948' }} />
          <Input
            type="search"
            placeholder="Search automations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={!selectedType ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(null)}
            style={!selectedType ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            All
          </Button>
          <Button
            variant={selectedType === 'auto_responder' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('auto_responder')}
            style={selectedType === 'auto_responder' ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            Auto-Reply
          </Button>
          <Button
            variant={selectedType === 'sequence' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('sequence')}
            style={selectedType === 'sequence' ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            Sequences
          </Button>
          <Button
            variant={selectedType === 'conditional' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('conditional')}
            style={selectedType === 'conditional' ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            Conditional
          </Button>
        </div>
      </div>

      {/* Automations List */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>All Automations ({filteredAutomations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAutomations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                style={{ borderColor: '#e8e4db' }}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Status Indicator */}
                  <div className="flex flex-col items-center gap-2">
                    {automation.enabled ? (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#3d5948' }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#e8e4db' }}
                      >
                        <Pause className="w-5 h-5" style={{ color: '#3d5948' }} />
                      </div>
                    )}
                    <span 
                      className="px-2 py-0.5 text-xs font-medium rounded-full"
                      style={automation.enabled 
                        ? { backgroundColor: '#3d5948', color: '#f4f2ed' }
                        : { backgroundColor: '#e8e4db', color: '#3d5948' }
                      }
                    >
                      {automation.enabled ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  {/* Automation Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg" style={{ color: '#142c1c' }}>
                        {automation.name}
                      </h3>
                      <span 
                        className="px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{ backgroundColor: '#e8e4db', color: '#3d5948' }}
                      >
                        {automation.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm" style={{ color: '#3d5948' }}>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>{automation.trigger}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{automation.formName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{automation.delay === 0 ? 'Instant' : `${automation.delay / 60}h delay`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        <span>{automation.sent} sent</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex flex-col gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                        {automation.openRate}%
                      </p>
                      <p className="text-xs" style={{ color: '#3d5948' }}>Open Rate</p>
                    </div>
                    <div className="w-full h-1 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${automation.openRate}%`, backgroundColor: '#3d5948' }}
                      />
                    </div>
                  </div>

                  <div className="hidden lg:flex flex-col gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                        {automation.clickRate}%
                      </p>
                      <p className="text-xs" style={{ color: '#3d5948' }}>Click Rate</p>
                    </div>
                    <div className="w-full h-1 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${automation.clickRate}%`, backgroundColor: '#770a19' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
              <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#142c1c' }}>
                1
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#142c1c' }}>Create Email Template</h4>
              <p className="text-sm mb-3" style={{ color: '#3d5948' }}>
                Design your email with variables like {'{firstName}'} and {'{score}'}
              </p>
              <Button size="sm" variant="outline">
                Go to Templates
              </Button>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
              <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#3d5948' }}>
                2
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#142c1c' }}>Set Trigger</h4>
              <p className="text-sm mb-3" style={{ color: '#3d5948' }}>
                Choose when to send: form submitted, quiz passed, specific answer
              </p>
              <Button size="sm" variant="outline">
                View Triggers
              </Button>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
              <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#770a19' }}>
                3
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#142c1c' }}>Activate & Monitor</h4>
              <p className="text-sm mb-3" style={{ color: '#3d5948' }}>
                Turn on your automation and track open/click rates
              </p>
              <Button size="sm" className="text-white" style={{ backgroundColor: '#142c1c' }}>
                Create Automation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
