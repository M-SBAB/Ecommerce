import express from 'express';
import {
  getDashboardStats,
  getRevenueTrends,
  getOrderTrends,
  getTopProducts,
  getLowStockAlerts,
  getRecentOrders,
  getCategoryStats,
  getRecentUsers,
} from '../controllers/dashboard.js';
import { isAdmin } from '../controllers/user.js';

const router = express.Router();

// All dashboard routes are admin-only
router.get('/stats', isAdmin, getDashboardStats);
router.get('/revenue-trends', isAdmin, getRevenueTrends);
router.get('/order-trends', isAdmin, getOrderTrends);
router.get('/top-products', isAdmin, getTopProducts);
router.get('/low-stock', isAdmin, getLowStockAlerts);
router.get('/recent-orders', isAdmin, getRecentOrders);
router.get('/category-stats', isAdmin, getCategoryStats);
router.get('/recent-users', isAdmin, getRecentUsers);

export default router;
