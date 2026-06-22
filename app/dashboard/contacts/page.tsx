'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-9 w-48" />
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contacts</h1>
              <p className="text-muted-foreground mt-1">Manage your contact database</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Contacts" value={stats.total} />
            <StatCard label="Leads" value={stats.leads} />
            <StatCard label="Customers" value={stats.customers} />
            <StatCard label="VIP" value={stats.vip} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="card-surface p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {allTags.length > 0 && (
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="h-10 px-4 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-4 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Contacts Table */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12 card-surface">
            <p className="text-muted-foreground mb-4">
              {contacts.length === 0 ? 'No contacts yet. Add your first contact to get started.' : 'No contacts match your search.'}
            </p>
            {contacts.length === 0 && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5" />
                Add Your First Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="card-surface overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Added</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/contacts/${contact.id}`} className="block">
                        <div className="font-medium text-foreground">
                          {contact.first_name || ''} {contact.last_name || ''}
                          {!contact.first_name && !contact.last_name && contact.email}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {contact.company && (
                        <div className="font-medium text-foreground">{contact.company}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(contact.tags || []).slice(0, 2).map(tag => (
                          <Badge key={tag} variant="default">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/contacts/${contact.id}`}
                        className="text-foreground hover:text-muted-foreground font-medium text-sm"
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
          <div className="card-surface p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Add Contact</h2>
            <form onSubmit={addContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                <Input
                  type="email"
                  required
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                  <Input
                    type="text"
                    value={newContact.first_name}
                    onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                  <Input
                    type="text"
                    value={newContact.last_name}
                    onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <Input
                  type="text"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                <Input
                  type="text"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tags (comma separated)</label>
                <Input
                  type="text"
                  value={newContact.tags}
                  onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                  placeholder="Lead, VIP"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Adding...' : 'Add Contact'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-surface p-4">
      <div className="text-muted-foreground text-sm mb-1">{label}</div>
      <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  )
}
