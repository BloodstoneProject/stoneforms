'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building, Edit, Trash2, DollarSign, FileText } from 'lucide-react'
import { getContactById, getContactDeals } from '@/lib/mock-data'

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const contact = getContactById(id)
  const deals = getContactDeals(id)
  const [activeTab, setActiveTab] = useState('overview')

  if (!contact) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Contact Not Found</h1>
          <Link href="/dashboard/contacts" className="text-stone-600 hover:text-stone-900">
            ← Back to Contacts
          </Link>
        </div>
      </div>
    )
  }

  const totalDealValue = deals.reduce((sum, d) => sum + d.value, 0)
  const wonDeals = deals.filter(d => d.status === 'won')

  const activities = [
    { type: 'deal', text: 'Deal created', date: new Date(2024, 1, 15), deal: deals[0] },
    { type: 'note', text: 'Added note', date: new Date(2024, 1, 10) },
    { type: 'contact', text: 'Contact created', date: new Date(contact.createdAt) },
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/contacts" className="text-stone-600 hover:text-stone-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-stone-900">
                  {contact.firstName} {contact.lastName}
                </h1>
                {contact.position && contact.company && (
                  <p className="text-stone-600 mt-1">
                    {contact.position} at {contact.company}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="text-stone-600 text-sm mb-1">Total Deals</div>
              <div className="text-2xl font-bold text-stone-900">{deals.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 text-sm mb-1">Won Deals</div>
              <div className="text-2xl font-bold text-green-900">{wonDeals.length}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 text-sm mb-1">Total Value</div>
              <div className="text-2xl font-bold text-blue-900">£{(totalDealValue / 1000).toFixed(0)}k</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-700 text-sm mb-1">Customer Since</div>
              <div className="text-lg font-bold text-purple-900">
                {new Date(contact.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-stone-400" />
                    <div>
                      <div className="text-xs text-stone-500">Email</div>
                      <a href={`mailto:${contact.email}`} className="text-stone-900 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-stone-400" />
                    <div>
                      <div className="text-xs text-stone-500">Phone</div>
                      <a href={`tel:${contact.phone}`} className="text-stone-900 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact.company && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-stone-400" />
                    <div>
                      <div className="text-xs text-stone-500">Company</div>
                      <div className="text-stone-900">{contact.company}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-stone-200">
              <div className="border-b border-stone-200 flex gap-6 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 border-b-2 font-medium ${
                    activeTab === 'overview' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-600'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('deals')}
                  className={`py-4 border-b-2 font-medium ${
                    activeTab === 'deals' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-600'
                  }`}
                >
                  Deals ({deals.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-stone-900 mb-3">Recent Deals</h3>
                    <div className="space-y-3">
                      {deals.slice(0, 3).map(deal => (
                        <Link
                          key={deal.id}
                          href={`/dashboard/deals/${deal.id}`}
                          className="block p-4 border border-stone-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-stone-900">{deal.title}</h4>
                            <span className="text-sm font-semibold text-stone-900">
                              £{(deal.value / 1000).toFixed(0)}k
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-stone-600">
                            <span className="capitalize">{deal.stage}</span>
                            <span>•</span>
                            <span>{deal.probability}% probability</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'deals' && (
                  <div className="space-y-3">
                    {deals.map(deal => (
                      <Link
                        key={deal.id}
                        href={`/dashboard/deals/${deal.id}`}
                        className="block p-4 border border-stone-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-stone-900">{deal.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-stone-600 mt-1">
                              <span className="capitalize">{deal.stage}</span>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-stone-900">
                            £{(deal.value / 1000).toFixed(0)}k
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
