import express from 'express';
import {
  createRequest,
  getTouristRequests,
  getGuideRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tourist endpoints
router.post('/', protect, authorize('tourist'), createRequest);
router.get('/tourist', protect, authorize('tourist'), getTouristRequests);

// Guide endpoints
router.get('/guide', protect, authorize('guide'), getGuideRequests);

// Status update (Guide can accept/reject/complete, Tourist can cancel)
router.put('/:id/status', protect, updateRequestStatus);

export default router;
