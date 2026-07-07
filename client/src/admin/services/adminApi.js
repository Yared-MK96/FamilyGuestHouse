import axios from 'axios';

// Create an axios instance specifically for the admin panel
const adminApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Add an interceptor to inject the auth token on every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Dashboard Stats
export const getStats = () => adminApi.get('/admin/stats').then(res => res.data);

// Rooms Management
export const getRooms = () => adminApi.get('/rooms').then(res => res.data);
export const createRoom = (data) => adminApi.post('/rooms', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => res.data);
export const updateRoom = (id, data) => adminApi.put(`/rooms/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => res.data);
export const deleteRoom = (id) => adminApi.delete(`/rooms/${id}`).then(res => res.data);

// Users Management
export const getAllUsers = () => adminApi.get('/admin/users').then(res => res.data);
export const deleteUser = (id) => adminApi.delete(`/admin/users/${id}`).then(res => res.data);
export const exportUsersExcel = (params) => adminApi.get('/admin/users/export/excel', {
  params,
  responseType: 'blob'
}).then(res => res.data);

// Download helper function for Blobs
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Bookings Management
export const getAllBookings = () => adminApi.get('/bookings').then(res => res.data);
export const updateBookingStatus = (id, status) => adminApi.put(`/bookings/${id}`, { status }).then(res => res.data);
export const exportBookingsExcel = (params) => adminApi.get('/admin/bookings/export/excel', {
  params,
  responseType: 'blob'
}).then(res => res.data);

// Payments Management
export const getPendingPayments = () => adminApi.get('/payments/pending').then(res => res.data);
export const verifyPayment = (id, action) => adminApi.put(`/payments/${id}/verify`, { action }).then(res => res.data);
export const getAllPayments = () => adminApi.get('/payments').then(res => res.data);

export default adminApi;
