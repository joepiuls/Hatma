import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import adminRoutes from './src/routes/admin.js';
import blogRoutes from './src/routes/blog.js';
import cors from 'cors';
import paystackRoutes from './src/routes/paystack.js';
import createDefaultAdmin from './src/config/createDefaultAdmin.js';
import trackRoute from './src/routes/track.js';
import subscribeRoute from './src/routes/subscribe.js';
import submitRequestRoute from './src/routes/request.js';
import projectRoutes from './src/routes/project.js';
import formRoutes from './src/routes/form.js';
import notificationRoutes from './src/routes/notifications.js';
import { createServer } from 'http'; // Added for WebSocket integration
import { WebSocketServer } from 'ws';
import path from 'path'; // Added for static file serving

// Initialize environment variables first
dotenv.config();


const app = express();


app.use(express.json());

const corsOptions = {
  origin: 'https://hatma.onrender.com',
  credentials: true, // Required for cookies/auth headers
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/paystack', paystackRoutes);
app.use('/api/analytics', trackRoute);
app.use('/api/subscribe', subscribeRoute);
app.use('/api/requests', submitRequestRoute);
app.use('/api/projects', projectRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  
  // Handle SPA routing
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/dist', 'index.html'));
  });
}

// Create HTTP server for WebSocket integration
const server = createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('error', console.error);
});

// Broadcast notification function
export function broadcastNotification(notification) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
  });
}


connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`WebSocket server running on same port`);
  });
});