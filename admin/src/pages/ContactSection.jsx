import { useState, useEffect } from 'react'
import { api } from '../lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Loader2, Eye, EyeOff } from 'lucide-react'

export default function ContactSection() {
  const [settings, setSettings] = useState({
    telegram_link: 'https://t.me/Jaredo_m',
    phone_number: '',
    contact_title: 'Ready to Book?',
    contact_subtitle: 'Contact us directly on Telegram for instant availability checks and reservations.',
    contact_note: 'Contact us directly for availability and booking',
    location: 'Addis Ababa, Ethiopia',
    checkin_time: '12:00 PM',
    checkout_time: '11:00 AM',
    show_prices: 'true',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.getSettings().then((data) => {
      setSettings((prev) => ({ ...prev, ...data }))
    }).catch(console.error)
  }, [])

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await api.updateSettings(settings)
      setMessage({ type: 'success', text: 'Contact info saved!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
          <p className="text-gray-500 text-sm mt-1">Update Telegram link, phone number, and contact details.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Telegram Link</label>
            <Input
              value={settings.telegram_link || ''}
              onChange={(e) => handleChange('telegram_link', e.target.value)}
              placeholder="https://t.me/yourusername"
            />
            <p className="text-xs text-gray-400">
              This link is used for all "Book Now" and "Book on Telegram" buttons across the site.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              value={settings.phone_number || ''}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              placeholder="+251 911 234 567"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Section Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Title</label>
            <Input value={settings.contact_title || ''} onChange={(e) => handleChange('contact_title', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Subtitle</label>
            <Textarea value={settings.contact_subtitle || ''} onChange={(e) => handleChange('contact_subtitle', e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Note (below button)</label>
            <Input value={settings.contact_note || ''} onChange={(e) => handleChange('contact_note', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location & Times</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input value={settings.location || ''} onChange={(e) => handleChange('location', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-in Time</label>
            <Input value={settings.checkin_time || ''} onChange={(e) => handleChange('checkin_time', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-out Time</label>
            <Input value={settings.checkout_time || ''} onChange={(e) => handleChange('checkout_time', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Display Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Show Prices on Website</label>
              <p className="text-xs text-gray-400 mt-0.5">Toggle room price display on the public site</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange('show_prices', settings.show_prices === 'true' ? 'false' : 'true')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.show_prices === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform ${settings.show_prices === 'true' ? 'translate-x-6' : 'translate-x-1'}`}>
                {settings.show_prices === 'true' ? <Eye className="h-3 w-3 text-blue-600" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
