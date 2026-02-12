'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, DollarSign, TrendingUp, Target, Award } from 'lucide-react'
import { mockDeals, getContactById } from '@/lib/mock-data'

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-stone-100' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-100' },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-100' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-100' },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100' },
  ]

  const filteredDeals = mockDeals.filter(deal => {
    const contact = getContactById(deal.contactId)
    const searchStr = `${deal.title} ${contact?.firstName} ${contact?.lastName} ${contact?.company}`.toLowerCase()
    return searchStr.includes(searchTerm.toLowerCase())
  })

  const stats = {
    total: mockDeals.length,
    open: mockDeals.filter(d => d.status === 'open').length,
    won: mockDeals.filter(d => d.status === 'won').length,
    totalValue: mockDeals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.value, 0),
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Deal Pipeline</h1>
              <p className="text-stone-600 mt-1">Track sales opportunities</p>
            </div>
            <Link href="/dashboard/deals/new" className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium">
              <Plus className="w-5 h-5" />
              New Deal
            </Link>
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
              <div className="text-2xl font-bold text-blue-900">£{(stats.totalValue / 1000).toFixed(0)}k</div>
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

        <div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage.id)
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0)

            return (
              <div key={stage.id} className="min-w-[280px]">
                <div className={`${stage.color} rounded-lg p-4 mb-3`}>
                  <h3 className="font-semibold text-stone-900 mb-1">{stage.name}</h3>
                  <div className="text-sm text-stone-600">
                    {stageDeals.length} deals · £{(stageValue / 1000).toFixed(0)}k
                  </div>
                </div>

                <div className="space-y-3">
                  {stageDeals.map(deal => {
                    const contact = getContactById(deal.contactId)
                    return (
                      <Link
                        key={deal.id}
                        href={`/dashboard/deals/${deal.id}`}
                        className="block bg-white border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-stone-900 mb-2 text-sm">
                          {deal.title}
                        </h4>
                        
                        <div className="text-xs text-stone-600 mb-3">
                          {contact?.firstName} {contact?.lastName}
                          {contact?.company && <span className="block">{contact.company}</span>}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-stone-900">
                            £{(deal.value / 1000).toFixed(0)}k
                          </span>
                          <span className="text-xs text-stone-600">
                            {deal.probability}%
                          </span>
                        </div>
                      </Link>
                    )
                  })}

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
      </div>
    </div>
  )
}
