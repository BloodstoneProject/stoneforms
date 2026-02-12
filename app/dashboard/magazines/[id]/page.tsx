'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Upload, Eye, Settings, Download, Share2, Copy, Move, Grid, Layout, Image as ImageIcon, Type, Zap } from 'lucide-react'
import { getMagazineById } from '@/lib/magazine-data'

export default function MagazineEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const magazine = getMagazineById(id)
  
  const [selectedPage, setSelectedPage] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('single')
  const [showSettings, setShowSettings] = useState(false)

  if (!magazine) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Magazine Not Found</h1>
          <Link href="/dashboard/magazines" className="text-stone-600 hover:text-stone-900">
            ← Back to Magazines
          </Link>
        </div>
      </div>
    )
  }

  const currentPage = magazine.pages[selectedPage]

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Top Toolbar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/magazines" className="p-2 hover:bg-stone-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-bold text-stone-900">{magazine.title}</h1>
                <p className="text-xs text-stone-600">{magazine.pages.length} pages</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
                className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                {viewMode === 'grid' ? <Layout className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                <span className="text-sm">{viewMode === 'grid' ? 'Single' : 'Grid'}</span>
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                <Settings className="w-4 h-4" />
              </button>

              <Link
                href={`/pub/${magazine.id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Preview</span>
              </Link>

              <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800">
                <Download className="w-4 h-4" />
                <span className="text-sm">Publish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Toolbar */}
        <div className="px-6 py-2 border-t border-stone-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-stone-100 rounded-lg hover:bg-stone-200 text-sm">
              <Plus className="w-4 h-4" />
              Add Page
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 rounded-lg text-sm">
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 rounded-lg text-sm">
              <Type className="w-4 h-4" />
              Add Text
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 rounded-lg text-sm">
              <ImageIcon className="w-4 h-4" />
              Background
            </button>
            <div className="flex-1" />
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 rounded-lg text-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Pages */}
        <div className="w-64 bg-white border-r border-stone-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-stone-900 mb-4">Pages</h3>
            <div className="space-y-2">
              {magazine.pages.map((page, idx) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(idx)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedPage === idx
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-stone-100 to-stone-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-2xl text-stone-400">{idx + 1}</span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Page {idx + 1}
                    {page.type === 'cover' && ' (Cover)'}
                  </div>
                </button>
              ))}
              
              <button className="w-full p-3 border-2 border-dashed border-stone-300 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-all">
                <div className="aspect-[3/4] flex items-center justify-center">
                  <Plus className="w-8 h-8 text-stone-400" />
                </div>
                <div className="text-xs text-stone-600 text-center mt-2">Add Page</div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-auto bg-stone-100 p-8">
          {viewMode === 'single' ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-stone-100 to-stone-200 relative group">
                  {/* Canvas Content */}
                  <div className="absolute inset-0 p-12">
                    <div className="text-center space-y-6">
                      <h2 className="text-4xl font-bold text-stone-900">
                        {currentPage.type === 'cover' ? magazine.title : `Page ${selectedPage + 1}`}
                      </h2>
                      {currentPage.type === 'cover' && magazine.description && (
                        <p className="text-xl text-stone-600">{magazine.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Page Tools Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all pointer-events-none" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                    <div className="flex gap-2">
                      <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-stone-50">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-stone-50">
                        <Move className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Page Number */}
                  <div className="absolute bottom-4 right-4 text-stone-400">
                    {selectedPage + 1}
                  </div>
                </div>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setSelectedPage(Math.max(0, selectedPage - 1))}
                  disabled={selectedPage === 0}
                  className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-white disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-stone-600">
                  Page {selectedPage + 1} of {magazine.pages.length}
                </span>
                <button
                  onClick={() => setSelectedPage(Math.min(magazine.pages.length - 1, selectedPage + 1))}
                  disabled={selectedPage === magazine.pages.length - 1}
                  className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {magazine.pages.map((page, idx) => (
                <button
                  key={page.id}
                  onClick={() => { setSelectedPage(idx); setViewMode('single'); }}
                  className="group"
                >
                  <div className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${
                    selectedPage === idx ? 'border-stone-900' : 'border-transparent'
                  }`}>
                    <div className="aspect-[3/4] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center relative">
                      <span className="text-4xl text-stone-400">{idx + 1}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 text-center">Page {idx + 1}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        {showSettings && (
          <div className="w-80 bg-white border-l border-stone-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="font-semibold text-stone-900 mb-6">Page Properties</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Page Type
                  </label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                    <option value="cover">Cover</option>
                    <option value="content">Content</option>
                    <option value="back">Back Cover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Layout
                  </label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                    <option value="single">Single Page</option>
                    <option value="spread">Double Spread</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 rounded-lg border border-stone-300"
                    defaultValue="#ffffff"
                  />
                </div>

                <div className="border-t border-stone-200 pt-6">
                  <h4 className="font-semibold text-stone-900 mb-4">Magazine Settings</h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-stone-700">Enable page flip sound</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-stone-700">Allow download</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-stone-700">Show social sharing</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6">
                  <button className="w-full px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
