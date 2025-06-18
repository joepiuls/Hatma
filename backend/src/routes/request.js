import express from 'express';
import Request from '../models/request.js';
import { protect, admin } from "../middleware/auth.js";
import { sendRequestEmail } from '../controllers/emailController.js';
import AnalyticsEvent from '../models/AnalyticsEvents.js';
import { createNotification } from '../services/notificationSevices.js';

const router = express.Router();

router.post('/product', async (req, res) => {
  try {
    const { email, name, description, attachment } = req.body;

    if (!email || !name || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRequest = new Request({ email, name, description, attachment });
    await newRequest.save();
    const event = new AnalyticsEvent({
      type: 'product_request',
      metadata: { requestId: newRequest._id },
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    await event.save();
    await createNotification({
      type: 'form',
      subtype: 'new',
      message: `New form request from ${name}`,
      referenceId: newRequest._id,
      priority: 1,
      context: {
        customer: email,
        items: 1
      }
    });
    await sendRequestEmail(newRequest);
    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Failed to save request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/custom', async (req, res) => {
  try {
    const { email, name, phone, message, budget } = req.body;

    if (!email || !name || !phone || !message || !budget) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRequest = new Request({ email, name, phoneNumber:phone, message, budget });
    await newRequest.save();
    await sendRequestEmail(newRequest);

    await createNotification({
      type: 'form',
      subtype: 'new',
      message: `New form request from ${name}`,
      referenceId: newRequest._id,
      priority: 1,
      context: {
        customer: email,
        items: 1
      }
    });
    
    const event = new AnalyticsEvent({
      type: 'service_request',
      metadata: { requestId: newRequest._id },
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    await event.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Failed to save request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Failed to fetch requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;
