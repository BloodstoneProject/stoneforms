'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Filter, Search, Calendar, Mail, User } from 'lucide-react'
import { getFormById, getFormSubmissions } from '@/lib/mock-data'

export default function FormResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const form = getFormById(id)
  const submissions = getFormSubmissions(id)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  if (!form) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Form Not Found</h1>
          <Link href="/dashboard/forms" className="text-stone-600 hover:text-stone-900">
            ← Back to Forms
          </Link>
        </div>
      </div>
    )
  }

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const emailAnswer = sub.answers.find(a => a.type === 'email')
    const nameAnswer = sub.answers.find(a => a.type === 'short_text')
    const searchValue = emailAnswer?.value || nameAnswer?.value || ''
    
    const matchesSearch = searchValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const subDate = new Date(sub.createdAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - subDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dateFilter === 'today') matchesDate = daysDiff === 0
      if (dateFilter === 'week') matchesDate = daysDiff <= 7
      if (dateFilter === 'month') matchesDate = daysDiff <= 30
    }
    
    return matchesSearch && matchesDate
  })

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/forms/${form.id}`} className="text-stone-600 hover:text-stone-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-stone-900">{form.title}</h1>
                <p className="text-stone-600 mt-1">Responses</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium">
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="text-stone-600 text-sm mb-1">Total Responses</div>
              <div className="text-2xl font-bold text-stone-900">{submissions.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 text-sm mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-900">
                {submissions.filter(s => s.completedAt).length}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 text-sm mb-1">Completion Rate</div>
              <div className="text-2xl font-bold text-blue-900">{form.completionRate?.toFixed(1)}%</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-700 text-sm mb-1">Avg. Time</div>
              <div className="text-2xl font-bold text-purple-900">2m 15s</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Responses List */}
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => {
            const emailAnswer = submission.answers.find(a => a.type === 'email')
            const nameAnswer = submission.answers.find(a => a.type === 'short_text')
            
            return (
              <div key={submission.id} className="bg-white rounded-lg border border-stone-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-stone-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900">
                        {nameAnswer?.value || 'Anonymous'}
                      </div>
                      {emailAnswer && (
                        <div className="text-sm text-stone-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {emailAnswer.value}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-stone-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      {new Date(submission.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Answers */}
                <div className="border-t border-stone-100 pt-4 space-y-3">
                  {submission.answers.map((answer, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="text-stone-600 mb-1">Question {idx + 1}</div>
                      <div className="text-stone-900 font-medium">{answer.value}</div>
                    </div>
                  ))}
                </div>

                {/* Metadata */}
                <div className="border-t border-stone-100 pt-4 mt-4 flex items-center gap-6 text-xs text-stone-500">
                  <div>Source: {submission.metadata?.referrer || 'Direct'}</div>
                  <div>IP: {submission.metadata?.ip || 'Hidden'}</div>
                  {submission.completedAt && (
                    <div className="text-green-600 font-medium">✓ Completed</div>
                  )}
                </div>
              </div>
            )
          })}

          {filteredSubmissions.length === 0 && (
            <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
              <p className="text-stone-600 mb-4">No responses found</p>
              <p className="text-stone-500 text-sm">
                {submissions.length === 0 
                  ? 'This form hasn\'t received any submissions yet.' 
                  : 'Try adjusting your filters.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination (placeholder) */}
        {filteredSubmissions.length > 20 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <span className="text-stone-600 text-sm px-4">
              Showing {Math.min(20, filteredSubmissions.length)} of {filteredSubmissions.length}
            </span>
            <button className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
