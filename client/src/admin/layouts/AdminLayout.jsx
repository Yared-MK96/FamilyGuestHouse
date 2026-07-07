import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaTachometerAlt,
  FaBed,
  FaClipboardList,
  FaUsers,
  FaMoneyCheckAlt,
  FaSignOutAlt,
  FaChevronRight,
} from 'react-icons/fa';

const sidebarLinks = [
  { label: 'Dashboard',    icon: FaTachometerAlt, path: '/admin' },
  { label: 'Rooms',        icon: FaBed,           path: '/admin/rooms' },
  { label: 'Bookings',     icon: FaClipboardList, path: '/admin/bookings' },
  { label: 'Payments',     icon: FaMoneyCheckAlt, path: '/admin/payments' },
  { label: 'Users',        icon: FaUsers,         path: '/admin/users' },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar - Sleek Dark Slate */}
      <aside className="w-64 bg-slate-900 text-gray-300 flex flex-col shadow-2xl z-20">
        <div className="px-6 py-8 border-b border-white/5">
          <Link to="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded-md">FG</span>
            <span className="leading-tight">Family<br/>Guest House</span>
          </Link>
          <div className="mt-2 text-xs font-semibold text-blue-400 tracking-widest uppercase">
            Admin Portal
          </div>
        </div>
        
        <nav className="flex-grow py-6 space-y-1">
          {sidebarLinks.map(({ label, icon: Icon, path }) => {
            const active = pathname === path || (path !== '/admin' && pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-4 px-6 py-3 text-sm font-medium transition-all duration-200
                  ${active 
                    ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                    : 'hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon size={18} className={active ? 'text-blue-500' : 'text-gray-500'} />
                <span>{label}</span>
                {active && <FaChevronRight size={12} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="px-6 py-6 border-t border-white/5 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-inner">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <span className="text-blue-600">Admin</span>
            <span>/</span>
            <span className="text-gray-700 capitalize">
              {pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
            </span>
          </div>
          <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        
        <main className="flex-grow overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
