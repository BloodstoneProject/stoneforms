'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Download,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  DollarSign,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last-30-days')

  // Mock report data
  const executiveSummary = {
    totalResponses: 2847,
    responseGrowth: 12.5,
    uniqueContacts: 1834,
    contactGrowth: 8.3,
    revenue: 34750,
    revenueGrowth: 15.2,
    avgCompletionRate: 78,
    completionChange: -2.1,
  }

  const topPerformers = [
    { name: 'Customer Feedback Survey', responses: 892, conversion: 94, revenue: 0 },
    { name: 'Lead Capture Form', responses: 645, conversion: 87, revenue: 12450 },
    { name: 'Event Registration', responses: 534, conversion: 91, revenue: 15890 },
    { name: 'Product Demo Signup', responses: 423, conversion: 82, revenue: 6410 },
  ]

  const trafficSources = [
    { source: 'Direct', visitors: 1245, percentage: 44 },
    { source: 'Social Media', visitors: 789, percentage: 28 },
    { source: 'Email Campaign', visitors: 534, percentage: 19 },
    { source: 'Organic Search', visitors: 279, percentage: 9 },
  ]

  const conversionFunnel = [
    { stage: 'Page Views', count: 5678, dropOff: 0 },
    { stage: 'Started Form', count: 3456, dropOff: 39 },
    { stage: 'Completed', count: 2847, dropOff: 18 },
    { stage: 'Became Contact', count: 1834, dropOff: 36 },
    { stage: 'Converted to Deal', count: 234, dropOff: 87 },
  ]

  const performanceMetrics = [
    { metric: 'Avg. Response Time', value: '2m 34s', change: -8.5, good: true },
    { metric: 'Bounce Rate', value: '23%', change: -5.2, good: true },
    { metric: 'Mobile Responses', value: '42%', change: 3.1, good: true },
    { metric: 'Form Abandonment', value: '18%', change: -2.8, good: true },
  ]

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Reports</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Executive dashboard and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border p-3"
            style={{ borderColor: '#e8e4db' }}
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="last-year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Email Report
          </Button>
          <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5" style={{ color: '#3d5948' }} />
              <div className={`flex items-center gap-1 text-sm ${executiveSummary.responseGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {executiveSummary.responseGrowth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(executiveSummary.responseGrowth)}%
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Responses</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
              {executiveSummary.totalResponses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5" style={{ color: '#3d5948' }} />
              <div className={`flex items-center gap-1 text-sm ${executiveSummary.contactGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {executiveSummary.contactGrowth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(executiveSummary.contactGrowth)}%
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Unique Contacts</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
              {executiveSummary.uniqueContacts.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5" style={{ color: '#3d5948' }} />
              <div className={`flex items-center gap-1 text-sm ${executiveSummary.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {executiveSummary.revenueGrowth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(executiveSummary.revenueGrowth)}%
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Revenue</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
              ${(executiveSummary.revenue / 1000).toFixed(1)}k
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5" style={{ color: '#3d5948' }} />
              <div className={`flex items-center gap-1 text-sm ${executiveSummary.completionChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {executiveSummary.completionChange > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(executiveSummary.completionChange)}%
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Completion Rate</p>
            <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
              {executiveSummary.avgCompletionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle style={{ color: '#142c1c' }}>Top Performing Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((form, index) => (
                <div key={form.name} className="flex items-center gap-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: index === 0 ? '#770a19' : '#142c1c' }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1" style={{ color: '#142c1c' }}>{form.name}</p>
                    <div className="flex gap-4 text-sm" style={{ color: '#3d5948' }}>
                      <span>{form.responses} responses</span>
                      <span>{form.conversion}% conversion</span>
                      {form.revenue > 0 && <span>${form.revenue.toLocaleString()} revenue</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle style={{ color: '#142c1c' }}>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: '#142c1c' }}>{source.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm" style={{ color: '#3d5948' }}>
                        {source.visitors.toLocaleString()} visitors
                      </span>
                      <span className="font-bold" style={{ color: '#142c1c' }}>
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${source.percentage}%`,
                        backgroundColor: '#142c1c'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>Conversion Funnel Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: '#142c1c' }}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium" style={{ color: '#142c1c' }}>{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {stage.dropOff > 0 && (
                      <span className="text-sm text-red-600">
                        -{stage.dropOff}% drop-off
                      </span>
                    )}
                    <span className="font-bold" style={{ color: '#142c1c' }}>
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(stage.count / conversionFunnel[0].count) * 100}%`,
                      backgroundColor: index === 0 ? '#142c1c' : '#3d5948'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.metric} className="p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
                <p className="text-sm mb-2" style={{ color: '#3d5948' }}>{metric.metric}</p>
                <p className="text-2xl font-bold mb-2" style={{ color: '#142c1c' }}>
                  {metric.value}
                </p>
                <div className={`flex items-center gap-1 text-sm ${metric.good ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(metric.change)}% vs last period
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
