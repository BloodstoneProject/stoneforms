'use client'

import Link from 'next/link'

export default function PrivacyPage() {
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
        <h1 className="text-5xl font-bold text-stone-900 mb-4">Privacy Policy</h1>
        <p className="text-stone-600 mb-12">Last updated: February 12, 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">1. Information We Collect</h2>
            <p className="text-stone-700 leading-relaxed mb-4">We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-8 space-y-2 text-stone-700">
              <li>Create an account</li>
              <li>Use our services</li>
              <li>Contact customer support</li>
              <li>Fill out forms</li>
              <li>Subscribe to our newsletter</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-stone-700 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-8 space-y-2 text-stone-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">3. Information Sharing</h2>
            <p className="text-stone-700 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with third-party service providers who assist us in operating our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">4. Data Security</h2>
            <p className="text-stone-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">5. Your Rights</h2>
            <p className="text-stone-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-8 space-y-2 text-stone-700">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">6. Cookies</h2>
            <p className="text-stone-700 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">7. Contact Us</h2>
            <p className="text-stone-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at privacy@stoneforms.com
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <div className="flex gap-6">
            <Link href="/legal/terms" className="text-stone-600 hover:text-stone-900">Terms of Service</Link>
            <Link href="/legal/cookies" className="text-stone-600 hover:text-stone-900">Cookie Policy</Link>
            <Link href="/legal/gdpr" className="text-stone-600 hover:text-stone-900">GDPR</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
