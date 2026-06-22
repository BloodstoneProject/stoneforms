'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  X,
  Link as LinkIcon,
  Code,
  QrCode,
  Mail,
  MessageSquare,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Pencil,
} from 'lucide-react'
import EmbedCodeGenerator from './embed-code-generator'
import { appendUtm, getQrImageUrl, type UtmParams } from '@/lib/embed'
import { getSiteUrl } from '@/lib/site'

interface ShareModalProps {
  formId: string
  formTitle: string
  slug?: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ formId, formTitle, slug, isOpen, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'qr' | 'social' | 'landing'>('link')
  const [copied, setCopied] = useState(false)
  const [vanityCopied, setVanityCopied] = useState(false)
  const [utmCopied, setUtmCopied] = useState(false)
  const [landingUrlCopied, setLandingUrlCopied] = useState(false)
  const [landingEmbedCopied, setLandingEmbedCopied] = useState(false)

  // UTM / link builder — appended to whichever link a user shares.
  const [utm, setUtm] = useState<UtmParams>({ source: '', medium: '', campaign: '' })

  if (!isOpen) return null

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const formUrl = `${baseUrl}/f/${formId}`
  const vanityUrl = slug ? `${baseUrl}/f/${slug}` : null

  // The canonical link people share = vanity if set, else the id link, plus UTM.
  const shareBase = vanityUrl || formUrl
  const shareUrl = appendUtm(shareBase, utm)

  const hasUtm = !!(utm.source?.trim() || utm.medium?.trim() || utm.campaign?.trim())

  // Landing page — hosted /p/{slug} page. Prefer the vanity slug, fall back to id.
  const siteUrl = getSiteUrl()
  const landingRef = slug || formId
  const landingUrl = `${siteUrl}/p/${landingRef}`
  const landingEditUrl = `/dashboard/forms/${formId}/landing`
  const landingEmbed = `<iframe src="${siteUrl}/p/${landingRef}" style="width:100%;border:none;min-height:720px" title="${formTitle}"></iframe>`

  const copyText = (text: string, set: (v: boolean) => void) => {
    navigator.clipboard.writeText(text)
    set(true)
    setTimeout(() => set(false), 2000)
  }

  const copyLink = () => copyText(formUrl, setCopied)
  const copyVanity = () => vanityUrl && copyText(vanityUrl, setVanityCopied)
  const copyShareUrl = () => copyText(shareUrl, setUtmCopied)

  const openShare = (url: string) =>
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600')

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Fill out: ${formTitle}`)
    const body = encodeURIComponent(`Please fill out this form:\n\n${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Fill out this form: ${shareUrl}`)
    openShare(`https://wa.me/?text=${text}`)
  }

  const shareViaSMS = () => {
    const text = encodeURIComponent(`Fill out this form: ${shareUrl}`)
    window.open(`sms:?body=${text}`)
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this form: ${formTitle}`)
    openShare(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`)
  }

  const shareOnLinkedIn = () =>
    openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)

  const shareOnFacebook = () =>
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl heading-tight text-foreground">Share Form</h2>
            <p className="text-sm text-muted-foreground mt-1">{formTitle}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('link')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'link'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              Link
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'embed'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="w-4 h-4" />
              Embed
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'qr'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'social'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Social
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'landing'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="w-4 h-4" />
              Landing page
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-6">
              {vanityUrl && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Custom link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={vanityUrl}
                      readOnly
                      className="flex-1 px-4 py-3 border border-input rounded-md bg-secondary text-foreground"
                    />
                    <button
                      onClick={copyVanity}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      {vanityCopied ? (
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
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Form URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formUrl}
                    readOnly
                    className="flex-1 px-4 py-3 border border-input rounded-md bg-secondary text-foreground"
                  />
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
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

              {/* UTM / link builder */}
              <div className="border border-border rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">Campaign tracking (UTM)</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tag this link so you can see where responses came from in your analytics.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Source</label>
                    <input
                      type="text"
                      value={utm.source || ''}
                      onChange={(e) => setUtm((u) => ({ ...u, source: e.target.value }))}
                      placeholder="newsletter"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Medium</label>
                    <input
                      type="text"
                      value={utm.medium || ''}
                      onChange={(e) => setUtm((u) => ({ ...u, medium: e.target.value }))}
                      placeholder="email"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Campaign</label>
                    <input
                      type="text"
                      value={utm.campaign || ''}
                      onChange={(e) => setUtm((u) => ({ ...u, campaign: e.target.value }))}
                      placeholder="spring_launch"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Shareable link {hasUtm ? '(with tracking)' : ''}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-2 border border-input rounded-md bg-secondary text-foreground text-sm"
                    />
                    <button
                      onClick={copyShareUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                    >
                      {utmCopied ? (
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={shareViaEmail}
                  className="flex items-center gap-3 px-4 py-3 border border-border rounded-md hover:bg-secondary text-foreground"
                >
                  <Mail className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Email</div>
                    <div className="text-xs text-muted-foreground">Send via email</div>
                  </div>
                </button>

                <button
                  onClick={shareViaSMS}
                  className="flex items-center gap-3 px-4 py-3 border border-border rounded-md hover:bg-secondary text-foreground"
                >
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">SMS</div>
                    <div className="text-xs text-muted-foreground">Send via text</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Embed Tab */}
          {activeTab === 'embed' && <EmbedCodeGenerator formId={formId} formTitle={formTitle} />}

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="space-y-6 text-center">
              <div className="inline-block p-8 bg-white border-2 border-border rounded-lg">
                <img
                  src={getQrImageUrl(shareUrl, 300)}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Scan this QR code to open the form</p>
                {hasUtm && (
                  <p className="text-xs text-muted-foreground mb-3">Includes your campaign tracking tags.</p>
                )}
                <p className="text-xs text-muted-foreground break-all max-w-md mx-auto mb-4">{shareUrl}</p>
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = getQrImageUrl(shareUrl, 1000)
                    link.download = `${formTitle}-qr-code.png`
                    link.target = '_blank'
                    link.click()
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your form. Links include any campaign tracking set on the Link tab.
              </p>

              <button
                onClick={shareOnTwitter}
                className="w-full flex items-center gap-4 px-6 py-4 border border-border rounded-md hover:bg-secondary text-foreground transition-colors"
              >
                <div className="w-12 h-12 bg-foreground rounded-md flex items-center justify-center text-background text-xl font-bold">
                  𝕏
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share on X (Twitter)</div>
                  <div className="text-sm text-muted-foreground">Post to your followers</div>
                </div>
              </button>

              <button
                onClick={shareOnLinkedIn}
                className="w-full flex items-center gap-4 px-6 py-4 border border-border rounded-md hover:bg-secondary text-foreground transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  in
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share on LinkedIn</div>
                  <div className="text-sm text-muted-foreground">Share with your network</div>
                </div>
              </button>

              <button
                onClick={shareOnFacebook}
                className="w-full flex items-center gap-4 px-6 py-4 border border-border rounded-md hover:bg-secondary text-foreground transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  f
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share on Facebook</div>
                  <div className="text-sm text-muted-foreground">Post to your timeline</div>
                </div>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-4 px-6 py-4 border border-border rounded-md hover:bg-secondary text-foreground transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  W
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share on WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Send in a chat</div>
                </div>
              </button>

              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-4 px-6 py-4 border border-border rounded-md hover:bg-secondary text-foreground transition-colors"
              >
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-foreground">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Share via Email</div>
                  <div className="text-sm text-muted-foreground">Open your mail client</div>
                </div>
              </button>
            </div>
          )}

          {/* Landing Page Tab */}
          {activeTab === 'landing' && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                A hosted page at <code className="font-mono text-xs">/p/{landingRef}</code> with
                your branding and this form embedded. Turn it on and customise it from the editor.
              </p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Landing page URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={landingUrl}
                    readOnly
                    className="flex-1 px-4 py-3 border border-input rounded-md bg-secondary text-foreground"
                  />
                  <button
                    onClick={() => copyText(landingUrl, setLandingUrlCopied)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    {landingUrlCopied ? (
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Embed the landing page</label>
                <div className="flex gap-2">
                  <textarea
                    value={landingEmbed}
                    readOnly
                    rows={3}
                    className="flex-1 px-4 py-3 border border-input rounded-md bg-secondary text-foreground font-mono text-xs resize-none"
                  />
                  <button
                    onClick={() => copyText(landingEmbed, setLandingEmbedCopied)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 self-start"
                  >
                    {landingEmbedCopied ? (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={landingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 border border-border rounded-md hover:bg-secondary text-foreground transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Open landing page</div>
                    <div className="text-xs text-muted-foreground">View the public page</div>
                  </div>
                </a>

                <Link
                  href={landingEditUrl}
                  className="flex items-center gap-3 px-4 py-3 border border-border rounded-md hover:bg-secondary text-foreground transition-colors"
                  onClick={onClose}
                >
                  <Pencil className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Edit landing page</div>
                    <div className="text-xs text-muted-foreground">Branding &amp; sections</div>
                  </div>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground">
                The landing page must be enabled in the editor for this link to go live.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
