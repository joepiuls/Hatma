import { api } from "../axios";

export const NotificationAPI = {
  // Get alerts with filtering
  getAlerts: async (params = {}) => {
    try {
      const { data } = await api.get(`/notifications/alerts`, { params });
      return data.map(alert => ({
        id: alert.id,
        iconType: alert.iconType,
        iconBg: alert.iconBg,
        iconColor: alert.iconColor,
        title: alert.title,
        timestamp: alert.timestamp,
        read: alert.read,
        type: alert.type,
        priority: alert.priority || 0,
        context: alert.context || {}
      }));
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch notifications");
    }
  },

  // Get top products with period filtering
  getTopProducts: async (period = 'week') => {
    try {
      const { data } = await api.get(`/notifications/products/top-selling`, { 
        params: { period } 
      });
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: `$${product.price?.toFixed(2) || '0.00'}`,
        rating: product.rating || 0,
        imageUrl: product.imageUrl || '/product-placeholder.jpg',
        totalSold: product.totalSold || 0,
        revenue: `$${(product.totalRevenue || 0).toFixed(2)}`
      }));
    } catch (error) {
      console.error("Failed to fetch top products:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch products");
    }
  },

  // Get subscribers with limit
  getSubscribers: async (limit = 8) => {
    try {
      const { data } = await api.get(`/notifications/subscribers/recent`, {
        params: { limit }
      });
      
      return data.map(sub => ({
        id: sub.id,
        name: sub.name,
        initials: sub.initials,
        avatarUrl: sub.avatarUrl || '/avatar-placeholder.png',
        email: sub.email,
        subscribedAt: sub.subscribedAt
      }));
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch subscribers");
    }
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      return id; // Return ID of read notification
    } catch (error) {
      console.error("Failed to mark as read:", error);
      throw new Error(error.response?.data?.error || "Failed to update notification");
    }
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (ids) => {
    try {
      await api.post(`/notifications/mark-read`, { ids });
      return ids; // Return array of read IDs
    } catch (error) {
      console.error("Failed to mark multiple as read:", error);
      throw new Error(error.response?.data?.error || "Failed to update notifications");
    }
  },

  // Get notification statistics
  getStats: async () => {
    try {
      const { data } = await api.get(`/notifications/stats`);
      return {
        total: data.total || 0,
        unread: data.unread || 0,
        byType: (data.byType || []).map(type => ({
          type: type.type,
          count: type.count || 0,
          unread: type.unread || 0,
          icon: type.icon || 'bell'
        }))
      };
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch notification stats");
    }
  },

  // Create new notification
  createNotification: async (notificationData) => {
    try {
      const { data } = await api.post(`/notifications`, notificationData);
      return {
        id: data.notification?.id,
        ...data.notification
      };
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw new Error(error.response?.data?.error || "Failed to create notification");
    }
  }
};