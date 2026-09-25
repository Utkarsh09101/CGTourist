import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminGuides,
  toggleGuideVerification,
  getAdminReviews,
  deleteAdminReview,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require valid JWT and 'admin' role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.delete('/users/:id', deleteAdminUser);
router.get('/guides', getAdminGuides);
router.put('/guides/:id/verify', toggleGuideVerification);
router.get('/reviews', getAdminReviews);
router.delete('/reviews/:id', deleteAdminReview);

export default router;
