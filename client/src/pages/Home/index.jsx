import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative w-full h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hotel_hero.png")' }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md text-[#a58641]">
            Welcome to Family Guest House
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Experience comfort, luxury, and warm hospitality in the heart of the city.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/rooms" 
              className="bg-[#a58641] hover:bg-[#8b6e32] text-white px-8 py-3 rounded text-lg font-medium transition-colors"
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

      {/* Other sections will go here */}
    </div>
  );
}
