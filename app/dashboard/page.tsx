import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Eye, 
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// This would come from your database
const stats = [
  {
    name: 'Total Forms',
    value: '12',
    change: '+2 this month',
    trend: 'up',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    name: 'Total Responses',
    value: '2,847',
    change: '+12.5% from last month',
    trend: 'up',
    icon: Eye,
    color: 'bg-purple-500',
  },
  {
    name: 'Contacts',
    value: '1,234',
    change: '+89 this week',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    name: 'Active Deals',
    value: '47',
    change: '-3 from last week',
    trend: 'down',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
]

const recentForms = [
  {
    id: '1',
    title: 'Customer Feedback Survey',
    responses: 234,
    lastResponse: '2 hours ago',
    status: 'published',
  },
  {
    id: '2',
    title: 'Lead Capture Form',
    responses: 89,
    lastResponse: '5 hours ago',
    status: 'published',
  },
  {
    id: '3',
    title: 'Event Registration',
    responses: 156,
    lastResponse: '1 day ago',
    status: 'published',
  },
  {
    id: '4',
    title: 'Product Interest Survey',
    responses: 0,
    lastResponse: 'Never',
    status: 'draft',
  },
]

const recentContacts = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    source: 'Customer Feedback Survey',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@company.com',
    source: 'Lead Capture Form',
    createdAt: '5 hours ago',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.w@startup.io',
    source: 'Event Registration',
    createdAt: '1 day ago',
  },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Link href="/dashboard/forms/new">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Create New Form
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2 text-sm">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Forms */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Forms</CardTitle>
                <CardDescription>Your most recently updated forms</CardDescription>
              </div>
              <Link href="/dashboard/forms">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentForms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{form.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          form.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {form.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{form.responses} responses</span>
                      <span>•</span>
                      <span>Last: {form.lastResponse}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/forms/${form.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Contacts</CardTitle>
                <CardDescription>New leads from your forms</CardDescription>
              </div>
              <Link href="/dashboard/contacts">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      From: {contact.source} • {contact.createdAt}
                    </p>
                  </div>
                  <Link href={`/dashboard/contacts/${contact.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/forms/new">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Form</h3>
                    <p className="text-sm text-gray-600">Build a new form</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/contacts/import">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Import Contacts</h3>
                    <p className="text-sm text-gray-600">Upload a CSV</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/integrations">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Setup Integration</h3>
                    <p className="text-sm text-gray-600">Connect your tools</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
