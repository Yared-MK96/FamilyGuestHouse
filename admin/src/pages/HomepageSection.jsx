import { useState, useEffect } from 'react'
import { api } from '../lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Upload, Eye, Loader2 } from 'lucide-react'

export default function HomepageSection() {
  const [settings, setSettings] = useState({
    hero_title: 'Welcome to\nFamily Guest House',
    hero_subtitle: 'Comfort, safety, and affordable rooms for your stay',
    hero_badge: 'Trusted by Guests Since 2010',
    hero_stat1_label: 'Happy Guests',
    hero_stat1_value: '500+',
    hero_stat2_label: 'Room Types',
    hero_stat2_value: '4',
    hero_stat3_label: 'Support',
    hero_stat3_value: '24/7',
    hero_image: null,
    features_title_1: 'Safe & Secure',
    features_sub_1: '24/7 security',
    features_title_2: 'Breakfast Included',
    features_sub_2: 'Daily meals',
    features_title_3: 'Free Wi-Fi',
    features_sub_3: 'All rooms',
    features_title_4: 'En-Suite Bathroom',
    features_sub_4: 'Every room',
    testimonial_1_text: 'Absolutely loved my stay! The staff was super friendly and the room was spotless.',
    testimonial_1_author: 'Meron T.',
    testimonial_2_text: 'Very affordable and comfortable. Will definitely come back again!',
    testimonial_2_author: 'Yonas B.',
    testimonial_3_text: 'The Deluxe room exceeded my expectations. Highly recommend for families.',
    testimonial_3_author: 'Sara K.',
  })
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [heroPreview, setHeroPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error)
  }, [])

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await api.updateSettings(settings)
      setMessage({ type: 'success', text: 'Homepage settings saved!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleHeroUpload = async () => {
    if (!heroImageFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', heroImageFile)
      const result = await api.uploadHeroImage(formData)
      setSettings((prev) => ({ ...prev, hero_image: result.value }))
      setHeroImageFile(null)
      setHeroPreview(null)
      setMessage({ type: 'success', text: 'Hero image updated!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUploading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleHeroFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHeroImageFile(file)
      setHeroPreview(URL.createObjectURL(file))
    }
  }

  const inputClasses = "w-full"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
          <p className="text-gray-500 text-sm mt-1">Edit all text and images on the public homepage.</p>
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
          <CardTitle className="text-lg">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Badge</label>
            <Input value={settings.hero_badge || ''} onChange={(e) => handleChange('hero_badge', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Title</label>
            <Textarea value={settings.hero_title || ''} onChange={(e) => handleChange('hero_title', e.target.value)} rows={2} />
            <p className="text-xs text-gray-400">Use \n for line breaks</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Subtitle</label>
            <Input value={settings.hero_subtitle || ''} onChange={(e) => handleChange('hero_subtitle', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Stat 1 Value</label>
              <Input value={settings.hero_stat1_value || ''} onChange={(e) => handleChange('hero_stat1_value', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stat 2 Value</label>
              <Input value={settings.hero_stat2_value || ''} onChange={(e) => handleChange('hero_stat2_value', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stat 3 Value</label>
              <Input value={settings.hero_stat3_value || ''} onChange={(e) => handleChange('hero_stat3_value', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stat 1 Label</label>
              <Input value={settings.hero_stat1_label || ''} onChange={(e) => handleChange('hero_stat1_label', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stat 2 Label</label>
              <Input value={settings.hero_stat2_label || ''} onChange={(e) => handleChange('hero_stat2_label', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stat 3 Label</label>
              <Input value={settings.hero_stat3_label || ''} onChange={(e) => handleChange('hero_stat3_label', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Background Image</label>
            <div className="flex items-center gap-4 flex-wrap">
              <Input type="file" accept="image/*" onChange={handleHeroFileSelect} className="flex-1" />
              <Button onClick={handleHeroUpload} disabled={!heroImageFile || uploading} variant="outline">
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                Upload
              </Button>
            </div>
            <div className="mt-2 flex gap-4 flex-wrap">
              {heroPreview && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">New image:</p>
                  <img src={heroPreview} className="h-32 w-56 object-cover rounded-lg border" />
                </div>
              )}
              {settings.hero_image && !heroPreview && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current image:</p>
                  <img src={settings.hero_image} className="h-32 w-56 object-cover rounded-lg border" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features Strip</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 p-3 border rounded-lg">
              <label className="text-sm font-medium">Feature {i} Title</label>
              <Input value={settings[`features_title_${i}`] || ''} onChange={(e) => handleChange(`features_title_${i}`, e.target.value)} />
              <label className="text-sm font-medium">Feature {i} Subtitle</label>
              <Input value={settings[`features_sub_${i}`] || ''} onChange={(e) => handleChange(`features_sub_${i}`, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testimonials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 border rounded-lg space-y-2">
              <label className="text-sm font-medium">Testimonial {i} Text</label>
              <Textarea value={settings[`testimonial_${i}_text`] || ''} onChange={(e) => handleChange(`testimonial_${i}_text`, e.target.value)} rows={2} />
              <label className="text-sm font-medium">Testimonial {i} Author</label>
              <Input value={settings[`testimonial_${i}_author`] || ''} onChange={(e) => handleChange(`testimonial_${i}_author`, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
