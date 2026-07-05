import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About Family Guest House</h1>
            <div className="w-20 h-1 bg-[#a58641] mb-8"></div>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Located in the vibrant heart of Hosaina, Family Guest House has been welcoming travelers with open arms and warm hospitality. Our mission is to provide a "home away from home" experience for every guest that walks through our doors.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Whether you are here for a quick business trip, a family vacation, or a peaceful retreat, our dedicated staff ensures your stay is comfortable, memorable, and absolutely stress-free.
            </p>
            <Link to="/rooms" className="inline-block bg-[#a58641] hover:bg-[#8b6e32] text-white px-8 py-3 rounded font-medium transition-colors">
              Explore Our Rooms
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="/hotel_hero.png" 
              alt="Family Guest House Exterior" 
              className="w-full h-[400px] object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-[#a58641] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Prime Location</h3>
              <p className="text-gray-600">Situated in Naramo, providing easy access to major city attractions and business centers.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-[#a58641] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Exceptional Service</h3>
              <p className="text-gray-600">Our staff is available 24/7 to cater to your every need with a friendly smile.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-[#a58641] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Modern Comfort</h3>
              <p className="text-gray-600">Enjoy meticulously designed rooms equipped with modern amenities for a perfect stay.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
