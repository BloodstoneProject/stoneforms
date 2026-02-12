'use client'

import Link from 'next/link'
import { Mail, MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-stone-900">Stoneforms</Link>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-stone-600 hover:text-stone-900">Features</Link>
              <Link href="/pricing" className="text-stone-600 hover:text-stone-900">Pricing</Link>
              <Link href="/templates" className="text-stone-600 hover:text-stone-900">Templates</Link>
              <Link href="/blog" className="text-stone-600 hover:text-stone-900">Blog</Link>
              <Link href="/auth/login" className="text-stone-600 hover:text-stone-900">Sign In</Link>
              <Link href="/auth/signup" className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 border-b border-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-stone-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-stone-600">
            Have a question? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-6">Contact Information</h3>
                <p className="text-stone-600">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-1">Email</h4>
                    <a href="mailto:hello@stoneforms.com" className="text-stone-600 hover:text-stone-900">
                      hello@stoneforms.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-1">Live Chat</h4>
                    <p className="text-stone-600">
                      Available Mon-Fri 9am-5pm GMT
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-lg p-6">
                <h4 className="font-semibold text-stone-900 mb-2">Sales Inquiries</h4>
                <p className="text-stone-600 text-sm mb-4">
                  Looking for a custom plan or have questions about Enterprise?
                </p>
                <a href="mailto:sales@stoneforms.com" className="text-stone-900 font-semibold hover:underline">
                  Contact Sales →
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <form className="bg-white border border-stone-200 rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={6}
                      placeholder="Tell us more about your question..."
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
