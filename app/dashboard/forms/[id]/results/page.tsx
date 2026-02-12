'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Mail,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

// Mock submission data
const mockSubmissions = [
  {
    id: '1',
    email: 'sarah.johnson@example.com',
    name: 'Sarah Johnson',
    submittedAt: '2024-02-09T10:30:00',
    answers: {
      rating: 5,
      feedback: 'Great experience!',
      recommend: true,
    },
    timeSpent: 127, // seconds
    device: 'Desktop',
  },
  {
    id: '2',
    email: 'michael.chen@company.com',
    name: 'Michael Chen',
    submittedAt: '2024-02-09T09:15:00',
    answers: {
      rating: 4,
      feedback: 'Very good, could be better',
      recommend: true,
    },
    timeSpent: 203,
    device: 'Mobile',
  },
  {
    id: '3',
    email: 'emma.wilson@startup.io',
    name: 'Emma Wilson',
    submittedAt: '2024-02-08T16:45:00',
    answers: {
      rating: 5,
      feedback: 'Love the interface!',
      recommend: true,
    },
    timeSpent: 89,
    device: 'Desktop',
  },
  {
    id: '4',
    email: 'john.doe@email.com',
    name: 'John Doe',
    submittedAt: '2024-02-08T14:20:00',
    answers: {
      rating: 3,
      feedback: 'It\'s okay',
      recommend: false,
    },
    timeSpent: 156,
    device: 'Tablet',
  },
]

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)

  const filteredSubmissions = mockSubmissions.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: mockSubmissions.length,
    today: 2,
    avgRating: (mockSubmissions.reduce((sum, s) => sum + s.answers.rating, 0) / mockSubmissions.length).toFixed(1),
    avgTime: Math.round(mockSubmissions.reduce((sum, s) => sum + s.timeSpent, 0) / mockSubmissions.length),
    recommendRate: Math.round((mockSubmissions.filter(s => s.answers.recommend).length / mockSubmissions.length) * 100),
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/forms">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Forms
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>
              Form Results
            </h1>
            <p style={{ color: '#3d5948' }} className="mt-1">
              Customer Feedback Survey
            </p>
          </div>
        </div>
        <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Responses</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.total}</p>
            <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: '#3d5948' }}>
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.today} today</span>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Avg. Rating</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.avgRating}/5</p>
            <div className="flex gap-0.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(Number(stats.avgRating)) ? 'opacity-100' : 'opacity-20'}>
                  ⭐
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Avg. Time</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{Math.floor(stats.avgTime / 60)}:{(stats.avgTime % 60).toString().padStart(2, '0')}</p>
            <p className="text-xs mt-2" style={{ color: '#3d5948' }}>per response</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Recommend Rate</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.recommendRate}%</p>
            <div className="w-full h-1 rounded-full mt-2" style={{ backgroundColor: '#e8e4db' }}>
              <div 
                className="h-full rounded-full" 
                style={{ width: `${stats.recommendRate}%`, backgroundColor: '#3d5948' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Completion Rate</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>87%</p>
            <p className="text-xs mt-2" style={{ color: '#3d5948' }}>234 of 269 started</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3d5948' }} />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Submissions Table */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>All Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e8e4db' }}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#142c1c' }}
                  >
                    <span className="text-sm font-semibold text-white">
                      {submission.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium" style={{ color: '#142c1c' }}>
                        {submission.name}
                      </h3>
                      <span className="text-sm" style={{ color: '#3d5948' }}>
                        {submission.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: '#3d5948' }}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                      <span>Rating: {submission.answers.rating}/5</span>
                      <span>{submission.device}</span>
                      <span>{Math.floor(submission.timeSpent / 60)}:{(submission.timeSpent % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedSubmission(submission.id)}
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
