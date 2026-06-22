'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, DollarSign, TrendingUp, Target, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

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
    { id: 'lead', name: 'Lead' },
    { id: 'qualified', name: 'Qualified' },
    { id: 'proposal', name: 'Proposal' },
    { id: 'negotiation', name: 'Negotiation' },
    { id: 'closed', name: 'Closed Won' },
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="h-9 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Deal Pipeline</h1>
              <p className="text-muted-foreground mt-1">Track sales opportunities</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="self-start sm:self-auto">
              <Plus className="w-5 h-5" />
              New Deal
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Open Deals" value={String(stats.open)} icon={<Target className="w-4 h-4" />} />
            <StatCard label="Won Deals" value={String(stats.won)} icon={<Award className="w-4 h-4" />} />
            <StatCard
              label="Pipeline Value"
              value={stats.totalValue > 0 ? `£${(stats.totalValue / 1000).toFixed(0)}k` : '£0'}
              icon={<DollarSign className="w-4 h-4" />}
            />
            <StatCard label="Total Deals" value={String(stats.total)} icon={<TrendingUp className="w-4 h-4" />} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="card-surface p-4 mb-6">
          <div className="relative">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              aria-label="Search deals"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {deals.length === 0 ? (
          <div className="text-center py-12 card-surface">
            <p className="text-muted-foreground mb-4">No deals yet. Create your first deal to start tracking your pipeline.</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5" />
              Create First Deal
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage.id)
              const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)

              return (
                <div key={stage.id} className="w-[260px] shrink-0">
                  <div className="bg-muted rounded-md p-4 mb-3 border border-border">
                    <h3 className="font-semibold text-foreground mb-1">{stage.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {stageDeals.length} deals {stageValue > 0 && `- £${(stageValue / 1000).toFixed(0)}k`}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        className="card-surface p-4 hover:bg-muted/30 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground mb-2 text-sm">{deal.title}</h4>
                        {deal.contact && (
                          <div className="text-xs text-muted-foreground mb-3">
                            {deal.contact.first_name} {deal.contact.last_name}
                            {deal.contact.company && <span className="block">{deal.contact.company}</span>}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-foreground">
                            £{deal.value > 0 ? (deal.value / 1000).toFixed(0) + 'k' : '0'}
                          </span>
                          <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="bg-muted/40 border border-dashed border-border rounded-md p-4 text-center">
                        <p className="text-muted-foreground text-sm">No deals</p>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-6 z-50" onClick={() => setShowAddModal(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-deal-title"
            className="card-surface p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="new-deal-title" className="text-2xl font-semibold tracking-tight text-foreground mb-6">New Deal</h2>
            <form onSubmit={addDeal} className="space-y-4">
              <div>
                <label htmlFor="deal-title" className="block text-sm font-medium text-foreground mb-1">Deal Title *</label>
                <Input
                  id="deal-title"
                  type="text"
                  required
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="e.g. Acme Corp - Pro Plan"
                />
              </div>
              {contacts.length > 0 && (
                <div>
                  <label htmlFor="deal-contact" className="block text-sm font-medium text-foreground mb-1">Contact</label>
                  <select
                    id="deal-contact"
                    value={newDeal.contact_id}
                    onChange={(e) => setNewDeal({ ...newDeal, contact_id: e.target.value })}
                    className="w-full h-10 px-4 rounded-md border border-input bg-card text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <label htmlFor="deal-value" className="block text-sm font-medium text-foreground mb-1">Value (£)</label>
                  <Input
                    id="deal-value"
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label htmlFor="deal-stage" className="block text-sm font-medium text-foreground mb-1">Stage</label>
                  <select
                    id="deal-stage"
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    className="w-full h-10 px-4 rounded-md border border-input bg-card text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Creating...' : 'Create Deal'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  )
}
