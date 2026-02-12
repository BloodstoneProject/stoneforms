'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  BarChart3, 
  Share2,
  MoreVertical,
  Trash2,
  Edit,
  Lock,
  Unlock,
  BookOpen,
  Presentation,
  FileImage
} from 'lucide-react'
import Link from 'next/link'

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const publications = [
    {
      id: '1',
      title: 'Product Catalog 2024',
      type: 'Magazine',
      thumbnail: '/api/placeholder/400/300',
      pages: 24,
      views: 1247,
      created: '2024-02-01',
      status: 'published',
      isProtected: false,
    },
    {
      id: '2',
      title: 'Company Brochure',
      type: 'Book',
      thumbnail: '/api/placeholder/400/300',
      pages: 12,
      views: 834,
      created: '2024-01-28',
      status: 'published',
      isProtected: true,
    },
    {
      id: '3',
      title: 'Sales Presentation',
      type: 'Slider',
      thumbnail: '/api/placeholder/400/300',
      pages: 18,
      views: 542,
      created: '2024-01-25',
      status: 'draft',
      isProtected: false,
    },
  ]

  const stats = [
    { label: 'Total Publications', value: '12', icon: BookOpen },
    { label: 'Total Views', value: '8.4k', icon: Eye },
    { label: 'This Month', value: '2.3k', icon: BarChart3 },
    { label: 'Published', value: '9', icon: FileText },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>
            Publications
          </h1>
          <p className="mt-1" style={{ color: '#3d5948' }}>
            Create interactive flipbooks from your PDFs
          </p>
        </div>
        <Link href="/dashboard/publications/new">
          <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
            <Plus className="w-4 h-4" />
            New Publication
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6 border-2" style={{ borderColor: '#e8e4db' }}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#f4f2ed' }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#142c1c' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#3d5948' }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#3d5948' }} />
          <Input
            placeholder="Search publications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2"
            style={{ borderColor: '#e8e4db' }}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          All Types
        </Button>
        <Button variant="outline" className="gap-2">
          Status
        </Button>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publications.map((pub) => (
          <Card 
            key={pub.id} 
            className="overflow-hidden border-2 hover:shadow-lg transition-all group"
            style={{ borderColor: '#e8e4db' }}
          >
            {/* Thumbnail */}
            <div 
              className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200"
              style={{ backgroundColor: '#f4f2ed' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <FileImage className="w-16 h-16" style={{ color: '#3d5948', opacity: 0.3 }} />
              </div>
              
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Link href={`/dashboard/publications/${pub.id}`}>
                  <Button size="sm" className="gap-2 bg-white text-black hover:bg-gray-100">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <Button size="sm" className="gap-2 bg-white text-black hover:bg-gray-100">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </div>

              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: pub.status === 'published' ? '#142c1c' : '#f4f2ed',
                    color: pub.status === 'published' ? '#f4f2ed' : '#142c1c',
                  }}
                >
                  {pub.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Protection icon */}
              {pub.isProtected && (
                <div className="absolute top-3 right-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(20, 44, 28, 0.9)' }}
                  >
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#142c1c' }}>
                    {pub.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#3d5948' }}>
                    {pub.type} • {pub.pages} pages
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5" style={{ color: '#3d5948' }} />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: '#3d5948' }}>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{pub.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{pub.pages} pages</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/dashboard/publications/${pub.id}/analytics`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Button>
                </Link>
                <Link href={`/dashboard/publications/${pub.id}/share`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state if no publications */}
      {publications.length === 0 && (
        <Card className="p-12 text-center border-2" style={{ borderColor: '#e8e4db' }}>
          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: '#3d5948', opacity: 0.5 }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: '#142c1c' }}>
            No publications yet
          </h3>
          <p className="mb-6" style={{ color: '#3d5948' }}>
            Upload your first PDF to create an interactive flipbook
          </p>
          <Link href="/dashboard/publications/new">
            <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
              <Plus className="w-4 h-4" />
              Create Your First Publication
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
