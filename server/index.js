import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import UserRoutes from './routes/user.js';
import ProductRoutes from './routes/products.js';
import OrderRoutes from './routes/order.js';
import DashboardRoutes from './routes/dashboard.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/auth', UserRoutes);
app.use('/products', ProductRoutes);
app.use('/orders', OrderRoutes);
app.use('/dashboard', DashboardRoutes);

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Connected on PORT ${PORT}`));
    console.log('Connected to MongoDB - Database: ecommerce_db');
  })
  .catch((err) => {
    console.log('Server could not connect');
    console.error('MongoDB connection error:', err);
  });
