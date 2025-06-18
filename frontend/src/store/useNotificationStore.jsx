import { create } from 'zustand';
import { NotificationAPI } from '../utils/notificationApi';

export const useNotificationStore = create((set) => ({
  notifications: [],
  topSellingProducts: [],
  subscribers: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const [alerts, products, subs] = await Promise.all([
        NotificationAPI.getAlerts(),
        NotificationAPI.getTopProducts(),
        NotificationAPI.getSubscribers()
      ]);
      
      set({
        notifications: alerts,
        topSellingProducts: products,
        subscribers: subs,
        unreadCount: alerts.filter(n => !n.read).length,
        loading: false
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      await NotificationAPI.markAsRead(id);
      set(state => {
        const updatedNotifications = state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
        return {
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length
        };
      });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }
}));