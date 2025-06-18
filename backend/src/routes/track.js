import express from 'express';
import AnalyticsEvent from '../models/AnalyticsEvents.js';

const router = express.Router();
router.post('/track', async (req, res) => {
  try {
    const { type, metadata } = req.body;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    if (!type || !metadata) {
      return res.status(400).json({ message: 'Missing type or metadata' });
    }

    const event = new AnalyticsEvent({
      type,
      metadata,
      userAgent,
      ip,
    });

    await event.save();
    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
