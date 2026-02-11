import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Eye,
  ArrowUpRight,
} from 'lucide-react'

// Mock data for the demo
const stats = [
  {
    name: 'Total Forms',
    value: '12',
    change: '+2 this month',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    name: 'Total Responses',
    value: '2,847',
    change: '+12.5% from last month',
    icon: Eye,
    color: 'bg-purple-500',
  },
  {
    name: 'Contacts',
    value: '1,234',
    change: '+89 this week',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    name: 'Active Deals',
    value: '47',
    change: '+5 from last week',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
]

const recentForms = [
  {
    id: '1',
    title: 'Customer Feedback Survey',
    responses: 234,
    completionRate: 78,
    status: 'published',
  },
  {
    id: '2',
    title: 'Lead Capture Form',
    responses: 89,
    completionRate: 92,
    status: 'published',
  },
  {
    id: '3',
    title: 'Event Registration',
    responses: 156,
    completionRate: 85,
    status: 'published',
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FormFlow
              </span>
              <span className="ml-3 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                DEMO
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Dashboard Demo</h1>
          <p className="text-blue-100 mb-4">
            This is a preview of what your FormFlow dashboard will look like. Sign up to start creating forms!
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Create Your Account →
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600">{stat.change}</span>
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

        {/* Forms Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Your Forms</CardTitle>
            <CardDescription>Create, manage, and analyze your forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentForms.map((form) => (
                <div
                  key={form.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {form.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{form.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Responses</span>
                      <span className="font-medium text-gray-900">{form.responses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-medium text-gray-900">{form.completionRate}%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="w-full">
                      View Analytics
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Beautiful Forms</h3>
            <p className="text-sm text-gray-600">
              Create conversational forms that feel natural and increase completion rates.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Built-in CRM</h3>
            <p className="text-sm text-gray-600">
              Every response automatically creates or updates a contact in your CRM.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">
              Track performance, identify drop-off points, and optimize conversion rates.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to create your first form?
          </h2>
          <p className="text-gray-600 mb-6">
            Start with our free plan. No credit card required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg">Sign Up Free</Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
