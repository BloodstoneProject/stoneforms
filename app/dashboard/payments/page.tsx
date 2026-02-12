'use client'

import { useState } from 'react'
import { CreditCard, DollarSign, Check, Settings, TrendingUp } from 'lucide-react'

export default function PaymentsPage() {
  const [stripeConnected, setStripeConnected] = useState(true)
  const [paypalConnected, setPaypalConnected] = useState(false)

  const transactions = [
    { id: '1', customer: 'John Doe', email: 'john@example.com', amount: '£49.99', status: 'completed', date: '2 hours ago', form: 'Product Order' },
    { id: '2', customer: 'Sarah Smith', email: 'sarah@example.com', amount: '£129.00', status: 'completed', date: '5 hours ago', form: 'Event Registration' },
    { id: '3', customer: 'Mike Johnson', email: 'mike@example.com', amount: '£25.00', status: 'pending', date: '1 day ago', form: 'Donation Form' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-stone-900">Payments</h1>
          <p className="text-stone-600 mt-1">Accept payments through your forms</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="text-stone-600 text-sm mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-stone-900">£12,450</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <div className="text-green-700 text-sm mb-1">This Month</div>
            <div className="text-3xl font-bold text-green-900">£3,250</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <div className="text-blue-700 text-sm mb-1">Transactions</div>
            <div className="text-3xl font-bold text-blue-900">127</div>
          </div>
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
            <div className="text-purple-700 text-sm mb-1">Success Rate</div>
            <div className="text-3xl font-bold text-purple-900">98.5%</div>
          </div>
        </div>

        {/* Payment Providers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`bg-white rounded-lg border-2 p-6 ${stripeConnected ? 'border-green-500' : 'border-stone-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Stripe</h3>
                <p className="text-stone-600 text-sm">Accept credit cards and more</p>
              </div>
              {stripeConnected && <Check className="w-6 h-6 text-green-600" />}
            </div>
            {stripeConnected ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">Connected to account ending in •••• 4242</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm font-medium">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
              </div>
            ) : (
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Connect Stripe
              </button>
            )}
          </div>

          <div className={`bg-white rounded-lg border-2 p-6 ${paypalConnected ? 'border-green-500' : 'border-stone-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">PayPal</h3>
                <p className="text-stone-600 text-sm">Accept PayPal payments</p>
              </div>
              {paypalConnected && <Check className="w-6 h-6 text-green-600" />}
            </div>
            <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
              Connect PayPal
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Form</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-900">{txn.customer}</div>
                      <div className="text-sm text-stone-600">{txn.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-900">{txn.form}</td>
                    <td className="px-6 py-4 font-semibold text-stone-900">{txn.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded ${
                        txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
