import express from 'express';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { sendOrderReceipt } from "../controllers/emailController.js";
import { generateInvoicePDF } from '../utils/pdf.js'; 
import AnalyticsEvents from '../models/AnalyticsEvents.js';
import {nanoid} from 'nanoid';
import dotenv from 'dotenv'
import Project from '../models/Projects.js';
import { createNotification } from '../services/notificationSevices.js';

const router = express.Router();
dotenv.config();


router.put('/update-profile', protect, async (req, res) => {
  const { name, phoneNumber, address = [] } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });


    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (Array.isArray(address)) {

      const hasDefault = address.filter((addr) => addr.isDefault).length > 1;
      if (hasDefault) {
        return res.status(400).json({ error: 'Only one address can be default.' });
      }
      user.address = address;
    }

    const updatedUser = await user.save();
    res.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profile update failed' });
  }
});


router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});


router.get('/cart', protect, async (req, res) => {
  res.json({ cart: req.user.cart });
});

router.post('/cart', protect, async (req, res) => {
  const { cart } = req.body;

  if (!Array.isArray(cart)) {
    return res.status(400).json({ error: "Cart must be an array" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { cart },
      { new: true, runValidators: true }
    );

    res.json({ message: "Cart synced", cart: updatedUser.cart });
  } catch (err) {
    console.error("Cart sync error:", err);
    res.status(500).json({ error: "Failed to sync cart" });
  }
});



router.delete('/cart/:productId', protect, async (req, res) => {
  req.user.cart = req.user.cart.filter(item => item.productId.toString() !== req.params.productId);
  await req.user.save();
  res.json(req.user.cart);
});

router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.patch('/products/:id/view', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

   
    await AnalyticsEvents.create({
      type: 'page_visit',
      metadata: {
        page: `/products/${id}`,
        source: req.get('Referer') || 'direct',
      },
      timestamp: new Date()
    });

    res.status(200).json({ views: product.views });
    
  } catch (error) {
    console.error('Error tracking product view:', error);
    res.status(500).json({ error: 'Could not track product view' });
  }
});


router.put('/projects/:id/view', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({
      success: true,
      views: project.views
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/checkout', protect, async (req, res) => {
  const {
    items,
    totalAmount,
    paymentMethod,
    transactionId,
    address,
    phoneNumber,
    additionalInfo = ""
  } = req.body;

  if (!items?.length) return res.status(400).json({ message: 'No items in order' });

  try {
    const reference = transactionId || `HTM-${nanoid(10)}`;

    // ✅ Enrich each item with full product details including category
    const itemsWithDetails = await Promise.all(
      items.map(async item => {
        const product = await Product.findById(item._id);
        if (!product) {
          throw new Error(`Product not found: ${item._id}`);
        }

        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image || '',
          category: product.category || 'Uncategorized'
        };
      })
    );

    const order = new Order({
      user: req.user._id,
      items: itemsWithDetails,
      totalAmount,
      paymentMethod,
      transactionId,
      reference,
      paymentStatus: 'paid',
      address,
      phoneNumber,
      additionalInfo
    });

    await order.save();


    req.user.cart = [];
    await req.user.save();

    await createNotification({
      type: 'order',
      subtype: 'new',
      message: `New order #${itemsWithDetails.length} for $${totalAmount}`,
      referenceId: reference,
      priority: 1,
      context: {
        customer: req.user.email,
        items: itemsWithDetails.length
      }
    });


    order.items.forEach(async item => {
      const product = await Product.findById(item.product);
      if (product.quantity < 10) {
        await createNotification({
          type: 'inventory',
          subtype: 'low-stock',
          message: `Low stock: ${product.name} (${product.quantity} left)`,
          referenceId: product._id,
          priority: 2
        });
      }
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  }
});


router.get('/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});


router.get('/orders/:id/receipt', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');
      
    if (!order || order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Set headers for PDF download
    const filename = `Hatma-Receipt-${order._id}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    // Stream PDF directly to client
    const pdfBuffer = await generateInvoicePDF(
      order.items,
      order._id.toString(),
      order.user.name,
      order.totalAmount,
      order.createdAt,
      process.env.LOGO_URL,
      process.env.FRONTEND_BASE_URL
    );

    
    // send buffered PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ message: 'Server error generating receipt' });
  }
});


router.get('/orders/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order || order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  res.json(order);
});

router.post("/receipt", protect, sendOrderReceipt);


export default router;