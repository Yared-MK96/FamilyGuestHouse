import { useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from '../App'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard, Home, BedDouble, Image, Phone, LogOut, Menu, X
} from 'lucide-react'
import HomepageSection from './HomepageSection'
import RoomsSection from './RoomsSection'
import GallerySection from './GallerySection'
import ContactSection from './ContactSection'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/homepage', icon: Home, label: 'Homepage' },
  { to: '/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/gallery', icon: Image, label: 'Gallery' },
  { to: '/contact', icon: Phone, label: 'Contact' },
]

function Sidebar({ open, onClose }) {
  const { logout } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              FG
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Family Guest House</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-red-600"
            onClick={() => { logout(); onClose() }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}

function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Manage your Family Guest House website content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Home, label: 'Homepage', desc: 'Edit hero, text & images', to: '/homepage', color: 'text-blue-600 bg-blue-50' },
          { icon: BedDouble, label: 'Rooms', desc: 'Manage rooms & prices', to: '/rooms', color: 'text-green-600 bg-green-50' },
          { icon: Image, label: 'Gallery', desc: 'Upload & manage photos', to: '/gallery', color: 'text-purple-600 bg-purple-50' },
          { icon: Phone, label: 'Contact', desc: 'Telegram & phone info', to: '/contact', color: 'text-amber-600 bg-amber-50' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </NavLink>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-2">Quick Tips</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Changes you make in the admin panel appear immediately on the public website.</li>
          <li>• Upload images in JPG, PNG, or WebP format (max 5MB for rooms, 10MB for hero/gallery).</li>
          <li>• Room prices can be updated quickly from the Rooms section.</li>
          <li>• The Telegram link is used for the "Book Now" buttons across the site.</li>
        </ul>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200 px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1" />
          </div>
        </header>

        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="homepage" element={<HomepageSection />} />
            <Route path="rooms" element={<RoomsSection />} />
            <Route path="gallery" element={<GallerySection />} />
            <Route path="contact" element={<ContactSection />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
