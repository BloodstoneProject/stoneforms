'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  FileText, 
  BookOpen,
  Presentation,
  Album,
  Notebook,
  Layers,
  CreditCard,
  Grid3x3,
  Check,
  ArrowRight,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function NewPublicationPage() {
  const [step, setStep] = useState<'upload' | 'configure' | 'processing'>('upload')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedEffect, setSelectedEffect] = useState('magazine')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')

  const pageEffects = [
    {
      id: 'magazine',
      name: 'Magazine',
      icon: BookOpen,
      description: 'Classic flipbook with realistic page turn',
      popular: true,
    },
    {
      id: 'book',
      name: 'Book',
      icon: FileText,
      description: 'Traditional book-style flip',
    },
    {
      id: 'slider',
      name: 'Slider',
      icon: Layers,
      description: 'Horizontal swipe presentation',
    },
    {
      id: 'album',
      name: 'Album',
      icon: Album,
      description: 'Photo album style',
    },
    {
      id: 'notebook',
      name: 'Notebook',
      icon: Notebook,
      description: 'Notebook flip effect',
    },
    {
      id: 'cards',
      name: 'Cards',
      icon: CreditCard,
      description: 'Card-based layout',
    },
    {
      id: 'coverflow',
      name: 'Coverflow',
      icon: Grid3x3,
      description: '3D coverflow effect',
    },
    {
      id: 'onepage',
      name: 'One Page',
      icon: Presentation,
      description: 'Single page view',
    },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setTimeout(() => setStep('configure'), 500)
        }
      }, 200)
    }
  }

  const handleCreatePublication = () => {
    setStep('processing')
    // Simulate processing
    setTimeout(() => {
      window.location.href = '/dashboard/publications/1'
    }, 3000)
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f4f2ed' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>
              Create New Publication
            </h1>
            <p className="mt-1" style={{ color: '#3d5948' }}>
              Upload a PDF and convert it to an interactive flipbook
            </p>
          </div>
          <Link href="/dashboard/publications">
            <Button variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'upload' ? 'ring-2' : ''
              }`}
              style={{ 
                backgroundColor: '#142c1c',
                color: '#f4f2ed',
              }}
            >
              1
            </div>
            <span className="font-semibold" style={{ color: '#142c1c' }}>Upload PDF</span>
          </div>

          <div className="w-16 h-0.5" style={{ backgroundColor: '#e8e4db' }} />

          <div className="flex items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'configure' ? 'ring-2' : ''
              }`}
              style={{ 
                backgroundColor: step !== 'upload' ? '#142c1c' : '#e8e4db',
                color: step !== 'upload' ? '#f4f2ed' : '#3d5948',
              }}
            >
              2
            </div>
            <span className="font-semibold" style={{ color: step !== 'upload' ? '#142c1c' : '#3d5948' }}>
              Configure
            </span>
          </div>

          <div className="w-16 h-0.5" style={{ backgroundColor: '#e8e4db' }} />

          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ 
                backgroundColor: step === 'processing' ? '#142c1c' : '#e8e4db',
                color: step === 'processing' ? '#f4f2ed' : '#3d5948',
              }}
            >
              3
            </div>
            <span className="font-semibold" style={{ color: step === 'processing' ? '#142c1c' : '#3d5948' }}>
              Processing
            </span>
          </div>
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <Card className="p-12 border-2" style={{ borderColor: '#e8e4db', backgroundColor: 'white' }}>
            <div className="text-center">
              <div 
                className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: '#f4f2ed' }}
              >
                <Upload className="w-12 h-12" style={{ color: '#142c1c' }} />
              </div>

              <h2 className="text-2xl font-bold mb-3" style={{ color: '#142c1c' }}>
                Upload Your PDF
              </h2>
              <p className="mb-8 text-lg" style={{ color: '#3d5948' }}>
                Drag and drop your PDF file here or click to browse
              </p>

              <label className="block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div 
                  className="border-2 border-dashed rounded-xl p-12 cursor-pointer hover:bg-gray-50 transition-all"
                  style={{ borderColor: '#142c1c' }}
                >
                  <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#3d5948', opacity: 0.5 }} />
                  <p className="font-semibold mb-2" style={{ color: '#142c1c' }}>
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>
                    PDF files up to 100MB
                  </p>
                </div>
              </label>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#142c1c' }}>
                      Uploading...
                    </span>
                    <span className="text-sm" style={{ color: '#3d5948' }}>
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e8e4db' }}>
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        backgroundColor: '#142c1c',
                        width: `${uploadProgress}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Configure Step */}
        {step === 'configure' && (
          <div className="space-y-8">
            {/* Title & Subtitle */}
            <Card className="p-6 border-2" style={{ borderColor: '#e8e4db', backgroundColor: 'white' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#142c1c' }}>
                Publication Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-2">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter publication title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-2"
                    style={{ borderColor: '#e8e4db' }}
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="mb-2">Subtitle (Optional)</Label>
                  <Input
                    id="subtitle"
                    placeholder="Enter subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="border-2"
                    style={{ borderColor: '#e8e4db' }}
                  />
                </div>
              </div>
            </Card>

            {/* Page Effect Selection */}
            <Card className="p-6 border-2" style={{ borderColor: '#e8e4db', backgroundColor: 'white' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#142c1c' }}>
                Choose Page Effect
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pageEffects.map((effect) => {
                  const Icon = effect.icon
                  const isSelected = selectedEffect === effect.id

                  return (
                    <button
                      key={effect.id}
                      onClick={() => setSelectedEffect(effect.id)}
                      className={`p-4 rounded-xl border-2 transition-all relative ${
                        isSelected ? 'ring-2' : 'hover:shadow-md'
                      }`}
                      style={{
                        borderColor: isSelected ? '#142c1c' : '#e8e4db',
                        backgroundColor: isSelected ? '#f4f2ed' : 'white',
                      }}
                    >
                      {effect.popular && (
                        <div 
                          className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ backgroundColor: '#770a19', color: 'white' }}
                        >
                          Popular
                        </div>
                      )}

                      {isSelected && (
                        <div 
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#142c1c' }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: '#142c1c' }} />
                      <p className="font-semibold mb-1 text-sm" style={{ color: '#142c1c' }}>
                        {effect.name}
                      </p>
                      <p className="text-xs" style={{ color: '#3d5948' }}>
                        {effect.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline"
                onClick={() => setStep('upload')}
                className="gap-2"
              >
                Back
              </Button>

              <Button 
                onClick={handleCreatePublication}
                className="gap-2 text-white"
                style={{ backgroundColor: '#142c1c' }}
              >
                Create Publication
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <Card className="p-12 border-2 text-center" style={{ borderColor: '#e8e4db', backgroundColor: 'white' }}>
            <div 
              className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse"
              style={{ backgroundColor: '#f4f2ed' }}
            >
              <BookOpen className="w-12 h-12" style={{ color: '#142c1c' }} />
            </div>

            <h2 className="text-2xl font-bold mb-3" style={{ color: '#142c1c' }}>
              Creating Your Flipbook...
            </h2>
            <p className="mb-8 text-lg" style={{ color: '#3d5948' }}>
              This will only take a moment
            </p>

            <div className="w-full max-w-md mx-auto h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e8e4db' }}>
              <div 
                className="h-full animate-pulse"
                style={{ 
                  backgroundColor: '#142c1c',
                  width: '70%'
                }}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
