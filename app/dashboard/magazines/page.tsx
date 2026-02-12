'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Share2, Download, MoreVertical, Upload, BookOpen } from 'lucide-react'
import { mockMagazines } from '@/lib/magazine-data'

export default function MagazinesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filteredMagazines = mockMagazines
    .filter(mag => {
      const matchesSearch = mag.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || mag.status === statusFilter
      return matchesSearch && matchesStatus
    })

  const stats = {
    total: mockMagazines.length,
    published: mockMagazines.filter(m => m.status === 'published').length,
    totalViews: mockMagazines.reduce((sum, m) => sum + m.views, 0),
    totalShares: mockMagazines.reduce((sum, m) => sum + m.shares, 0),
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
              <h1 className="text-3xl font-bold text-stone-900">Digital Magazines</h1>
              <p className="text-stone-600 mt-1">Create stunning flipbook magazines and publications</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/magazines/upload"
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload PDF
              </Link>
              <Link
                href="/dashboard/magazines/new"
                className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Magazine
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="text-stone-600 text-sm mb-1">Total Magazines</div>
              <div className="text-2xl font-bold text-stone-900">{stats.total}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 text-sm mb-1">Published</div>
              <div className="text-2xl font-bold text-green-900">{stats.published}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 text-sm mb-1">Total Views</div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalViews.toLocaleString()}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-700 text-sm mb-1">Total Shares</div>
              <div className="text-2xl font-bold text-purple-900">{stats.totalShares}</div>
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
                placeholder="Search magazines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-stone-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {filteredMagazines.map((magazine) => (
            <div key={magazine.id} className="group">
              <Link href={`/dashboard/magazines/${magazine.id}`}>
                <div className="aspect-[3/4] bg-stone-200 rounded-lg overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-stone-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{magazine.pages.length} pages</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/dashboard/magazines/${magazine.id}`}>
                      <h3 className="font-semibold text-stone-900 group-hover:text-stone-700 line-clamp-2">
                        {magazine.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-stone-600 mt-1">
                      {magazine.pages.length} pages
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    magazine.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {magazine.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-stone-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{magazine.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>{magazine.shares}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/pub/${magazine.id}`}
                    target="_blank"
                    className="flex-1 px-3 py-2 text-center text-sm border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/dashboard/magazines/${magazine.id}`}
                    className="flex-1 px-3 py-2 text-center text-sm bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMagazines.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <BookOpen className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-600 mb-4">No magazines found</p>
            <Link
              href="/dashboard/magazines/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Create Your First Magazine
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
