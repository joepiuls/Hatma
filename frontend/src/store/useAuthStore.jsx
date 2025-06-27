import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../axios';
import { trackError } from '../utils/trackEvent';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null, 
      isAuthenticated: false,
      error: null,
      loading: false,
      hasHydrated: false,

      
      clearAuthState: () => set({ error: null, loading: false }),

      setUser: (user) => set({ user }),

      
      setHasHydrated: (state) => set({ hasHydrated: state }),

      signUp: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
          });

          if (!response.data.user || !response.data.accessToken) {
            throw new Error('Invalid server response');
          }

          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
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
          const response = await api.post('/auth/login', {
            email: data.email,
            password: data.password
          });

          if (!response.data.user || !response.data.accessToken) {
            throw new Error('Invalid server response');
          }

          console.log('Login response:', response.data);

          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true, message: 'Login successful!' };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          set({ error: errorMessage, loading: false });
          trackError(errorMessage, {
            action: 'login',
            user: data.email,
            additionalInfo: { name: data.name }
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

          if (!response.data.accessToken) {
            throw new Error('No access token returned from server');
          }

          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true, message: 'Logged in with Google successfully' };
        } catch (err) {
          const errorMessage = err.response?.data?.error || err.message;
          set({ error: errorMessage, loading: false });
          trackError(errorMessage, {
            action: 'loginWithGoogle',
            user: 'unknown',
            additionalInfo: { name: 'Google user' }
          });
          return {
            success: false,
            message: errorMessage || 'Google login failed. Please try again.',
          };
        }
      },

      logout: async () => {
        try {
          // Call logout API
          await api.post('/auth/logout');
        } catch (err) {
          console.error('Logout API error:', err);
        }
        
        // Clear client-side state
        set({
          user: null,
          accessToken: null,
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
            message: errorMessage || 'Failed to send reset email.',
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
            message: errorMessage || 'Reset failed. Token may be invalid or expired.',
          };
        }
      },

      // Token refresh method
      refreshToken: async () => {
        try {
          // This will automatically send the refreshToken cookie
          const response = await api.post('/auth/refresh');
          
          if (response.data.accessToken) {
            set({ accessToken: response.data.accessToken });
            return response.data.accessToken;
          }
          return null;
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Clear auth state on refresh failure
          get().logout();
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);


api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const auth = useAuthStore.getState();
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await auth.refreshToken();
        if (newToken) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
      }
      

      auth.logout();
    }
    
    return Promise.reject(error);
  }
);

export default useAuthStore;