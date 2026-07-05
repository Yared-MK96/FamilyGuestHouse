import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
  FaFacebookF, FaInstagram, FaYoutube, FaTiktok,
  FaBars, FaTimes, FaUserCircle,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS, HOTEL_INFO } from '../../constants';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="w-full shadow-md z-50 sticky top-0">
      {/* Top Bar */}
      <div className="bg-[#1a191f] text-gray-200 text-sm py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-xs">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#a58641]" />
            <span>{HOTEL_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-[#a58641]" />
            <span>{HOTEL_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-[#a58641]" />
            <span>{HOTEL_INFO.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          {[FaFacebookF, FaInstagram, FaYoutube, FaTiktok].map((Icon, i) => (
            <a key={i} href="#"
              className="w-7 h-7 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#a58641] hover:border-[#a58641] transition-colors">
              <Icon size={12} />
            </a>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white py-4 px-4 md:px-8 flex justify-between items-center border-b">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center gap-1">
          <span className="text-[#a58641]">Family</span>&nbsp;Guest House
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium text-sm">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'}
              className={({ isActive }) =>
                isActive ? 'text-[#a58641] font-semibold' : 'hover:text-[#a58641] transition-colors'
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link to="/dashboard"
                  className="text-xs border border-[#a58641] text-[#a58641] hover:bg-[#a58641] hover:text-white px-3 py-1.5 rounded transition-colors">
                  Dashboard
                </Link>
              )}
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <FaUserCircle className="text-[#a58641]" /> {user.name}
              </span>
              <button onClick={logout}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"
                className="text-sm border border-gray-300 hover:border-[#a58641] text-gray-700 hover:text-[#a58641] px-4 py-2 rounded transition-colors">
                Login
              </Link>
              <Link to="/register"
                className="text-sm bg-[#a58641] hover:bg-[#8b6e32] text-white px-4 py-2 rounded transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg px-6 py-4 space-y-3">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm font-medium ${isActive ? 'text-[#a58641]' : 'text-gray-700 hover:text-[#a58641]'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <hr />
          {user ? (
            <>
              {isAdmin && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-[#a58641]">Dashboard</Link>}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-sm text-red-500">Logout</button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm border border-gray-300 py-2 rounded">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm bg-[#a58641] text-white py-2 rounded">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
