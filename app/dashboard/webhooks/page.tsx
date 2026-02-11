'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus,
  Webhook,
  Play,
  Pause,
  Trash2,
  Edit,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Code,
  Send,
  RefreshCw
} from 'lucide-react'

export default function WebhooksPage() {
  const [isCreating, setIsCreating] = useState(false)

  const webhooks = [
    {
      id: '1',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/T00/B00/XXX',
      events: ['form_submitted', 'quiz_passed'],
      status: 'active',
      lastTriggered: '2024-02-09T14:30:00',
      successRate: 99.2,
      totalDeliveries: 1234,
      failedDeliveries: 10,
    },
    {
      id: '2',
      name: 'CRM Integration',
      url: 'https://api.yourcrm.com/webhooks/stoneforms',
      events: ['contact_created', 'deal_created'],
      status: 'active',
      lastTriggered: '2024-02-09T12:15:00',
      successRate: 98.5,
      totalDeliveries: 892,
      failedDeliveries: 13,
    },
    {
      id: '3',
      name: 'Analytics Tracker',
      url: 'https://analytics.example.com/track',
      events: ['form_submitted', 'form_viewed'],
      status: 'paused',
      lastTriggered: '2024-02-08T16:45:00',
      successRate: 100,
      totalDeliveries: 456,
      failedDeliveries: 0,
    },
  ]

  const recentDeliveries = [
    {
      id: '1',
      webhookName: 'Slack Notifications',
      event: 'form_submitted',
      status: 'success',
      responseCode: 200,
      responseTime: 234,
      timestamp: '2024-02-09T14:30:00',
    },
    {
      id: '2',
      webhookName: 'CRM Integration',
      event: 'contact_created',
      status: 'success',
      responseCode: 201,
      responseTime: 456,
      timestamp: '2024-02-09T14:28:00',
    },
    {
      id: '3',
      webhookName: 'Slack Notifications',
      event: 'quiz_passed',
      status: 'failed',
      responseCode: 500,
      responseTime: 5000,
      timestamp: '2024-02-09T14:25:00',
    },
  ]

  const eventTypes = [
    { id: 'form_submitted', label: 'Form Submitted' },
    { id: 'form_viewed', label: 'Form Viewed' },
    { id: 'quiz_passed', label: 'Quiz Passed' },
    { id: 'quiz_failed', label: 'Quiz Failed' },
    { id: 'contact_created', label: 'Contact Created' },
    { id: 'contact_updated', label: 'Contact Updated' },
    { id: 'deal_created', label: 'Deal Created' },
    { id: 'deal_stage_changed', label: 'Deal Stage Changed' },
    { id: 'payment_succeeded', label: 'Payment Succeeded' },
    { id: 'payment_failed', label: 'Payment Failed' },
  ]

  const stats = {
    total: webhooks.length,
    active: webhooks.filter(w => w.status === 'active').length,
    totalDeliveries: webhooks.reduce((sum, w) => sum + w.totalDeliveries, 0),
    avgSuccessRate: webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length,
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Webhooks</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Send real-time data to external services
          </p>
        </div>
        <Button 
          className="gap-2 text-white" 
          style={{ backgroundColor: '#142c1c' }}
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4" />
          Create Webhook
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Webhooks</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.total}</p>
              </div>
              <Webhook className="w-12 h-12" style={{ color: '#e8e4db' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Active</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.active}</p>
              </div>
              <CheckCircle2 className="w-12 h-12" style={{ color: '#3d5948' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Deliveries</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  {stats.totalDeliveries.toLocaleString()}
                </p>
              </div>
              <Send className="w-12 h-12" style={{ color: '#e8e4db' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Success Rate</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  {stats.avgSuccessRate.toFixed(1)}%
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Webhooks List */}
        <div className="lg:col-span-2 space-y-4">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Configured Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#e8e4db' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: webhook.status === 'active' ? '#3d5948' : '#e8e4db' }}
                        >
                          <Webhook className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1" style={{ color: '#142c1c' }}>
                            {webhook.name}
                          </h4>
                          <code className="text-xs p-1 rounded" style={{ backgroundColor: '#f4f2ed', color: '#3d5948' }}>
                            {webhook.url}
                          </code>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {webhook.events.map(event => (
                              <span
                                key={event}
                                className="px-2 py-0.5 text-xs font-medium rounded-full"
                                style={{ backgroundColor: '#e8e4db', color: '#3d5948' }}
                              >
                                {event.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={webhook.status === 'active'
                          ? { backgroundColor: '#e8f5e9', color: '#2e7d32' }
                          : { backgroundColor: '#e8e4db', color: '#3d5948' }
                        }
                      >
                        {webhook.status}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-t pt-3" style={{ borderColor: '#e8e4db' }}>
                      <div>
                        <p className="text-xs" style={{ color: '#3d5948' }}>Deliveries</p>
                        <p className="font-semibold" style={{ color: '#142c1c' }}>
                          {webhook.totalDeliveries}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#3d5948' }}>Success Rate</p>
                        <p className="font-semibold" style={{ color: '#142c1c' }}>
                          {webhook.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#3d5948' }}>Failed</p>
                        <p className="font-semibold text-red-600">
                          {webhook.failedDeliveries}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Send className="w-3 h-3" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        {webhook.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {webhook.status === 'active' ? 'Pause' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deliveries */}
        <div className="lg:col-span-1">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#142c1c' }}>Recent Deliveries</CardTitle>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="p-3 border rounded-lg"
                    style={{ borderColor: '#e8e4db' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: '#142c1c' }}>
                        {delivery.webhookName}
                      </span>
                      {delivery.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-xs mb-2" style={{ color: '#3d5948' }}>
                      {delivery.event.replace('_', ' ')}
                    </p>
                    <div className="flex justify-between text-xs" style={{ color: '#3d5948' }}>
                      <span>HTTP {delivery.responseCode}</span>
                      <span>{delivery.responseTime}ms</span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#3d5948' }}>
                      {new Date(delivery.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Webhook Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Card className="w-full max-w-2xl" style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#142c1c' }}>Create Webhook</CardTitle>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook Name</Label>
                <Input placeholder="My Custom Webhook" />
              </div>

              <div className="space-y-2">
                <Label>Endpoint URL</Label>
                <Input placeholder="https://your-app.com/webhook" />
              </div>

              <div className="space-y-2">
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded" style={{ borderColor: '#e8e4db' }}>
                  {eventTypes.map(event => (
                    <label key={event.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      {event.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Authentication (Optional)</Label>
                <select className="w-full rounded-md border p-3" style={{ borderColor: '#e8e4db' }}>
                  <option>No Authentication</option>
                  <option>API Key (Header)</option>
                  <option>Bearer Token</option>
                  <option>Basic Auth</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 text-white" style={{ backgroundColor: '#142c1c' }}>
                  Create Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
