'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Mail, Phone, Building, Download, Upload } from 'lucide-react'

interface Contact {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  company: string | null
  tags: string[]
  properties: Record<string, string>
  created_at: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'recent'>('recent')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newContact, setNewContact] = useState({ email: '', first_name: '', last_name: '', phone: '', company: '', tags: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json()
      if (data.contacts) setContacts(data.contacts)
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newContact,
          tags: newContact.tags ? newContact.tags.split(',').map(t => t.trim()) : [],
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to add contact')
        return
      }
      setContacts([data.contact, ...contacts])
      setShowAddModal(false)
      setNewContact({ email: '', first_name: '', last_name: '', phone: '', company: '', tags: '' })
    } catch (error) {
      console.error('Failed to add contact:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact?')) return
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      setContacts(contacts.filter(c => c.id !== id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags || [])))

  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch =
        (contact.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.company || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = tagFilter === 'all' || (contact.tags || []).includes(tagFilter)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim()
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim()
        return nameA.localeCompare(nameB)
      }
      if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const stats = {
    total: contacts.length,
    leads: contacts.filter(c => (c.tags || []).includes('Lead')).length,
    customers: contacts.filter(c => (c.tags || []).includes('Customer')).length,
    vip: contacts.filter(c => (c.tags || []).includes('VIP')).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Contacts</h1>
              <p className="text-stone-600 mt-1">Manage your contact database</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Contact
              </button>
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
            {allTags.length > 0 && (
              <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="px-4 py-2 border border-stone-300 rounded-lg">
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 border border-stone-300 rounded-lg">
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Contacts Table */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <p className="text-stone-600 mb-4">
              {contacts.length === 0 ? 'No contacts yet. Add your first contact to get started.' : 'No contacts match your search.'}
            </p>
            {contacts.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Add Your First Contact
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Added</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/contacts/${contact.id}`} className="block">
                        <div className="font-medium text-stone-900">
                          {contact.first_name || ''} {contact.last_name || ''}
                          {!contact.first_name && !contact.last_name && contact.email}
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
                        <div className="font-medium text-stone-900">{contact.company}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(contact.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/contacts/${contact.id}`}
                        className="text-stone-900 hover:text-stone-700 font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Add Contact</h2>
            <form onSubmit={addContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newContact.first_name}
                    onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newContact.last_name}
                    onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newContact.tags}
                  onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  placeholder="Lead, VIP"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-stone-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
