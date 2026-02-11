'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  const features = [
    'AI-powered form generation',
    'Built-in CRM & automation',
    'Interactive flipbooks',
    'Appointment booking',
    'White label ready',
  ]

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: '#f4f2ed' }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12" style={{ backgroundColor: '#142c1c' }}>
        <div>
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#f4f2ed' }}
            >
              <Sparkles className="w-6 h-6" style={{ color: '#142c1c' }} />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#f4f2ed' }}>
              Stoneforms
            </span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#f4f2ed' }}>
            Craft Forms That Convert Like Stone
          </h1>
          
          <p className="text-xl mb-12" style={{ color: '#3d5948' }}>
            The only platform with AI generation, CRM, flipbooks, and automation — all in one place.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#3d5948' }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#f4f2ed' }} />
                </div>
                <span className="text-lg" style={{ color: '#f4f2ed' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm" style={{ color: '#3d5948' }}>
            "Stoneforms replaced 5 tools for us. The AI form builder alone is worth it!"
          </p>
          <div>
            <p className="font-semibold" style={{ color: '#f4f2ed' }}>
              Sarah Johnson
            </p>
            <p className="text-sm" style={{ color: '#3d5948' }}>
              Head of Marketing, TechStart Inc
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#142c1c' }}
            >
              <Sparkles className="w-6 h-6" style={{ color: '#f4f2ed' }} />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#142c1c' }}>
              Stoneforms
            </span>
          </Link>

          <Card className="p-8 border-2" style={{ borderColor: '#e8e4db', backgroundColor: 'white' }}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#142c1c' }}>
                Welcome back
              </h2>
              <p style={{ color: '#3d5948' }}>
                Sign in to your account to continue
              </p>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full mb-6 py-6 border-2"
              style={{ borderColor: '#e8e4db' }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#e8e4db' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white" style={{ color: '#3d5948' }}>
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-2">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#3d5948' }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-6 border-2"
                    style={{ borderColor: '#e8e4db' }}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm hover:underline"
                    style={{ color: '#142c1c' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#3d5948' }} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 py-6 border-2"
                    style={{ borderColor: '#e8e4db' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" style={{ color: '#3d5948' }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: '#3d5948' }} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg gap-2 text-white"
                style={{ backgroundColor: '#142c1c' }}
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: '#3d5948' }}>
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="font-semibold hover:underline"
                style={{ color: '#142c1c' }}
              >
                Sign up for free
              </Link>
            </p>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm" style={{ color: '#3d5948' }}>
              Trusted by 1,500+ companies worldwide
            </p>
            <div className="flex items-center justify-center gap-6 opacity-50">
              <div className="text-xs font-semibold" style={{ color: '#142c1c' }}>BOSCH</div>
              <div className="text-xs font-semibold" style={{ color: '#142c1c' }}>PUMA</div>
              <div className="text-xs font-semibold" style={{ color: '#142c1c' }}>DANONE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
