import express from 'express';
import axios from 'axios';
import Subscriber from '../models/Subscriber.js';
import Notification from '../models/Notifications.js';
import { createNotification } from '../services/notificationSevices.js';
import { configDotenv } from 'dotenv';
configDotenv();

const router = express.Router();

router.post("/", async (req, res) => {
  const GROUP_ID = process.env.GROUP_ID;
  const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
  const { email } = req.body;
  
  // Validate email
  if (!email || !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Generate initials from email
  const generateInitials = () => {
    return email.substring(0, 2).toUpperCase();
  };
   

  const url = `https://api.mailerlite.com/api/v2/groups/${GROUP_ID}/subscribers`;

  try {
    // Add to MailerLite
    await axios.post(
      url,
      { email, resubscribe: true },
      { headers: { "Content-Type": "application/json", "X-MailerLite-ApiKey": MAILERLITE_API_KEY } }
    );

    // Create in database
    const newSubscriber = await Subscriber.create({
      email,
      name: email.split('@')[0],
      initials: generateInitials(),
    });

    // Create admin notification
   await createNotification({
      type: 'subscriber',
      subtype: 'new',
      message: `New subscriber: ${email}`,
      referenceId: newSubscriber._id
    });

    res.status(201).json({ 
      message: "Subscription successful",
      subscriber: {
        id: newSubscriber._id,
        name: newSubscriber.name,
        initials: newSubscriber.initials,
        email: newSubscriber.email
      }
    });
  } catch (error) {
    // Handle MailerLite conflict
    if (error.response && error.response.status === 409) {
      return res.status(409).json({ error: "Email already subscribed" });
    }
    
    // Handle duplicate email in database
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({ error: "Email already exists in our database" });
    }

    await createNotification({
      type: 'system',
      subtype: 'error',
      message: `Subscription failed: ${error.message}`,
      priority: 2,
      context: { email }
    });
    
    console.error('Subscription error:', error);
    res.status(500).json({ error: "Failed to process subscription" });
  }
});

export default router;