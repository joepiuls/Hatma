// src/stores/portfolioStore.js
import { create } from 'zustand';
import { api } from '../axios';
import { 
  Briefcase, 
  Eye, 
  Star,
  Clock,
} from 'lucide-react';

const usePortfolioStore = create((set, get) => ({
  portfolioItems: [],
  stats: null,
  mostViewed: null,
  leastViewed: null,
  trends: null,
  historicalData: null,
  loading: false,
  error: null,

fetchPortfolioItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/projects/');
      const data = response.data;
      set({ portfolioItems: data, loading: false });      
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      set({ error, loading: false });
    }
  },

fetchPortfolioStats: async () => {
  set({ loading: true, error: null });

  try {
    const response = await api.get('/admin/get-portfolio-stats');
    const data = response.data;

    const {
      totalProjects = 0,
      publishedProjects = 0,
      draftProjects = 0,
      totalViews = 0,
      mostViewed = null,
      leastViewed = null,
      trends = {
        views: { currentMonth: 0, lastMonth: 0, changePercentage: 0, direction: 'up' },
        published: { currentMonth: 0, lastMonth: 0, changePercentage: 0, direction: 'up' },
        draft: { currentMonth: 0, lastMonth: 0, changePercentage: 0, direction: 'up' }
      },
      historicalData = []
    } = data || {};

    set({
      stats: {
        totalProjects,
        publishedProjects,
        draftProjects,
        totalViews
      },
      mostViewed,
      leastViewed,
      trends,
      historicalData,
      loading: false
    });

  } catch (error) {
    console.error('API fetch error:', error);
    set({ error, loading: false });
  }
},

computedStats: () => {
  const stats = get().stats || {
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    totalViews: 0
  };

  const trends = get().trends || {
    views: { changePercentage: 0, direction: 'neutral' },
    published: { changePercentage: 0, direction: 'neutral' },
    draft: { changePercentage: 0, direction: 'neutral' }
  };

  return [
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      trend: null, // No trend data for total projects
      increasing: true,
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      trend: `${Math.abs(trends.views.changePercentage)}%`,
      increasing: trends.views.direction === 'up',
      icon: <Eye className="w-6 h-6 text-green-600" />,
      color: 'green'
    },
    {
      title: 'Published Projects',
      value: stats.publishedProjects.toString(),
      trend: `${Math.abs(trends.published.changePercentage)}%`,
      increasing: trends.published.direction === 'up',
      icon: <Star className="w-6 h-6 text-purple-600" />,
      color: 'purple'
    },
    {
      title: 'Draft Projects',
      value: stats.draftProjects.toString(),
      trend: `${Math.abs(trends.draft.changePercentage)}%`,
      increasing: trends.draft.direction === 'up',
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      color: 'orange'
    }
  ];
},

 addPortfolioItem: async (item) => {
    set({ loading: true, error: null });
    try {
      // POST to API
      const { data: newItem } = await api.post('/admin/portfolio', item);
      // update local state
      set(state => ({
        portfolioItems: [...state.portfolioItems, newItem],
        loading: false
      }));
    } catch (err) {
      console.error('Add failed', err);
      set({ error: err, loading: false });
    }
},

  updatePortfolioItem: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // PUT to API
      const { data: updatedItem } = await api.put(`/admin/portfolio/${id}`, updates);
      // update local state
      set(state => ({
        portfolioItems: state.portfolioItems.map(item =>
          item.id === id ? updatedItem : item
        ),
        loading: false
      }));
    } catch (err) {
      console.error('Update failed', err);
      set({ error: err, loading: false });
    }
},

updatePortfolioStatus: async (id, newStatus) => {
    try {
      // Optimistic UI update
      set(state => ({
        portfolioItems: state.portfolioItems.map(item => 
          item.id === id ? {...item, status: newStatus} : item
        )
      }));
      const response = await api.put(`/admin/update-status/${id}`, { status: newStatus });      
      get().fetchPortfolioStats();
    } catch (error) {
      console.error('Status update failed:', error);
      set(state => ({
        portfolioItems: state.portfolioItems.map(item => 
          item.id === id ? {...item, status: get().portfolioItems.find(i => i.id === id).status} : item
        )
      }));
    }
  },

  deletePortfolioItem: async (id) => {
    set({ loading: true, error: null });
    try {
      // DELETE from API
      await api.delete(`/admin/portfolio/${id}`);
      // update local state
      set(state => ({
        portfolioItems: state.portfolioItems.filter(item => item.id !== id),
        loading: false
      }));
    } catch (err) {
      console.error('Delete failed', err);
      set({ error: err, loading: false });
    }
  }
}));

export default usePortfolioStore;
