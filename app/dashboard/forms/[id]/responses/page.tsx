'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Upload, Trash2, Eye, Search, TrendingUp, X, Loader2, Tag, ChevronLeft, ChevronRight, FileJson, Plus } from 'lucide-react'

interface Response {
  id: string
  answers: Record<string, any>
  metadata?: Record<string, any> | null
  status?: string | null
  created_at: string
}

const PAGE_SIZE = 50

// Review status options stored in metadata.status.
const STATUS_OPTIONS = ['new', 'reviewed', 'flagged', 'archived'] as const
const STATUS_TINTS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  reviewed: 'bg-green-500/10 text-green-600 border-green-500/20',
  flagged: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  archived: 'bg-secondary text-muted-foreground border-border',
}

interface Field {
  id: string
  label: string
  field_type: string
}

// Render a composite address object as a readable comma string.
function formatAddress(value: any): string {
  if (!value || typeof value !== 'object') return ''
  const parts = [value.line1, value.line2, value.city, value.state, value.postal, value.country]
  return parts.filter((p) => typeof p === 'string' && p.trim()).join(', ')
}

// Safely turn any answer value (string, number, boolean, string[], address
// object, signature data-URL) into display text.
function formatAnswer(value: any, fieldType?: string): string {
  if (value === null || value === undefined) return ''
  if (fieldType === 'address' || (value && typeof value === 'object' && !Array.isArray(value) && ('line1' in value || 'city' in value || 'postal' in value))) {
    return formatAddress(value)
  }
  // Signature: never dump the giant data URL.
  if (fieldType === 'signature' || (typeof value === 'string' && value.startsWith('data:image'))) {
    return typeof value === 'string' && value.trim() ? '[signature]' : ''
  }
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

// Escape a value for safe CSV output (RFC 4180): wrap in quotes, double inner quotes.
function csvCell(value: any, fieldType?: string): string {
  return `"${formatAnswer(value, fieldType).replace(/"/g, '""')}"`
}

// Escape an already-formatted plain string for CSV.
function csvText(text: string): string {
  return `"${(text ?? '').replace(/"/g, '""')}"`
}

export default function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = (useParams() as any)
  
  const [responses, setResponses] = useState<Response[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Server-side filter / sort / pagination state.
  const [completion, setCompletion] = useState<'all' | 'complete' | 'partial'>('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    // Fetch fields once.
    fetch(`/api/forms/${formId}/fields`)
      .then((r) => r.json())
      .then((d) => { if (d.fields) setFields(d.fields) })
      .catch((e) => console.error('Failed to fetch fields:', e))
  }, [formId])

  const fetchResponses = useCallback(async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      qs.set('limit', String(PAGE_SIZE))
      qs.set('offset', String(page * PAGE_SIZE))
      qs.set('sort', sort)
      if (completion !== 'all') qs.set('completion', completion)
      if (statusFilter) qs.set('status', statusFilter)
      if (tagFilter) qs.set('tag', tagFilter)
      if (searchTerm.trim()) qs.set('search', searchTerm.trim())
      if (fromDate) qs.set('from', fromDate)
      if (toDate) qs.set('to', toDate)

      const res = await fetch(`/api/forms/${formId}/responses?${qs.toString()}`)
      const data = await res.json()
      setResponses(data.responses || [])
      setTotal(typeof data.total === 'number' ? data.total : (data.responses?.length || 0))
      if (Array.isArray(data.tags)) setAvailableTags(data.tags)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }, [formId, page, sort, completion, statusFilter, tagFilter, searchTerm, fromDate, toDate])

  // Debounced refetch on any filter change.
  useEffect(() => {
    const t = setTimeout(() => { fetchResponses() }, 250)
    return () => clearTimeout(t)
  }, [fetchResponses])

  // Reset to first page whenever a filter (not the page itself) changes.
  useEffect(() => {
    setPage(0)
  }, [completion, statusFilter, tagFilter, searchTerm, fromDate, toDate, sort])

  const fetchData = fetchResponses

  // Persist status/tags for a single response (metadata-only PATCH).
  const updateResponseMeta = async (responseId: string, patch: { status?: string | null; tags?: string[] | null }) => {
    try {
      const res = await fetch(`/api/forms/${formId}/responses/${responseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) return
      const newMeta = data.metadata || {}
      const apply = (r: Response): Response =>
        r.id === responseId ? { ...r, metadata: { ...(r.metadata || {}), ...newMeta } } : r
      setResponses((prev) => prev.map(apply))
      setSelectedResponse((prev) => (prev && prev.id === responseId ? apply(prev) : prev))
    } catch (error) {
      console.error('Failed to update response:', error)
    }
  }

  const exportToCSV = () => {
    if (responses.length === 0) {
      alert('No responses to export')
      return
    }

    const hasQuiz = responses.some(r => r.metadata?.quiz)

    // Create CSV headers
    const headers = ['Submitted At', ...fields.map(f => f.label), ...(hasQuiz ? ['Score'] : [])]

    // Build each row as already-CSV-escaped cells (handles arrays/booleans/
    // numbers/address objects/signatures, plus quiz score).
    const rowCells = responses.map(response => {
      const cells = [
        csvText(new Date(response.created_at).toLocaleString()),
        ...fields.map(field => csvCell(response.answers[field.id], field.field_type)),
      ]
      if (hasQuiz) {
        const q = response.metadata?.quiz
        cells.push(csvText(q ? `${q.total}${q.max ? ` / ${q.max}` : ''}` : ''))
      }
      return cells
    })

    // Combine into CSV string
    const csvContent = [
      headers.map(csvText).join(','),
      ...rowCells.map(cells => cells.join(',')),
    ].join('\r\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-responses-${formId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    if (responses.length === 0) {
      alert('No responses to export')
      return
    }
    // Map each response to a readable object keyed by field label, plus metadata.
    const out = responses.map((response) => {
      const obj: Record<string, any> = {
        id: response.id,
        submitted_at: response.created_at,
      }
      for (const field of fields) {
        obj[field.label] = response.answers[field.id] ?? null
      }
      if (response.metadata?.status) obj.status = response.metadata.status
      if (Array.isArray(response.metadata?.tags)) obj.tags = response.metadata.tags
      if (response.metadata?.quiz) obj.quiz = response.metadata.quiz
      if (response.metadata?.url_params) obj.url_params = response.metadata.url_params
      return obj
    })
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-responses-${formId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importFromCSV = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      
      // Map CSV headers to field IDs
      const fieldMap: Record<string, string> = {}
      headers.forEach((header, i) => {
        const field = fields.find(f => f.label === header)
        if (field) fieldMap[i] = field.id
      })

      // Parse rows
      const newResponses = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
        const responseData: Record<string, string> = {}
        
        values.forEach((value, idx) => {
          if (fieldMap[idx]) {
            responseData[fieldMap[idx]] = value
          }
        })

        if (Object.keys(responseData).length > 0) {
          // Submit via API
          await fetch(`/api/forms/${formId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: responseData })
          })
          
          newResponses.push({
            id: `temp-${i}`,
            answers: responseData,
            created_at: new Date().toISOString()
          })
        }
      }

      alert(`Imported ${newResponses.length} responses`)
      fetchData() // Refresh
    }
    
    input.click()
  }

  const deleteResponse = async (responseId: string) => {
    if (!confirm('Delete this response?')) return

    try {
      await fetch(`/api/forms/${formId}/responses/${responseId}`, {
        method: 'DELETE'
      })
      if (selectedResponse?.id === responseId) setSelectedResponse(null)
      fetchResponses()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const deleteAllResponses = async () => {
    if (!confirm(`Delete all ${total} responses? This cannot be undone!`)) return

    try {
      await fetch(`/api/forms/${formId}/responses`, {
        method: 'DELETE'
      })
      setPage(0)
      fetchResponses()
      alert('All responses deleted')
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const hasQuizScores = responses.some(r => r.metadata?.quiz)

  // Responses are already filtered server-side; render them as-is.
  const filteredResponses = responses

  const hasActiveFilters = !!(searchTerm || statusFilter || tagFilter || fromDate || toDate || completion !== 'all')
  const pageStart = total === 0 ? 0 : page * PAGE_SIZE + 1
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, total)
  const hasMore = (page + 1) * PAGE_SIZE < total

  if (loading && responses.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading responses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/forms/${formId}`} aria-label="Back to form builder" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl heading-tight text-foreground">Responses</h1>
                <p className="text-muted-foreground mt-1">{total} total submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href={`/dashboard/forms/${formId}/analytics`}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Link>
              <button
                onClick={importFromCSV}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
              <button
                onClick={exportToCSV}
                disabled={responses.length === 0}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={exportToJSON}
                disabled={responses.length === 0}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary disabled:opacity-50"
              >
                <FileJson className="w-4 h-4" />
                Export JSON
              </button>
              {total > 0 && (
                <button
                  onClick={deleteAllResponses}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter / search bar */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={completion}
              onChange={(e) => setCompletion(e.target.value as any)}
              aria-label="Filter by completion"
              className="px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
            >
              <option value="all">All submissions</option>
              <option value="complete">Completed</option>
              <option value="partial">Pending / partial</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
            >
              <option value="">Any status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              aria-label="Sort order"
              className="px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              From
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2 py-1.5 border border-input rounded-md bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              To
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2 py-1.5 border border-input rounded-md bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </label>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchTerm(''); setStatusFilter(''); setTagFilter('')
                  setFromDate(''); setToDate(''); setCompletion('all')
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" /> Clear filters
              </button>
            )}
          </div>

          {/* Tag filter chips */}
          {availableTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Tags:</span>
              {availableTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTagFilter(tagFilter === t ? '' : t)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    tagFilter === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Responses Table */}
        {filteredResponses.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? 'No responses match your search' : 'No responses yet'}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Submitted</th>
                    {fields.slice(0, 3).map(field => (
                      <th key={field.id} className="text-left px-6 py-4 text-sm font-medium text-foreground">
                        {field.label}
                      </th>
                    ))}
                    {hasQuizScores && (
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Score</th>
                    )}
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((response) => (
                    <tr key={response.id} className="border-b border-border hover:bg-secondary">
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(response.created_at).toLocaleString()}
                      </td>
                      {fields.slice(0, 3).map(field => {
                        const text = formatAnswer(response.answers[field.id], field.field_type)
                        return (
                          <td key={field.id} className="px-6 py-4 text-sm text-foreground">
                            {text ? text.slice(0, 50) : '-'}
                            {text.length > 50 && '…'}
                          </td>
                        )
                      })}
                      {hasQuizScores && (
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {response.metadata?.quiz
                            ? `${response.metadata.quiz.total}${response.metadata.quiz.max ? ` / ${response.metadata.quiz.max}` : ''}`
                            : '-'}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {response.metadata?.status ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_TINTS[response.metadata.status] || 'bg-secondary text-muted-foreground border-border'}`}>
                              {response.metadata.status}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                          {Array.isArray(response.metadata?.tags) && response.metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {response.metadata.tags.slice(0, 3).map((t: string) => (
                                <span key={t} className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[11px] text-muted-foreground">{t}</span>
                              ))}
                              {response.metadata.tags.length > 3 && (
                                <span className="text-[11px] text-muted-foreground">+{response.metadata.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedResponse(response)}
                          aria-label="View response details"
                          className="text-muted-foreground hover:text-foreground mr-4"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteResponse(response.id)}
                          aria-label="Delete response"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination controls */}
        {total > PAGE_SIZE && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {pageStart}–{pageEnd} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-3 py-2 border border-border rounded-md text-sm hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="flex items-center gap-1 px-3 py-2 border border-border rounded-md text-sm hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelectedResponse(null)}>
          <div className="bg-card rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl heading-tight text-foreground">Response Details</h2>
              <button onClick={() => setSelectedResponse(null)} aria-label="Close response details" className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Submitted: {new Date(selectedResponse.created_at).toLocaleString()}
            </p>

            {/* Status + tags editor (metadata only) */}
            <div className="mb-6 p-4 rounded-md bg-secondary border border-border space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => {
                    const active = selectedResponse.metadata?.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => updateResponseMeta(selectedResponse.id, { status: active ? null : s })}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                          active ? (STATUS_TINTS[s] || 'bg-primary text-primary-foreground border-primary') : 'bg-card text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>
              <TagEditor
                tags={Array.isArray(selectedResponse.metadata?.tags) ? selectedResponse.metadata.tags : []}
                onChange={(tags) => updateResponseMeta(selectedResponse.id, { tags })}
              />
            </div>

            {selectedResponse.metadata?.quiz && (
              <div className="mb-6 p-4 rounded-md bg-secondary border border-border">
                <p className="text-sm text-foreground font-medium">Quiz score</p>
                <p className="text-2xl heading-tight text-foreground">
                  {selectedResponse.metadata.quiz.total}
                  {selectedResponse.metadata.quiz.max ? ` / ${selectedResponse.metadata.quiz.max}` : ''}
                </p>
              </div>
            )}
            <div className="space-y-6">
              {fields.map(field => {
                const raw = selectedResponse.answers[field.id]
                const isSignature = field.field_type === 'signature' || (typeof raw === 'string' && raw.startsWith('data:image'))
                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-foreground mb-2">{field.label}</label>
                    {isSignature && typeof raw === 'string' && raw.trim() ? (
                      <div className="p-4 bg-secondary rounded-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={raw} alt="Signature" className="max-h-32 bg-card border border-border rounded" />
                      </div>
                    ) : (
                      <div className="p-4 bg-secondary rounded-md text-foreground whitespace-pre-wrap break-words">
                        {formatAnswer(raw, field.field_type) || '(No answer)'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add / remove tags on a single response. Calls onChange with the full new list.
function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const t = draft.trim()
    if (!t || tags.includes(t)) { setDraft(''); return }
    onChange([...tags, t])
    setDraft('')
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-card border border-border text-foreground">
            {t}
            <button
              onClick={() => onChange(tags.filter((x) => x !== t))}
              aria-label={`Remove tag ${t}`}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="inline-flex items-center gap-1">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="Add tag"
            className="w-28 px-2 py-1 border border-input rounded-md bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
          />
          <button
            onClick={addTag}
            disabled={!draft.trim()}
            aria-label="Add tag"
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
