'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  BarChart3
} from 'lucide-react'

export default function AnalyticsPage() {
  // Mock data for charts
  const formStats = {
    totalForms: 12,
    publishedForms: 8,
    totalResponses: 1847,
    uniqueRespondents: 1234,
    avgCompletionRate: 78,
    avgTimeToComplete: 127, // seconds
  }

  const responsesByDay = [
    { day: 'Mon', responses: 45 },
    { day: 'Tue', responses: 67 },
    { day: 'Wed', responses: 89 },
    { day: 'Thu', responses: 56 },
    { day: 'Fri', responses: 102 },
    { day: 'Sat', responses: 34 },
    { day: 'Sun', responses: 23 },
  ]

  const topForms = [
    { name: 'Customer Feedback Survey', responses: 456, completionRate: 92 },
    { name: 'Lead Capture Form', responses: 342, completionRate: 87 },
    { name: 'Event Registration', responses: 289, completionRate: 94 },
    { name: 'Product Interest Survey', responses: 178, completionRate: 76 },
    { name: 'Newsletter Signup', responses: 156, completionRate: 98 },
  ]

  const conversionFunnel = [
    { stage: 'Form Views', count: 2689, percentage: 100 },
    { stage: 'Started', count: 2147, percentage: 80 },
    { stage: 'Completed', count: 1847, percentage: 69 },
    { stage: 'Became Contact', count: 1234, percentage: 46 },
    { stage: 'Active Deal', count: 89, percentage: 3 },
  ]

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Analytics</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Track your performance and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Responses</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  {formStats.totalResponses.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#142c1c' }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Completion Rate</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  {formStats.avgCompletionRate}%
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+3% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Unique Contacts</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  {formStats.uniqueRespondents.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#770a19' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Avg. Time</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>
                  {Math.floor(formStats.avgTimeToComplete / 60)}:{(formStats.avgTimeToComplete % 60).toString().padStart(2, '0')}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                  <TrendingDown className="w-3 h-3" />
                  <span>-5% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responses Over Time */}
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle style={{ color: '#142c1c' }}>Responses This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {responsesByDay.map((day) => {
                const maxResponses = Math.max(...responsesByDay.map(d => d.responses))
                const percentage = (day.responses / maxResponses) * 100
                
                return (
                  <div key={day.day}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: '#142c1c' }}>
                        {day.day}
                      </span>
                      <span className="text-sm font-bold" style={{ color: '#142c1c' }}>
                        {day.responses}
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: '#142c1c'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle style={{ color: '#142c1c' }}>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: index === 0 ? '#142c1c' : '#3d5948' }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#142c1c' }}>
                          {stage.stage}
                        </p>
                        <p className="text-xs" style={{ color: '#3d5948' }}>
                          {stage.percentage}% of views
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold" style={{ color: '#142c1c' }}>
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${stage.percentage}%`,
                        backgroundColor: index === 0 ? '#142c1c' : '#3d5948'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Forms */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>Top Performing Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topForms.map((form, index) => (
              <div 
                key={form.name}
                className="flex items-center gap-4 p-4 rounded-lg border"
                style={{ borderColor: '#e8e4db' }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{ 
                    backgroundColor: index === 0 ? '#142c1c' : '#e8e4db',
                    color: index === 0 ? '#f4f2ed' : '#3d5948'
                  }}
                >
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold" style={{ color: '#142c1c' }}>
                    {form.name}
                  </h4>
                  <p className="text-sm" style={{ color: '#3d5948' }}>
                    {form.responses} responses • {form.completionRate}% completion rate
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-24">
                    <div className="text-xs mb-1" style={{ color: '#3d5948' }}>
                      {form.completionRate}%
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${form.completionRate}%`,
                          backgroundColor: form.completionRate >= 90 ? '#3d5948' : '#142c1c'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#142c1c' }}>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>Desktop</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>62%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '62%', backgroundColor: '#142c1c' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>Mobile</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>31%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '31%', backgroundColor: '#3d5948' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>Tablet</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>7%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '7%', backgroundColor: '#770a19' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#142c1c' }}>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>Direct</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>45%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '45%', backgroundColor: '#142c1c' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>Social Media</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>28%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '28%', backgroundColor: '#3d5948' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>Email</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>27%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '27%', backgroundColor: '#770a19' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#142c1c' }}>Response Times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>{'<'} 1 min</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>18%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '18%', backgroundColor: '#3d5948' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>1-3 min</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>54%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '54%', backgroundColor: '#142c1c' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: '#3d5948' }}>{'>'} 3 min</span>
                <span className="text-sm font-bold" style={{ color: '#142c1c' }}>28%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                <div className="h-full rounded-full" style={{ width: '28%', backgroundColor: '#770a19' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
