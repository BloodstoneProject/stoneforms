'use client'

import Link from 'next/link'
import { Plus, TrendingUp, Users, FileText, DollarSign, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { mockForms, mockContacts, mockDeals, mockSubmissions } from '@/lib/mock-data'

export default function DashboardPage() {
  // Calculate real stats
  const totalForms = mockForms.length
  const publishedForms = mockForms.filter(f => f.status === 'published').length
  const totalResponses = mockForms.reduce((sum, f) => sum + (f.responseCount || 0), 0)
  const totalViews = mockForms.reduce((sum, f) => sum + (f.viewCount || 0), 0)
  const avgCompletionRate = mockForms.reduce((sum, f) => sum + (f.completionRate || 0), 0) / mockForms.length
  
  const totalContacts = mockContacts.length
  const newContactsThisMonth = mockContacts.filter(c => {
    const created = new Date(c.createdAt)
    const thisMonth = new Date()
    return created.getMonth() === thisMonth.getMonth() && created.getFullYear() === thisMonth.getFullYear()
  }).length

  const openDeals = mockDeals.filter(d => d.status === 'open').length
  const wonDeals = mockDeals.filter(d => d.status === 'won').length
  const totalDealValue = mockDeals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.value, 0)

  // Recent activity
  const recentForms = mockForms.slice(0, 5)
  const recentSubmissions = mockSubmissions.slice(0, 10)

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Dashboard</h1>
          <p className="text-stone-600">Welcome back! Here's what's happening with your forms.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard/forms/new" className="bg-stone-900 text-white rounded-lg p-6 hover:bg-stone-800 transition-colors">
            <Plus className="w-6 h-6 mb-2" />
            <div className="font-semibold">Create Form</div>
          </Link>
          <Link href="/dashboard/contacts" className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <Users className="w-6 h-6 text-stone-900 mb-2" />
            <div className="font-semibold text-stone-900">View Contacts</div>
          </Link>
          <Link href="/dashboard/deals" className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <DollarSign className="w-6 h-6 text-stone-900 mb-2" />
            <div className="font-semibold text-stone-900">Manage Deals</div>
          </Link>
          <Link href="/dashboard/analytics" className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <TrendingUp className="w-6 h-6 text-stone-900 mb-2" />
            <div className="font-semibold text-stone-900">View Analytics</div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Total Forms</p>
                <p className="text-3xl font-bold text-stone-900">{totalForms}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {publishedForms} published
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Total Responses</p>
                <p className="text-3xl font-bold text-stone-900">{totalResponses.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {avgCompletionRate.toFixed(1)}% completion
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-stone-900">{totalContacts}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +{newContactsThisMonth} this month
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Pipeline Value</p>
                <p className="text-3xl font-bold text-stone-900">£{(totalDealValue / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {openDeals} open deals
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Forms */}
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-stone-900">Recent Forms</h2>
              <Link href="/dashboard/forms" className="text-sm text-stone-600 hover:text-stone-900">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentForms.map((form) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/${form.id}`}
                  className="block p-4 rounded-lg hover:bg-stone-50 transition-colors border border-stone-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-900 mb-1">{form.title}</h3>
                      <p className="text-sm text-stone-600">
                        {form.responseCount} responses · {form.viewCount} views
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {form.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Responses */}
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-stone-900">Recent Responses</h2>
              <Link href="/dashboard/forms" className="text-sm text-stone-600 hover:text-stone-900">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentSubmissions.map((sub) => {
                const form = mockForms.find(f => f.id === sub.formId)
                const emailAnswer = sub.answers.find(a => a.type === 'email')
                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-lg border border-stone-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-stone-900">{form?.title}</h3>
                      <span className="text-xs text-stone-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600">{emailAnswer?.value || 'Anonymous'}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-8">
          <ActivityFeed limit={8} />
        </div>
      </div>
    </div>
  )
}

import ActivityFeed from '@/components/ActivityFeed'
