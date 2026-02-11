'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Link as LinkIcon
} from 'lucide-react'

export default function AppointmentsPage() {
  const [isCalendarConnected, setIsCalendarConnected] = useState(false)

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: '1',
      title: 'Sales Call - Acme Corp',
      contact: 'Sarah Johnson',
      email: 'sarah@acme.com',
      dateTime: '2024-02-10T14:00:00',
      duration: 30,
      type: 'video',
      status: 'confirmed',
      formName: 'Book a Demo',
    },
    {
      id: '2',
      title: 'Product Demo',
      contact: 'Michael Chen',
      email: 'm.chen@tech.com',
      dateTime: '2024-02-10T15:30:00',
      duration: 60,
      type: 'video',
      status: 'confirmed',
      formName: 'Schedule Consultation',
    },
    {
      id: '3',
      title: 'Support Session',
      contact: 'Emma Wilson',
      email: 'emma@startup.io',
      dateTime: '2024-02-11T10:00:00',
      duration: 45,
      type: 'phone',
      status: 'pending',
      formName: 'Technical Support',
    },
  ]

  const stats = {
    totalBookings: 89,
    thisWeek: 12,
    confirmed: 8,
    cancelled: 2,
  }

  const availabilitySlots = [
    { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Wednesday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Friday', enabled: true, start: '09:00', end: '15:00' },
    { day: 'Saturday', enabled: false, start: '09:00', end: '17:00' },
    { day: 'Sunday', enabled: false, start: '09:00', end: '17:00' },
  ]

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Appointment Booking</h1>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Manage calendar integrations and scheduled appointments
          </p>
        </div>
        <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
          <Plus className="w-4 h-4" />
          New Booking Link
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Bookings</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#142c1c' }}>
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>This Week</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.thisWeek}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Confirmed</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d5948' }}>
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Cancelled</p>
                <p className="text-3xl font-bold" style={{ color: '#142c1c' }}>{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#770a19' }}>
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar Connection */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calendar Integration */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Calendar Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCalendarConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-800">Google Calendar Connected</p>
                      <p className="text-sm text-green-700">work@example.com</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsCalendarConnected(false)} className="w-full">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#fff8e1' }}>
                    <AlertCircle className="w-6 h-6 text-yellow-700 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-800">No Calendar Connected</p>
                      <p className="text-sm text-yellow-700">Connect to sync appointments</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start gap-3"
                      variant="outline"
                      onClick={() => setIsCalendarConnected(true)}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Connect Google Calendar
                    </Button>

                    <Button className="w-full justify-start gap-3" variant="outline">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0078D4">
                        <path d="M23 11.01v.5c0 1.8-1.46 3.25-3.25 3.25H16.5v6.5c0 .69-.56 1.25-1.25 1.25h-6.5C7.56 22.51 7 21.95 7 21.26v-6.5H3.75C1.95 14.76.5 13.3.5 11.51v-.5c0-1.8 1.45-3.25 3.25-3.25H7V1.25C7 .56 7.56 0 8.25 0h6.5c.69 0 1.25.56 1.25 1.25v6.51h3.25c1.8 0 3.25 1.45 3.25 3.25z"/>
                      </svg>
                      Connect Outlook Calendar
                    </Button>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="pt-4 border-t space-y-4" style={{ borderColor: '#e8e4db' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#142c1c' }}>Buffer Time</p>
                    <p className="text-xs" style={{ color: '#3d5948' }}>Gap between meetings</p>
                  </div>
                  <select className="rounded-md border p-2 text-sm" style={{ borderColor: '#e8e4db' }}>
                    <option>0 min</option>
                    <option>15 min</option>
                    <option>30 min</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#142c1c' }}>Confirmation Email</p>
                    <p className="text-xs" style={{ color: '#3d5948' }}>Send after booking</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#142c1c' }}>Reminder Email</p>
                    <p className="text-xs" style={{ color: '#3d5948' }}>24 hours before</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availabilitySlots.map((slot) => (
                  <div key={slot.day} className="flex items-center gap-3">
                    <Switch checked={slot.enabled} />
                    <span className="w-20 text-sm font-medium" style={{ color: '#142c1c' }}>
                      {slot.day}
                    </span>
                    {slot.enabled && (
                      <div className="flex items-center gap-2 text-sm">
                        <Input
                          type="time"
                          value={slot.start}
                          className="w-24 h-8"
                        />
                        <span style={{ color: '#3d5948' }}>to</span>
                        <Input
                          type="time"
                          value={slot.end}
                          className="w-24 h-8"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#e8e4db' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#142c1c' }}
                        >
                          {appointment.type === 'video' ? (
                            <Video className="w-5 h-5 text-white" />
                          ) : (
                            <Phone className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1" style={{ color: '#142c1c' }}>
                            {appointment.title}
                          </h4>
                          <div className="flex flex-col gap-1 text-sm" style={{ color: '#3d5948' }}>
                            <span>{appointment.contact} • {appointment.email}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(appointment.dateTime).toLocaleString()} ({appointment.duration} min)
                            </span>
                            <span className="text-xs">From: {appointment.formName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={appointment.status === 'confirmed'
                            ? { backgroundColor: '#e8f5e9', color: '#2e7d32' }
                            : { backgroundColor: '#fff8e1', color: '#f57c00' }
                          }
                        >
                          {appointment.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <LinkIcon className="w-3 h-3" />
                        Join Meeting
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        Cancel
                      </Button>
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
