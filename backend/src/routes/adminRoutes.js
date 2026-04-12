import express from 'express';
import {
  bulkUploadProducts,
  createProduct,
  deleteProduct,
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getAnalytics,
  getDashboardStats,
  updateOrderStatus,
  updateProduct
} from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/products', getAllProducts);
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/bulk-upload', upload.single('file'), bulkUploadProducts);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
