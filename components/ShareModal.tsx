'use client'

import { useState } from 'react'
import { X, Link as LinkIcon, Code, QrCode, Copy, Check, Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

interface ShareModalProps {
  formId: string
  formTitle: string
  onClose: () => void
}

export default function ShareModal({ formId, formTitle, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'qr' | 'social'>('link')

  const formUrl = `https://stoneforms.com/f/${formId}`
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`
  const embedCodeReact = `<iframe\n  src="${formUrl}"\n  width="100%"\n  height="600"\n  frameBorder="0"\n  title="${formTitle}"\n/>`

  const copyToClipboard = (text: string, type: 'link' | 'embed') => {
    navigator.clipboard.writeText(text)
    if (type === 'link') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      setEmbedCopied(true)
      setTimeout(() => setEmbedCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Share Form</h2>
            <p className="text-stone-600 text-sm mt-1">{formTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('link')}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
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
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
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
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
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
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'social'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              Social
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'link' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Direct Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(formUrl, 'link')}
                    className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-stone-600 mt-2">
                  Share this link with anyone to collect responses
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  You can customize the URL slug in form settings for a branded link
                </p>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">HTML Embed Code</label>
                <div className="relative">
                  <pre className="bg-stone-900 text-stone-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {embedCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(embedCode, 'embed')}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs flex items-center gap-1"
                  >
                    {embedCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {embedCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">React/Next.js Code</label>
                <div className="relative">
                  <pre className="bg-stone-900 text-stone-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {embedCodeReact}
                  </pre>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Responsive Embed</h4>
                <p className="text-sm text-amber-800 mb-3">
                  For a responsive embed that adjusts to container width:
                </p>
                <code className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded">
                  width="100%" height="600"
                </code>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-8 bg-white border-2 border-stone-300 rounded-2xl">
                  <div className="w-64 h-64 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-stone-500" />
                  </div>
                </div>
                <p className="text-sm text-stone-600 mt-4">
                  Scan this QR code to access the form
                </p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 border-2 border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                  Download PNG
                </button>
                <button className="flex-1 px-4 py-3 border-2 border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                  Download SVG
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Use Cases</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Print on flyers and posters</li>
                  <li>• Add to business cards</li>
                  <li>• Display at events</li>
                  <li>• Include in presentations</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Share on Social Media</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    Facebook
                  </button>
                  <button className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                    <Twitter className="w-5 h-5 text-sky-500" />
                    Twitter
                  </button>
                  <button className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    LinkedIn
                  </button>
                  <button className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                    <Mail className="w-5 h-5 text-stone-600" />
                    Email
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Custom Message</label>
                <textarea
                  defaultValue={`Check out this form: ${formTitle}\n\n${formUrl}`}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-stone-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">
              View count: <span className="font-semibold text-stone-900">1,234 views</span>
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
