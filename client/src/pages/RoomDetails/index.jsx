import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { ROOMS_DATA, HOTEL_INFO } from '../../constants';
import { formatCurrency } from '../../utils/helpers';

export default function RoomDetails() {
  const { id } = useParams();
  const room = ROOMS_DATA.find(r => r.id === parseInt(id));

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Room Not Found</h2>
        <Link to="/rooms" className="text-primary hover:underline">Back to Rooms</Link>
      </div>
    );
  }

  return (
    <div className="bg-white pb-20">
      {/* Hero Image */}
      <div className="w-full h-[50vh] md:h-[60vh] relative">
        <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{room.title}</h1>
            <p className="text-xl text-gray-200">{formatCurrency(room.price)} <span className="text-sm">/ night</span></p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Details */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{room.longDescription}</p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {room.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-600">
                  <FaCheckCircle className="text-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reserve this Room</h3>
              <div className="text-3xl font-bold text-primary mb-6">
                {formatCurrency(room.price)}<span className="text-lg text-gray-500 font-normal"> / night</span>
              </div>
              <a 
                href={HOTEL_INFO.telegramBot} 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary hover:bg-primaryHover text-white text-center py-3 rounded font-bold transition-colors"
              >
                Book Now via Telegram
              </a>
              <p className="text-sm text-gray-500 mt-4 text-center">
                You won't be charged yet.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
