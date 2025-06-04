import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Blog from '../models/Blog.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/dashboard', protect, admin, (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

router.post('/products', protect, admin, async (req, res) => {
  const { name, description, price, category, stock, tags, isFeatured } = req.body;
  const product = new Product({ name, description, price, category, stock, tags, isFeatured });
  await product.save();
  res.status(201).json(product);
});

router.put('/products/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.delete('/products/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

router.post('/blogs', protect, admin, async (req, res) => {
  const { title, content, author, published } = req.body;
  const blog = new Blog({ title, content, author, published });
  await blog.save();
  res.status(201).json(blog);
});

router.put('/blogs/:id', protect, admin, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
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

export default router;