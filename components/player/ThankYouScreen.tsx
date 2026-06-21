'use client'

import { Check } from 'lucide-react'

interface ThankYouScreenProps {
  title?: string
  message?: string
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
    font?: string
    buttonRadius?: string
  }
}

export function ThankYouScreen({ title, message, theme }: ThankYouScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: theme.backgroundColor, fontFamily: theme.font }}
    >
      <div className="w-full max-w-xl text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center animate-scale-in"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: theme.textColor }}>
          {title || 'Thank you!'}
        </h1>
        <p className="text-lg md:text-xl opacity-70" style={{ color: theme.textColor }}>
          {message || 'Your response has been recorded.'}
        </p>
        <p className="text-xs mt-12 opacity-40" style={{ color: theme.textColor }}>
          Powered by <span className="font-semibold">Stoneforms</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes scale-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.45s ease-out; }
      `}</style>
    </div>
  )
}
