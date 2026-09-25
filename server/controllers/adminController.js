import User from '../models/User.js';
import GuideProfile from '../models/GuideProfile.js';
import Destination from '../models/Destination.js';
import GuideRequest from '../models/GuideRequest.js';
import Review from '../models/Review.js';

// Helper to recalculate guide rating
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
    await GuideProfile.findByIdAndUpdate(guideId, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// @desc    Get aggregate platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalGuides, totalDestinations, totalRequests, totalReviews] =
      await Promise.all([
        User.countDocuments({ role: 'tourist' }),
        GuideProfile.countDocuments(),
        Destination.countDocuments(),
        GuideRequest.countDocuments(),
        Review.countDocuments(),
      ]);

    // Request status breakdown
    const [pendingRequests, acceptedRequests, completedRequests, rejectedRequests] =
      await Promise.all([
        GuideRequest.countDocuments({ status: 'pending' }),
        GuideRequest.countDocuments({ status: 'accepted' }),
        GuideRequest.countDocuments({ status: 'completed' }),
        GuideRequest.countDocuments({ status: 'rejected' }),
      ]);

    // Recent 5 requests
    const recentRequests = await GuideRequest.find()
      .populate('tourist', 'name email profileImage')
      .populate('destination', 'name district')
      .populate({
        path: 'guide',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalGuides,
          totalDestinations,
          totalRequests,
          totalReviews,
        },
        requestStatus: {
          pending: pendingRequests,
          accepted: acceptedRequests,
          completed: completedRequests,
          rejected: rejectedRequests,
        },
        recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteAdminUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting admin itself
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Administrator accounts cannot be deleted',
      });
    }

    // If guide, remove their guide profile and requests
    if (user.role === 'guide') {
      const guideProfile = await GuideProfile.findOne({ user: user._id });
      if (guideProfile) {
        await Review.deleteMany({ guide: guideProfile._id });
        await GuideRequest.deleteMany({ guide: guideProfile._id });
        await guideProfile.deleteOne();
      }
    } else {
      await GuideRequest.deleteMany({ tourist: user._id });
      await Review.deleteMany({ tourist: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all guide profiles for administration
// @route   GET /api/admin/guides
// @access  Private (Admin only)
export const getAdminGuides = async (req, res, next) => {
  try {
    const guides = await GuideProfile.find()
      .populate('user', 'name email phone profileImage createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle guide verification badge
// @route   PUT /api/admin/guides/:id/verify
// @access  Private (Admin only)
export const toggleGuideVerification = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found',
      });
    }

    guide.isVerified = !guide.isVerified;
    await guide.save();

    res.status(200).json({
      success: true,
      message: `Guide verification status updated to ${guide.isVerified ? 'VERIFIED' : 'UNVERIFIED'}`,
      data: guide,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private (Admin only)
export const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('tourist', 'name email profileImage')
      .populate({
        path: 'guide',
        populate: { path: 'user', select: 'name' },
      })
      .populate({
        path: 'request',
        populate: { path: 'destination', select: 'name district' },
      })
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

// @desc    Delete review in moderation
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin only)
export const deleteAdminReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const guideId = review.guide;
    await review.deleteOne();

    // Recalculate guide rating
    await updateGuideRatingStats(guideId);

    res.status(200).json({
      success: true,
      message: 'Inappropriate review deleted and guide rating recalculated',
    });
  } catch (error) {
    next(error);
  }
};
