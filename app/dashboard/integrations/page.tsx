'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { 
  Search,
  Zap,
  CheckCircle2,
  ExternalLink,
  Settings,
  Plus,
  TrendingUp,
  Mail,
  MessageSquare,
  Database,
  FileText,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Globe,
  Lock
} from 'lucide-react'

const integrationCategories = [
  { id: 'all', name: 'All Integrations', icon: Zap },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'communication', name: 'Communication', icon: MessageSquare },
  { id: 'productivity', name: 'Productivity', icon: FileText },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'crm', name: 'CRM & Sales', icon: Users },
  { id: 'payment', name: 'Payment', icon: DollarSign },
]

const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications in Slack when forms are submitted',
    category: 'communication',
    icon: '💬',
    color: '#4A154B',
    connected: true,
    popular: true,
    features: ['Real-time notifications', 'Channel selection', 'Custom messages'],
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5,000+ apps with automated workflows',
    category: 'productivity',
    icon: '⚡',
    color: '#FF4A00',
    connected: false,
    popular: true,
    features: ['5000+ app connections', 'Multi-step zaps', 'Custom triggers'],
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Automatically add form responses to spreadsheets',
    category: 'productivity',
    icon: '📊',
    color: '#0F9D58',
    connected: true,
    popular: true,
    features: ['Auto-sync responses', 'Multiple sheets', 'Real-time updates'],
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Add contacts to email lists automatically',
    category: 'marketing',
    icon: '🐵',
    color: '#FFE01B',
    connected: false,
    popular: true,
    features: ['List management', 'Tag contacts', 'Audience sync'],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync contacts and create deals in HubSpot CRM',
    category: 'crm',
    icon: '🧡',
    color: '#FF7A59',
    connected: false,
    popular: true,
    features: ['Contact sync', 'Deal creation', 'Pipeline updates'],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Create leads and opportunities from form submissions',
    category: 'crm',
    icon: '☁️',
    color: '#00A1E0',
    connected: false,
    popular: false,
    features: ['Lead creation', 'Opportunity tracking', 'Custom objects'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments directly through your forms',
    category: 'payment',
    icon: '💳',
    color: '#635BFF',
    connected: true,
    popular: true,
    features: ['Payment processing', 'Subscriptions', 'Invoicing'],
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track form performance and conversions',
    category: 'analytics',
    icon: '📈',
    color: '#E37400',
    connected: false,
    popular: false,
    features: ['Event tracking', 'Conversion goals', 'Custom dimensions'],
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Send form data to Airtable bases',
    category: 'productivity',
    icon: '🎨',
    color: '#18BFFF',
    connected: false,
    popular: false,
    features: ['Base sync', 'Field mapping', 'Attachments'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create database entries from form submissions',
    category: 'productivity',
    icon: '✏️',
    color: '#000000',
    connected: false,
    popular: false,
    features: ['Database creation', 'Page templates', 'Relations'],
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Send SMS notifications for form submissions',
    category: 'communication',
    icon: '📱',
    color: '#F22F46',
    connected: false,
    popular: false,
    features: ['SMS notifications', 'WhatsApp messages', 'Voice calls'],
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    description: 'Send data to any endpoint via HTTP POST',
    category: 'productivity',
    icon: '🔗',
    color: '#142c1c',
    connected: false,
    popular: true,
    features: ['Custom endpoints', 'Headers & auth', 'Retry logic'],
  },
]

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showConnectedOnly, setShowConnectedOnly] = useState(false)

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    const matchesConnected = !showConnectedOnly || integration.connected
    return matchesSearch && matchesCategory && matchesConnected
  })

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.connected).length,
    available: integrations.length - integrations.filter(i => i.connected).length,
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Integrations</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Connect Stoneforms with your favorite tools
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Request Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Available</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.total}</p>
              </div>
              <Zap className="w-12 h-12" style={{ color: '#e8e4db' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Connected</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.connected}</p>
              </div>
              <CheckCircle2 className="w-12 h-12" style={{ color: '#3d5948' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Available</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.available}</p>
              </div>
              <Plus className="w-12 h-12" style={{ color: '#e8e4db' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3d5948' }} />
            <Input
              type="search"
              placeholder="Search integrations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={showConnectedOnly}
              onCheckedChange={setShowConnectedOnly}
            />
            <span className="text-sm" style={{ color: '#3d5948' }}>
              Show connected only
            </span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {integrationCategories.map(category => {
            const isSelected = selectedCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors"
                style={isSelected 
                  ? { backgroundColor: '#142c1c', color: '#f4f2ed' }
                  : { backgroundColor: 'white', color: '#3d5948', border: '1px solid #e8e4db' }
                }
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map(integration => (
          <Card 
            key={integration.id}
            className="group hover:shadow-lg transition-all"
            style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: integration.color + '20' }}
                  >
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#142c1c' }}>
                      {integration.name}
                    </h3>
                    {integration.popular && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff8e1', color: '#f57c00' }}>
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                {integration.connected && (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#3d5948' }} />
                )}
              </div>

              {/* Description */}
              <p className="text-sm mb-4" style={{ color: '#3d5948' }}>
                {integration.description}
              </p>

              {/* Features */}
              <div className="space-y-1.5 mb-4">
                {integration.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs" style={{ color: '#3d5948' }}>
                    <CheckCircle2 className="w-3 h-3" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {integration.connected ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Settings className="w-3 h-3" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    className="w-full text-white"
                    style={{ backgroundColor: integration.color }}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#3d5948' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#142c1c' }}>
              No integrations found
            </h3>
            <p style={{ color: '#3d5948' }}>
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}

      {/* Coming Soon Banner */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#770a19' }}
            >
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1" style={{ color: '#142c1c' }}>
                Need a custom integration?
              </h3>
              <p className="text-sm" style={{ color: '#3d5948' }}>
                We're constantly adding new integrations. Request the apps you need and we'll prioritize them.
              </p>
            </div>
            <Button variant="outline">
              Request Integration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
