'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building, Edit, Trash2, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
  const { id } = (useParams() as any)
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="h-9 w-64" />
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

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-4">Contact Not Found</h1>
          <Link href="/dashboard/contacts" className="text-muted-foreground hover:text-foreground">
            Back to Contacts
          </Link>
        </div>
      </div>
    )
  }

  const totalDealValue = deals.reduce((sum, d) => sum + (d.value || 0), 0)
  const wonDeals = deals.filter(d => d.status === 'won')

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Link
                href="/dashboard/contacts"
                aria-label="Back to contacts"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground truncate">
                  {contact.first_name || ''} {contact.last_name || ''}
                  {!contact.first_name && !contact.last_name && contact.email}
                </h1>
                {contact.company && (
                  <p className="text-muted-foreground mt-1 truncate">{contact.company}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" onClick={deleteContact} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Deals" value={String(deals.length)} />
            <StatCard label="Won Deals" value={String(wonDeals.length)} />
            <StatCard label="Total Value" value={totalDealValue > 0 ? `£${(totalDealValue / 1000).toFixed(0)}k` : '£0'} />
            <StatCard
              label="Customer Since"
              value={new Date(contact.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="card-surface p-6">
              <h2 className="font-semibold tracking-tight text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <a href={`mailto:${contact.email}`} className="text-foreground hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <a href={`tel:${contact.phone}`} className="text-foreground hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Company</div>
                      <div className="text-foreground">{contact.company}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(contact.tags || []).length > 0 && (
              <div className="card-surface p-6">
                <h2 className="font-semibold tracking-tight text-foreground mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map(tag => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="card-surface">
              <div className="border-b border-border px-6">
                <button
                  onClick={() => setActiveTab('deals')}
                  className={`py-4 border-b-2 font-medium mr-6 transition-colors ${
                    activeTab === 'deals' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'
                  }`}
                >
                  Deals ({deals.length})
                </button>
              </div>

              <div className="p-6">
                {deals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No deals associated with this contact.</p>
                ) : (
                  <div className="space-y-3">
                    {deals.map(deal => (
                      <div
                        key={deal.id}
                        className="p-4 border border-border rounded-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{deal.title}</h4>
                          <span className="text-sm font-semibold text-foreground">
                            £{deal.value > 0 ? (deal.value / 1000).toFixed(0) + 'k' : '0'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="capitalize">{deal.stage}</span>
                          <span>-</span>
                          <span>{deal.probability}% probability</span>
                          <Badge variant={deal.status === 'won' ? 'solid' : deal.status === 'lost' ? 'destructive' : 'default'} className="capitalize">
                            {deal.status}
                          </Badge>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-4">
      <div className="text-muted-foreground text-sm mb-1">{label}</div>
      <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  )
}
