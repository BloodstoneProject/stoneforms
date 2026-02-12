'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search,
  Eye,
  Copy,
  Star,
  FileText,
  Briefcase,
  Heart,
  GraduationCap,
  ShoppingCart,
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  Award,
  MessageSquare
} from 'lucide-react'

const templateCategories = [
  { id: 'all', name: 'All Templates', icon: FileText },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'hr', name: 'HR & Recruiting', icon: Users },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'events', name: 'Events', icon: CalendarIcon },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
  { id: 'feedback', name: 'Feedback', icon: MessageSquare },
]

const templates = [
  {
    id: '1',
    name: 'Customer Satisfaction Survey',
    description: 'Measure customer satisfaction with NPS, CSAT questions',
    category: 'feedback',
    icon: MessageSquare,
    questions: 8,
    responseTime: '2 min',
    uses: 12453,
    rating: 4.8,
    featured: true,
    color: '#3d5948',
  },
  {
    id: '2',
    name: 'Lead Capture Form',
    description: 'Qualify leads with smart questions and scoring',
    category: 'marketing',
    icon: TrendingUp,
    questions: 6,
    responseTime: '1 min',
    uses: 9821,
    rating: 4.9,
    featured: true,
    color: '#142c1c',
  },
  {
    id: '3',
    name: 'Event Registration',
    description: 'Register attendees with payment integration',
    category: 'events',
    icon: CalendarIcon,
    questions: 10,
    responseTime: '3 min',
    uses: 8234,
    rating: 4.7,
    featured: false,
    color: '#770a19',
  },
  {
    id: '4',
    name: 'Job Application Form',
    description: 'Collect resumes and screen candidates',
    category: 'hr',
    icon: Users,
    questions: 12,
    responseTime: '5 min',
    uses: 7654,
    rating: 4.6,
    featured: false,
    color: '#3d5948',
  },
  {
    id: '5',
    name: 'Product Feedback',
    description: 'Get detailed feedback on your product features',
    category: 'feedback',
    icon: MessageSquare,
    questions: 7,
    responseTime: '2 min',
    uses: 6543,
    rating: 4.8,
    featured: true,
    color: '#142c1c',
  },
  {
    id: '6',
    name: 'Course Enrollment',
    description: 'Enroll students with payment and prerequisites',
    category: 'education',
    icon: GraduationCap,
    questions: 9,
    responseTime: '3 min',
    uses: 5432,
    rating: 4.7,
    featured: false,
    color: '#770a19',
  },
  {
    id: '7',
    name: 'Order Form',
    description: 'Process orders with product selection and payment',
    category: 'ecommerce',
    icon: ShoppingCart,
    questions: 8,
    responseTime: '2 min',
    uses: 4321,
    rating: 4.5,
    featured: false,
    color: '#3d5948',
  },
  {
    id: '8',
    name: 'Contact Sales',
    description: 'Qualify enterprise leads and schedule demos',
    category: 'business',
    icon: Briefcase,
    questions: 6,
    responseTime: '2 min',
    uses: 3210,
    rating: 4.9,
    featured: false,
    color: '#142c1c',
  },
  {
    id: '9',
    name: 'Volunteer Signup',
    description: 'Recruit and schedule volunteers',
    category: 'events',
    icon: Heart,
    questions: 7,
    responseTime: '2 min',
    uses: 2987,
    rating: 4.6,
    featured: false,
    color: '#770a19',
  },
  {
    id: '10',
    name: 'Employee Onboarding',
    description: 'Collect new hire information and paperwork',
    category: 'hr',
    icon: Users,
    questions: 15,
    responseTime: '6 min',
    uses: 2654,
    rating: 4.7,
    featured: false,
    color: '#3d5948',
  },
  {
    id: '11',
    name: 'Quiz Template',
    description: 'Test knowledge with scoring and certificates',
    category: 'education',
    icon: Award,
    questions: 10,
    responseTime: '10 min',
    uses: 1987,
    rating: 4.8,
    featured: false,
    color: '#142c1c',
  },
  {
    id: '12',
    name: 'Newsletter Signup',
    description: 'Grow your email list with GDPR compliance',
    category: 'marketing',
    icon: TrendingUp,
    questions: 3,
    responseTime: '30 sec',
    uses: 15432,
    rating: 4.9,
    featured: true,
    color: '#770a19',
  },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredTemplates = filteredTemplates.filter(t => t.featured)
  const regularTemplates = filteredTemplates.filter(t => !t.featured)

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Form Templates</h1>
        <p style={{ color: '#3d5948' }} className="mt-1">
          Start with a pre-built template and customize to your needs
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#3d5948' }} />
        <Input
          type="search"
          placeholder="Search templates..."
          className="pl-10 py-6 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {templateCategories.map(category => {
          const isSelected = selectedCategory === category.id
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors"
              style={isSelected 
                ? { backgroundColor: '#142c1c', color: '#f4f2ed' }
                : { backgroundColor: 'white', color: '#3d5948', border: '1px solid #e8e4db' }
              }
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          )
        })}
      </div>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && selectedCategory === 'all' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5" style={{ color: '#770a19' }} />
            <h2 className="text-xl font-bold" style={{ color: '#142c1c' }}>Featured Templates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        {selectedCategory !== 'all' && (
          <h2 className="text-xl font-bold mb-4" style={{ color: '#142c1c' }}>
            {templateCategories.find(c => c.id === selectedCategory)?.name} Templates
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(selectedCategory === 'all' ? regularTemplates : filteredTemplates).map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#3d5948' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#142c1c' }}>
              No templates found
            </h3>
            <p style={{ color: '#3d5948' }}>
              Try adjusting your search or browse different categories
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TemplateCard({ template }: { template: any }) {
  const Icon = template.icon

  return (
    <Card 
      className="group hover:shadow-lg transition-all cursor-pointer"
      style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
    >
      <CardContent className="p-6">
        {/* Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: template.color }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {template.featured && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fff8e1', color: '#f57c00' }}>
              <Star className="w-3 h-3" />
              Featured
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold mb-2" style={{ color: '#142c1c' }}>
          {template.name}
        </h3>
        <p className="text-sm mb-4" style={{ color: '#3d5948' }}>
          {template.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b" style={{ borderColor: '#e8e4db' }}>
          <div>
            <p className="text-xs" style={{ color: '#3d5948' }}>Questions</p>
            <p className="font-semibold" style={{ color: '#142c1c' }}>{template.questions}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: '#3d5948' }}>Time</p>
            <p className="font-semibold" style={{ color: '#142c1c' }}>{template.responseTime}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: '#3d5948' }}>Uses</p>
            <p className="font-semibold" style={{ color: '#142c1c' }}>{template.uses.toLocaleString()}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(template.rating) ? 'fill-current' : ''}`}
                style={{ color: i < Math.floor(template.rating) ? '#f59e0b' : '#e8e4db' }}
              />
            ))}
            <span className="ml-1" style={{ color: '#3d5948' }}>{template.rating}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Eye className="w-3 h-3" />
            Preview
          </Button>
          <Button size="sm" className="flex-1 gap-1 text-white" style={{ backgroundColor: '#142c1c' }}>
            <Copy className="w-3 h-3" />
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
