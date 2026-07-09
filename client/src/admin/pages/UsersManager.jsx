import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, exportUsersExcel, downloadBlob } from '../services/adminApi';
import toast from 'react-hot-toast';
import { FaTrash, FaSpinner, FaUserShield, FaUser, FaFileExcel, FaSearch } from 'react-icons/fa';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  // Filters state
  const [roleFilter, setRoleFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const filters = {};
      if (roleFilter !== 'all') filters.role = roleFilter;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const blob = await exportUsersExcel(filters);
      downloadBlob(blob, `users-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Excel file downloaded');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export Excel file');
    } finally {
      setExportLoading(false);
    }
  };

  // Local filtering for the table display (since getAllUsers returns all)
  // In a full production app, you might fetch filtered users from the backend instead.
  const displayedUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (startDate && new Date(u.createdAt) < new Date(startDate)) return false;
    if (endDate && new Date(u.createdAt) > new Date(endDate)) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Users Manager</h1>

      {/* Filter and Export Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <FaSearch className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">Guests</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">From:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">To:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exportLoading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-70"
        >
          {exportLoading ? <FaSpinner className="animate-spin" /> : <FaFileExcel size={18} />}
          Export Excel
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-gray-500">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold capitalize
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role === 'admin' ? <FaUserShield /> : <FaUser />} {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user._id)} 
                      disabled={user.role === 'admin'} // Prevent deleting other admins
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No users found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
