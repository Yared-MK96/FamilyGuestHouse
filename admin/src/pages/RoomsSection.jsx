import { useState, useEffect } from 'react'
import { api } from '../lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Pencil, Trash2, Image as ImageIcon, Loader2, DollarSign, Upload
} from 'lucide-react'

export default function RoomsSection() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingRoom, setEditingRoom] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', badge: '', bed_type: '', is_featured: false, sort_order: 0 })
  const [imageFile, setImageFile] = useState(null)
  const [priceEdit, setPriceEdit] = useState({ id: null, value: '' })
  const [descEdit, setDescEdit] = useState({ id: null, value: '' })
  const [message, setMessage] = useState(null)

  useEffect(() => { loadRooms() }, [])

  const loadRooms = async () => {
    try {
      const data = await api.getRooms()
      setRooms(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingRoom(null)
    setForm({ name: '', description: '', price: '', badge: '', bed_type: '', is_featured: false, sort_order: 0 })
    setImageFile(null)
    setDialogOpen(true)
  }

  const openEdit = (room) => {
    setEditingRoom(room)
    setForm({
      name: room.name || '',
      description: room.description || '',
      price: room.price?.toString() || '',
      badge: room.badge || '',
      bed_type: room.bed_type || '',
      is_featured: room.is_featured || false,
      sort_order: room.sort_order?.toString() || '0',
    })
    setImageFile(null)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('badge', form.badge)
      formData.append('bed_type', form.bed_type)
      formData.append('is_featured', form.is_featured)
      formData.append('sort_order', form.sort_order)
      if (imageFile) formData.append('image', imageFile)

      if (editingRoom) {
        await api.updateRoom(editingRoom.id, formData)
        setMessage({ type: 'success', text: 'Room updated!' })
      } else {
        await api.createRoom(formData)
        setMessage({ type: 'success', text: 'Room created!' })
      }
      setDialogOpen(false)
      loadRooms()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this room?')) return
    try {
      await api.deleteRoom(id)
      setMessage({ type: 'success', text: 'Room deleted' })
      loadRooms()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handlePriceUpdate = async (id) => {
    if (!priceEdit.value || isNaN(priceEdit.value)) return
    try {
      await api.updateRoomPrice(id, parseFloat(priceEdit.value))
      setPriceEdit({ id: null, value: '' })
      setMessage({ type: 'success', text: 'Price updated!' })
      loadRooms()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDescUpdate = async (id) => {
    if (!descEdit.value) return
    try {
      await api.updateRoomDesc(id, descEdit.value)
      setDescEdit({ id: null, value: '' })
      setMessage({ type: 'success', text: 'Description updated!' })
      loadRooms()
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
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, delete rooms and update prices.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Room
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4">
        {rooms.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <BedDouble className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No rooms yet. Click "Add Room" to create one.</p>
            </CardContent>
          </Card>
        )}
        {rooms.map((room) => (
          <Card key={room.id} className={`overflow-hidden ${room.is_featured ? 'ring-2 ring-blue-400' : ''}`}>
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-40 sm:h-auto bg-gray-100 flex-shrink-0 relative group cursor-pointer" onClick={() => openEdit(room)}>
                {room.image_url ? (
                  <>
                    <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium flex items-center gap-1"><Upload className="h-3 w-3" /> Change Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:text-gray-400 transition-colors">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 mx-auto" />
                      <span className="text-xs block mt-1">Click to add photo</span>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{room.name}</h3>
                      {room.is_featured && <Badge>Featured</Badge>}
                      {room.badge && <Badge variant="secondary">{room.badge}</Badge>}
                    </div>
                    {descEdit.id === room.id ? (
                      <div className="flex items-start gap-1 mt-1">
                        <textarea
                          value={descEdit.value}
                          onChange={(e) => setDescEdit({ ...descEdit, value: e.target.value })}
                          className="text-sm w-full rounded border border-input bg-transparent px-2 py-1 resize-none"
                          rows={2}
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Escape') setDescEdit({ id: null, value: '' }); if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleDescUpdate(room.id) } }}
                        />
                        <Button size="sm" onClick={() => handleDescUpdate(room.id)} className="h-8 shrink-0">Save</Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 cursor-pointer hover:text-gray-700" onClick={() => setDescEdit({ id: room.id, value: room.description || '' })}>{room.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Bed: {room.bed_type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {priceEdit.id === room.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={priceEdit.value}
                          onChange={(e) => setPriceEdit({ ...priceEdit, value: e.target.value })}
                          className="w-20 h-8 text-sm"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Enter') handlePriceUpdate(room.id); if (e.key === 'Escape') setPriceEdit({ id: null, value: '' }) }}
                        />
                        <Button size="sm" onClick={() => handlePriceUpdate(room.id)} className="h-8">Save</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => setPriceEdit({ id: room.id, value: room.price?.toString() || '' })}>
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">{room.price || '0'}</span>
                        <span className="text-xs text-gray-400">/night</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline" onClick={() => openEdit(room)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(room.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            <DialogDescription>
              {editingRoom ? 'Update the room details below.' : 'Fill in the details for the new room.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (per night)</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bed Type</label>
                <Input value={form.bed_type} onChange={(e) => setForm({ ...form, bed_type: e.target.value })} placeholder="e.g. Queen bed" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Badge</label>
                <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Most Popular" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
              <label htmlFor="featured" className="text-sm font-medium">Featured Room</label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Photo</label>
              {editingRoom?.image_url && !imageFile && (
                <div className="mb-2">
                  <img src={editingRoom.image_url} alt="Current" className="w-32 h-24 object-cover rounded border" />
                  <p className="text-xs text-gray-400 mt-1">Current photo</p>
                </div>
              )}
              {imageFile && (
                <div className="mb-2">
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-32 h-24 object-cover rounded border" />
                  <p className="text-xs text-green-600 mt-1">New photo selected</p>
                </div>
              )}
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              {editingRoom?.image_url && (
                <p className="text-xs text-gray-400">Leave empty to keep current photo</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {editingRoom ? 'Update Room' : 'Create Room'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
