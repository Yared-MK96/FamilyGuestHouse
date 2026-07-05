import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
  FaFacebookF, FaInstagram, FaYoutube, FaTiktok,
  FaBars, FaTimes, FaUserCircle,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS, HOTEL_INFO } from '../../constants';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

  return (
    <header className="w-full shadow-sm z-50 sticky top-0 relative">
      {/* Top Bar - Hidden on Mobile */}
      <div className="hidden md:flex bg-[#1a191f] text-gray-200 text-sm py-2 px-4 md:px-8 justify-between items-center">
        <div className="flex items-center gap-10 text-xs">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-secondary" />
            <span>{HOTEL_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-secondary" />
            <span>{HOTEL_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-secondary" />
            <span>{HOTEL_INFO.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[FaFacebookF, FaInstagram, FaYoutube, FaTiktok].map((Icon, i) => (
            <a key={i} href="#"
              className="w-7 h-7 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
              <Icon size={12} />
            </a>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white py-4 px-4 md:px-8 flex justify-between items-center relative z-50 border-b border-gray-100">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center gap-1">
          <span className="text-primary">Family</span>&nbsp;Guest House
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium text-sm">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'}
              className={({ isActive }) =>
                isActive ? 'text-primary font-semibold' : 'hover:text-primary transition-colors'
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
                  className="text-xs border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded transition-colors">
                  Dashboard
                </Link>
              )}
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <FaUserCircle className="text-primary" /> {user.name}
              </span>
              <button onClick={logout}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"
                className="text-sm border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-4 py-2 rounded transition-colors">
                Login
              </Link>
              <Link to="/register"
                className="text-sm bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded transition-colors shadow-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 p-1 hover:text-primary transition-colors focus:outline-none"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop for clicking outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 z-40 top-[72px]" // 72px is approx header height
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl z-50 border-b border-gray-100 flex flex-col"
            >
              <div className="px-6 py-6 space-y-2 max-h-[70vh] overflow-y-auto">
                {NAV_LINKS.map(({ label, path }) => (
                  <NavLink key={path} to={path} end={path === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg text-base font-medium transition-colors ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}

                <hr className="my-4 border-gray-100" />

                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium">
                      <FaUserCircle className="text-primary text-xl" />
                      <span>{user.name}</span>
                    </div>
                    {isAdmin && (
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                        className="block py-3 px-4 rounded-lg text-primary bg-primary/5 font-medium">
                        Dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left py-3 px-4 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)}
                      className="w-full text-center text-base font-medium border border-gray-300 text-gray-700 py-3 rounded-lg hover:border-primary hover:text-primary transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}
                      className="w-full text-center text-base font-medium bg-primary text-white py-3 rounded-lg hover:bg-primaryHover transition-colors shadow-md">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
