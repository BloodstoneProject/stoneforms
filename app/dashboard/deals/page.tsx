'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Building,
  MoreVertical,
  Filter
} from 'lucide-react'

// Mock pipeline stages
const pipelineStages = [
  { id: 'lead', name: 'Lead', color: '#3d5948', probability: 10 },
  { id: 'qualified', name: 'Qualified', color: '#3d5948', probability: 25 },
  { id: 'proposal', name: 'Proposal', color: '#142c1c', probability: 50 },
  { id: 'negotiation', name: 'Negotiation', color: '#770a19', probability: 75 },
  { id: 'closed', name: 'Closed Won', color: '#3d5948', probability: 100 },
]

// Mock deals data
const mockDeals = [
  {
    id: '1',
    title: 'Enterprise License - Acme Corp',
    value: 15000,
    stage: 'proposal',
    probability: 50,
    contactName: 'Sarah Johnson',
    company: 'Acme Corp',
    expectedCloseDate: '2024-03-15',
    createdAt: '2024-01-15',
    notes: 'Waiting for approval from CFO',
  },
  {
    id: '2',
    title: 'Annual Subscription - Tech Innovations',
    value: 25000,
    stage: 'negotiation',
    probability: 75,
    contactName: 'Michael Chen',
    company: 'Tech Innovations',
    expectedCloseDate: '2024-02-28',
    createdAt: '2024-01-20',
    notes: 'Price negotiation in progress',
  },
  {
    id: '3',
    title: 'Starter Plan - Startup Inc',
    value: 8000,
    stage: 'qualified',
    probability: 25,
    contactName: 'Emma Wilson',
    company: 'Startup Inc',
    expectedCloseDate: '2024-04-01',
    createdAt: '2024-02-01',
    notes: 'Interested in annual plan',
  },
  {
    id: '4',
    title: 'Professional Plan - Freelance',
    value: 3000,
    stage: 'lead',
    probability: 10,
    contactName: 'John Doe',
    company: 'Freelance',
    expectedCloseDate: '2024-05-01',
    createdAt: '2024-02-05',
    notes: 'Initial inquiry',
  },
  {
    id: '5',
    title: 'Enterprise Plan - Global Corp',
    value: 50000,
    stage: 'closed',
    probability: 100,
    contactName: 'Alice Brown',
    company: 'Global Corp',
    expectedCloseDate: '2024-02-01',
    createdAt: '2023-12-15',
    notes: 'Deal closed successfully',
  },
]

export default function DealsPage() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const dealsByStage = pipelineStages.map(stage => ({
    ...stage,
    deals: mockDeals.filter(deal => deal.stage === stage.id),
    totalValue: mockDeals
      .filter(deal => deal.stage === stage.id)
      .reduce((sum, deal) => sum + deal.value, 0),
  }))

  const stats = {
    totalDeals: mockDeals.length,
    totalValue: mockDeals.reduce((sum, deal) => sum + deal.value, 0),
    weightedValue: mockDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0),
    wonDeals: mockDeals.filter(d => d.stage === 'closed').length,
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Deals Pipeline</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Track and manage your sales opportunities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Link href="/dashboard/deals/new">
            <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
              <Plus className="w-4 h-4" />
              New Deal
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Deals</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.totalDeals}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#142c1c' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Pipeline Value</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  ${(stats.totalValue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Weighted Value</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  ${(stats.weightedValue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#770a19' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: '#3d5948' }}>
              Based on probability
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Won This Month</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.wonDeals}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {dealsByStage.map((stage) => (
            <Card
              key={stage.id}
              className="w-80 flex-shrink-0"
              style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <CardTitle className="text-lg" style={{ color: '#142c1c' }}>
                      {stage.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: '#e8e4db', color: '#3d5948' }}
                    >
                      {stage.deals.length}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#3d5948' }}>
                  ${(stage.totalValue / 1000).toFixed(0)}k
                </p>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {stage.deals.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color: '#3d5948' }}>
                    No deals in this stage
                  </div>
                ) : (
                  stage.deals.map((deal) => (
                    <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>
                      <div
                        className="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer group"
                        style={{ borderColor: '#e8e4db', backgroundColor: 'white' }}
                      >
                        {/* Deal Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h4 
                            className="font-semibold text-sm leading-tight flex-1 group-hover:underline"
                            style={{ color: '#142c1c' }}
                          >
                            {deal.title}
                          </h4>
                          <button 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreVertical className="w-4 h-4" style={{ color: '#3d5948' }} />
                          </button>
                        </div>

                        {/* Deal Value */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" style={{ color: '#3d5948' }} />
                            <span className="text-lg font-bold" style={{ color: '#142c1c' }}>
                              ${deal.value.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                              <div
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${deal.probability}%`,
                                  backgroundColor: stage.color
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium" style={{ color: '#3d5948' }}>
                              {deal.probability}%
                            </span>
                          </div>
                        </div>

                        {/* Deal Info */}
                        <div className="space-y-2 text-xs" style={{ color: '#3d5948' }}>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>{deal.contactName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-3 h-3" />
                            <span>{deal.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        {deal.notes && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#e8e4db' }}>
                            <p className="text-xs italic line-clamp-2" style={{ color: '#3d5948' }}>
                              {deal.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Drag & Drop Hint */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardContent className="p-6 text-center">
          <p className="text-sm" style={{ color: '#3d5948' }}>
            💡 <strong>Coming Soon:</strong> Drag and drop deals between stages to update their status
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
