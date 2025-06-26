import axios from 'axios';
import useAuthStore from './store/useAuthStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  // Wait for Zustand hydration to complete
  await new Promise(resolve => {
    const unsubscribe = useAuthStore.subscribe(
      state => {
        if (state.hasHydrated) resolve();
      },
      state => state.hasHydrated
    );
    
    // If already hydrated, resolve immediately
    if (useAuthStore.getState().hasHydrated) resolve();
    return unsubscribe;
  });

  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
