import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../services/adminApi';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

export default function RoomsManager() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchRooms = () => {
    setLoading(true);
    getRooms().then(setRooms).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openModal = (room = null) => {
    setEditingRoom(room);
    if (room) {
      reset({ ...room, images: null }); // Don't prefill file input
    } else {
      reset({ name: '', description: '', type: 'standard', pricePerNight: '', capacity: 2 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key !== 'images') formData.append(key, data[key]);
    });
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i]);
      }
    }

    try {
      if (editingRoom) {
        await updateRoom(editingRoom._id, formData);
        toast.success('Room updated successfully');
      } else {
        await createRoom(formData);
        toast.success('Room created successfully');
      }
      closeModal();
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving room');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
      toast.success('Room deleted');
      fetchRooms();
    } catch (error) {
      toast.error('Error deleting room');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rooms Manager</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-colors"
        >
          <FaPlus /> Add New Room
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
                <th className="px-6 py-4">Room Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {room.images && room.images[0] ? (
                      <img src={`http://localhost:5000${room.images[0]}`} alt={room.name} className="w-16 h-12 object-cover rounded-md shadow-sm" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{room.name}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">{room.type}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600">{room.pricePerNight} ETB</td>
                  <td className="px-6 py-4">{room.capacity} Guests</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openModal(room)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(room._id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No rooms found. Add one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Room Name</label>
                  <input {...register('name', { required: true })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                  <select {...register('type', { required: true })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price per Night (ETB)</label>
                  <input type="number" {...register('pricePerNight', { required: true })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity (Guests)</label>
                  <input type="number" {...register('capacity', { required: true })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea {...register('description', { required: true })} rows="3" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Images</label>
                <input type="file" multiple {...register('images')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  {editingRoom ? 'Update Room' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
