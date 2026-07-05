import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#1a191f] text-gray-300 pt-16 pb-8 border-t-4 border-[#a58641]">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
            <span className="text-[#a58641]">Family</span> Guest House
          </Link>
          <p className="text-sm text-gray-400 mb-6">
            Experience comfort, luxury, and warm hospitality in the heart of Hosaina. Your perfect stay awaits.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#a58641] transition-colors">
              <FaFacebookF size={14} className="text-white" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#a58641] transition-colors">
              <FaInstagram size={14} className="text-white" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#a58641] transition-colors">
              <FaYoutube size={14} className="text-white" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#a58641] transition-colors">
              <FaTiktok size={14} className="text-white" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[#a58641] transition-colors">Home</Link></li>
            <li><Link to="/rooms" className="hover:text-[#a58641] transition-colors">Our Rooms</Link></li>
            <li><Link to="/services" className="hover:text-[#a58641] transition-colors">Services</Link></li>
            <li><Link to="/about" className="hover:text-[#a58641] transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#a58641] transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#a58641] mt-1 shrink-0" />
              <span>HVC5+87M Family Guest House,<br/>Naramo, Hosaina</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#a58641] shrink-0" />
              <span>+251909517777</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-[#a58641] shrink-0" />
              <span>familyguesthouse@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Subscribe to get special offers and updates.</p>
          <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-[#a58641]"
            />
            <button type="submit" className="bg-[#a58641] hover:bg-[#8b6e32] text-white px-4 py-2 rounded transition-colors font-medium">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Family Guest House. All rights reserved.</p>
      </div>
    </footer>
  );
}
