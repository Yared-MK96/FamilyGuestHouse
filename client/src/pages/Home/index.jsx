import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative w-full h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hotel_hero.png")' }}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 text-center text-white px-4">
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
      </section>

      {/* Feature Strip */}
      <section className="bg-primary text-white py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold mb-1">4+</p>
            <p className="text-sm opacity-80">Room Types</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">100%</p>
            <p className="text-sm opacity-80">Guest Satisfaction</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">24/7</p>
            <p className="text-sm opacity-80">Support Available</p>
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
