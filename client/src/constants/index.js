export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const HOTEL_INFO = {
  name: 'Family Guest House',
  phone: '+251951141620',
  email: 'familyguesthouse@gmail.com',
  address: 'HVC5+87M Family Guest House,moyale',
};

export const ROOMS_DATA = [
  {
    id: 1,
    title: 'Standard Room',
    description: 'A comfortable and cozy room perfect for solo travelers or couples.',
    longDescription:
      'Our Standard Room offers a perfect blend of comfort and convenience. Ideal for business travelers or couples on a weekend getaway. The room features a plush bed, a modern en-suite bathroom, and a dedicated workspace. Enjoy complimentary high-speed WiFi and a flat-screen TV with premium channels.',
    price: 700,
    image: '/y1.jpg',
    capacity: 2,
    amenities: ['Free WiFi', 'TV', 'Coffee Maker', 'Air Conditioning', 'Room Service', 'Daily Housekeeping'],
  },
  {
    id: 2,
    title: 'Deluxe Double Room',
    description: 'Spacious room with modern amenities and a beautiful city view.',
    longDescription:
      'Step into our Deluxe Double Room and experience spacious luxury. This room boasts breathtaking city views, elegant decor, and a large king-sized bed. The expanded seating area is perfect for relaxing after a long day of exploring. Refresh yourself in the premium bathroom featuring a rainfall shower.',
    price: 1200,
    image: '/y2.jpg',
    capacity: 2,
    amenities: ['Free WiFi', 'TV', 'Mini Bar', 'King Bed', 'Air Conditioning', 'City View', 'Bathrobes'],
  },
  {
    id: 3,
    title: 'Family Suite',
    description: 'Large suite designed for families, offering maximum comfort and space.',
    longDescription:
      "The Family Suite is designed with your family's comfort in mind. It features a master bedroom and a separate living area that can easily accommodate children. A convenient kitchenette allows for easy snack preparation. With two flat-screen TVs, everyone can enjoy their favorite shows.",
    price: 1800,
    image: '/y3.jpg',
    capacity: 5,
    amenities: ['Free WiFi', '2 TVs', 'Kitchenette', 'Living Area', 'Dining Table', 'Multiple Beds'],
  },
  {
    id: 4,
    title: 'Executive Suite',
    description: 'Our most luxurious suite with premium services and elegant decor.',
    longDescription:
      'Experience the pinnacle of luxury in our Executive Suite. This expansive suite offers panoramic views, a private jacuzzi, and top-tier furnishings. Enjoy exclusive access to the executive lounge and personalized concierge service.',
    price: 2800,
    image: '/y4.jpg',
    capacity: 3,
    amenities: ['Free WiFi', 'Smart TV', 'Jacuzzi', 'Lounge Access', 'Premium Toiletries', 'King Bed'],
  },
];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

