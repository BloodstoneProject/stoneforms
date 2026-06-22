'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, TrendingUp, Calendar, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Form {
  id: string
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/forms')
      const data = await res.json()

      if (!res.ok) {
        alert(`Error fetching forms: ${data.error || res.statusText}`)
        return
      }

      if (data.forms) {
        setForms(data.forms)
      }
    } catch (error) {
      console.error('Failed to fetch forms:', error)
      alert(`Network error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createForm = async () => {
    setCreating(true)
    try {
      console.log('Creating form...')
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Form' })
      })

      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)

      if (!res.ok) {
        // Show error to user
        if (data.upgrade) {
          alert(`Plan Limit Reached!\n\n${data.error}\n\nYou're on the ${data.plan} plan.\nCurrent forms: ${data.current}/${data.limit}\n\nUpgrade to Pro for unlimited forms!`)
        } else {
          alert(`Error: ${data.error || 'Failed to create form'}`)
        }
        setCreating(false)
        return
      }

      if (data.form) {
        console.log('Redirecting to:', `/dashboard/forms/${data.form.id}`)
        window.location.href = `/dashboard/forms/${data.form.id}`
      } else {
        alert('Error: No form returned from server')
        setCreating(false)
      }
    } catch (error) {
      console.error('Failed to create form:', error)
      alert(`Network error: ${error.message}`)
      setCreating(false)
    }
  }

  const duplicateForm = async (id: string) => {
    try {
      const res = await fetch(`/api/forms/${id}/duplicate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Failed to duplicate'); return }
      if (data.form) setForms([data.form, ...forms])
    } catch (error) {
      console.error('Failed to duplicate:', error)
    }
  }

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return

    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const data = await res.json()
        alert(`Error: ${data.error || 'Failed to delete form'}`)
        return
      }

      setForms(forms.filter(f => f.id !== id))
    } catch (error) {
      console.error('Failed to delete form:', error)
      alert(`Network error: ${error.message}`)
    }
  }

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: forms.length,
    published: forms.filter(f => f.status === 'published').length,
    draft: forms.filter(f => f.status === 'draft').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-9 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Forms</h1>
              <p className="text-muted-foreground mt-1">Manage all your forms</p>
            </div>
            <Button onClick={createForm} disabled={creating}>
              <Plus className="w-5 h-5" />
              {creating ? 'Creating...' : 'Create Form'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Stat label="Total Forms" value={stats.total} icon={<TrendingUp className="w-6 h-6" />} />
            <Stat label="Published" value={stats.published} icon={<Eye className="w-6 h-6" />} />
            <Stat label="Drafts" value={stats.draft} icon={<Calendar className="w-6 h-6" />} />
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-11"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-11 px-4 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No forms found. Create your first form to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div key={form.id} className="card-surface p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{form.title}</h3>
                  <Badge variant={form.status === 'published' ? 'solid' : form.status === 'draft' ? 'outline' : 'default'} className="capitalize">
                    {form.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{form.description || 'No description'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="text-foreground hover:text-muted-foreground font-medium text-sm"
                  >
                    Edit Form →
                  </Link>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateForm(form.id)}
                      title="Duplicate"
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteForm(form.id)}
                      title="Delete"
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  )
}
