'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Eye, Download, Star } from 'lucide-react'

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const templates = [
    { id: '1', name: 'Contact Form', category: 'lead-generation', description: 'Simple contact form for your website', uses: 5420, fields: 4 },
    { id: '2', name: 'Lead Capture', category: 'lead-generation', description: 'Capture leads with email validation', uses: 4230, fields: 5 },
    { id: '3', name: 'Newsletter Signup', category: 'lead-generation', description: 'Email subscription form', uses: 3890, fields: 2 },
    { id: '4', name: 'Demo Request', category: 'lead-generation', description: 'Request a product demo', uses: 2340, fields: 6 },
    { id: '5', name: 'Quote Request', category: 'lead-generation', description: 'Get pricing quotes', uses: 2100, fields: 7 },
    { id: '6', name: 'NPS Survey', category: 'customer-feedback', description: 'Net Promoter Score survey', uses: 4560, fields: 3 },
    { id: '7', name: 'Customer Satisfaction', category: 'customer-feedback', description: 'CSAT survey form', uses: 3210, fields: 5 },
    { id: '8', name: 'Product Feedback', category: 'customer-feedback', description: 'Collect product feedback', uses: 2890, fields: 6 },
    { id: '9', name: 'Service Review', category: 'customer-feedback', description: 'Service quality review', uses: 1980, fields: 4 },
    { id: '10', name: 'Feature Request', category: 'customer-feedback', description: 'Request new features', uses: 1560, fields: 5 },
    { id: '11', name: 'Event Registration', category: 'event-registration', description: 'Register for events', uses: 3450, fields: 8 },
    { id: '12', name: 'Workshop Signup', category: 'event-registration', description: 'Workshop registration', uses: 2340, fields: 6 },
    { id: '13', name: 'Webinar Registration', category: 'event-registration', description: 'Webinar signup form', uses: 2120, fields: 5 },
    { id: '14', name: 'Conference Ticket', category: 'event-registration', description: 'Conference registration', uses: 1890, fields: 9 },
    { id: '15', name: 'RSVP Form', category: 'event-registration', description: 'Event RSVP', uses: 1670, fields: 4 },
    { id: '16', name: 'Job Application', category: 'job-application', description: 'Apply for positions', uses: 4120, fields: 10 },
    { id: '17', name: 'Internship Application', category: 'job-application', description: 'Internship application form', uses: 2340, fields: 8 },
    { id: '18', name: 'Volunteer Application', category: 'job-application', description: 'Volunteer signup', uses: 1890, fields: 7 },
    { id: '19', name: 'Contractor Onboarding', category: 'job-application', description: 'Contractor details', uses: 1450, fields: 12 },
    { id: '20', name: 'Resume Submission', category: 'job-application', description: 'Submit resume and cover letter', uses: 1230, fields: 5 },
    { id: '21', name: 'Order Form', category: 'ecommerce', description: 'Product order form', uses: 3890, fields: 8 },
    { id: '22', name: 'Custom Order', category: 'ecommerce', description: 'Custom product orders', uses: 2340, fields: 10 },
    { id: '23', name: 'Pre-Order', category: 'ecommerce', description: 'Pre-order products', uses: 1980, fields: 6 },
    { id: '24', name: 'Wholesale Inquiry', category: 'ecommerce', description: 'Wholesale requests', uses: 1560, fields: 9 },
    { id: '25', name: 'Return Request', category: 'ecommerce', description: 'Product return form', uses: 1230, fields: 7 },
    { id: '26', name: 'Course Enrollment', category: 'education', description: 'Enroll in courses', uses: 3210, fields: 8 },
    { id: '27', name: 'Student Feedback', category: 'education', description: 'Course feedback form', uses: 2120, fields: 6 },
    { id: '28', name: 'Parent-Teacher Meeting', category: 'education', description: 'Meeting request form', uses: 1670, fields: 5 },
    { id: '29', name: 'Scholarship Application', category: 'education', description: 'Apply for scholarships', uses: 1450, fields: 12 },
    { id: '30', name: 'Class Registration', category: 'education', description: 'Register for classes', uses: 1230, fields: 7 },
  ]

  const template = templates.find(t => t.id === id)

  if (!template) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Template Not Found</h1>
          <Link href="/templates" className="text-stone-600 hover:text-stone-900">
            ← Back to Templates
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/templates" className="text-stone-600 hover:text-stone-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-stone-900">{template.name}</h1>
              <p className="text-stone-600 mt-1">{template.description}</p>
            </div>
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold"
            >
              Use This Template
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="text-stone-600 text-sm mb-1">Total Uses</div>
              <div className="text-2xl font-bold text-stone-900">{template.uses.toLocaleString()}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 text-sm mb-1">Form Fields</div>
              <div className="text-2xl font-bold text-blue-900">{template.fields}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 text-sm mb-1">Category</div>
              <div className="text-lg font-bold text-green-900 capitalize">{template.category.replace('-', ' ')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-stone-200 p-8">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Template Preview</h2>
              
              <div className="space-y-6">
                {/* Sample form preview */}
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg p-8 border-2 border-dashed border-stone-300">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-stone-900 mb-2">{template.name}</h3>
                      <p className="text-stone-600">{template.description}</p>
                    </div>

                    {Array.from({ length: Math.min(template.fields, 4) }).map((_, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          {['Email', 'Name', 'Company', 'Message'][i] || `Field ${i + 1}`}
                        </label>
                        <div className="w-full h-12 bg-white border-2 border-stone-300 rounded-lg" />
                      </div>
                    ))}

                    <button className="w-full py-3 bg-stone-900 text-white rounded-lg font-semibold">
                      Submit
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">Preview</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50">
                    <Copy className="w-4 h-4" />
                    <span className="font-medium">Duplicate</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50">
                    <Download className="w-4 h-4" />
                    <span className="font-medium">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="font-bold text-stone-900 mb-4">Included Features</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-stone-700">Email validation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-stone-700">Auto-responder</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-stone-700">Mobile optimized</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-stone-700">Analytics included</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-lg p-6 text-white">
              <h3 className="font-bold text-xl mb-2">Ready to use?</h3>
              <p className="text-stone-300 mb-4 text-sm">
                Sign up free and start using this template in minutes
              </p>
              <Link
                href="/auth/signup"
                className="block w-full py-3 bg-white text-stone-900 rounded-lg text-center font-semibold hover:bg-stone-100"
              >
                Get Started Free
              </Link>
            </div>

            {/* Similar Templates */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="font-bold text-stone-900 mb-4">Similar Templates</h3>
              <div className="space-y-3">
                {templates
                  .filter(t => t.category === template.category && t.id !== template.id)
                  .slice(0, 3)
                  .map(similar => (
                    <Link
                      key={similar.id}
                      href={`/templates/${similar.id}`}
                      className="block p-3 border border-stone-200 rounded-lg hover:bg-stone-50"
                    >
                      <h4 className="font-medium text-stone-900 text-sm">{similar.name}</h4>
                      <p className="text-xs text-stone-600 mt-1">{similar.uses.toLocaleString()} uses</p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
