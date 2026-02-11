'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Palette,
  Globe,
  Upload,
  Eye,
  CheckCircle2,
  Crown,
  Sparkles
} from 'lucide-react'

export default function WhiteLabelPage() {
  const [customDomain, setCustomDomain] = useState('forms.yourbrand.com')
  const [brandName, setBrandName] = useState('YourBrand')
  const [primaryColor, setPrimaryColor] = useState('#142c1c')
  const [removeBranding, setRemoveBranding] = useState(true)
  const [customCSS, setCustomCSS] = useState('')

  const isPremium = true // Check user plan

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold" style={{ color: '#142c1c' }}>White Label</h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: '#770a19', color: '#f4f2ed' }}>
              ENTERPRISE
            </span>
          </div>
          <p style={{ color: '#3d5948' }} className="mt-1">
            Customize Stoneforms to match your brand identity
          </p>
        </div>
        <Button className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
          <Eye className="w-4 h-4" />
          Preview Changes
        </Button>
      </div>

      {!isPremium && (
        <Card style={{ backgroundColor: '#fff8e1', borderColor: '#f57c00' }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Crown className="w-6 h-6 text-yellow-700 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 mb-1">Upgrade to Enterprise</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  White label features are available on Enterprise plans. Remove Stoneforms branding and use your own domain.
                </p>
                <Button className="text-white" style={{ backgroundColor: '#770a19' }}>
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Settings */}
        <div className="space-y-6">
          {/* Custom Domain */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#142c1c' }}>
                <Globe className="w-5 h-5" />
                Custom Domain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your Custom Domain</Label>
                <Input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="forms.yourbrand.com"
                  disabled={!isPremium}
                />
                <p className="text-xs" style={{ color: '#3d5948' }}>
                  Forms will be available at: https://{customDomain}/your-form
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: '#142c1c' }}>DNS Configuration</h4>
                <div className="space-y-2 text-xs" style={{ color: '#3d5948' }}>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <code className="px-2 py-1 rounded" style={{ backgroundColor: 'white' }}>CNAME</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <code className="px-2 py-1 rounded" style={{ backgroundColor: 'white' }}>forms</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Value:</span>
                    <code className="px-2 py-1 rounded" style={{ backgroundColor: 'white' }}>custom.stoneforms.com</code>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Domain verified and active</span>
              </div>
            </CardContent>
          </Card>

          {/* Brand Customization */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#142c1c' }}>
                <Palette className="w-5 h-5" />
                Brand Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Your Company"
                  disabled={!isPremium}
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Brand Color</Label>
                <div className="flex gap-3">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-12"
                    disabled={!isPremium}
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#142c1c"
                    disabled={!isPremium}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#e8e4db' }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#3d5948' }} />
                  <p className="text-sm font-medium mb-1" style={{ color: '#142c1c' }}>
                    Click to upload logo
                  </p>
                  <p className="text-xs" style={{ color: '#3d5948' }}>
                    PNG or SVG, max 2MB
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#e8e4db' }}
                >
                  <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: '#3d5948' }} />
                  <p className="text-xs" style={{ color: '#3d5948' }}>
                    32x32 PNG or ICO
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remove Branding */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Branding Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
                <div>
                  <p className="font-medium" style={{ color: '#142c1c' }}>Remove "Powered by Stoneforms"</p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>Hide Stoneforms branding from forms</p>
                </div>
                <Switch checked={removeBranding} onCheckedChange={setRemoveBranding} disabled={!isPremium} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
                <div>
                  <p className="font-medium" style={{ color: '#142c1c' }}>Custom Email Sender</p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>Send emails from your domain</p>
                </div>
                <Switch checked={true} disabled={!isPremium} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
                <div>
                  <p className="font-medium" style={{ color: '#142c1c' }}>White Label API</p>
                  <p className="text-sm" style={{ color: '#3d5948' }}>Use your brand in API responses</p>
                </div>
                <Switch checked={true} disabled={!isPremium} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Advanced */}
        <div className="space-y-6">
          {/* Custom CSS */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#142c1c' }}>
                <Sparkles className="w-5 h-5" />
                Custom CSS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm" style={{ color: '#3d5948' }}>
                Add custom CSS to fully control the appearance of your forms
              </p>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder=".form-container { background: #fff; }"
                rows={12}
                className="w-full rounded-md border p-3 font-mono text-sm"
                style={{ borderColor: '#e8e4db' }}
                disabled={!isPremium}
              />
              <Button variant="outline" className="w-full" disabled={!isPremium}>
                Validate CSS
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg p-6 space-y-4"
                style={{ 
                  borderColor: '#e8e4db',
                  backgroundColor: '#f4f2ed'
                }}
              >
                {/* Mock Form Preview */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    {brandName[0]}
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: primaryColor }}>
                    {brandName}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#142c1c' }}>
                      What's your name?
                    </label>
                    <input
                      type="text"
                      placeholder="Your answer"
                      className="w-full rounded-md border p-3"
                      style={{ borderColor: '#e8e4db' }}
                    />
                  </div>

                  <button
                    className="px-6 py-3 rounded-lg font-medium text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Continue
                  </button>
                </div>

                {!removeBranding && (
                  <div className="text-center pt-4 border-t" style={{ borderColor: '#e8e4db' }}>
                    <p className="text-xs" style={{ color: '#3d5948' }}>
                      Powered by Stoneforms
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button className="w-full text-white" style={{ backgroundColor: '#142c1c' }} size="lg" disabled={!isPremium}>
            Save White Label Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
