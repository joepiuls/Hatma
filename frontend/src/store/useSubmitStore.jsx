import {create} from 'zustand';
import { api } from '../axios'; 
import { toast } from 'sonner';

const useSubmitStore = create((set) => ({
  requests: [],
  loading: false,
  error: null,

  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/requests');
      set({ requests: data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to load requests', loading: false });
    }
  },

  submitProductRequest: async (requestData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/requests/product', requestData);
      set((state) => ({
        requests: [data, ...state.requests],
        loading: false,
      }));
      toast.success('Custom request submitted');
      return data; // return created request if needed
    } catch (error) {
      set({ error: error.message || 'Failed to submit request', loading: false });
       toast.error(error.message||'Failed to submit request')
    }
  },

  submitCustomRequest: async (requestData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/requests/custom', requestData);
      set((state) => ({
        requests: [data, ...state.requests],
        loading: false,
      }));
      toast.success('Custom request submitted');
      return data; 
    } catch (error) {
      set({ error: error.message || 'Failed to submit request', loading: false });
      toast.error(error.message||'Failed to submit request')
    }
  },
}));

export default useSubmitStore;
