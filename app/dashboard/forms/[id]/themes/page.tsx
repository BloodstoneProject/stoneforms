'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Sparkles, Eye } from 'lucide-react'
import { getFormById } from '@/lib/mock-data'

interface Theme {
  id: string
  name: string
  description: string
  gradient: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  buttonStyle: string
  fontFamily: string
  category: 'modern' | 'minimal' | 'vibrant' | 'professional' | 'playful'
  preview: string
}

export default function FormThemesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const form = getFormById(id)
  const [selectedTheme, setSelectedTheme] = useState<string>('default')

  const themes: Theme[] = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean and simple',
      gradient: 'from-white to-stone-50',
      primaryColor: '#1c1917',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1c1917',
      buttonStyle: 'rounded-lg',
      fontFamily: 'DM Sans',
      category: 'minimal',
      preview: 'bg-white border-stone-300'
    },
    {
      id: 'midnight',
      name: 'Midnight',
      description: 'Dark and elegant',
      gradient: 'from-slate-900 to-slate-800',
      primaryColor: '#0f172a',
      accentColor: '#3b82f6',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      buttonStyle: 'rounded-xl',
      fontFamily: 'DM Sans',
      category: 'modern',
      preview: 'bg-slate-900 border-slate-700'
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      description: 'Calm and professional',
      gradient: 'from-blue-50 via-cyan-50 to-teal-50',
      primaryColor: '#0369a1',
      accentColor: '#06b6d4',
      backgroundColor: '#f0f9ff',
      textColor: '#0c4a6e',
      buttonStyle: 'rounded-2xl',
      fontFamily: 'DM Sans',
      category: 'professional',
      preview: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm and inviting',
      gradient: 'from-orange-50 via-pink-50 to-purple-50',
      primaryColor: '#ea580c',
      accentColor: '#ec4899',
      backgroundColor: '#fff7ed',
      textColor: '#7c2d12',
      buttonStyle: 'rounded-2xl',
      fontFamily: 'DM Sans',
      category: 'vibrant',
      preview: 'bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200'
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Natural and fresh',
      gradient: 'from-emerald-50 via-green-50 to-lime-50',
      primaryColor: '#047857',
      accentColor: '#84cc16',
      backgroundColor: '#f0fdf4',
      textColor: '#064e3b',
      buttonStyle: 'rounded-xl',
      fontFamily: 'DM Sans',
      category: 'professional',
      preview: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
    },
    {
      id: 'bubblegum',
      name: 'Bubblegum',
      description: 'Fun and playful',
      gradient: 'from-pink-100 via-purple-100 to-blue-100',
      primaryColor: '#db2777',
      accentColor: '#a855f7',
      backgroundColor: '#fdf2f8',
      textColor: '#831843',
      buttonStyle: 'rounded-full',
      fontFamily: 'DM Sans',
      category: 'playful',
      preview: 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-300'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Professional and trustworthy',
      gradient: 'from-slate-50 to-stone-100',
      primaryColor: '#1e293b',
      accentColor: '#2563eb',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      buttonStyle: 'rounded-lg',
      fontFamily: 'DM Sans',
      category: 'professional',
      preview: 'bg-gradient-to-br from-slate-50 to-stone-100 border-slate-300'
    },
    {
      id: 'neon',
      name: 'Neon',
      description: 'Bold and modern',
      gradient: 'from-purple-900 via-pink-900 to-red-900',
      primaryColor: '#7c3aed',
      accentColor: '#ec4899',
      backgroundColor: '#3b0764',
      textColor: '#fdf4ff',
      buttonStyle: 'rounded-2xl',
      fontFamily: 'DM Sans',
      category: 'vibrant',
      preview: 'bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500'
    },
    {
      id: 'lavender',
      name: 'Lavender Dreams',
      description: 'Soft and elegant',
      gradient: 'from-purple-50 via-pink-50 to-rose-50',
      primaryColor: '#9333ea',
      accentColor: '#ec4899',
      backgroundColor: '#faf5ff',
      textColor: '#581c87',
      buttonStyle: 'rounded-xl',
      fontFamily: 'DM Sans',
      category: 'minimal',
      preview: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      description: 'Sleek and minimal',
      gradient: 'from-gray-50 to-gray-100',
      primaryColor: '#111827',
      accentColor: '#4b5563',
      backgroundColor: '#f9fafb',
      textColor: '#111827',
      buttonStyle: 'rounded-lg',
      fontFamily: 'DM Sans',
      category: 'minimal',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
    },
    {
      id: 'sunshine',
      name: 'Sunshine',
      description: 'Bright and cheerful',
      gradient: 'from-yellow-50 via-amber-50 to-orange-50',
      primaryColor: '#d97706',
      accentColor: '#f59e0b',
      backgroundColor: '#fffbeb',
      textColor: '#78350f',
      buttonStyle: 'rounded-2xl',
      fontFamily: 'DM Sans',
      category: 'playful',
      preview: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
    },
    {
      id: 'ice',
      name: 'Ice',
      description: 'Cool and crisp',
      gradient: 'from-cyan-50 via-blue-50 to-indigo-50',
      primaryColor: '#0891b2',
      accentColor: '#3b82f6',
      backgroundColor: '#ecfeff',
      textColor: '#164e63',
      buttonStyle: 'rounded-xl',
      fontFamily: 'DM Sans',
      category: 'modern',
      preview: 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200'
    },
  ]

  const categories = [
    { value: 'all', label: 'All Themes' },
    { value: 'modern', label: 'Modern' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'vibrant', label: 'Vibrant' },
    { value: 'professional', label: 'Professional' },
    { value: 'playful', label: 'Playful' },
  ]

  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredThemes = categoryFilter === 'all' 
    ? themes 
    : themes.filter(t => t.category === categoryFilter)

  if (!form) return <div>Form not found</div>

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/forms/${id}`} className="p-2 hover:bg-stone-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-stone-900">Form Themes</h1>
                <p className="text-sm text-stone-600">{form.title}</p>
              </div>
            </div>
            <Link
              href={`/f/${id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 mb-2">Beautiful Pre-designed Themes</h3>
              <p className="text-purple-800 mb-3">
                Choose from 12 professionally designed themes. Each theme includes custom colors, gradients, and styling. Apply with one click!
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat.value
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredThemes.map((theme) => (
            <div key={theme.id} className="group">
              <div 
                className={`aspect-[3/4] ${theme.preview} border-2 rounded-xl overflow-hidden mb-4 relative cursor-pointer transition-all hover:scale-105 ${
                  selectedTheme === theme.id ? 'ring-4 ring-stone-900' : ''
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                {/* Theme Preview */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-current opacity-20 rounded w-3/4" />
                    <div className="h-2 bg-current opacity-15 rounded w-full" />
                    <div className="h-2 bg-current opacity-15 rounded w-5/6" />
                    <div className="h-8 bg-current opacity-10 rounded mt-4" />
                    <div 
                      className="h-10 rounded-lg mt-4 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Button
                    </div>
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-stone-900">{theme.name}</h3>
                <p className="text-sm text-stone-600">{theme.description}</p>
                
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.backgroundColor }}
                  />
                </div>

                {selectedTheme === theme.id && (
                  <button className="w-full mt-3 px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold">
                    Applied ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <div className="mt-12 bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 mb-1">
                Selected Theme: {themes.find(t => t.id === selectedTheme)?.name}
              </h3>
              <p className="text-stone-600">
                This theme will be applied to your form
              </p>
            </div>
            <button className="px-8 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold text-lg">
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
