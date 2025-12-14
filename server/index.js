import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import UserRoutes from './routes/user.js';
import ProductRoutes from './routes/products.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/auth', UserRoutes);
app.use('/products', ProductRoutes);

const PORT = process.env.PORT || 6001;
mongoose
  .connect(
    'mongodb+srv://s22bdocs1m01174_db_user:nAiWZxj1sT8IB2Nv@maincluster.gehzeyy.mongodb.net/ecommerce_db?appName=Mohsin-FYP'
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server Connected on PORT ${PORT}`));
    console.log('Connected to MongoDB - Database: ecommerce_db');
  })
  .catch((err) => {
    console.log('Server didnt connect');
    console.error('MongoDB connection error:', err);
  });
