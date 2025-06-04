import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../axios';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      loading: false,

      // Clear errors and loading state
      clearAuthState: () => set({ error: null, loading: false }),

      setUser: (user)=>set({user}),

      signUp: async (data) => {
        set({ loading: true, error: null });
        try {
          const { data: response } = await api.post('/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
          });

          if (!response.user || !response.token) {
            throw new Error('Invalid server response');
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true, message: 'Signed up successfully' };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          return { 
            success: false, 
            message: errorMessage || 'Signup failed. Please try again.' 
          };
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const { data: response } = await api.post('/auth/login', {
            email: data.email,
            password: data.password
          });

          if (!response.user || !response.token) {
            throw new Error('Invalid server response');
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true, message: 'Login successful!' };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          return { 
            success: false, 
            message: errorMessage || 'Login failed. Please check your credentials.' 
          };
        }
      },

      loginWithGoogle: async (tokenId) => {
        set({ loading: true, error: null });
        try {
          const { data: response } = await axios.post("http://localhost:5000/api/auth/google-login", { tokenId });

          if (!response.token) {
            throw new Error('No token returned from server');
          }

          set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              loading: false,
            });

          return { success: true, message: 'Logged in with Google successfully' };
        } catch (err) {
          const errorMessage = err.response?.data?.error || err.message;
          set({ error: errorMessage, loading: false });
          return {
            success: false,
            message: errorMessage || 'Google login failed. Please try again.',
          };
        }
    },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
        // Consider adding API call to invalidate token on server
        return { success: true, message: 'You have logged out.' };
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const { data: response } = await api.post('/auth/forgot-password', { email });
          set({ loading: false });
          return { 
            success: true, 
            message: response.message || 'Password reset email sent.' 
          };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          return {
            success: false,
            message: errorMessage || 'Failed to send reset email.',
          };
        }
      },

      resetPassword: async (token, data) => {
        set({ loading: true, error: null });
        try {
          const { data: response } = await api.post(`/auth/reset-password/${token}`,
           {password:data.password});
          set({ loading: false });
          return { 
            success: true, 
            message: response.message || 'Password reset successful.' 
          };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          return {
            success: false,
            message: errorMessage || 'Reset failed. Token may be invalid or expired.',
          };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;