'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  Edit,
  Trash2,
  Plus,
  FileText,
  TrendingUp,
  MessageSquare,
  Clock
} from 'lucide-react'

// Mock contact data
const mockContact = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.j@example.com',
  phone: '+1 (555) 123-4567',
  company: 'Acme Corp',
  jobTitle: 'Marketing Director',
  tags: ['Customer', 'VIP'],
  source: 'Customer Feedback Survey',
  createdAt: '2024-01-15',
  lastActivity: '2024-02-09T10:30:00',
  properties: {
    industry: 'Technology',
    employeeCount: '50-200',
    website: 'https://acmecorp.example.com',
  },
}

const mockActivity = [
  {
    id: '1',
    type: 'submission',
    title: 'Submitted Customer Feedback Survey',
    description: 'Rating: 5/5, Positive feedback',
    timestamp: '2024-02-09T10:30:00',
    icon: FileText,
    color: '#3d5948',
  },
  {
    id: '2',
    type: 'deal',
    title: 'Deal moved to Proposal stage',
    description: 'Enterprise License - $15,000',
    timestamp: '2024-02-08T14:20:00',
    icon: TrendingUp,
    color: '#142c1c',
  },
  {
    id: '3',
    type: 'email',
    title: 'Email sent',
    description: 'Follow-up email about pricing',
    timestamp: '2024-02-07T09:15:00',
    icon: Mail,
    color: '#3d5948',
  },
  {
    id: '4',
    type: 'note',
    title: 'Note added',
    description: 'Interested in annual subscription',
    timestamp: '2024-02-06T16:45:00',
    icon: MessageSquare,
    color: '#3d5948',
  },
  {
    id: '5',
    type: 'created',
    title: 'Contact created',
    description: 'From Lead Capture Form',
    timestamp: '2024-01-15T12:00:00',
    icon: Plus,
    color: '#3d5948',
  },
]

const mockDeals = [
  {
    id: '1',
    title: 'Enterprise License',
    value: 15000,
    stage: 'Proposal',
    probability: 50,
    expectedCloseDate: '2024-03-15',
  },
]

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contacts">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Contacts
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Send Email
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Card */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: '#142c1c', color: '#f4f2ed' }}
                >
                  {mockContact.firstName[0]}{mockContact.lastName[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                    {mockContact.firstName} {mockContact.lastName}
                  </h2>
                  <p style={{ color: '#3d5948' }}>{mockContact.jobTitle}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {mockContact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={
                      tag === 'VIP'
                        ? { backgroundColor: '#770a19', color: '#f4f2ed' }
                        : { backgroundColor: '#3d5948', color: '#f4f2ed' }
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue={mockContact.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue={mockContact.lastName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue={mockContact.email} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" defaultValue={mockContact.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input defaultValue={mockContact.company} />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input defaultValue={mockContact.jobTitle} />
                  </div>
                  <Button className="w-full text-white" style={{ backgroundColor: '#142c1c' }}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4" style={{ color: '#3d5948' }} />
                    <a 
                      href={`mailto:${mockContact.email}`}
                      className="hover:underline"
                      style={{ color: '#142c1c' }}
                    >
                      {mockContact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4" style={{ color: '#3d5948' }} />
                    <span style={{ color: '#142c1c' }}>{mockContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4" style={{ color: '#3d5948' }} />
                    <span style={{ color: '#142c1c' }}>{mockContact.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4" style={{ color: '#3d5948' }} />
                    <span style={{ color: '#3d5948' }}>
                      Created {new Date(mockContact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-4 h-4" style={{ color: '#3d5948' }} />
                    <span style={{ color: '#3d5948' }}>
                      Source: {mockContact.source}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Deals Card */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#142c1c' }}>Active Deals</CardTitle>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="w-3 h-3" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockDeals.map((deal) => (
                <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>
                  <div 
                    className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#e8e4db' }}
                  >
                    <h4 className="font-semibold text-sm mb-2" style={{ color: '#142c1c' }}>
                      {deal.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold" style={{ color: '#142c1c' }}>
                        ${deal.value.toLocaleString()}
                      </span>
                      <span 
                        className="px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{ backgroundColor: '#e8e4db', color: '#3d5948' }}
                      >
                        {deal.stage}
                      </span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#3d5948' }}>
                      Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity Timeline */}
        <div className="lg:col-span-2">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: activity.color }}
                      >
                        <activity.icon className="w-5 h-5 text-white" />
                      </div>
                      {index < mockActivity.length - 1 && (
                        <div className="w-0.5 flex-1 my-2" style={{ backgroundColor: '#e8e4db' }} />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold" style={{ color: '#142c1c' }}>
                          {activity.title}
                        </h4>
                        <span className="text-xs flex items-center gap-1" style={{ color: '#3d5948' }}>
                          <Clock className="w-3 h-3" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#3d5948' }}>
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
