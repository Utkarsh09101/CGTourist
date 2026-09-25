import Review from '../models/Review.js';
import GuideRequest from '../models/GuideRequest.js';
import GuideProfile from '../models/GuideProfile.js';

// Helper function to recalculate and update a guide's average rating and review count
const updateGuideRatingStats = async (guideId) => {
  const stats = await Review.aggregate([
    { $match: { guide: guideId } },
    {
      $group: {
        _id: '$guide',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await GuideProfile.findByIdAndUpdate(guideId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    // If no reviews left
    await GuideProfile.findByIdAndUpdate(guideId, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// @desc    Submit a review and rating for a completed guide request
// @route   POST /api/reviews
// @access  Private (Tourist only)
export const createReview = async (req, res, next) => {
  try {
    const { requestId, rating, comment } = req.body;

    if (!requestId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide requestId, rating (1-5), and review comment',
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
      });
    }

    // 1. Verify that the booking request exists
    const request = await GuideRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Associated booking request not found',
      });
    }

    // 2. Verify that the logged-in user is indeed the tourist who booked the tour
    if (request.tourist.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review tours that you personally booked',
      });
    }

    // 3. Verify that the tour has actually been completed
    if (request.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review a guide after the tour is marked as completed',
      });
    }

    // 4. Verify that this request hasn't been reviewed already
    const existingReview = await Review.findOne({ request: requestId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this completed tour',
      });
    }

    // 5. Create Review
    const review = await Review.create({
      tourist: req.user._id,
      guide: request.guide,
      request: requestId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // 6. Recalculate guide's average rating in GuideProfile
    await updateGuideRatingStats(request.guide);

    const populatedReview = await Review.findById(review._id).populate(
      'tourist',
      'name profileImage'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a specific guide
// @route   GET /api/reviews/guide/:guideId
// @access  Public
export const getGuideReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ guide: req.params.guideId })
      .populate('tourist', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Admin or reviewer)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Only the reviewer or an admin can delete
    if (
      review.tourist.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const guideId = review.guide;
    await review.deleteOne();

    // Recalculate rating stats
    await updateGuideRatingStats(guideId);

    res.status(200).json({
      success: true,
      message: 'Review deleted and guide rating updated',
    });
  } catch (error) {
    next(error);
  }
};
