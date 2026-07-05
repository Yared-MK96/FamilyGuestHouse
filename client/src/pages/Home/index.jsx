import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative w-full min-h-[85vh] flex items-center justify-center bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: 'url("/hotel_hero.png")' }}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 text-center text-white px-4 pb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md text-secondary">
            Welcome to Family Guest House
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Experience comfort, luxury, and warm hospitality in the heart of the city.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/rooms"
              className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded text-lg font-medium transition-colors shadow-lg"
            >
              Book a Room
            </Link>
            <Link
              to="/contact"
              className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-8 py-3 rounded text-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Feature Strip Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-primary/20 backdrop-blur-sm text-white py-3 px-4 z-28">
          <div className="container mx-auto grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 text-center">
            <div>
              <p className="text-xl md:text-2xl font-bold mb-0.5">4+</p>
              <p className="text-xs md:text-sm opacity-80 uppercase tracking-wider">Room Types</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold mb-0.5">100%</p>
              <p className="text-xs md:text-sm opacity-80 uppercase tracking-wider">Guest Satisfaction</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold mb-0.5">24/7</p>
              <p className="text-xs md:text-sm opacity-80 uppercase tracking-wider">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Rooms section on home */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Rooms</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Handcrafted rooms designed to make you feel at home.</p>
          <Link to="/rooms" className="inline-block bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded font-medium transition-colors">
            View All Rooms
          </Link>
        </div>
      </section>
    </div>
  );
}
