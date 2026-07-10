import { Link } from 'react-router-dom';
import { FaWifi, FaTv, FaCoffee, FaBed } from 'react-icons/fa';
import { ROOMS_DATA, HOTEL_INFO } from '../../constants';
import { formatCurrency } from '../../utils/helpers';

export default function Rooms() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Accommodations</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Choose from our selection of beautifully designed rooms and suites. 
            Each space is crafted to provide you with the utmost comfort and a memorable stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {ROOMS_DATA.map((room) => (
            <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />

              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{room.title}</h2>
                <p className="text-gray-600 mb-6 line-clamp-2">{room.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {amenity.includes("WiFi")   && <FaWifi   className="text-primary"/>}
                      {amenity.includes("TV")     && <FaTv     className="text-primary"/>}
                      {amenity.includes("Coffee") && <FaCoffee className="text-primary"/>}
                      {amenity.includes("Bed")    && <FaBed    className="text-primary"/>}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <Link 
                    to={`/rooms/${room.id}`} 
                    className="text-primary hover:text-primaryHover font-semibold flex items-center gap-1 transition-colors"
                  >
                    View Details &rarr;
                  </Link>
                  <a 
                    href={HOTEL_INFO.telegramBot} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded transition-colors"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
