import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.js';
import { isAdmin } from '../controllers/user.js';

const router = express.Router();

// Public/User routes
router.post('/placeOrder', placeOrder);
router.get('/user/:userId', getUserOrders); // Get orders for specific user
router.get('/:orderId', getOrderById); // Get single order details
router.patch('/:orderId/cancel', cancelOrder); // User can cancel their own order

// Admin only routes
router.get('/', isAdmin, getAllOrders); // Get all orders (admin)
router.patch('/:orderId/status', isAdmin, updateOrderStatus); // Update order status (admin)

export default router;
