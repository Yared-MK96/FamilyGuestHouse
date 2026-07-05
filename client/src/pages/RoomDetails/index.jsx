import { useParams, Link } from 'react-router-dom';
import { FaWifi, FaTv, FaCoffee, FaBed, FaCheckCircle } from 'react-icons/fa';

// We reuse the same static data for now, ideally this comes from the backend API
const ROOMS_DATA = [
  {
    id: 1,
    title: "Standard Room",
    description: "A comfortable and cozy room perfect for solo travelers or couples.",
    longDescription: "Our Standard Room offers a perfect blend of comfort and convenience. Ideal for business travelers or couples on a weekend getaway. The room features a plush bed, a modern en-suite bathroom, and a dedicated workspace. Enjoy complimentary high-speed WiFi and a flat-screen TV with premium channels.",
    price: 50,
    image: "/y1.jpg",
    amenities: ["Free WiFi", "TV", "Coffee Maker", "Air Conditioning", "Room Service", "Daily Housekeeping"]
  },
  {
    id: 2,
    title: "Deluxe Double Room",
    description: "Spacious room with modern amenities and a beautiful city view.",
    longDescription: "Step into our Deluxe Double Room and experience spacious luxury. This room boasts breathtaking city views, elegant decor, and a large king-sized bed. The expanded seating area is perfect for relaxing after a long day of exploring. Refresh yourself in the premium bathroom featuring a rainfall shower.",
    price: 85,
    image: "/y2.jpg",
    amenities: ["Free WiFi", "TV", "Mini Bar", "King Bed", "Air Conditioning", "City View", "Bathrobes"]
  },
  {
    id: 3,
    title: "Family Suite",
    description: "Large suite designed for families, offering maximum comfort and space.",
    longDescription: "The Family Suite is designed with your family's comfort in mind. It features a master bedroom and a separate living area that can easily accommodate children. A convenient kitchenette allows for easy snack preparation. With two flat-screen TVs, everyone can enjoy their favorite shows.",
    price: 120,
    image: "/y3.jpg",
    amenities: ["Free WiFi", "2 TVs", "Kitchenette", "Living Area", "Dining Table", "Multiple Beds"]
  },
  {
    id: 4,
    title: "Executive Suite",
    description: "Our most luxurious suite with premium services and elegant decor.",
    longDescription: "Experience the pinnacle of luxury in our Executive Suite. This expansive suite offers panoramic ocean views, a private jacuzzi, and top-tier furnishings. Enjoy exclusive access to the executive lounge and personalized concierge service. This is the ultimate choice for a truly unforgettable stay.",
    price: 200,
    image: "/y4.jpg",
    amenities: ["Free WiFi", "Smart TV", "Jacuzzi", "Ocean View", "Lounge Access", "Premium Toiletries", "King Bed"]
  }
];

export default function RoomDetails() {
  const { id } = useParams();
  const room = ROOMS_DATA.find(r => r.id === parseInt(id));

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Room Not Found</h2>
        <Link to="/rooms" className="text-[#a58641] hover:underline">Back to Rooms</Link>
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
            <p className="text-xl text-gray-200">${room.price} <span className="text-sm">/ night</span></p>
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
                  <FaCheckCircle className="text-[#a58641]" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reserve this Room</h3>
              <div className="text-3xl font-bold text-[#a58641] mb-6">
                ${room.price}<span className="text-lg text-gray-500 font-normal"> / night</span>
              </div>
              
              <Link 
                to={`/booking?room=${room.id}`}
                className="block w-full bg-[#a58641] hover:bg-[#8b6e32] text-white text-center py-3 rounded font-bold transition-colors"
              >
                Proceed to Booking
              </Link>
              
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
