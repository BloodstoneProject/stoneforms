'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Users, TrendingUp, Calendar, ExternalLink, Trash2 } from 'lucide-react'

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading forms...</p>
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
              <h1 className="text-3xl font-bold text-stone-900">Forms</h1>
              <p className="text-stone-600 mt-1">Manage all your forms</p>
            </div>
            <button 
              onClick={createForm}
              disabled={creating}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              {creating ? 'Creating...' : 'Create Form'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-stone-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-600 text-sm">Total Forms</p>
                  <p className="text-3xl font-bold text-stone-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-stone-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-stone-700" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm">Published</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">{stats.published}</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700 text-sm">Drafts</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.draft}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 border border-stone-300 rounded-lg"
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
            <p className="text-stone-600">No forms found. Create your first form to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div key={form.id} className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-900">{form.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    form.status === 'published' ? 'bg-green-100 text-green-800' :
                    form.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-stone-100 text-stone-800'
                  }`}>
                    {form.status}
                  </span>
                </div>
                <p className="text-stone-600 text-sm mb-6 line-clamp-2">{form.description || 'No description'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <Link 
                    href={`/dashboard/forms/${form.id}`}
                    className="text-stone-900 hover:text-stone-700 font-medium text-sm"
                  >
                    Edit Form →
                  </Link>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
