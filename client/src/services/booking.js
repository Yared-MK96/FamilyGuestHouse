import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  },
  getUserBookings: async () => {
    const res = await api.get('/bookings/my');
    return res.data;
  },
  getAllBookings: async () => {
    const res = await api.get('/bookings');
    return res.data;
  },
  getBookingById: async (id) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  },
  updateBookingStatus: async (id, status) => {
    const res = await api.patch(`/bookings/${id}/status`, { status });
    return res.data;
  },
  cancelBooking: async (id) => {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  },
};
