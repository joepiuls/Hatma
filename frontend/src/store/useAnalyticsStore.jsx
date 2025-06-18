import { create } from 'zustand';
import { api } from '../axios';

export const useAnalyticsStore = create((set) => ({
  loading: true,
  stats: [],
  services: [],
  conversions: [],
  traffic: [],
  topPages: [],
  monthly: [],

  fetchAnalytics: async () => {
    try {
      const { data } = await api.get('/admin/analytics');
      console.log(data);
      

      const safeStats = data?.stats || {
        totalVisits: 0,
        averageSession: 0,
        growth: 0,
        subscribers: 0,
      };

      set({
        stats: [
          {
            title: 'Total visits',
            value: safeStats?.totalVisits?.toLocaleString?.() || '0',
            trend: '+11.01%',
            increasing: true,
          },
          {
            title: 'Average Session',
            value: safeStats?.averageSession || 0,
            suffix: 'hours',
            trend: '',
            increasing: false,
          },
          {
            title: 'Growth',
            value: safeStats?.growth || 0,
            trend: '',
            increasing: true,
          },
          {
            title: 'Subscribers',
            value: safeStats?.subscribers?.toLocaleString?.() || '0',
            trend: '+6.08%',
            increasing: true,
          },
        ],
        services: data?.services || [],
        conversions: data?.conversions || [],
        traffic: data?.traffic || [],
        topPages: data?.topPages || [],
        monthly: data?.monthly || [],
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      set({ loading: false });
    }
  },
}));
