// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../axios';
import { trackError } from '../utils/trackEvent';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      loading: false,
      hasHydrated: false,

      clearAuthState: () => set({ error: null, loading: false }),

      setUser: (user) => set({ user }),

      setHasHydrated: (state) => set({ hasHydrated: state }),

      hydrateSession: async () => {
        try {
          const response = await api.post('/auth/refresh');
          if (response.data.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
            });
          }
        } catch (err) {
          console.error('Session hydration failed:', err);
          get().logout();
        }
      },

      signUp: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', data);

          if (!response.data.user) {
            throw new Error('Invalid server response');
          }

          set({
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true, message: 'Signed up successfully' };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          trackError(errorMessage, {
            action: 'signUp',
            user: data.email,
            additionalInfo: { name: data.name }
          });
          return {
            success: false,
            message: errorMessage || 'Signup failed. Please try again.'
          };
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', data);

          if (!response.data.user) {
            throw new Error('Invalid server response');
          }

          set({
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true, message: 'Login successful!' };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          trackError(errorMessage, {
            action: 'login',
            user: data.email
          });
          return {
            success: false,
            message: errorMessage || 'Login failed. Please check your credentials.'
          };
        }
      },

      loginWithGoogle: async (tokenId) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/google-login', { tokenId });

          if (!response.data.user) {
            throw new Error('Invalid Google login response');
          }

          set({
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true, message: 'Logged in with Google successfully' };
        } catch (err) {
          const errorMessage = err.response?.data?.error || err.message;
          set({ error: errorMessage, loading: false });
          trackError(errorMessage, {
            action: 'loginWithGoogle',
            user: 'unknown'
          });
          return {
            success: false,
            message: errorMessage || 'Google login failed. Please try again.'
          };
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (err) {
          console.error('Logout API error:', err);
        }

        set({
          user: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });

        return { success: true, message: 'You have logged out.' };
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          await api.post('/auth/forgot-password', { email });
          set({ loading: false });
          return {
            success: true,
            message: 'Password reset email sent.'
          };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          trackError(errorMessage, {
            action: 'forgotPassword',
            user: email
          });
          return {
            success: false,
            message: errorMessage || 'Failed to send reset email.'
          };
        }
      },

      resetPassword: async (token, data) => {
        set({ loading: true, error: null });
        try {
          await api.post(`/auth/reset-password/${token}`, { password: data.password });
          set({ loading: false });
          return {
            success: true,
            message: 'Password reset successful.'
          };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          trackError(errorMessage, {
            action: 'resetPassword',
            user: data.email
          });
          return {
            success: false,
            message: errorMessage || 'Reset failed. Token may be invalid or expired.'
          };
        }
      },

      refreshToken: async () => {
        try {
          const response = await api.post('/auth/refresh');
          return response.data.accessToken || null;
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.hydrateSession?.();
      }
    }
  )
);

export default useAuthStore;
