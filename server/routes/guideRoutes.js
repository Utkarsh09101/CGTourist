import express from 'express';
import {
  getGuides,
  getGuideById,
  getMyGuideProfile,
  updateMyGuideProfile,
} from '../controllers/guideController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getGuides);
router.get('/:id', getGuideById);

// Protected routes (Guide role only)
router.get('/me/profile', protect, authorize('guide'), getMyGuideProfile);
router.put('/profile', protect, authorize('guide'), updateMyGuideProfile);

export default router;
