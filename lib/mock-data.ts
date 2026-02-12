// Rich Mock Data for Stoneforms Platform
import type { Form, Contact, Deal, Submission } from '@/types'

// Generate 100 demo forms
export const mockForms: Form[] = Array.from({ length: 100 }, (_, i) => {
  const categories = ['Lead Generation', 'Customer Feedback', 'Event Registration', 'Job Application', 'Contact Form', 'Survey', 'Quiz', 'Order Form', 'Booking', 'Newsletter']
  const statuses = ['published', 'draft', 'archived'] as const
  const category = categories[i % categories.length]
  
  return {
    id: `form-${i + 1}`,
    workspaceId: 'demo',
    title: `${category} Form ${Math.floor(i / 10) + 1}`,
    description: `A professional ${category.toLowerCase()} form for collecting responses`,
    questions: [],
    logic: [],
    theme: {
      id: 'default',
      name: 'Default Theme',
      colors: {
        primary: '#142c1c',
        background: '#f4f2ed',
        text: '#142c1c',
        button: '#142c1c',
        buttonText: '#ffffff',
      },
      fonts: {
        heading: 'DM Sans',
        body: 'DM Sans',
      },
    },
    settings: {
      showProgressBar: true,
      allowMultipleSubmissions: false,
      requireEmail: i % 3 === 0,
    },
    status: statuses[i % 3],
    createdAt: new Date(2024, 0, 1 + i).toISOString(),
    updatedAt: new Date(2024, 1, 1 + i).toISOString(),
    createdBy: 'demo@stoneforms.com',
    responseCount: Math.floor(Math.random() * 1000),
    viewCount: Math.floor(Math.random() * 5000),
    completionRate: 60 + Math.random() * 35,
  }
})

// Generate 500 contacts
export const mockContacts: Contact[] = Array.from({ length: 500 }, (_, i) => {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
  const companies = ['Tech Corp', 'Design Studio', 'Marketing Agency', 'Consulting Group', 'Software Inc', 'Creative Labs', 'Digital Solutions', 'Innovation Hub', 'Growth Partners', 'Strategy Firm']
  const tags = ['Lead', 'Customer', 'Partner', 'Prospect', 'VIP', 'Trial', 'Active', 'Churned']
  
  const firstName = firstNames[i % firstNames.length]
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 20 ? i : ''}@example.com`
  
  return {
    id: `contact-${i + 1}`,
    workspaceId: 'demo',
    firstName,
    lastName,
    email,
    phone: i % 3 === 0 ? `+44 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}` : undefined,
    company: i % 2 === 0 ? companies[i % companies.length] : undefined,
    position: i % 2 === 0 ? ['CEO', 'Marketing Manager', 'Sales Director', 'Product Manager', 'Designer'][i % 5] : undefined,
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
    source: ['Website Form', 'Manual Entry', 'Import', 'API'][i % 4],
    createdAt: new Date(2024, 0, 1 + (i % 60)).toISOString(),
    updatedAt: new Date(2024, 1, 1 + (i % 28)).toISOString(),
    notes: i % 5 === 0 ? 'Interested in premium plan. Follow up next week.' : undefined,
    customFields: {
      industry: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Education'][i % 5],
      revenue: ['< £100k', '£100k - £500k', '£500k - £1M', '£1M+'][i % 4],
    },
  }
})

// Generate 50 deals
export const mockDeals: Deal[] = Array.from({ length: 50 }, (_, i) => {
  const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']
  const values = [5000, 10000, 15000, 25000, 50000, 75000, 100000]
  
  return {
    id: `deal-${i + 1}`,
    workspaceId: 'demo',
    contactId: `contact-${i + 1}`,
    title: `${mockContacts[i].company || 'New Company'} - ${['Starter', 'Professional', 'Business', 'Enterprise'][i % 4]} Plan`,
    value: values[i % values.length],
    currency: 'GBP',
    stage: stages[i % stages.length],
    probability: [25, 50, 75, 90, 100, 0][i % stages.length],
    status: i % 6 === 4 ? 'won' : i % 6 === 5 ? 'lost' : 'open',
    expectedCloseDate: new Date(2024, 2 + (i % 6), 15).toISOString(),
    createdAt: new Date(2024, 0, 1 + i).toISOString(),
    updatedAt: new Date(2024, 1, 1 + (i % 28)).toISOString(),
    notes: i % 3 === 0 ? 'Requires custom integration. Scheduled demo for next week.' : undefined,
  }
})

// Generate form responses
export const mockSubmissions: Submission[] = Array.from({ length: 1000 }, (_, i) => {
  const formId = `form-${(i % 100) + 1}`
  
  return {
    id: `submission-${i + 1}`,
    formId,
    workspaceId: 'demo',
    answers: [
      {
        questionId: 'q1',
        value: mockContacts[i % 500].email,
        type: 'email',
      },
      {
        questionId: 'q2',
        value: mockContacts[i % 500].firstName + ' ' + mockContacts[i % 500].lastName,
        type: 'short_text',
      },
    ],
    metadata: {
      userAgent: 'Mozilla/5.0',
      ip: '192.168.1.' + (i % 255),
      referrer: ['Google', 'Direct', 'Facebook', 'LinkedIn'][i % 4],
    },
    createdAt: new Date(2024, 1, 1 + (i % 28), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString(),
    completedAt: new Date(2024, 1, 1 + (i % 28), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString(),
  }
})

// Analytics data
export const formAnalytics = mockForms.map((form, i) => ({
  formId: form.id,
  views: form.viewCount,
  responses: form.responseCount,
  completionRate: form.completionRate,
  averageTime: 120 + Math.random() * 180, // seconds
  dropOffRate: 100 - form.completionRate,
  topSources: [
    { source: 'Direct', count: Math.floor(form.viewCount! * 0.4) },
    { source: 'Google', count: Math.floor(form.viewCount! * 0.3) },
    { source: 'Social', count: Math.floor(form.viewCount! * 0.2) },
    { source: 'Email', count: Math.floor(form.viewCount! * 0.1) },
  ],
  responsesByDay: Array.from({ length: 30 }, (_, day) => ({
    date: new Date(2024, 1, day + 1).toISOString(),
    count: Math.floor(Math.random() * 50),
  })),
}))

// Blog posts
export const mockBlogPosts = [
  {
    id: 'blog-1',
    slug: 'how-to-create-high-converting-forms',
    title: 'How to Create High-Converting Forms in 2024',
    excerpt: 'Learn the proven strategies for creating forms that convert at 80%+ rates.',
    content: 'Full article content here...',
    author: 'Sarah Johnson',
    publishedAt: new Date(2024, 0, 15).toISOString(),
    tags: ['Forms', 'Conversion', 'Best Practices'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  },
  {
    id: 'blog-2',
    slug: 'form-builder-comparison-2024',
    title: 'Form Builder Comparison 2024: Which Tool is Right for You?',
    excerpt: 'An honest comparison of the top form builders on the market.',
    content: 'Full article content here...',
    author: 'Michael Chen',
    publishedAt: new Date(2024, 0, 20).toISOString(),
    tags: ['Comparison', 'Tools', 'Reviews'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  },
  // ... 8 more posts
]

// Form templates
export const formTemplates = [
  {
    id: 'template-1',
    category: 'lead-generation',
    name: 'Lead Capture Form',
    description: 'Simple 3-field lead generation form',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    uses: 1234,
  },
  {
    id: 'template-2',
    category: 'customer-feedback',
    name: 'Customer Satisfaction Survey',
    description: 'NPS and feedback collection',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    uses: 987,
  },
  // ... 28 more templates
]

// Helper functions
export function getFormById(id: string) {
  return mockForms.find(f => f.id === id)
}

export function getContactById(id: string) {
  return mockContacts.find(c => c.id === id)
}

export function getDealById(id: string) {
  return mockDeals.find(d => d.id === id)
}

export function getFormSubmissions(formId: string) {
  return mockSubmissions.filter(s => s.formId === formId)
}

export function getContactDeals(contactId: string) {
  return mockDeals.filter(d => d.contactId === contactId)
}

export function getFormAnalytics(formId: string) {
  return formAnalytics.find(a => a.formId === formId)
}
