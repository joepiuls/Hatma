import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order.js';
import User from '../models/User.js';
import {protect} from '../middleware/auth.js'; // Assumes you have JWT auth middleware
const router = express.Router();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// 1️⃣ Initialize Paystack Payment
router.post('/initiate', protect, async (req, res) => {
  const { items, amount, address } = req.body;
  const userId = req.user.id;

  const reference = uuidv4();

  try {
    const user = await User.findById(userId);

    const order = new Order({
      user: userId,
      items,
      amount,
      address,
      reference,
      status: 'pending',
    });
    await order.save();

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount,
        reference,
        callback_url: 'https://localhost:3000/payment-success',
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// 2️⃣ Webhook Handler (Paystack Server → Your Server)
router.post('/webhook', express.json(), async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== signature) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;

  if (event.event === 'charge.success') {
    const ref = event.data.reference;

    try {
      const order = await Order.findOne({ reference: ref });
      if (!order) return res.status(404).send('Order not found');

      order.status = 'paid';
      await order.save();

      console.log('✅ Order marked as paid:', ref);
    } catch (err) {
      console.error('Webhook order update error:', err.message);
    }
  }

  res.status(200).send('OK');
});

// 3️⃣ (Optional) Manual Payment Verification
router.get('/verify/:reference', protect, async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });

    const data = response.data.data;

    if (data.status === 'success') {
      const order = await Order.findOne({ reference });
      if (order && order.status !== 'paid') {
        order.status = 'paid';
        await order.save();
      }

      return res.json({ message: 'Payment verified successfully', data });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
