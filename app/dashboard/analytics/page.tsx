'use client'

import Link from 'next/link'
import { TrendingUp, TrendingDown, Users, Eye, FileText, DollarSign } from 'lucide-react'
import { mockForms, mockContacts, mockDeals } from '@/lib/mock-data'

export default function AnalyticsPage() {
  const totalForms = mockForms.length
  const publishedForms = mockForms.filter(f => f.status === 'published').length
  const totalResponses = mockForms.reduce((sum, f) => sum + (f.responseCount || 0), 0)
  const totalViews = mockForms.reduce((sum, f) => sum + (f.viewCount || 0), 0)
  const avgCompletionRate = mockForms.reduce((sum, f) => sum + (f.completionRate || 0), 0) / mockForms.length
  const conversionRate = (totalResponses / totalViews) * 100

  const totalContacts = mockContacts.length
  const newContactsThisMonth = mockContacts.filter(c => {
    const created = new Date(c.createdAt)
    const thisMonth = new Date()
    return created.getMonth() === thisMonth.getMonth()
  }).length

  const openDeals = mockDeals.filter(d => d.status === 'open').length
  const wonDeals = mockDeals.filter(d => d.status === 'won').length
  const totalDealValue = mockDeals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.value, 0)

  const topForms = mockForms
    .sort((a, b) => (b.responseCount || 0) - (a.responseCount || 0))
    .slice(0, 5)

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
      responses: Math.floor(Math.random() * 100) + 50,
    }
  })

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-stone-900">Analytics</h1>
          <p className="text-stone-600 mt-1">Track performance and insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Total Views</p>
                <p className="text-3xl font-bold text-stone-900">{totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
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
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8.3%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-stone-900">{conversionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+2.1%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Avg Completion</p>
                <p className="text-3xl font-bold text-stone-900">{avgCompletionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span>-1.2%</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-6">Response Trend</h2>
            <div className="space-y-3">
              {last7Days.map((day, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-stone-600">{day.date}</div>
                  <div className="flex-1">
                    <div className="bg-stone-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${(day.responses / 150) * 100}%` }}
                      >
                        <span className="text-white text-sm font-medium">{day.responses}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-stone-900">Top Forms</h2>
              <Link href="/dashboard/forms" className="text-sm text-stone-600 hover:text-stone-900">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {topForms.map((form, idx) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/${form.id}`}
                  className="block p-4 rounded-lg hover:bg-stone-50 border border-stone-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-stone-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">{form.title}</h3>
                      <p className="text-sm text-stone-600">
                        {form.responseCount} responses
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Total Contacts</p>
                <p className="text-2xl font-bold text-stone-900">{totalContacts}</p>
              </div>
            </div>
            <p className="text-sm text-stone-600">
              +{newContactsThisMonth} new this month
            </p>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-stone-900">£{(totalDealValue / 1000).toFixed(0)}k</p>
              </div>
            </div>
            <p className="text-sm text-stone-600">
              {openDeals} open · {wonDeals} won
            </p>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Published Forms</p>
                <p className="text-2xl font-bold text-stone-900">{publishedForms}</p>
              </div>
            </div>
            <p className="text-sm text-stone-600">
              {totalForms} total forms
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
