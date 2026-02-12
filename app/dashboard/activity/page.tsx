'use client'

import { useState } from 'react'
import { Calendar, Filter, Mail, UserPlus, DollarSign, FileText, Zap, Edit, Circle } from 'lucide-react'

export default function ActivityPage() {
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('all')

  const activities = [
    { id: '1', type: 'form_response', user: 'John Doe', action: 'submitted', target: 'Contact Form', timestamp: '2 minutes ago', icon: Mail, color: 'blue' },
    { id: '2', type: 'contact_created', user: 'Sarah Smith', action: 'was added as', target: 'new contact', timestamp: '15 minutes ago', icon: UserPlus, color: 'green' },
    { id: '3', type: 'deal_won', user: 'You', action: 'won', target: 'Enterprise Deal - £5,000', timestamp: '1 hour ago', icon: DollarSign, color: 'purple' },
    { id: '4', type: 'form_created', user: 'You', action: 'created', target: 'Newsletter Signup', timestamp: '2 hours ago', icon: FileText, color: 'amber' },
    { id: '5', type: 'automation_run', user: 'System', action: 'ran', target: 'Welcome automation', timestamp: '3 hours ago', icon: Zap, color: 'indigo' },
  ]

  const activityTypes = [
    { value: 'all', label: 'All Activity' },
    { value: 'form_response', label: 'Form Responses' },
    { value: 'contact_created', label: 'Contacts' },
    { value: 'deal_won', label: 'Deals' },
    { value: 'automation_run', label: 'Automations' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-stone-900">Activity</h1>
          <p className="text-stone-600 mt-1">Track all activity across your workspace</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-lg"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="divide-y divide-stone-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-stone-50">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}>
                    <activity.icon className={`w-6 h-6 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-stone-900">
                      <span className="font-semibold">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="font-semibold">{activity.target}</span>
                    </p>
                    <p className="text-sm text-stone-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
