'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Upload, Trash2, Eye, Search, Calendar, TrendingUp } from 'lucide-react'

interface Response {
  id: string
  response_data: Record<string, string>
  submitted_at: string
}

interface Field {
  id: string
  label: string
  field_type: string
}

export default function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params)
  
  const [responses, setResponses] = useState<Response[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [formId])

  const fetchData = async () => {
    try {
      // Fetch fields
      const fieldsRes = await fetch(`/api/forms/${formId}/fields`)
      const fieldsData = await fieldsRes.json()
      if (fieldsData.fields) setFields(fieldsData.fields)

      // Fetch responses
      const responsesRes = await fetch(`/api/forms/${formId}/responses`)
      const responsesData = await responsesRes.json()
      if (responsesData.responses) setResponses(responsesData.responses)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (responses.length === 0) {
      alert('No responses to export')
      return
    }

    // Create CSV headers
    const headers = ['Submitted At', ...fields.map(f => f.label)]
    
    // Create CSV rows
    const rows = responses.map(response => {
      return [
        new Date(response.submitted_at).toLocaleString(),
        ...fields.map(field => response.response_data[field.id] || '')
      ]
    })

    // Combine into CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-responses-${formId}.csv`
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
            response_data: responseData,
            submitted_at: new Date().toISOString()
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
      setResponses(responses.filter(r => r.id !== responseId))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const deleteAllResponses = async () => {
    if (!confirm(`Delete all ${responses.length} responses? This cannot be undone!`)) return

    try {
      await fetch(`/api/forms/${formId}/responses`, {
        method: 'DELETE'
      })
      setResponses([])
      alert('All responses deleted')
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const filteredResponses = responses.filter(response => {
    if (!searchTerm) return true
    
    return fields.some(field => {
      const value = response.response_data[field.id] || ''
      return value.toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Analytics
  const stats = {
    total: responses.length,
    today: responses.filter(r => {
      const date = new Date(r.submitted_at)
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }).length,
    thisWeek: responses.filter(r => {
      const date = new Date(r.submitted_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date > weekAgo
    }).length,
    completionRate: fields.length > 0 
      ? Math.round((responses.filter(r => {
          return fields.every(f => r.response_data[f.id])
        }).length / responses.length) * 100) || 0
      : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading responses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/forms/${formId}`} className="text-stone-600 hover:text-stone-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-stone-900">Responses</h1>
                <p className="text-stone-600 mt-1">{responses.length} total submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={importFromCSV}
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
              <button
                onClick={exportToCSV}
                disabled={responses.length === 0}
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              {responses.length > 0 && (
                <button
                  onClick={deleteAllResponses}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Total</p>
                  <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-stone-400" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Today</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.today}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">This Week</p>
                  <p className="text-2xl font-bold text-green-900">{stats.thisWeek}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Completion</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.completionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg"
            />
          </div>
        </div>

        {/* Responses Table */}
        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <p className="text-stone-600">
              {searchTerm ? 'No responses match your search' : 'No responses yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-900">Submitted</th>
                    {fields.slice(0, 3).map(field => (
                      <th key={field.id} className="text-left px-6 py-4 text-sm font-medium text-stone-900">
                        {field.label}
                      </th>
                    ))}
                    <th className="text-right px-6 py-4 text-sm font-medium text-stone-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((response) => (
                    <tr key={response.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {new Date(response.submitted_at).toLocaleString()}
                      </td>
                      {fields.slice(0, 3).map(field => (
                        <td key={field.id} className="px-6 py-4 text-sm text-stone-900">
                          {response.response_data[field.id]?.substring(0, 50) || '-'}
                          {response.response_data[field.id]?.length > 50 && '...'}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedResponse(response)}
                          className="text-stone-600 hover:text-stone-900 mr-4"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteResponse(response.id)}
                          className="text-red-600 hover:text-red-700"
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
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelectedResponse(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Response Details</h2>
              <button onClick={() => setSelectedResponse(null)} className="text-stone-600 hover:text-stone-900">
                ✕
              </button>
            </div>
            <p className="text-sm text-stone-600 mb-6">
              Submitted: {new Date(selectedResponse.submitted_at).toLocaleString()}
            </p>
            <div className="space-y-6">
              {fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-stone-900 mb-2">{field.label}</label>
                  <div className="p-4 bg-stone-50 rounded-lg text-stone-900">
                    {selectedResponse.response_data[field.id] || '(No answer)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
