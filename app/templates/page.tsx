'use client'

import Link from 'next/link'
import { Search, Star, Users, Briefcase, Heart, GraduationCap, ShoppingCart, Calendar, FileText } from 'lucide-react'
import { useState } from 'react'

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Templates', icon: FileText },
    { id: 'lead-generation', name: 'Lead Generation', icon: Users },
    { id: 'customer-feedback', name: 'Customer Feedback', icon: Star },
    { id: 'event-registration', name: 'Event Registration', icon: Calendar },
    { id: 'job-application', name: 'Job Application', icon: Briefcase },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'healthcare', name: 'Healthcare', icon: Heart },
  ]

  const templates = [
    { id: 1, name: 'Contact Form', category: 'lead-generation', description: 'Simple contact form', uses: 5420 },
    { id: 2, name: 'Lead Capture', category: 'lead-generation', description: 'Capture leads with email', uses: 4230 },
    { id: 3, name: 'Newsletter Signup', category: 'lead-generation', description: 'Email subscription form', uses: 3890 },
    { id: 4, name: 'Demo Request', category: 'lead-generation', description: 'Request a product demo', uses: 2340 },
    { id: 5, name: 'Quote Request', category: 'lead-generation', description: 'Get pricing quotes', uses: 2100 },
    
    { id: 6, name: 'NPS Survey', category: 'customer-feedback', description: 'Net Promoter Score', uses: 4560 },
    { id: 7, name: 'Customer Satisfaction', category: 'customer-feedback', description: 'CSAT survey', uses: 3210 },
    { id: 8, name: 'Product Feedback', category: 'customer-feedback', description: 'Collect product feedback', uses: 2890 },
    { id: 9, name: 'Service Review', category: 'customer-feedback', description: 'Service quality review', uses: 1980 },
    { id: 10, name: 'Feature Request', category: 'customer-feedback', description: 'Request new features', uses: 1560 },

    { id: 11, name: 'Event Registration', category: 'event-registration', description: 'Register for events', uses: 3450 },
    { id: 12, name: 'Workshop Signup', category: 'event-registration', description: 'Workshop registration', uses: 2340 },
    { id: 13, name: 'Webinar Registration', category: 'event-registration', description: 'Webinar signup', uses: 2120 },
    { id: 14, name: 'Conference Ticket', category: 'event-registration', description: 'Conference registration', uses: 1890 },
    { id: 15, name: 'RSVP Form', category: 'event-registration', description: 'Event RSVP', uses: 1670 },

    { id: 16, name: 'Job Application', category: 'job-application', description: 'Apply for positions', uses: 4120 },
    { id: 17, name: 'Internship Application', category: 'job-application', description: 'Internship form', uses: 2340 },
    { id: 18, name: 'Volunteer Application', category: 'job-application', description: 'Volunteer signup', uses: 1890 },
    { id: 19, name: 'Contractor Onboarding', category: 'job-application', description: 'Contractor details', uses: 1450 },
    { id: 20, name: 'Resume Submission', category: 'job-application', description: 'Submit resume', uses: 1230 },

    { id: 21, name: 'Order Form', category: 'ecommerce', description: 'Product order form', uses: 3890 },
    { id: 22, name: 'Custom Order', category: 'ecommerce', description: 'Custom product orders', uses: 2340 },
    { id: 23, name: 'Pre-Order', category: 'ecommerce', description: 'Pre-order products', uses: 1980 },
    { id: 24, name: 'Wholesale Inquiry', category: 'ecommerce', description: 'Wholesale requests', uses: 1560 },
    { id: 25, name: 'Return Request', category: 'ecommerce', description: 'Product returns', uses: 1230 },

    { id: 26, name: 'Course Enrollment', category: 'education', description: 'Enroll in courses', uses: 3210 },
    { id: 27, name: 'Student Feedback', category: 'education', description: 'Course feedback', uses: 2120 },
    { id: 28, name: 'Parent-Teacher', category: 'education', description: 'Meeting request', uses: 1670 },
    { id: 29, name: 'Scholarship Application', category: 'education', description: 'Apply for scholarships', uses: 1450 },
    { id: 30, name: 'Class Registration', category: 'education', description: 'Register for classes', uses: 1230 },
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || template.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-stone-900">Stoneforms</Link>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-stone-600 hover:text-stone-900">Features</Link>
              <Link href="/pricing" className="text-stone-600 hover:text-stone-900">Pricing</Link>
              <Link href="/templates" className="text-stone-900 font-medium">Templates</Link>
              <Link href="/auth/login" className="text-stone-600 hover:text-stone-900">Sign In</Link>
              <Link href="/auth/signup" className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white py-16 px-6 border-b border-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-stone-900 mb-4">Form Templates</h1>
          <p className="text-xl text-stone-600 mb-8">
            Start with a professional template and customize it to your needs
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="aspect-video bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-stone-400 group-hover:text-stone-600 transition-colors" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-stone-700">
                  {template.name}
                </h3>
                <p className="text-stone-600 text-sm mb-4">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    {template.uses.toLocaleString()} uses
                  </span>
                  <span className="text-stone-900 font-semibold text-sm group-hover:underline">
                    Use Template →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600 mb-4">No templates found</p>
            <button
              onClick={() => { setSearchTerm(''); setCategory('all'); }}
              className="text-stone-900 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
