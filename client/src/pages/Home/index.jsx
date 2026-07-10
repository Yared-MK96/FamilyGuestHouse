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
        <div className="relative z-20 text-center text-white px-4 pb-32 md:pb-20">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 drop-shadow-md text-secondary">
            Welcome to Family Guest House
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Experience comfort, luxury, and warm hospitality in the heart of the city.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/rooms"
              className="bg-primary hover:bg-primaryHover text-white px-6 md:px-8 py-3 rounded text-base md:text-lg font-medium transition-colors shadow-lg"
            >
              Book a Room
            </Link>
            <Link
              to="/contact"
              className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-6 md:px-8 py-3 rounded text-base md:text-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Feature Strip Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-primary/20 backdrop-blur-md text-white py-4 px-2 sm:px-4 z-28 border-t border-white/10">
          <div className="container mx-auto grid grid-cols-3 gap-1 sm:gap-4 md:gap-8 text-center divide-x divide-white/20">
            <div className="px-1 flex flex-col items-center justify-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold leading-none">4+</p>
              <p className="text-[10px] sm:text-xs md:text-sm opacity-90 uppercase tracking-wider mt-1 sm:mt-1.5 leading-tight">Room Types</p>
            </div>
            <div className="px-1 flex flex-col items-center justify-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold leading-none">100%</p>
              <p className="text-[10px] sm:text-xs md:text-sm opacity-90 uppercase tracking-wider mt-1 sm:mt-1.5 leading-tight">Satisfaction</p>
            </div>
            <div className="px-1 flex flex-col items-center justify-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold leading-none">24/7</p>
              <p className="text-[10px] sm:text-xs md:text-sm opacity-90 uppercase tracking-wider mt-1 sm:mt-1.5 leading-tight">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Us</h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                Located in the vibrant heart of Moyale, Family Guest House has been welcoming travelers with open arms and warm hospitality. Our mission is to provide a "home away from home" experience for every guest.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
                Whether you are here for a quick business trip, a family vacation, or a peaceful retreat, our dedicated staff ensures your stay is comfortable, memorable, and absolutely stress-free.
              </p>
              <Link to="/about" className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded font-medium transition-colors">
                Learn More
              </Link>
            </div>
            <div className="lg:w-1/2 w-full">
              <img
                src="/photo_2026-07-05_20-28-30.jpg"
                alt="Family Guest House Exterior"
                className="w-full h-[300px] md:h-[400px] object-cover object-bottom md:object-center rounded-lg shadow-xl"
              />
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
