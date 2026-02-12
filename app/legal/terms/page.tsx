'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <nav className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-stone-900">Stoneforms</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-stone-900 mb-4">Terms of Service</h1>
        <p className="text-stone-600 mb-12">Last updated: February 12, 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-stone-700 leading-relaxed">
              By accessing and using Stoneforms ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">2. Use License</h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Stoneforms for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-stone-700 leading-relaxed">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-8 space-y-2 text-stone-700">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on Stoneforms</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">3. Account Terms</h2>
            <ul className="list-disc pl-8 space-y-2 text-stone-700">
              <li>You must be 13 years or older to use this Service</li>
              <li>You must provide a valid email address and any other information requested</li>
              <li>You are responsible for maintaining the security of your account and password</li>
              <li>You are responsible for all Content posted and activity that occurs under your account</li>
              <li>One person or legal entity may not maintain more than one free account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">4. Payment Terms</h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              For paid plans, you agree to pay all fees or charges to your account based on the fees, charges, and billing terms in effect at the time.
            </p>
            <ul className="list-disc pl-8 space-y-2 text-stone-700">
              <li>All fees are exclusive of all taxes, levies, or duties</li>
              <li>You are responsible for paying all taxes associated with your use of the Service</li>
              <li>Refunds are only processed according to our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">5. Cancellation and Termination</h2>
            <p className="text-stone-700 leading-relaxed">
              You may cancel your account at any time by contacting customer support. Upon cancellation, your account will be downgraded to the free tier. Stoneforms reserves the right to suspend or terminate your account at any time for any reason.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">6. Modifications to Service</h2>
            <p className="text-stone-700 leading-relaxed">
              Stoneforms reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">7. Contact Information</h2>
            <p className="text-stone-700 leading-relaxed">
              Questions about the Terms of Service should be sent to us at legal@stoneforms.com
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-stone-600 hover:text-stone-900">Privacy Policy</Link>
            <Link href="/legal/cookies" className="text-stone-600 hover:text-stone-900">Cookie Policy</Link>
            <Link href="/legal/gdpr" className="text-stone-600 hover:text-stone-900">GDPR</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
