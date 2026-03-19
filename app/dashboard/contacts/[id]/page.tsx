'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building, Edit, Trash2, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

interface Deal {
  id: string
  title: string
  value: number
  stage: string
  probability: number
  status: string
  created_at: string
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchContact()
  }, [id])

  const fetchContact = async () => {
    try {
      const res = await fetch(`/api/contacts/${id}`)
      if (!res.ok) {
        setLoading(false)
        return
      }
      const data = await res.json()
      setContact(data.contact)
      setDeals(data.deals || [])
    } catch (error) {
      console.error('Failed to fetch contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteContact = async () => {
    if (!confirm('Delete this contact? This cannot be undone.')) return
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      router.push('/dashboard/contacts')
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Contact Not Found</h1>
          <Link href="/dashboard/contacts" className="text-stone-600 hover:text-stone-900">
            Back to Contacts
          </Link>
        </div>
      </div>
    )
  }

  const totalDealValue = deals.reduce((sum, d) => sum + (d.value || 0), 0)
  const wonDeals = deals.filter(d => d.status === 'won')

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/contacts" className="text-stone-600 hover:text-stone-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-stone-900">
                  {contact.first_name || ''} {contact.last_name || ''}
                  {!contact.first_name && !contact.last_name && contact.email}
                </h1>
                {contact.company && (
                  <p className="text-stone-600 mt-1">{contact.company}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={deleteContact}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
              >
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
              <div className="text-2xl font-bold text-blue-900">
                {totalDealValue > 0 ? `£${(totalDealValue / 1000).toFixed(0)}k` : '£0'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-700 text-sm mb-1">Customer Since</div>
              <div className="text-lg font-bold text-purple-900">
                {new Date(contact.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
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
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500">Email</div>
                    <a href={`mailto:${contact.email}`} className="text-stone-900 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
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

            {(contact.tags || []).length > 0 && (
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
            )}
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-stone-200">
              <div className="border-b border-stone-200 px-6">
                <button
                  onClick={() => setActiveTab('deals')}
                  className={`py-4 border-b-2 font-medium mr-6 ${
                    activeTab === 'deals' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-600'
                  }`}
                >
                  Deals ({deals.length})
                </button>
              </div>

              <div className="p-6">
                {deals.length === 0 ? (
                  <p className="text-stone-500 text-center py-8">No deals associated with this contact.</p>
                ) : (
                  <div className="space-y-3">
                    {deals.map(deal => (
                      <div
                        key={deal.id}
                        className="p-4 border border-stone-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-stone-900">{deal.title}</h4>
                          <span className="text-sm font-semibold text-stone-900">
                            £{deal.value > 0 ? (deal.value / 1000).toFixed(0) + 'k' : '0'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-600">
                          <span className="capitalize">{deal.stage}</span>
                          <span>-</span>
                          <span>{deal.probability}% probability</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            deal.status === 'won' ? 'bg-green-100 text-green-800' :
                            deal.status === 'lost' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {deal.status}
                          </span>
                        </div>
                      </div>
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
