import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Blog from '../models/Blog.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import AnalyticsEvents from '../models/AnalyticsEvents.js';
import Project from '../models/Projects.js';
import Request from '../models/request.js';
import { configDotenv } from 'dotenv';
configDotenv()
const router = express.Router();
import {v2 as cloudinary} from 'cloudinary'
import multer from 'multer';
import {getTrafficSources, getAverageSession, 
                getConversions, getMonthlyTrends, getServicesRequested,
                getTopPages, getTotalVisits, getSubscribersCount}  from '../utils/analytics.js';



const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Helper functions
async function calculateViewsTrend(startDate, endDate) {
  const result = await Project.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].totalViews : 0;
}

async function calculateProjectTrend(status, startDate, endDate) {
  return Project.countDocuments({
    status,
    createdAt: { $gte: startDate, $lte: endDate }
  });
}

function calculateChangePercentage(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

async function getHistoricalData(months) {
  const data = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthName = monthStart.toLocaleString('default', { month: 'short' });
    const year = monthStart.getFullYear();
    const label = `${monthName} ${year}`;
    
    const views = await calculateViewsTrend(monthStart, monthEnd);
    const published = await calculateProjectTrend('Published', monthStart, monthEnd);
    const draft = await calculateProjectTrend('Draft', monthStart, monthEnd);
    
    data.push({
      period: label,
      views,
      published,
      draft
    });
  }
  
  return data;
}

async function getMetricTrend(AnalyticsEventModel, type, matchExtra = {}) {
  const typeCondition = Array.isArray(type)
    ? { $in: type }
    : type;

  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 7);

  const [current, previous] = await Promise.all([
    AnalyticsEventModel.countDocuments({
      type: typeCondition,
      timestamp: { $gte: pastDate, $lt: now },
      ...matchExtra
    }),
    AnalyticsEventModel.countDocuments({
      type: typeCondition,
      timestamp: {
        $gte: new Date(pastDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lt: pastDate
      },
      ...matchExtra
    })
  ]);

  const trend = previous === 0 ? 0 : ((current - previous) / previous) * 100;
  return {
    value: current,
    trend: `${Math.abs(trend.toFixed(1))}%`,
    increasing: current >= previous
  };
}


router.get('/dashboard', protect, admin, (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

router.post('/products', protect, admin, upload.array('images'), async (req, res) => {
  try {
    const { name, description, price, discountPrice, costPrice, quantity, category, subCategory,
            sku, deliveryInfo, featured, variants } = req.body;

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(file.buffer);
        });

        uploadedImages.push(uploadResult.secure_url);
      }
    }

    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;

    const product = new Product({
      name, description, price, discountPrice,
      costPrice, quantity, category, subCategory,
      sku, deliveryInfo,
      featured: featured === 'true' || featured === true,
      variants: parsedVariants,
      images: uploadedImages,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/products/:id', protect, admin, upload.array('images'), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      costPrice,
      quantity,
      category,
      subCategory,
      sku,
      deliveryInfo,
      featured,
      variants,
    } = req.body;

    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;

    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.costPrice = costPrice || product.costPrice;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.sku = sku || product.sku;
    product.deliveryInfo = deliveryInfo || product.deliveryInfo;
    product.featured = featured === 'true' || featured === true;
    product.variants = parsedVariants || product.variants;

    // Append new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/products/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});


router.delete('/blogs/:id', protect, admin, async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ message: 'Blog deleted' });
});


router.get('/orders', protect, admin, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  const count = await Order.countDocuments();
  res.json({ total: count, page: Number(page), pages: Math.ceil(count / limit), orders });
});

router.put('/orders/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  await order.save();

  res.json(order);
});

router.get('/dashboard/metrics', protect, admin, async (req, res) => {
  const [userCount, orderCount, revenue] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }])
  ]);

  res.json({
    users: userCount,
    orders: orderCount,
    revenue: revenue[0]?.total || 0
  });
});


router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const [
      totalVisits,
      services,
      conversions,
      traffic,
      topPages,
      avgSession,
      monthly
    ] = await Promise.all([
      getTotalVisits(),
      getServicesRequested(),
      getConversions(),
      getTrafficSources(),
      getTopPages(),
      getAverageSession(),
      getMonthlyTrends(),
      getSubscribersCount()
    ]);

    res.json({
      stats: {
        totalVisits,
        averageSession: avgSession,
        growth: '15%', // Placeholder - you can calculate based on prev. month
        subscribers: 2318, // Replace with dynamic count if available
      },
      services,
      conversions,
      traffic,
      topPages,
      monthly,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics dashboard' });
  }
});

router.get('/overview', async (req, res) => {
  try {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - 7);

    // Metric calculations
    const sessions = await getMetricTrend(AnalyticsEvents, 'session');
    const conversions = await getMetricTrend(AnalyticsEvents, 'conversion');
    const serviceRequests = await getMetricTrend(AnalyticsEvents, 'service_request');
    const productRequests = await getMetricTrend(AnalyticsEvents, 'product_request');
    const totalSubmissions = await getMetricTrend(
      AnalyticsEvents,
      ['service_request', 'product_request']
    );
    const pageViews = await getMetricTrend(AnalyticsEvents, 'page_visit');
    const totalProductViews = await getMetricTrend(AnalyticsEvents, 'page_visit', {
      'metadata.page': { $regex: '^/products/' }
    });
    const blogViews = await getMetricTrend(AnalyticsEvents, 'page_visit', {
      'metadata.page': { $regex: '^/blog/' }
    });

    // User metrics
    const userStatsAgg = await User.aggregate([
      { $match: { createdAt: { $gte: pastDate, $lt: now } } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    const userCount = userStatsAgg[0]?.count || 0;

    const prevUserStatsAgg = await User.aggregate([
      { 
        $match: { 
          createdAt: {
            $gte: new Date(pastDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            $lt: pastDate
          }
        } 
      },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    const prevUserCount = prevUserStatsAgg[0]?.count || 0;
    const userTrend = prevUserCount === 0 ? 0 : ((userCount - prevUserCount) / prevUserCount) * 100;

    const totalUsers = {
      value: userCount,
      trend: `${Math.abs(userTrend.toFixed(1))}%`,
      increasing: userCount >= prevUserCount
    };

    // Sales metrics
    const [salesNowAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: pastDate, $lt: now } } },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 }
        } 
      }
    ]);

    const [salesPrevAgg] = await Order.aggregate([
      { 
        $match: { 
          createdAt: {
            $gte: new Date(pastDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            $lt: pastDate
          }
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 }
        } 
      }
    ]);

    const currentRevenue = salesNowAgg?.totalRevenue || 0;
    const previousRevenue = salesPrevAgg?.totalRevenue || 0;
    const currentTransactions = salesNowAgg?.totalTransactions || 0;
    const previousTransactions = salesPrevAgg?.totalTransactions || 0;

    const revenueTrend = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const transactionTrend = previousTransactions === 0 ? 0 : ((currentTransactions - previousTransactions) / previousTransactions) * 100;

    const totalSales = {
      totalRevenue: {
        value: currentRevenue,
        trend: `${Math.abs(revenueTrend.toFixed(1))}%`,
        increasing: currentRevenue >= previousRevenue
      },
      totalTransactions: {
        value: currentTransactions,
        trend: `${Math.abs(transactionTrend.toFixed(1))}%`,
        increasing: currentTransactions >= previousTransactions
      }
    };

    // Aggregations
    const trafficSources = await AnalyticsEvents.aggregate([
      { $match: { type: 'traffic_source' } },
      { $group: { _id: '$metadata.source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topPages = await AnalyticsEvents.aggregate([
      { $match: { type: 'page_visit' } },
      { $group: { _id: '$metadata.page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const totalProducts = await Product.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalUserCount = await User.countDocuments();
    const [totalRevenueAgg] = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueAgg?.totalRevenue || 0;
    const totalTransactions = await Order.countDocuments();

    const userStats = await User.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const blogViewTrends = await AnalyticsEvents.aggregate([
      { 
        $match: { 
          type: 'page_visit',
          'metadata.page': { $regex: '^/blog/' } 
        } 
      },
      { 
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, 
          views: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    const productSalesTrends = await Order.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, totalAmount: { $sum: '$totalAmount' }, totalSales: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // View analysis helper
    async function getViewedItem(pagePrefix, Model, sortOrder = -1) {
      const result = await AnalyticsEvents.aggregate([
        { $match: { type: 'page_visit', 'metadata.page': { $regex: `^${pagePrefix}` } } },
        { $group: { _id: '$metadata.page', count: { $sum: 1 } } },
        { $sort: { count: sortOrder } },
        { $limit: 1 }
      ]);

      if (result.length === 0) return null;

      const id = result[0]._id.split('/').pop();
      const item = await Model.findById(id).lean();
      if (!item) return null;

      return {
        ...item,
        views: result[0].count
      };
    }

    const mostViewedProduct = await getViewedItem('/products/', Product, -1);
    const leastViewedProduct = await getViewedItem('/products/', Product, 1);
    const mostViewedBlog = await getViewedItem('/blog/', Blog, -1);
    const leastViewedBlog = await getViewedItem('/blog/', Blog, 1);

    // Form analytics - NEW SECTION
    const formSubmissionDetails = await Request.aggregate([
      { $match: { createdAt: { $gte: pastDate } } },
      { 
        $project: {
          _id: 0,
          id: "$_id",
          type: { 
            $cond: [
              { $and: [
                { $ifNull: ["$budget", false] },
                { $ifNull: ["$message", false] }
              ]}, 
              "Service Request", 
              "Product Request"
            ]
          },
          date: { $dateToString: { format: "%Y-%m-%dT%H:%M:%SZ", date: "$createdAt" } },
          name: 1,
          email: 1,
          details: {
            $cond: [
              { $and: [
                { $ifNull: ["$budget", false] },
                { $ifNull: ["$message", false] }
              ]}, 
              { service: "$description", budget: "$budget" }, 
              { product: "$description" }
            ]
          }
        }
      },
      { $sort: { date: -1 } },
      { $limit: 50 }
    ]);

    const serviceRequestHistory = await Request.find({
      $and: [
        { budget: { $exists: true } },
        { message: { $exists: true } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    const productRequestHistory = await Request.find({
      $and: [
        { description: { $exists: true } },
        { budget: { $exists: false } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    // Response with all metrics
    res.json({
      // Core metrics
      sessions,
      conversions,
      pageViews,
      
      // Form analytics
      serviceRequests,
      productRequests,
      totalSubmissions,
      formDistribution: {
        service: serviceRequests.value,
        product: productRequests.value
      },
      formSubmissionDetails,
      serviceRequestHistory,
      productRequestHistory,
      
      // Content metrics
      blogViews,
      totalProductViews,
      mostViewedProduct,
      leastViewedProduct,
      mostViewedBlog,
      leastViewedBlog,
      
      // User metrics
      totalUsers,
      totalUser: totalUserCount,
      userStats,
      
      // Sales metrics
      totalSales,
      totalRevenue,
      totalTransactions,
      productSalesTrends,
      
      // Traffic metrics
      trafficSources,
      topPages,
      
      // Inventory metrics
      totalProducts,
      totalBlogs,
      
      // Trend data
      blogViewTrends
    });
    
  } catch (err) {
    console.error('Error fetching overview data:', err);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
});


router.get('/sales-overview', protect, admin, async (req, res) => {
  try {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeek = new Date(pastDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Aggregated revenue & transactions
    const [salesNowAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: pastDate, $lt: now } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const [salesPrevAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: prevWeek, $lt: pastDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const currentRevenue = salesNowAgg?.totalRevenue || 0;
    const currentTransactions = salesNowAgg?.totalTransactions || 0;
    const previousRevenue = salesPrevAgg?.totalRevenue || 0;
    const previousTransactions = salesPrevAgg?.totalTransactions || 0;

    const revenueTrend = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const transactionTrend = previousTransactions === 0 ? 0 : ((currentTransactions - previousTransactions) / previousTransactions) * 100;

    const totalSales = {
      totalRevenue: {
        value: currentRevenue,
        trend: `${Math.abs(revenueTrend.toFixed(1))}%`,
        increasing: currentRevenue >= previousRevenue
      },
      totalTransactions: {
        value: currentTransactions,
        trend: `${Math.abs(transactionTrend.toFixed(1))}%`,
        increasing: currentTransactions >= previousTransactions
      }
    };

    // Product sales trend by date
    const productSalesTrends = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fetch all orders for the period
    const ordersAll = await Order.find({ createdAt: { $gte: pastDate, $lt: now } }).populate('user').lean();
    const order = await Order.findOne({});

    const pendingOrders = ordersAll.filter(o => o.paymentStatus === 'pending').length;
    const failedPayments = ordersAll.filter(o => o.paymentStatus === 'failed').length;

    const categoryRevenueMap = {};
    const productRevenueMap = {};
    let categoryColors = {
      'Electronics': '#3B82F6',
      'Accessories': '#10B981',
      'Software': '#8B5CF6',
      'Services': '#F59E0B'
    };

    order.items?.forEach(p => {
  if (!p?.category || !p?.price || !p?.quantity || !p?.name) return;

  // Category sales
  categoryRevenueMap[p.category] = (categoryRevenueMap[p.category] || 0) + (p.price * p.quantity);

  // Product sales
  const key = p.name;
  if (!productRevenueMap[key]) {
    productRevenueMap[key] = {
      name: p.name,
      value: 0,
      sales: 0,
      color: '#000'
    };
  }
  productRevenueMap[key].value += p.price * p.quantity;
  productRevenueMap[key].sales += p.quantity;
});

    const totalRev = Object.values(categoryRevenueMap).reduce((sum, val) => sum + val, 0);

    const salesData = Object.entries(categoryRevenueMap).map(([category, value]) => ({
      category,
      value,
      percentage: totalRev ? (value / totalRev) * 100 : 0,
      color: categoryColors[category] || '#ccc'
    })).sort((a, b) => b.value - a.value);

    const products = Object.values(productRevenueMap)
      .map(p => ({
        ...p,
        color: categoryColors['Accessories'] // Default/fallback color
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const orders = await Order.find().sort({ createdAt: -1 }).limit(6).populate('user').lean();

    const recentOrders = orders.map((order) => ({
      id: order._id || order._id.toString(),
      customer: `${order.user?.firstName || 'N/A'} ${order.user?.lastName || ''}`.trim(),
      product: order.items?.[0]?.name || 'N/A',
      date: new Date(order.createdAt).toLocaleString(),
      amount: `₦${order.totalAmount.toLocaleString()}`,
      payment: order.paymentStatus || 'pending',
      delivery: order.deliveryStatus || 'Processing',
      avatar: `${order.user?.firstName?.[0] || 'U'}${order.user?.lastName?.[0] || ''}`
    }));

    res.json({
      totalSales,
      productSalesTrends,
      pendingOrders,
      failedPayments,
      salesData,
      products,
      orders: recentOrders
    });

  } catch (err) {
    console.error('Error fetching sales overview:', err);
    res.status(500).json({ error: 'Failed to fetch sales overview' });
  }
});

router.patch('/order/payment-status/:id', protect, admin, async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!['paid', 'pending', 'failed'].includes(paymentStatus)) {
    return res.status(400).json({ message: 'Invalid payment status' });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { _id: id },
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Payment status updated', order });
  } catch (err) {
    console.error('Update payment status error:', err);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
});


router.patch('/order/delivery-status/:id', protect, admin, async (req, res) => {
  const { id } = req.params;
  const { deliveryStatus } = req.body;

  if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(deliveryStatus)) {
    return res.status(400).json({ message: 'Invalid delivery status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Delivery status updated', order });
  } catch (err) {
    console.error('Update delivery status error:', err);
    res.status(500).json({ message: 'Failed to update delivery status' });
  }
});


router.post('/blogs', protect, admin, upload.array('images'), async (req, res) => {
  try {
    const { title, category, duration, industry, body, featured } = req.body;

     const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'blog' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(file.buffer);
        });

        uploadedImages.push(uploadResult.secure_url);
      }
    }
 

    const blog = new Blog({
      title,
      category,
      duration,
      industry,
      body,
      featured: featured === 'true',
      images: uploadedImages,
      author: req.user._id
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog', details: err.message });
  }
});


router.get('/get-portfolio-stats', protect, admin, async (req, res) => {
  try {
    // Current date calculations
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const twoMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    
    // Total projects
    const totalProjects = await Project.countDocuments();
    
    // Published projects
    const publishedProjects = await Project.countDocuments({ status: 'Published' });
    
    // Draft projects
    const draftProjects = await Project.countDocuments({ status: 'Draft' });
    
    // Get total views
    const totalViewsResult = await Project.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;
    
    // Get most and least viewed projects
    const mostViewed = await Project.findOne().sort({ views: -1 }).limit(1);
    const leastViewed = await Project.findOne().sort({ views: 1 }).limit(1);
    
    // Calculate trends
    const trends = {
      views: {
        currentMonth: await calculateViewsTrend(currentMonthStart, now),
        lastMonth: await calculateViewsTrend(lastMonthStart, lastMonthEnd),
        changePercentage: 0,
        direction: 'neutral'
      },
      published: {
        currentMonth: await calculateProjectTrend('Published', currentMonthStart, now),
        lastMonth: await calculateProjectTrend('Published', lastMonthStart, lastMonthEnd),
        changePercentage: 0,
        direction: 'neutral'
      },
      draft: {
        currentMonth: await calculateProjectTrend('Draft', currentMonthStart, now),
        lastMonth: await calculateProjectTrend('Draft', lastMonthStart, lastMonthEnd),
        changePercentage: 0,
        direction: 'neutral'
      }
    };
    
    // Calculate percentage changes
    trends.views.changePercentage = calculateChangePercentage(
      trends.views.currentMonth, 
      trends.views.lastMonth
    );
    trends.views.direction = trends.views.changePercentage >= 0 ? 'up' : 'down';
    
    trends.published.changePercentage = calculateChangePercentage(
      trends.published.currentMonth, 
      trends.published.lastMonth
    );
    trends.published.direction = trends.published.changePercentage >= 0 ? 'up' : 'down';
    
    trends.draft.changePercentage = calculateChangePercentage(
      trends.draft.currentMonth, 
      trends.draft.lastMonth
    );
    trends.draft.direction = trends.draft.changePercentage >= 0 ? 'up' : 'down';
    
    // Get historical data for charts
    const historicalData = await getHistoricalData(6); // Last 6 months
    
    res.json({
      totalProjects,
      publishedProjects,
      draftProjects,
      totalViews,
      mostViewed,
      leastViewed,
      trends,
      historicalData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/blogs/:id', protect, admin, upload.array('images'), async (req, res) => {
  try {
    const { title, category, duration, industry, body, featured } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    blog.title = title;
    blog.category = category;
    blog.duration = duration;
    blog.industry = industry;
    blog.body = body;
    blog.featured = featured === 'true';

      if (req.files && req.files.length > 0) {
    const uploadedImages = [];

    for (const file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'blog' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(file.buffer);
      });

      uploadedImages.push(uploadResult.secure_url);
    }

    // Optional: Replace or append images
    blog.images = [...blog.images, ...uploadedImages];
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog', details: err.message });
  }
});

router.post('/add-defaults', protect, admin, async (req, res) => {
  const defaultProjects = [
    {
      id: 1,
      title: 'TechFlow Solutions',
      client: 'B2B SaaS Startup',
      category: 'Branding',
      views: 1245,
      status: 'Published',
      year: '2024',
      duration: '3 months',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Complete brand identity redesign for a growing SaaS company',
      results: [
        { metric: 'Brand Recognition', value: '85%', icon: 'Award' },
        { metric: 'Customer Engagement', value: '+150%', icon: 'TrendingUp' },
        { metric: 'Lead Generation', value: '+200%', icon: 'Target' }
      ],
      tags: ['Brand Identity', 'Logo Design', 'Visual System'],
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'GreenEarth Initiative',
      client: 'Environmental NGO',
      category: 'Digital Marketing',
      views: 892,
      status: 'Published',
      year: '2024',
      duration: '6 months',
      image: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comprehensive digital marketing campaign for environmental awareness',
      results: [
        { metric: 'Social Reach', value: '2.5M', icon: 'Users' },
        { metric: 'Donation Increase', value: '+300%', icon: 'TrendingUp' },
        { metric: 'Volunteer Sign-ups', value: '+450%', icon: 'Target' }
      ],
      tags: ['Social Media', 'Content Strategy', 'Campaign Management'],
      createdAt: '2024-02-20'
    },
    {
      id: 3,
      title: 'RetailMax Platform',
      client: 'E-commerce Retailer',
      category: 'Web Development',
      views: 1567,
      status: 'Published',
      year: '2024',
      duration: '4 months',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Custom e-commerce platform with advanced analytics',
      results: [
        { metric: 'Page Load Speed', value: '2.1s', icon: 'Zap' },
        { metric: 'Conversion Rate', value: '+180%', icon: 'TrendingUp' },
        { metric: 'User Retention', value: '+220%', icon: 'Users' }
      ],
      tags: ['E-commerce', 'Custom Development', 'Analytics'],
      createdAt: '2024-03-10'
    },
    {
      id: 4,
      title: 'FinanceForward Strategy',
      client: 'Financial Services',
      category: 'Strategy',
      views: 634,
      status: 'Draft',
      year: '2023',
      duration: '2 months',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Strategic business transformation and digital adoption roadmap',
      results: [
        { metric: 'Digital Adoption', value: '95%', icon: 'Target' },
        { metric: 'Operational Efficiency', value: '+160%', icon: 'TrendingUp' },
        { metric: 'Customer Satisfaction', value: '4.8/5', icon: 'Award' }
      ],
      tags: ['Business Strategy', 'Digital Transformation', 'Process Optimization'],
      createdAt: '2023-11-15'
    },
    {
      id: 5,
      title: 'HealthTech Connect',
      client: 'Healthcare Technology',
      category: 'Branding',
      views: 1089,
      status: 'Published',
      year: '2023',
      duration: '5 months',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Brand positioning for healthcare technology platform',
      results: [
        { metric: 'Brand Trust Score', value: '92%', icon: 'Award' },
        { metric: 'User Acquisition', value: '+250%', icon: 'Users' },
        { metric: 'Platform Adoption', value: '+180%', icon: 'TrendingUp' }
      ],
      tags: ['Healthcare Branding', 'Trust Building', 'User Experience'],
      createdAt: '2023-08-22'
    },
    {
      id: 6,
      title: 'EduTech Revolution',
      client: 'Educational Platform',
      category: 'Digital Marketing',
      views: 756,
      status: 'Published',
      year: '2023',
      duration: '8 months',
      image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Multi-channel marketing campaign for online learning platform',
      results: [
        { metric: 'Student Enrollment', value: '+400%', icon: 'Users' },
        { metric: 'Course Completion', value: '89%', icon: 'Target' },
        { metric: 'Revenue Growth', value: '+350%', icon: 'TrendingUp' }
      ],
      tags: ['Education Marketing', 'Student Acquisition', 'Content Marketing'],
      createdAt: '2023-05-18'
    },
  ];

  try {
    // Prevent duplicates by checking existing titles
    const existingTitles = (await Project.find({}, 'title')).map(p => p.title);
    const newProjects = defaultProjects.filter(
      project => !existingTitles.includes(project.title)
    );

    if (newProjects.length === 0) {
      return res.status(200).json({
        message: 'All default projects already exist in the database'
      });
    }

    // Insert new projects
    const createdProjects = await Project.insertMany(newProjects);

    res.status(201).json({
      message: `${createdProjects.length} default projects added successfully`,
      projects: createdProjects
    });
  } catch (error) {
    console.error('Error adding default projects:', error);
    res.status(500).json({
      message: 'Server error while adding default projects',
      error: error.message
    });
  }
});

router.put('/update-status/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.status = req.body.status;
    project.updatedAt = Date.now();
    
    const updatedProject = await project.save();
    
    res.status(200).json({
      message: 'Status updated successfully',
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while updating status',
      error: error.message
    });
  }
});



export default router;