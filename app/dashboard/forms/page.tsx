'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical,
  Copy,
  Archive,
  Trash2,
  Eye,
  BarChart3,
  Calendar
} from 'lucide-react'

// Mock data - will be replaced with real data from Supabase
const mockForms = [
  {
    id: '1',
    title: 'Customer Feedback Survey',
    description: 'Gather insights from our customers',
    status: 'published' as const,
    responses: 234,
    views: 1847,
    completionRate: 78,
    lastModified: '2024-02-08',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Lead Capture Form',
    description: 'Capture leads from our landing page',
    status: 'published' as const,
    responses: 89,
    views: 456,
    completionRate: 92,
    lastModified: '2024-02-07',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Event Registration',
    description: 'Register attendees for the conference',
    status: 'published' as const,
    responses: 156,
    views: 892,
    completionRate: 85,
    lastModified: '2024-02-06',
    createdAt: '2024-01-25',
  },
  {
    id: '4',
    title: 'Product Interest Survey',
    description: 'Understand customer product preferences',
    status: 'draft' as const,
    responses: 0,
    views: 12,
    completionRate: 0,
    lastModified: '2024-02-09',
    createdAt: '2024-02-09',
  },
]

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Forms</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Create and manage your forms
          </p>
        </div>
        <Link href="/dashboard/forms/new">
          <Button size="lg" className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
            <Plus className="w-5 h-5" />
            Create New Form
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3d5948' }} />
          <Input
            type="search"
            placeholder="Search forms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            style={filterStatus === 'all' ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'published' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('published')}
            style={filterStatus === 'published' ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            Published
          </Button>
          <Button
            variant={filterStatus === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('draft')}
            style={filterStatus === 'draft' ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            Drafts
          </Button>
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#3d5948' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#142c1c' }}>
              {searchQuery ? 'No forms found' : 'No forms yet'}
            </h3>
            <p className="mb-6" style={{ color: '#3d5948' }}>
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first form'}
            </p>
            <Link href="/dashboard/forms/new">
              <Button className="text-white" style={{ backgroundColor: '#142c1c' }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card 
              key={form.id} 
              className="group hover:shadow-lg transition-all cursor-pointer"
              style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#142c1c' }}>
                    <FileText className="w-6 h-6" style={{ color: '#f4f2ed' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full`}
                      style={form.status === 'published' 
                        ? { backgroundColor: '#3d5948', color: '#f4f2ed' }
                        : { backgroundColor: '#e8e4db', color: '#3d5948' }
                      }
                    >
                      {form.status}
                    </span>
                    <button className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" style={{ color: '#3d5948' }} />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <Link href={`/dashboard/forms/${form.id}/edit`}>
                  <h3 className="font-semibold mb-1 hover:underline" style={{ color: '#142c1c' }}>
                    {form.title}
                  </h3>
                </Link>
                <p className="text-sm mb-4" style={{ color: '#3d5948' }}>
                  {form.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b" style={{ borderColor: '#e8e4db' }}>
                  <div>
                    <p className="text-xs" style={{ color: '#3d5948' }}>Responses</p>
                    <p className="text-lg font-semibold" style={{ color: '#142c1c' }}>{form.responses}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#3d5948' }}>Views</p>
                    <p className="text-lg font-semibold" style={{ color: '#142c1c' }}>{form.views}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#3d5948' }}>Rate</p>
                    <p className="text-lg font-semibold" style={{ color: '#142c1c' }}>{form.completionRate}%</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs" style={{ color: '#3d5948' }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {new Date(form.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/forms/${form.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/forms/${form.id}/results`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <BarChart3 className="w-3 h-3" />
                      Results
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Forms</p>
              <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>{mockForms.length}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Published</p>
              <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                {mockForms.filter(f => f.status === 'published').length}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Responses</p>
              <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                {mockForms.reduce((sum, f) => sum + f.responses, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Avg. Completion</p>
              <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                {Math.round(mockForms.reduce((sum, f) => sum + f.completionRate, 0) / mockForms.length)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
