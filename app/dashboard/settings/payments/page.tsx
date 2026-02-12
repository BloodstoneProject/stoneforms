'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Link as LinkIcon
} from 'lucide-react'

export default function PaymentSettingsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [stripePublicKey, setStripePublicKey] = useState('')
  const [stripeSecretKey, setStripeSecretKey] = useState('')
  const [defaultCurrency, setDefaultCurrency] = useState('USD')

  // Mock payment stats
  const stats = {
    totalRevenue: 24750,
    thisMonth: 8450,
    transactions: 89,
    avgTransaction: 278,
  }

  const recentTransactions = [
    {
      id: '1',
      customer: 'Sarah Johnson',
      amount: 299,
      currency: 'USD',
      formName: 'Event Registration',
      date: '2024-02-09T10:30:00',
      status: 'succeeded',
    },
    {
      id: '2',
      customer: 'Michael Chen',
      amount: 499,
      currency: 'USD',
      formName: 'Course Enrollment',
      date: '2024-02-08T14:20:00',
      status: 'succeeded',
    },
    {
      id: '3',
      customer: 'Emma Wilson',
      amount: 149,
      currency: 'USD',
      formName: 'Membership Signup',
      date: '2024-02-07T09:15:00',
      status: 'succeeded',
    },
  ]

  const handleConnect = () => {
    // TODO: Actual Stripe OAuth flow
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setStripePublicKey('')
    setStripeSecretKey('')
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>Payment Settings</h1>
        <p style={{ color: '#3d5948' }} className="mt-1">
          Connect Stripe to accept payments through your forms
        </p>
      </div>

      {/* Connection Status */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>Stripe Connection</CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-semibold text-green-800">Connected to Stripe</p>
                  <p className="text-sm text-green-700">You can now accept payments through your forms</p>
                </div>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>

              {/* Payment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
                  <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Total Revenue</p>
                  <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
                  <p className="text-sm mb-1" style={{ color: '#3d5948' }}>This Month</p>
                  <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                    ${stats.thisMonth.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
                  <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Transactions</p>
                  <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                    {stats.transactions}
                  </p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
                  <p className="text-sm mb-1" style={{ color: '#3d5948' }}>Avg. Transaction</p>
                  <p className="text-2xl font-bold" style={{ color: '#142c1c' }}>
                    ${stats.avgTransaction}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#fff8e1' }}>
                <AlertCircle className="w-6 h-6 text-yellow-700 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-800">Stripe Not Connected</p>
                  <p className="text-sm text-yellow-700">Connect your Stripe account to start accepting payments</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Stripe Publishable Key</Label>
                  <Input
                    type="text"
                    placeholder="pk_test_..."
                    value={stripePublicKey}
                    onChange={(e) => setStripePublicKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stripe Secret Key</Label>
                  <Input
                    type="password"
                    placeholder="sk_test_..."
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full rounded-md border p-3"
                    style={{ borderColor: '#e8e4db' }}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                <Button 
                  className="w-full text-white" 
                  style={{ backgroundColor: '#142c1c' }}
                  onClick={handleConnect}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect Stripe Account
                </Button>

                <p className="text-xs text-center" style={{ color: '#3d5948' }}>
                  Don't have a Stripe account? 
                  <a href="https://stripe.com" target="_blank" className="underline ml-1">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {isConnected && (
        <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
          <CardHeader>
            <CardTitle style={{ color: '#142c1c' }}>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: '#e8e4db' }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#3d5948' }}
                    >
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#142c1c' }}>
                        {transaction.customer}
                      </p>
                      <p className="text-sm" style={{ color: '#3d5948' }}>
                        {transaction.formName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: '#142c1c' }}>
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs" style={{ color: '#3d5948' }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Features */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>Payment Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" style={{ color: '#3d5948' }} />
                <div>
                  <p className="font-medium" style={{ color: '#142c1c' }}>One-Time Payments</p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>Accept single payments for events, products, services</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" style={{ color: '#3d5948' }} />
                <div>
                  <p className="font-medium" style={{ color: '#142c1c' }}>Recurring Subscriptions</p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>Set up monthly or yearly subscription payments</p>
                </div>
              </div>
              <Switch checked={false} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5" style={{ color: '#3d5948' }} />
                <div>
                  <p className="font-medium" style={{ color: '#142c1c' }}>Variable Pricing</p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>Calculate price based on form answers</p>
                </div>
              </div>
              <Switch checked={false} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" style={{ color: '#3d5948' }} />
                <div>
                  <p className="font-medium" style={{ color: '#142c1c' }}>Custom Amounts</p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>Let customers enter their own amount (donations)</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Guide */}
      <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
        <CardHeader>
          <CardTitle style={{ color: '#142c1c' }}>How to Accept Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: '#142c1c' }}
              >
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: '#142c1c' }}>Connect Stripe</h4>
                <p className="text-sm" style={{ color: '#3d5948' }}>
                  Add your Stripe API keys above to enable payment processing
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: '#3d5948' }}
              >
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: '#142c1c' }}>Enable on Forms</h4>
                <p className="text-sm" style={{ color: '#3d5948' }}>
                  Go to form settings and enable payment collection with your desired amount
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: '#770a19' }}
              >
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: '#142c1c' }}>Start Collecting</h4>
                <p className="text-sm" style={{ color: '#3d5948' }}>
                  Payments are automatically processed when users submit your form
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
