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
import submitRequestRoute from './src/routes/request.js'
import projectRoutes from './src/routes/project.js';
import formRoutes from './src/routes/form.js';
import notificationRoutes from './src/routes/notifications.js';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });


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

dotenv.config();
connectDB();


const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
