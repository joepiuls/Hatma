import { create } from 'zustand'
import { api } from '../axios';

const useFormStore = create((set, get) => ({
  formSubmissions: [],
  formStats: {
    totalSubmissions: 0,
    servicesRequested: 0,
    productsRequested: 0,
    conversionRate: 0
  },
  servicesData: [],
  formsData: [],
  historicalData: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    type: 'all',
    dateRange: 'all'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  },

  

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch all dashboard data
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      const response = await api.get('/forms/', {
        params: {
          ...filters,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage
        }
      });
      
      set({ 
        formSubmissions: response.data.formSubmissions,
        formStats: response.data.formStats,
        servicesData: response.data.servicesData,
        formsData: response.data.formsData,
        historicalData: response.data.historicalData,
        pagination: response.data.pagination,
        loading: false 
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // Update form status
  updateFormStatus: async (formId, newStatus) => {
    set({ loading: true });
    try {
      await api.put(`/forms/${formId}/status`, { status: newStatus });
      
      // Optimistic UI update
      set(state => ({
        formSubmissions: state.formSubmissions.map(form =>
          form.id === formId ? { ...form, status: newStatus } : form
        ),
        loading: false
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // Delete form submission
  deleteFormSubmission: async (formId) => {
    set({ loading: true });
    try {
      await api.delete(`/forms/${formId}`);
      
      // Optimistic UI update
      set(state => ({
        formSubmissions: state.formSubmissions.filter(form => form.id !== formId),
        formStats: {
          ...state.formStats,
          totalSubmissions: state.formStats.totalSubmissions - 1,
          [state.formSubmissions.find(f => f.id === formId)?.type === 'Service Request' 
            ? 'servicesRequested' 
            : 'productsRequested']: state.formStats[
              state.formSubmissions.find(f => f.id === formId)?.type === 'Service Request' 
                ? 'servicesRequested' 
                : 'productsRequested'
            ] - 1
        },
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1
        },
        loading: false
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // Update filters and refetch data
  updateFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 }
    }), () => {
      // Fetch new data after state update
      get().fetchDashboardData();
    });
  },

  // Update pagination and refetch data
  updatePagination: (newPagination) => {
    set(state => ({
      pagination: { ...state.pagination, ...newPagination }
    }), () => {
      // Fetch new data after state update
      get().fetchDashboardData();
    });
  },

  // Computed stats for dashboard cards
  computedStats: () => {
    const { formStats } = get();
    return [
      {
        title: 'Total Submissions',
        value: formStats.totalSubmissions?.value?.toLocaleString(),
        trend: formStats.totalSubmissions?.trend,  // Placeholder - backend needs to implement trend calculation
        increasing: formStats.totalSubmissions?.increasing,  // Placeholder
        icon: '📝',
        color: 'blue'
      },
      {
        title: 'Services Requested',
        value: formStats.servicesRequested?.value?.toLocaleString(),
        trend: formStats.servicesRequested?.trend,  // Placeholder
        increasing: formStats.servicesRequested?.increasing,
        icon: '🛠️',
        color: 'green'
      },
      {
        title: 'Products Requested',
        value: formStats.productsRequested?.value?.toLocaleString(),
        trend: formStats.productsRequested?.trend,
        increasing: formStats.productsRequested?.increasing,
        icon: '📦',
        color: 'purple'
      },
      {
        title: 'Conversion Rate',
        value: `${formStats.conversionRate?.value}%`,
        trend: formStats.conversionRate?.trend,
        increasing: formStats.conversionRate?.increasing,
        icon: '📈',
        color: 'orange'
      }
    ]
  }
}));

export default useFormStore;