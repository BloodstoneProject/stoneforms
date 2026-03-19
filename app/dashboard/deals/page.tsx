'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, DollarSign, TrendingUp, Target, Award } from 'lucide-react'

interface Deal {
  id: string
  title: string
  value: number
  currency: string
  stage: string
  probability: number
  status: 'open' | 'won' | 'lost'
  notes: string | null
  created_at: string
  contact: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string
    company: string | null
  } | null
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [newDeal, setNewDeal] = useState({ title: '', contact_id: '', value: '', stage: 'lead', probability: '10' })
  const [saving, setSaving] = useState(false)

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-stone-100' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-100' },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-100' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-100' },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-100' },
  ]

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const [dealsRes, contactsRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/contacts'),
      ])
      const dealsData = await dealsRes.json()
      const contactsData = await contactsRes.json()
      if (dealsData.deals) setDeals(dealsData.deals)
      if (contactsData.contacts) setContacts(contactsData.contacts)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const addDeal = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDeal,
          value: parseFloat(newDeal.value) || 0,
          probability: parseInt(newDeal.probability) || 10,
          contact_id: newDeal.contact_id || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to create deal')
        return
      }
      setDeals([data.deal, ...deals])
      setShowAddModal(false)
      setNewDeal({ title: '', contact_id: '', value: '', stage: 'lead', probability: '10' })
    } catch (error) {
      console.error('Failed to create deal:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateDealStage = async (dealId: string, newStage: string) => {
    try {
      const stageProb: Record<string, number> = { lead: 10, qualified: 25, proposal: 50, negotiation: 75, closed: 100 }
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: newStage,
          probability: stageProb[newStage] || 50,
          status: newStage === 'closed' ? 'won' : 'open',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setDeals(deals.map(d => d.id === dealId ? data.deal : d))
      }
    } catch (error) {
      console.error('Failed to update deal:', error)
    }
  }

  const filteredDeals = deals.filter(deal => {
    const searchStr = `${deal.title} ${deal.contact?.first_name || ''} ${deal.contact?.last_name || ''} ${deal.contact?.company || ''}`.toLowerCase()
    return searchStr.includes(searchTerm.toLowerCase())
  })

  const openDeals = deals.filter(d => d.status === 'open')
  const stats = {
    total: deals.length,
    open: openDeals.length,
    won: deals.filter(d => d.status === 'won').length,
    totalValue: openDeals.reduce((sum, d) => sum + (d.value || 0), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Deal Pipeline</h1>
              <p className="text-stone-600 mt-1">Track sales opportunities</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Deal
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-stone-600 text-sm mb-1">
                <Target className="w-4 h-4" />
                Open Deals
              </div>
              <div className="text-2xl font-bold text-stone-900">{stats.open}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
                <Award className="w-4 h-4" />
                Won Deals
              </div>
              <div className="text-2xl font-bold text-green-900">{stats.won}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Pipeline Value
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {stats.totalValue > 0 ? `£${(stats.totalValue / 1000).toFixed(0)}k` : '£0'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-700 text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                Total Deals
              </div>
              <div className="text-2xl font-bold text-purple-900">{stats.total}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
        </div>

        {deals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <p className="text-stone-600 mb-4">No deals yet. Create your first deal to start tracking your pipeline.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Create First Deal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
            {stages.map(stage => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage.id)
              const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)

              return (
                <div key={stage.id} className="min-w-[240px]">
                  <div className={`${stage.color} rounded-lg p-4 mb-3`}>
                    <h3 className="font-semibold text-stone-900 mb-1">{stage.name}</h3>
                    <div className="text-sm text-stone-600">
                      {stageDeals.length} deals {stageValue > 0 && `- £${(stageValue / 1000).toFixed(0)}k`}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        className="bg-white border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-stone-900 mb-2 text-sm">{deal.title}</h4>
                        {deal.contact && (
                          <div className="text-xs text-stone-600 mb-3">
                            {deal.contact.first_name} {deal.contact.last_name}
                            {deal.contact.company && <span className="block">{deal.contact.company}</span>}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-stone-900">
                            £{deal.value > 0 ? (deal.value / 1000).toFixed(0) + 'k' : '0'}
                          </span>
                          <span className="text-xs text-stone-600">{deal.probability}%</span>
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-lg p-4 text-center">
                        <p className="text-stone-400 text-sm">No deals</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">New Deal</h2>
            <form onSubmit={addDeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  placeholder="e.g. Acme Corp - Pro Plan"
                />
              </div>
              {contacts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Contact</label>
                  <select
                    value={newDeal.contact_id}
                    onChange={(e) => setNewDeal({ ...newDeal, contact_id: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  >
                    <option value="">No contact</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.first_name || ''} {c.last_name || ''} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Value (£)</label>
                  <input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-stone-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg disabled:opacity-50">
                  {saving ? 'Creating...' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
