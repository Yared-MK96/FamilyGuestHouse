import { FaBed, FaClipboardList, FaUsers, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { ROOMS_DATA } from '../../constants';

const stats = [
  { label: 'Total Rooms',    value: '4',   icon: FaBed,           change: null,   bg: 'bg-blue-50',   icon_bg: 'bg-blue-500' },
  { label: 'Active Bookings',value: '12',  icon: FaClipboardList, change: '+5%',  up: true,  bg: 'bg-green-50',  icon_bg: 'bg-green-500' },
  { label: 'Total Guests',   value: '38',  icon: FaUsers,         change: '+12%', up: true,  bg: 'bg-purple-50', icon_bg: 'bg-purple-500' },
  { label: 'Revenue (Month)',value: '$2,400', icon: FaDollarSign,  change: '-3%',  up: false, bg: 'bg-yellow-50', icon_bg: 'bg-[#a58641]' },
];

const recentBookings = [
  { id: '#B001', guest: 'John Doe',      room: 'Standard Room',    checkIn: '2026-07-10', status: 'confirmed' },
  { id: '#B002', guest: 'Jane Smith',    room: 'Deluxe Double',    checkIn: '2026-07-11', status: 'pending' },
  { id: '#B003', guest: 'Ali Hassan',    room: 'Family Suite',     checkIn: '2026-07-12', status: 'confirmed' },
  { id: '#B004', guest: 'Maria Lopes',   room: 'Executive Suite',  checkIn: '2026-07-14', status: 'cancelled' },
];

const statusBadge = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, change, up, bg, icon_bg }) => (
          <div key={label} className={`${bg} rounded-xl p-5 flex items-center gap-4 shadow-sm`}>
            <div className={`${icon_bg} p-3 rounded-lg shrink-0`}>
              <Icon className="text-white text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
              {change && (
                <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${up ? 'text-green-600' : 'text-red-500'}`}>
                  {up ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />} {change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-bold text-gray-700">Recent Bookings</h2>
            <span className="text-xs text-[#a58641] font-medium cursor-pointer hover:underline">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-6 py-3">ID</th>
                  <th className="text-left px-6 py-3">Guest</th>
                  <th className="text-left px-6 py-3">Room</th>
                  <th className="text-left px-6 py-3">Check-In</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-gray-500">{b.id}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{b.guest}</td>
                    <td className="px-6 py-3 text-gray-600">{b.room}</td>
                    <td className="px-6 py-3 text-gray-500">{b.checkIn}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Overview */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-gray-700">Room Overview</h2>
          </div>
          <div className="p-4 space-y-3">
            {ROOMS_DATA.map(room => (
              <div key={room.id} className="flex items-center gap-3">
                <img src={room.image} alt={room.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{room.title}</p>
                  <p className="text-xs text-gray-500">${room.price} / night</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">Available</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
