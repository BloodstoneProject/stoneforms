'use client'

import Link from 'next/link'
import { ArrowLeft, CreditCard, Download, Check } from 'lucide-react'

export default function BillingSettingsPage() {
  const currentPlan = {
    name: 'Professional',
    price: '£15',
    period: 'month',
    nextBilling: '2024-03-15',
  }

  const invoices = [
    { id: 'INV-001', date: '2024-02-01', amount: '£15.00', status: 'paid' },
    { id: 'INV-002', date: '2024-01-01', amount: '£15.00', status: 'paid' },
    { id: 'INV-003', date: '2023-12-01', amount: '£15.00', status: 'paid' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/settings" className="text-stone-600 hover:text-stone-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Billing & Subscription</h1>
              <p className="text-stone-600 text-sm mt-1">Manage your plan and payment methods</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Current Plan */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Current Plan</h2>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-stone-900">{currentPlan.name}</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-stone-600 mb-4">
                <span className="text-3xl font-bold text-stone-900">{currentPlan.price}</span> / {currentPlan.period}
              </p>
              <p className="text-sm text-stone-600">
                Next billing date: {new Date(currentPlan.nextBilling).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/pricing" className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium">
                Change Plan
              </Link>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium">
                Cancel Plan
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-900">Payment Method</h2>
            <button className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium text-sm">
              Add Payment Method
            </button>
          </div>
          
          <div className="border border-stone-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Visa ending in 4242</p>
                  <p className="text-sm text-stone-600">Expires 12/2025</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm text-stone-600 hover:text-stone-900">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Billing History</h2>
          <div className="space-y-3">
            {invoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{invoice.id}</p>
                    <p className="text-sm text-stone-600">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-semibold text-stone-900">{invoice.amount}</span>
                  <button className="flex items-center gap-2 text-stone-600 hover:text-stone-900">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
