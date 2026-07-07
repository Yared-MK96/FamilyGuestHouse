import { useEffect, useState } from 'react';
import { getStats } from '../services/adminApi';
import { FaUsers, FaBed, FaClipboardCheck, FaSpinner } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-3xl" />
      </div>
    );
  }

  const cards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: FaUsers, color: 'bg-indigo-500' },
    { title: 'Total Rooms', value: stats?.totalRooms || 0, icon: FaBed, color: 'bg-teal-500' },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: FaClipboardCheck, color: 'bg-rose-500' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-6 transform transition hover:-translate-y-1 hover:shadow-md">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${card.color} shadow-lg shadow-${card.color.split('-')[1]}-200`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-3xl font-black text-gray-800 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to the Admin Portal</h2>
        <p className="text-gray-600">
          From here you can manage all aspects of the Family Guest House platform. Use the sidebar to navigate through Rooms, Bookings, Manual Payment Verifications, and Users.
        </p>
      </div>
    </div>
  );
}
