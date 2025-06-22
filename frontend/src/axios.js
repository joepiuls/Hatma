import axios from 'axios';
import useAuthStore from './store/useAuthStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // only needed if using cookies
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // ✅ Read token from Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
