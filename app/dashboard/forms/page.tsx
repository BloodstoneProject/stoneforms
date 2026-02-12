'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Users, TrendingUp, Calendar, ExternalLink } from 'lucide-react'
import { mockForms } from '@/lib/mock-data'

export default function FormsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'responses'>('recent')

  const filteredForms = mockForms
    .filter(form => {
      const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || form.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title)
      if (sortBy === 'responses') return (b.responseCount || 0) - (a.responseCount || 0)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  const stats = {
    total: mockForms.length,
    published: mockForms.filter(f => f.status === 'published').length,
    draft: mockForms.filter(f => f.status === 'draft').length,
    totalResponses: mockForms.reduce((sum, f) => sum + (f.responseCount || 0), 0),
    totalViews: mockForms.reduce((sum, f) => sum + (f.viewCount || 0), 0),
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Forms</h1>
              <p className="text-stone-600 mt-1">Manage all your forms</p>
            </div>
            <Link href="/dashboard/forms/new" className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium">
              <Plus className="w-5 h-5" />
              Create Form
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="text-stone-600 text-sm mb-1">Total Forms</div>
              <div className="text-2xl font-bold text-stone-900">{stats.total}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 text-sm mb-1">Published</div>
              <div className="text-2xl font-bold text-green-900">{stats.published}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 text-sm mb-1">Total Responses</div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalResponses.toLocaleString()}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-700 text-sm mb-1">Total Views</div>
              <div className="text-2xl font-bold text-purple-900">{stats.totalViews.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-2 border border-stone-300 rounded-lg">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 border border-stone-300 rounded-lg">
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="responses">Most Responses</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredForms.map((form) => (
            <div key={form.id} className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link href={`/dashboard/forms/${form.id}`} className="text-lg font-semibold text-stone-900 hover:text-stone-700">
                      {form.title}
                    </Link>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      form.status === 'published' ? 'bg-green-100 text-green-700' :
                      form.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {form.status}
                    </span>
                  </div>

                  <p className="text-stone-600 text-sm mb-4">{form.description || 'No description'}</p>

                  <div className="flex items-center gap-6 text-sm text-stone-600">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{(form.viewCount || 0).toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{(form.responseCount || 0).toLocaleString()} responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>{form.completionRate?.toFixed(1)}% completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/f/${form.id}`} target="_blank" className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg" title="Preview">
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                  <Link href={`/dashboard/forms/${form.id}/responses`} className="px-4 py-2 text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                    View Responses
                  </Link>
                  <Link href={`/dashboard/forms/${form.id}`} className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-600 mb-4">No forms found</p>
              <Link href="/dashboard/forms/new" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg">
                <Plus className="w-5 h-5" />
                Create Your First Form
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
