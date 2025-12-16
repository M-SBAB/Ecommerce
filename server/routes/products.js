import express from 'express';
import {
  addProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  updateStock,
  deleteProduct,
} from '../controllers/products.js';
import { isAdmin } from '../controllers/user.js';

const router = express.Router();

// Public routes - accessible to all users (no authentication required)
router.get('/all', getAllProduct); // Supports query params: ?search=laptop&category=electronics&minPrice=100&maxPrice=1000
router.get('/:productID', getProductById);

// Protected routes - admin only (write operations)
router.post('/add', isAdmin, addProduct);
router.put('/:productID', isAdmin, updateProduct); // Full product update
router.patch('/:productID/Update', isAdmin, updateStock); // Stock update only
router.delete('/:productID', isAdmin, deleteProduct);

export default router;
