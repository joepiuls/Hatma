import express from 'express';
import Request from '../models/request.js';
import AnalyticsEvent from '../models/AnalyticsEvents.js';
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();

// Helper function to calculate trends
const calculateTrend = (current, previous) => {
  if (previous === 0) return { trend: '0.0%', increasing: false };
  const percentage = ((current - previous) / previous) * 100;
  return {
    trend: `${Math.abs(percentage).toFixed(1)}%`,
    increasing: percentage >= 0
  };
};

// Helper function to get date ranges
const getDateRanges = (dateRange) => {
  const now = new Date();
  let currentStart, currentEnd, previousStart, previousEnd;

  switch (dateRange) {
    case 'today':
      currentStart = new Date(now);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = now;
      
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 1);
      previousEnd = new Date(previousStart);
      previousEnd.setHours(23, 59, 59, 999);
      break;

    case 'week':
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - 6);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = now;
      
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 7);
      previousEnd = new Date(currentStart);
      previousEnd.setDate(previousEnd.getDate() - 1);
      previousEnd.setHours(23, 59, 59, 999);
      break;

    case 'month':
      currentStart = new Date(now);
      currentStart.setMonth(now.getMonth() - 1);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = now;
      
      previousStart = new Date(currentStart);
      previousStart.setMonth(previousStart.getMonth() - 1);
      previousEnd = new Date(currentStart);
      previousEnd.setDate(previousEnd.getDate() - 1);
      previousEnd.setHours(23, 59, 59, 999);
      break;

    default: // 'all'
      currentStart = null;
      currentEnd = null;
      previousStart = null;
      previousEnd = null;
  }

  return { currentStart, currentEnd, previousStart, previousEnd };
};

// Get form analytics dashboard data
router.get('/', protect, admin, async (req, res) => {
  try {
    const { search = '', status = 'all', type = 'all', dateRange = 'all', page = 1, limit = 10 } = req.query;

    const filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status !== 'all') {
      filter.status = status;
    }
    
    // Type filter
    if (type !== 'all') {
      if (type === 'Service Request') {
        filter.budget = { $exists: true };
      } else if (type === 'Product Request') {
        filter.budget = { $exists: false };
      }
    }
    
    // Get date ranges for trend calculation
    const { currentStart, currentEnd, previousStart, previousEnd } = getDateRanges(dateRange);
    
    // Apply date range filter
    if (currentStart && currentEnd) {
      filter.createdAt = { $gte: currentStart, $lte: currentEnd };
    }

    // Get paginated form submissions
    const totalItems = await Request.countDocuments(filter);
    const requests = await Request.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Transform requests to match frontend structure
    const formSubmissions = requests.map(request => ({
      id: request._id.toString(),
      date: request.createdAt.toISOString(),
      name: request.name,
      email: request.email,
      phone: request.phoneNumber || '',
      type: request.budget ? 'Service Request' : 'Product Request',
      status: request.status || 'Complete',
      message: request.budget ? request.message : request.description,
      priority: request.priority || 'medium',
      source: request.source || 'Website'
    }));

    // Get form statistics with trends
    const getStatWithTrend = async (filterCondition) => {
      const currentFilter = currentStart && currentEnd 
        ? { ...filterCondition, createdAt: { $gte: currentStart, $lte: currentEnd } }
        : filterCondition;
      
      const previousFilter = previousStart && previousEnd 
        ? { ...filterCondition, createdAt: { $gte: previousStart, $lte: previousEnd } }
        : filterCondition;
      
      const [currentCount, previousCount] = await Promise.all([
        Request.countDocuments(currentFilter),
        Request.countDocuments(previousFilter)
      ]);
      
      return {
        value: currentCount,
        ...calculateTrend(currentCount, previousCount)
      };
    };

    // Calculate stats with trends
    const totalSubmissions = await getStatWithTrend({});
    const servicesRequested = await getStatWithTrend({ budget: { $exists: true } });
    const productsRequested = await getStatWithTrend({ 
      budget: { $exists: false },
      description: { $exists: true }
    });

    // Calculate conversion rate (placeholder - needs actual implementation)
    const conversionRate = {
      value: 85.2,
      trend: '+5.2%',
      increasing: true
    };

    const formStats = {
      totalSubmissions,
      servicesRequested,
      productsRequested,
      conversionRate
    };

    // Get service distribution data
    const servicesData = await Request.aggregate([
      { $match: { budget: { $exists: true } } },
      { $group: { _id: '$description', count: { $sum: 1 } } },
      { $project: { 
          name: '$_id', 
          value: '$count',
          color: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'Hatma Prime'] }, then: 'bg-purple-500' },
                { case: { $eq: ['$_id', 'Design'] }, then: 'bg-blue-500' },
                { case: { $eq: ['$_id', 'CAC Reg'] }, then: 'bg-gray-800' },
                { case: { $eq: ['$_id', 'Branding'] }, then: 'bg-green-500' },
                { case: { $eq: ['$_id', 'Marketing'] }, then: 'bg-orange-500' }
              ],
              default: 'bg-teal-500'
            }
          }
        } 
      },
      { $sort: { value: -1 } }
    ]);

    // Get form distribution data
    const formsData = await Request.aggregate([
      { 
        $project: { 
          category: { 
            $cond: [
              { $and: [
                { $ifNull: ["$budget", false] },
                { $ifNull: ["$message", false] }
              ]}, 
              "Service Request", 
              "Product Request"
            ]
          }
        } 
      },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { 
          category: '$_id', 
          percentage: { 
            $round: [
              { $multiply: [{ $divide: ["$count", totalSubmissions.value] }, 100] },
              1
            ] 
          },
          color: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'Hatma Prime'] }, then: 'bg-purple-500' },
                { case: { $eq: ['$_id', 'Contact us'] }, then: 'bg-blue-500' },
                { case: { $eq: ['$_id', 'Feedback'] }, then: 'bg-green-500' },
                { case: { $eq: ['$_id', 'Product request'] }, then: 'bg-orange-500' }
              ],
              default: 'bg-teal-500'
            }
          }
        } 
      }
    ]);

    // Get historical data (last 6 months)
    const historicalData = await AnalyticsEvent.aggregate([
      { 
        $match: { 
          type: { $in: ['service_request', 'product_request'] },
          timestamp: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { month: '$_id', submissions: '$count' } }
    ]);

    res.json({
      formSubmissions,
      formStats,
      servicesData,
      formsData,
      historicalData,
      pagination: {
        totalItems,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(totalItems / limit)
      }
    });

  } catch (err) {
    console.error('Error fetching form dashboard data:', err);
    res.status(500).json({ error: 'Failed to fetch form analytics' });
  }
});
// Update form status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(updatedRequest);
  } catch (err) {
    console.error('Error updating form status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete form submission
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);
    
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    console.error('Error deleting form submission:', err);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

export default router;