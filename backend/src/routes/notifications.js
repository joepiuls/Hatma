import express from 'express';
import Notification from '../models/Notifications.js';
import Subscriber from '../models/Subscriber.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/auth.js';

const router = express.Router();


const TYPE_CONFIG = {
  user: {
    icon: 'user',
    bg: 'bg-blue-100',
    color: 'text-blue-600'
  },
  order: {
    icon: 'shopping-cart',
    bg: 'bg-green-100',
    color: 'text-green-600'
  },
  subscriber: {
    icon: 'mail',
    bg: 'bg-teal-100',
    color: 'text-teal-600'
  },
  form: {
    icon: 'clipboard',
    bg: 'bg-purple-100',
    color: 'text-purple-600'
  },
  system: {
    icon: 'server',
    bg: 'bg-gray-100',
    color: 'text-gray-600'
  },
  analytics: {
    icon: 'bar-chart',
    bg: 'bg-indigo-100',
    color: 'text-indigo-600'
  },
  inventory: {
    icon: 'package',
    bg: 'bg-orange-100',
    color: 'text-orange-600'
  }
};

// Get all notifications with filtering
router.get('/alerts', protect, admin, async (req, res) => {
  try {
    const { type, priority, limit = 20 } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (priority) filter.priority = parseInt(priority);
    
    const alerts = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(alerts.map(alert => ({
      id: alert._id,
      iconType: alert.icon || TYPE_CONFIG[alert.type]?.icon || 'bell',
      iconBg: alert.iconBg || TYPE_CONFIG[alert.type]?.bg || 'bg-indigo-100',
      iconColor: alert.iconColor || TYPE_CONFIG[alert.type]?.color || 'text-indigo-600',
      title: alert.message,
      timestamp: alert.createdAt,
      read: alert.isRead,
      type: alert.type,
      priority: alert.priority || 0,
      context: alert.context
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Mark notification as read
router.patch('/:id/read', protect, admin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({
      id: notification._id,
      read: notification.isRead
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark multiple notifications as read
router.post('/mark-read', protect, admin, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid notification IDs' });
    }
    
    await Notification.updateMany(
      { _id: { $in: ids } },
      { isRead: true }
    );
    
    res.json({ message: `${ids.length} notifications marked as read` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Get top-selling products
router.get('/products/top-selling', protect, admin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let dateFilter = {};
    
    // Add time period filtering
    if (period === 'day') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: start } };
    } else if (period === 'month') {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      dateFilter = { createdAt: { $gte: start } };
    } else { // Default to week
      const start = new Date();
      start.setDate(start.getDate() - 7);
      dateFilter = { createdAt: { $gte: start } };
    }
    
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          id: '$_id',
          name: '$product.name',
          price: '$product.price',
          rating: '$product.rating',
          imageUrl: '$product.images.0',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// Get recent subscribers
router.get('/subscribers/recent', protect, admin, async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(subscribers.map(sub => ({
      id: sub._id,
      name: sub.name || sub.email.split('@')[0],
      initials: sub.name 
        ? sub.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : sub.email.substring(0, 2).toUpperCase(),
      avatarUrl: sub.avatarUrl,
      email: sub.email,
      subscribedAt: sub.createdAt
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Create new notification with automatic styling
router.post('/', protect, admin, async (req, res) => {
  try {
    const { type, message, context, priority = 0 } = req.body;
    
    // Get config for notification type
    const config = TYPE_CONFIG[type] || TYPE_CONFIG.system;
    
    const notification = await Notification.create({
      type,
      message,
      context,
      priority,
      icon: config.icon,
      iconBg: config.bg,
      iconColor: config.color,
      isRead: false
    });

    res.status(201).json({
      id: notification._id,
      message: 'Notification created',
      notification: {
        id: notification._id,
        iconType: notification.icon,
        iconBg: notification.iconBg,
        iconColor: notification.iconColor,
        title: notification.message,
        timestamp: notification.createdAt,
        read: notification.isRead
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Get notification statistics
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [total, unread, byType] = await Promise.all([
      Notification.countDocuments(),
      Notification.countDocuments({ isRead: false }),
      Notification.aggregate([
        { 
          $group: { 
            _id: '$type', 
            count: { $sum: 1 },
            unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);
    
    res.json({
      total,
      unread,
      byType: byType.map(typeStat => ({
        type: typeStat._id,
        count: typeStat.count,
        unread: typeStat.unread,
        icon: TYPE_CONFIG[typeStat._id]?.icon || 'bell'
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notification stats' });
  }
});

export default router;