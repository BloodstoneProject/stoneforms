'use client'

import Link from 'next/link'
import { Mail, UserPlus, DollarSign, FileText, Zap, Edit, Trash2, CheckCircle, Circle } from 'lucide-react'

interface Activity {
  id: string
  type: 'form_response' | 'contact_created' | 'deal_won' | 'form_created' | 'automation_run' | 'contact_updated' | 'form_edited'
  user: string
  action: string
  target: string
  link?: string
  timestamp: string
  icon: any
  color: string
}

export default function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'form_response',
      user: 'John Doe',
      action: 'submitted',
      target: 'Contact Form',
      link: '/dashboard/forms/form-1/responses',
      timestamp: '2 minutes ago',
      icon: Mail,
      color: 'blue'
    },
    {
      id: '2',
      type: 'contact_created',
      user: 'Sarah Smith',
      action: 'was added as',
      target: 'new contact',
      link: '/dashboard/contacts/contact-2',
      timestamp: '15 minutes ago',
      icon: UserPlus,
      color: 'green'
    },
    {
      id: '3',
      type: 'deal_won',
      user: 'You',
      action: 'won',
      target: 'Enterprise Deal - £5,000',
      link: '/dashboard/deals',
      timestamp: '1 hour ago',
      icon: DollarSign,
      color: 'purple'
    },
    {
      id: '4',
      type: 'form_created',
      user: 'You',
      action: 'created',
      target: 'Newsletter Signup Form',
      link: '/dashboard/forms/form-50',
      timestamp: '2 hours ago',
      icon: FileText,
      color: 'amber'
    },
    {
      id: '5',
      type: 'automation_run',
      user: 'System',
      action: 'ran',
      target: 'Welcome New Leads automation',
      link: '/dashboard/automations',
      timestamp: '3 hours ago',
      icon: Zap,
      color: 'indigo'
    },
    {
      id: '6',
      type: 'contact_updated',
      user: 'You',
      action: 'updated',
      target: 'Mike Johnson contact',
      link: '/dashboard/contacts/contact-3',
      timestamp: '4 hours ago',
      icon: Edit,
      color: 'stone'
    },
    {
      id: '7',
      type: 'form_response',
      user: 'Emma Wilson',
      action: 'submitted',
      target: 'Product Survey',
      link: '/dashboard/forms/form-2/responses',
      timestamp: '5 hours ago',
      icon: Mail,
      color: 'blue'
    },
    {
      id: '8',
      type: 'deal_won',
      user: 'You',
      action: 'won',
      target: 'Starter Plan Deal - £500',
      link: '/dashboard/deals',
      timestamp: '6 hours ago',
      icon: DollarSign,
      color: 'purple'
    },
    {
      id: '9',
      type: 'form_edited',
      user: 'You',
      action: 'edited',
      target: 'Event Registration Form',
      link: '/dashboard/forms/form-10',
      timestamp: '1 day ago',
      icon: Edit,
      color: 'stone'
    },
    {
      id: '10',
      type: 'contact_created',
      user: 'Tom Brown',
      action: 'was added as',
      target: 'new contact',
      link: '/dashboard/contacts/contact-5',
      timestamp: '1 day ago',
      icon: UserPlus,
      color: 'green'
    },
  ]

  const displayedActivities = activities.slice(0, limit)

  return (
    <div className="bg-white rounded-lg border border-stone-200">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="p-6 border-b border-stone-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900">Recent Activity</h2>
        <Link href="/dashboard/activity" className="text-sm text-stone-600 hover:text-stone-900 font-medium">
          View all →
        </Link>
      </div>

      <div className="divide-y divide-stone-200">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-stone-50 transition-colors">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-900">
                  <span className="font-semibold">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  {activity.link ? (
                    <Link href={activity.link} className="font-semibold text-stone-900 hover:underline">
                      {activity.target}
                    </Link>
                  ) : (
                    <span className="font-semibold">{activity.target}</span>
                  )}
                </p>
                <p className="text-xs text-stone-500 mt-1">{activity.timestamp}</p>
              </div>

              {/* Timestamp dot */}
              <div className="flex-shrink-0">
                <Circle className={`w-2 h-2 fill-${activity.color}-600 text-${activity.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-stone-600">No recent activity</p>
        </div>
      )}
    </div>
  )
}
