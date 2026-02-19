'use client'

import { useState } from 'react'
import { X, Link as LinkIcon, Code, QrCode, Mail, MessageSquare, Copy, Check } from 'lucide-react'
import EmbedCodeGenerator from './embed-code-generator'

interface ShareModalProps {
  formId: string
  formTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ formId, formTitle, isOpen, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'qr' | 'social'>('link')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const formUrl = `${baseUrl}/f/${formId}`

  const copyLink = () => {
    navigator.clipboard.writeText(formUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Fill out: ${formTitle}`)
    const body = encodeURIComponent(`Please fill out this form:\n\n${formUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = () => {
    const text = encodeURIComponent(`Fill out this form: ${formUrl}`)
    window.open(`sms:?body=${text}`)
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this form: ${formTitle}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(formUrl)}`)
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formUrl)}`)
  }

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formUrl)}`)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Share Form</h2>
            <p className="text-sm text-stone-600 mt-1">{formTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('link')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'link'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              Link
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'embed'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Code className="w-4 h-4" />
              Embed
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'qr'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'social'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Social
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Form URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formUrl}
                    readOnly
                    className="flex-1 px-4 py-3 border border-stone-300 rounded-lg bg-stone-50"
                  />
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={shareViaEmail}
                  className="flex items-center gap-3 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50"
                >
                  <Mail className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Email</div>
                    <div className="text-xs text-stone-600">Send via email</div>
                  </div>
                </button>

                <button
                  onClick={shareViaSMS}
                  className="flex items-center gap-3 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50"
                >
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">SMS</div>
                    <div className="text-xs text-stone-600">Send via text</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Embed Tab */}
          {activeTab === 'embed' && (
            <EmbedCodeGenerator formId={formId} formTitle={formTitle} />
          )}

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="space-y-6 text-center">
              <div className="inline-block p-8 bg-white border-2 border-stone-200 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(formUrl)}`}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
              <div>
                <p className="text-sm text-stone-600 mb-4">
                  Scan this QR code to access the form
                </p>
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(formUrl)}`
                    link.download = `${formTitle}-qr-code.png`
                    link.click()
                  }}
                  className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600 mb-6">
                Share your form on social media
              </p>

              <button
                onClick={shareOnTwitter}
                className="w-full flex items-center gap-4 px-6 py-4 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  𝕏
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share on Twitter/X</div>
                  <div className="text-sm text-stone-600">Post to your followers</div>
                </div>
              </button>

              <button
                onClick={shareOnLinkedIn}
                className="w-full flex items-center gap-4 px-6 py-4 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  in
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share on LinkedIn</div>
                  <div className="text-sm text-stone-600">Share with your network</div>
                </div>
              </button>

              <button
                onClick={shareOnFacebook}
                className="w-full flex items-center gap-4 px-6 py-4 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  f
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share on Facebook</div>
                  <div className="text-sm text-stone-600">Post to your timeline</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
