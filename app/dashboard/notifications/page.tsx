'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Check, CheckCheck, Trash2, Settings, Mail, UserPlus, DollarSign, FileText, Zap } from 'lucide-react'

interface Notification {
  id: string
  type: 'form_response' | 'contact_created' | 'deal_won' | 'payment_received' | 'automation_run'
  title: string
  message: string
  link?: string
  read: boolean
  timestamp: string
  icon: any
  color: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'form_response',
      title: 'New form response',
      message: 'John Doe submitted "Contact Form"',
      link: '/dashboard/forms/form-1/responses',
      read: false,
      timestamp: '2 minutes ago',
      icon: Mail,
      color: 'blue'
    },
    {
      id: '2',
      type: 'contact_created',
      title: 'New contact added',
      message: 'Sarah Smith was added to your contacts',
      link: '/dashboard/contacts/contact-2',
      read: false,
      timestamp: '1 hour ago',
      icon: UserPlus,
      color: 'green'
    },
    {
      id: '3',
      type: 'deal_won',
      title: 'Deal won!',
      message: 'Enterprise Deal closed - £5,000',
      link: '/dashboard/deals',
      read: true,
      timestamp: '3 hours ago',
      icon: DollarSign,
      color: 'purple'
    },
    {
      id: '4',
      type: 'payment_received',
      title: 'Payment received',
      message: 'Mike Johnson paid £129.00',
      link: '/dashboard/payments',
      read: true,
      timestamp: '5 hours ago',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: '5',
      type: 'automation_run',
      title: 'Automation completed',
      message: 'Welcome New Leads ran successfully',
      link: '/dashboard/automations',
      read: true,
      timestamp: '1 day ago',
      icon: Zap,
      color: 'amber'
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-stone-900">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-stone-600">Stay updated with your latest activity</p>
            </div>
            <Link
              href="/dashboard/settings/notifications"
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Actions Bar */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border-2 transition-all ${
                  notification.read 
                    ? 'border-stone-200' 
                    : 'border-blue-200 bg-blue-50/30'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-${notification.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`w-6 h-6 text-${notification.color}-600`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-stone-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-stone-600">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-stone-500">
                          {notification.timestamp}
                        </span>
                        
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="text-sm text-stone-900 font-medium hover:underline"
                          >
                            View details →
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-stone-100 rounded-lg"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-stone-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">All caught up!</h3>
            <p className="text-stone-600">No new notifications</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-bold text-blue-900 mb-3">Notification Settings</h4>
          <p className="text-blue-800 mb-4">
            Customize which notifications you receive and how you're notified.
          </p>
          <Link
            href="/dashboard/settings/notifications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Settings className="w-4 h-4" />
            Manage Preferences
          </Link>
        </div>
      </div>
    </div>
  )
}
