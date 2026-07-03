import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  verifyToken: () =>
    request('/auth/verify'),

  // Rooms
  getRooms: () => request('/rooms'),
  getRoom: (id) => request(`/rooms/${id}`),
  createRoom: (formData) =>
    request('/rooms', {
      method: 'POST',
      body: formData,
    }),
  updateRoom: (id, formData) =>
    request(`/rooms/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  updateRoomPrice: (id, price) =>
    request(`/rooms/${id}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ price }),
    }),
  updateRoomDesc: (id, description) =>
    request(`/rooms/${id}/description`, {
      method: 'PATCH',
      body: JSON.stringify({ description }),
    }),
  deleteRoom: (id) =>
    request(`/rooms/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (settings) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  uploadHeroImage: (formData) =>
    request('/settings/hero-image', {
      method: 'POST',
      body: formData,
    }),

  // Gallery
  getGallery: () => request('/gallery'),
  uploadGalleryImage: (formData) =>
    request('/gallery', {
      method: 'POST',
      body: formData,
    }),
  updateGalleryItem: (id, formData) =>
    request(`/gallery/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  deleteGalleryItem: (id) =>
    request(`/gallery/${id}`, { method: 'DELETE' }),
};
