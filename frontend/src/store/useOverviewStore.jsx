'use client'
import { toast } from 'sonner';
import { create } from 'zustand'
import { api } from '../axios';

const mockOverviewData = {
  sessions: 12543,
  conversions: 1234,
  serviceRequests: 89,
  pageViews: 45623,
  totalProductViews: 8932,
  totalProducts: 156,
  totalBlogs: 45,
  totalUsers: 2341,
  totalSales: {
    totalRevenue: 125000,
    totalTransactions: 456,
  },
  totalRevenue: [
    { _id: 'Jan', totalRevenue: 10000 },
  ],
  totalTransactions:10000,
  trafficSources: [
    { _id: 'Google', count: 5643 },
    { _id: 'Direct', count: 3421 },
    { _id: 'Social Media', count: 2156 },
    { _id: 'Email', count: 1323 },
  ],
  topPages: [
    { _id: '/products', count: 3456 },
    { _id: '/blog', count: 2134 },
    { _id: '/services', count: 1876 },
    { _id: '/about', count: 1234 },
  ],
  blogViewTrends: [
    { _id: 'Jan', views: 1200 },
    { _id: 'Feb', views: 1800 },
    { _id: 'Mar', views: 2200 },
    { _id: 'Apr', views: 1900 },
    { _id: 'May', views: 2400 },
    { _id: 'Jun', views: 2800 },
  ],
  productSalesTrends: [
    { _id: 'Jan', totalAmount: 15000 },
    { _id: 'Feb', totalAmount: 22000 },
    { _id: 'Mar', totalAmount: 18000 },
    { _id: 'Apr', totalAmount: 25000 },
    { _id: 'May', totalAmount: 28000 },
    { _id: 'Jun', totalAmount: 32000 },
  ],
  userStats: [
    { _id: 'Jan', count: 120 },
    { _id: 'Feb', count: 180 },
    { _id: 'Mar', count: 220 },
    { _id: 'Apr', count: 190 },
    { _id: 'May', count: 240 },
    { _id: 'Jun', count: 280 },
  ],
  mostViewedProduct: {
    title: 'Premium Wireless Headphones',
    views: 1245,
  },
  leastViewedProduct: {
    title: 'Basic Phone Case',
    views: 23,
  },
  mostViewedBlog: {
    title: 'Top 10 Tech Trends 2024',
    views: 3456,
  },
  leastViewedBlog: {
    title: 'Getting Started Guide',
    views: 89,
  },
};

export const PAYMENT_OPTIONS = ['pending', 'paid', 'failed'];
export const DELIVERY_OPTIONS = ['processing', 'shipped', 'delivered', 'cancelled'];

const normalizeOrder = (order) => ({
  ...order,
  deliveryStatus: DELIVERY_OPTIONS.includes(order.delivery) 
    ? order.delivery 
    : DELIVERY_OPTIONS[0],
  paymentStatus: PAYMENT_OPTIONS.includes(order.payment) 
    ? order.payment 
    : PAYMENT_OPTIONS[0]
});


export const useOverviewStore = create((set, get) => ({
  overview: mockOverviewData,
  orders: [],
  salesOverview: {
      totalSales  : 0,
      productSalesTrends: [],
      pendingOrders: 0,
      failedPayments: 0,
      salesData: [],
      products: [],
      orders: [],
  },
  isLoading: false,
  error: null,
  fetchOverview: async () => {
  set({ isLoading: true, error: null });

  try {
    const res = await api.get('/admin/overview');
    set({ overview: res.data, isLoading: false });
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch overview data, using mock');
    set({ overview: mockOverviewData, isLoading: false, error: 'Using fallback data' });
  }
},
// Update fetchSalesOverview
fetchSalesOverview: async () => {
  set({ isLoading: true, error: null });
  try {
    const res = await api.get('/admin/sales-overview');
    
    // Normalize orders
    const normalizedOrders = res.data.orders?.map(normalizeOrder) || [];
    
    set({ 
      salesOverview: {
        ...res.data,
        orders: normalizedOrders
      },
      orders: normalizedOrders,
      isLoading: false 
    });
  } catch (error) {
    toast.error('Failed to fetch sales overview');
    set({ error: error.message, isLoading: false });
  }
},

  updateDeliveryStatus: async (orderId, updates) => {
    try {
      const normalizedStatus = DELIVERY_OPTIONS.includes(updates.deliveryStatus)
        ? updates.deliveryStatus
        : DELIVERY_OPTIONS[0];
      
      await api.patch(`/admin/order/delivery-status/${orderId}`, {
        deliveryStatus: normalizedStatus
      });
      
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, deliveryStatus: normalizedStatus }
            : order
        ),
        salesOverview: {
          ...state.salesOverview,
          orders: state.salesOverview.orders.map(order => 
            order.id === orderId 
              ? { ...order, deliveryStatus: normalizedStatus }
              : order
          )
        }
      }));
    } catch (err) {
      console.error('Failed to update order', err);
      toast.error('Failed to update delivery status');
    }
  },

  updatePaymentStatus: async (id, updates) => {
    try {
      const normalizedStatus = PAYMENT_OPTIONS.includes(updates.paymentStatus)
        ? updates.paymentStatus
        : PAYMENT_OPTIONS[0];
      
      await api.patch(`/admin/order/payment-status/${id}`, {
        paymentStatus: normalizedStatus
      });
      
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === id 
            ? { ...order, paymentStatus: normalizedStatus }
            : order
        ),
        salesOverview: {
          ...state.salesOverview,
          orders: state.salesOverview.orders.map(order => 
            order.id === id 
              ? { ...order, paymentStatus: normalizedStatus }
              : order
          )
        }
      }));
    } catch (err) {
      console.error('Failed to update order', err);
      toast.error('Failed to update payment status');
    }
  },
}));


