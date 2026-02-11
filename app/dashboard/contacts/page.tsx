'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus,
  Search,
  Filter,
  Upload,
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  MoreVertical,
  TrendingUp,
  FileText,
  Eye
} from 'lucide-react'

// Mock contact data
const mockContacts = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    tags: ['Customer', 'VIP'],
    source: 'Customer Feedback Survey',
    lastActivity: '2024-02-09T10:30:00',
    createdAt: '2024-01-15',
    dealValue: 15000,
    submissions: 3,
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@company.com',
    phone: '+1 (555) 234-5678',
    company: 'Tech Innovations',
    tags: ['Lead', 'Hot'],
    source: 'Lead Capture Form',
    lastActivity: '2024-02-09T09:15:00',
    createdAt: '2024-01-20',
    dealValue: 25000,
    submissions: 2,
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.w@startup.io',
    phone: '+1 (555) 345-6789',
    company: 'Startup Inc',
    tags: ['Customer'],
    source: 'Event Registration',
    lastActivity: '2024-02-08T16:45:00',
    createdAt: '2024-01-25',
    dealValue: 8000,
    submissions: 4,
  },
  {
    id: '4',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 456-7890',
    company: 'Freelance',
    tags: ['Lead'],
    source: 'Product Interest Survey',
    lastActivity: '2024-02-08T14:20:00',
    createdAt: '2024-02-01',
    dealValue: 0,
    submissions: 1,
  },
]

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = !selectedTag || contact.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  const stats = {
    total: mockContacts.length,
    customers: mockContacts.filter(c => c.tags.includes('Customer')).length,
    leads: mockContacts.filter(c => c.tags.includes('Lead')).length,
    totalValue: mockContacts.reduce((sum, c) => sum + c.dealValue, 0),
  }

  const allTags = Array.from(new Set(mockContacts.flatMap(c => c.tags)))

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Contacts</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Manage your customers and leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
          <Link href="/dashboard/contacts/new">
            <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Contacts</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#142c1c' }}>
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Customers</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.customers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Active Leads</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.leads}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#770a19' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Pipeline Value</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  ${(stats.totalValue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3d5948' }} />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={!selectedTag ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(null)}
            style={!selectedTag ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="gap-1"
              style={selectedTag === tag ? { backgroundColor: '#142c1c', color: '#f4f2ed' } : {}}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Contacts List */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>All Contacts ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto mb-4" style={{ color: '#3d5948' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#142c1c' }}>
                No contacts found
              </h3>
              <p className="mb-6" style={{ color: '#3d5948' }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                  style={{ borderColor: '#e8e4db' }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#142c1c' }}
                    >
                      <span className="text-lg font-semibold text-white">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Link href={`/dashboard/contacts/${contact.id}`}>
                          <h3 className="font-semibold hover:underline" style={{ color: '#142c1c' }}>
                            {contact.firstName} {contact.lastName}
                          </h3>
                        </Link>
                        <div className="flex gap-1">
                          {contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs font-medium rounded-full"
                              style={
                                tag === 'VIP' || tag === 'Hot'
                                  ? { backgroundColor: '#770a19', color: '#f4f2ed' }
                                  : tag === 'Customer'
                                  ? { backgroundColor: '#3d5948', color: '#f4f2ed' }
                                  : { backgroundColor: '#e8e4db', color: '#3d5948' }
                              }
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm" style={{ color: '#3d5948' }}>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {contact.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {contact.submissions} submissions
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden lg:flex flex-col items-end gap-1">
                      {contact.dealValue > 0 && (
                        <span className="text-lg font-bold" style={{ color: '#142c1c' }}>
                          ${(contact.dealValue / 1000).toFixed(0)}k
                        </span>
                      )}
                      <span className="text-xs" style={{ color: '#3d5948' }}>
                        Last active {new Date(contact.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/contacts/${contact.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
