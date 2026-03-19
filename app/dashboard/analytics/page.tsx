'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Users, Eye, FileText, DollarSign } from 'lucide-react'

interface Form {
  id: string
  title: string
  status: string
  created_at: string
}

interface Stats {
  totalForms: number
  publishedForms: number
  totalContacts: number
  totalDeals: number
  openDeals: number
  wonDeals: number
  pipelineValue: number
  totalResponses: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalForms: 0, publishedForms: 0, totalContacts: 0,
    totalDeals: 0, openDeals: 0, wonDeals: 0, pipelineValue: 0, totalResponses: 0,
  })
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [formsRes, contactsRes, dealsRes] = await Promise.all([
        fetch('/api/forms'),
        fetch('/api/contacts'),
        fetch('/api/deals'),
      ])

      const formsData = await formsRes.json()
      const contactsData = await contactsRes.json()
      const dealsData = await dealsRes.json()

      const allForms = formsData.forms || []
      const allContacts = contactsData.contacts || []
      const allDeals = dealsData.deals || []

      const openDeals = allDeals.filter((d: any) => d.status === 'open')

      setForms(allForms)
      setStats({
        totalForms: allForms.length,
        publishedForms: allForms.filter((f: any) => f.status === 'published').length,
        totalContacts: allContacts.length,
        totalDeals: allDeals.length,
        openDeals: openDeals.length,
        wonDeals: allDeals.filter((d: any) => d.status === 'won').length,
        pipelineValue: openDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
        totalResponses: 0,
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
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
                <p className="text-stone-600 text-sm mb-1">Total Forms</p>
                <p className="text-3xl font-bold text-stone-900">{stats.totalForms}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-stone-500">{stats.publishedForms} published</p>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-stone-900">{stats.totalContacts}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-stone-500">In your CRM</p>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Pipeline Value</p>
                <p className="text-3xl font-bold text-stone-900">
                  {stats.pipelineValue > 0 ? `£${(stats.pipelineValue / 1000).toFixed(0)}k` : '£0'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-stone-500">{stats.openDeals} open, {stats.wonDeals} won</p>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-600 text-sm mb-1">Total Deals</p>
                <p className="text-3xl font-bold text-stone-900">{stats.totalDeals}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-stone-500">Across all stages</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-stone-900">Your Forms</h2>
              <Link href="/dashboard/forms" className="text-sm text-stone-600 hover:text-stone-900">
                View all
              </Link>
            </div>
            {forms.length === 0 ? (
              <p className="text-stone-500 text-center py-8">No forms yet. Create your first form to see data here.</p>
            ) : (
              <div className="space-y-4">
                {forms.slice(0, 5).map((form, idx) => (
                  <Link
                    key={form.id}
                    href={`/dashboard/forms/${form.id}`}
                    className="block p-4 rounded-lg hover:bg-stone-50 border border-stone-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-900">{form.title}</h3>
                        <p className="text-sm text-stone-600 capitalize">{form.status}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/forms"
                className="block p-4 rounded-lg border border-stone-200 hover:bg-stone-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-stone-600" />
                  <div>
                    <h3 className="font-medium text-stone-900">Create a Form</h3>
                    <p className="text-sm text-stone-500">Build a new form or survey</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/dashboard/contacts"
                className="block p-4 rounded-lg border border-stone-200 hover:bg-stone-50"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-stone-600" />
                  <div>
                    <h3 className="font-medium text-stone-900">Manage Contacts</h3>
                    <p className="text-sm text-stone-500">View and add contacts</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/dashboard/deals"
                className="block p-4 rounded-lg border border-stone-200 hover:bg-stone-50"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-stone-600" />
                  <div>
                    <h3 className="font-medium text-stone-900">Deal Pipeline</h3>
                    <p className="text-sm text-stone-500">Track your sales pipeline</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
