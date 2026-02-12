'use client'

import { Button } from '@/components/ui/button'
import { Check, Download, Share2 } from 'lucide-react'

interface ThankYouScreenProps {
  formTitle: string
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
  }
  customMessage?: string
  showSocialShare?: boolean
}

export function ThankYouScreen({
  formTitle,
  theme,
  customMessage,
  showSocialShare = false,
}: ThankYouScreenProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="w-full max-w-2xl text-center">
        {/* Success Icon */}
        <div 
          className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center animate-scale-in"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </div>

        {/* Success Message */}
        <div 
          className="bg-white rounded-2xl p-12 shadow-2xl mb-6"
          style={{ borderTop: `4px solid ${theme.primaryColor}` }}
        >
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            Thank you!
          </h1>
          <p 
            className="text-xl mb-8"
            style={{ color: theme.textColor, opacity: 0.7 }}
          >
            {customMessage || 'Your response has been recorded successfully.'}
          </p>

          {/* Optional Actions */}
          {showSocialShare && (
            <div className="pt-8 border-t" style={{ borderColor: '#e8e4db' }}>
              <p className="text-sm mb-4" style={{ color: theme.textColor, opacity: 0.6 }}>
                Share this form
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Response
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Powered By */}
        <p className="text-sm" style={{ color: theme.textColor, opacity: 0.4 }}>
          Powered by <span className="font-semibold">Stoneforms</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
