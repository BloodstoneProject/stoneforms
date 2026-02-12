'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Mail, Phone, Building, Tag, Download, Upload, Filter } from 'lucide-react'
import { mockContacts, getContactDeals } from '@/lib/mock-data'

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'recent'>('recent')

  // Get unique tags
  const allTags = Array.from(new Set(mockContacts.flatMap(c => c.tags)))

  // Filter and sort
  const filteredContacts = mockContacts
    .filter(contact => {
      const matchesSearch = 
        contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = tagFilter === 'all' || contact.tags.includes(tagFilter)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim()
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim()
        return nameA.localeCompare(nameB)
      }
      if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const stats = {
    total: mockContacts.length,
    leads: mockContacts.filter(c => c.tags.includes('Lead')).length,
    customers: mockContacts.filter(c => c.tags.includes('Customer')).length,
    vip: mockContacts.filter(c => c.tags.includes('VIP')).length,
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Contacts</h1>
              <p className="text-stone-600 mt-1">Manage your contact database</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
              <Link href="/dashboard/contacts/new" className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium">
                <Plus className="w-5 h-5" />
                Add Contact
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="text-stone-600 text-sm mb-1">Total Contacts</div>
              <div className="text-2xl font-bold text-stone-900">{stats.total}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 text-sm mb-1">Leads</div>
              <div className="text-2xl font-bold text-blue-900">{stats.leads}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 text-sm mb-1">Customers</div>
              <div className="text-2xl font-bold text-green-900">{stats.customers}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-700 text-sm mb-1">VIP</div>
              <div className="text-2xl font-bold text-purple-900">{stats.vip}</div>
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
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="px-4 py-2 border border-stone-300 rounded-lg">
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 border border-stone-300 rounded-lg">
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Added</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredContacts.slice(0, 50).map((contact) => {
                const deals = getContactDeals(contact.id)
                return (
                  <tr key={contact.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/contacts/${contact.id}`} className="block">
                        <div className="font-medium text-stone-900">
                          {contact.firstName || ''} {contact.lastName || ''}
                        </div>
                        <div className="text-sm text-stone-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-sm text-stone-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {contact.company && (
                        <div>
                          <div className="font-medium text-stone-900">{contact.company}</div>
                          {contact.position && (
                            <div className="text-sm text-stone-600">{contact.position}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">{contact.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/contacts/${contact.id}`} 
                        className="text-stone-900 hover:text-stone-700 font-medium text-sm"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <p className="text-stone-600 mb-4">No contacts found</p>
            <Link href="/dashboard/contacts/new" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg">
              <Plus className="w-5 h-5" />
              Add Your First Contact
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
