import { useState, useEffect } from 'react'
import { api } from '../lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger
} from '@/components/ui/dialog'
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'

export default function GallerySection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => { loadGallery() }, [])

  const loadGallery = async () => {
    try {
      const data = await api.getGallery()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!imageFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('caption', caption)
      formData.append('sort_order', items.length)
      await api.uploadGalleryImage(formData)
      setUploadOpen(false)
      setImageFile(null)
      setCaption('')
      setMessage({ type: 'success', text: 'Image uploaded!' })
      loadGallery()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUploading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this image from the gallery?')) return
    try {
      await api.deleteGalleryItem(id)
      setMessage({ type: 'success', text: 'Image deleted' })
      loadGallery()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage photos for the website gallery.</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" /> Upload Image
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No images in the gallery yet.</p>
            <p className="text-sm mt-1">Click "Upload Image" to add photos.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white">
              <div className="aspect-square">
                <img src={item.image_url} alt={item.caption || 'Gallery'} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{item.caption || 'No caption'}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>Add a new photo to the gallery.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image *</label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Caption (optional)</label>
              <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Brief description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!imageFile || uploading}>
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
