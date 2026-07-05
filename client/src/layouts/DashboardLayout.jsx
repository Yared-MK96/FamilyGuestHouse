import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt, FaBed, FaClipboardList, FaUsers,
  FaCog, FaSignOutAlt, FaChevronRight,
} from 'react-icons/fa';

const sidebarLinks = [
  { label: 'Dashboard',  icon: FaTachometerAlt, path: '/dashboard' },
  { label: 'Rooms',      icon: FaBed,           path: '/dashboard/rooms' },
  { label: 'Bookings',   icon: FaClipboardList, path: '/dashboard/bookings' },
  { label: 'Customers',  icon: FaUsers,         path: '/dashboard/customers' },
  { label: 'Settings',   icon: FaCog,           path: '/dashboard/settings' },
];

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-gray-200 flex flex-col shadow-xl">
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="text-xl font-bold text-white">
            Family Guest House
          </Link>
          <p className="text-xs text-white/50 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-grow py-4">
          {sidebarLinks.map(({ label, icon: Icon, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                  ${active ? 'bg-white/10 text-white border-r-4 border-white' : 'hover:bg-white/10 hover:text-white'}`}
              >
                <Icon size={16} />
                <span>{label}</span>
                {active && <FaChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-white/50 capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white shadow px-8 py-4 text-sm text-gray-500 flex items-center justify-between">
          <span className="font-semibold text-gray-700 capitalize">
            {pathname.split('/').filter(Boolean).join(' › ')}
          </span>
          <span className="text-xs">{new Date().toDateString()}</span>
        </header>
        <main className="flex-grow overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
