'use client'

import { use, useState, useEffect } from 'react'
import { getMagazineById } from '@/lib/magazine-data'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize, Share2, Download, Volume2, VolumeX, BookOpen } from 'lucide-react'

export default function MagazineViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const magazine = getMagazineById(id)
  
  const [currentPage, setCurrentPage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)

  if (!magazine) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Magazine Not Found</h1>
          <p className="text-stone-400">This publication does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const handleNextPage = () => {
    if (currentPage < magazine.pages.length - 1) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNextPage()
    if (e.key === 'ArrowLeft') handlePrevPage()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage])

  const currentPageData = magazine.pages[currentPage]

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        
        @keyframes pageFlip {
          0% { transform: perspective(1000px) rotateY(0deg); }
          50% { transform: perspective(1000px) rotateY(-90deg); }
          100% { transform: perspective(1000px) rotateY(0deg); }
        }
        
        .page-flip {
          animation: pageFlip 0.6s ease-in-out;
        }
      `}</style>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="w-6 h-6" />
              <div>
                <h1 className="font-bold text-lg">{magazine.title}</h1>
                <p className="text-sm text-stone-400">
                  Page {currentPage + 1} of {magazine.pages.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm px-3">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-white/20 mx-2" />

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>

              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Share">
                <Share2 className="w-5 h-5" />
              </button>

              {magazine.settings.allowDownload && (
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Download">
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Magazine Viewer */}
      <div className="pt-20 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}>
            {/* Page Display */}
            <div className={`bg-white rounded-lg shadow-2xl overflow-hidden ${isFlipping ? 'page-flip' : ''}`}>
              <div className="aspect-[3/4] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center relative">
                {/* Page Content */}
                <div className="absolute inset-0 p-12">
                  <div className="text-center space-y-6">
                    <h2 className="text-4xl font-bold text-stone-900">
                      {currentPageData?.type === 'cover' ? magazine.title : `Page ${currentPage + 1}`}
                    </h2>
                    {currentPageData?.type === 'cover' && magazine.description && (
                      <p className="text-xl text-stone-600">{magazine.description}</p>
                    )}
                    <div className="text-stone-400 text-sm">
                      {currentPageData?.type === 'cover' ? 'Cover Page' : 'Content Page'}
                    </div>
                  </div>
                </div>

                {/* Page Number */}
                <div className="absolute bottom-4 right-4 text-stone-400 text-sm">
                  {currentPage + 1}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === magazine.pages.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${((currentPage + 1) / magazine.pages.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Page Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {magazine.pages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(idx)}
                className={`flex-shrink-0 w-16 h-20 rounded border-2 transition-all ${
                  idx === currentPage
                    ? 'border-amber-500 scale-110'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-stone-700 to-stone-800 rounded flex items-center justify-center">
                  <span className="text-xs">{idx + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
