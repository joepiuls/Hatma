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
app.use('/api/paystack/', paystackRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
