import express from 'express';
import {
  createReview,
  getGuideReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/guide/:guideId', getGuideReviews);

// Protected routes
router.post('/', protect, authorize('tourist'), createReview);
router.delete('/:id', protect, deleteReview);

export default router;
