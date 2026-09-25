import GuideRequest from '../models/GuideRequest.js';
import GuideProfile from '../models/GuideProfile.js';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';

// @desc    Create a new booking request to a guide
// @route   POST /api/requests
// @access  Private (Tourist only)
export const createRequest = async (req, res, next) => {
  try {
    const { guideId, destinationId, date, numberOfPeople, message } = req.body;

    if (!guideId || !destinationId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide guide, destination, and tour date',
      });
    }

    // Verify guide exists
    const guide = await GuideProfile.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'The selected guide profile does not exist',
      });
    }

    // Prevent guide from booking themselves
    if (guide.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book a tour with yourself',
      });
    }

    // Verify destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found in catalog',
      });
    }

    // Create the booking request
    const request = await GuideRequest.create({
      tourist: req.user._id,
      guide: guide._id,
      destination: destination._id,
      date: new Date(date),
      numberOfPeople: numberOfPeople ? Number(numberOfPeople) : 1,
      message: message || '',
      status: 'pending',
    });

    const populated = await GuideRequest.findById(request._id)
      .populate('destination', 'name district image')
      .populate({
        path: 'guide',
        populate: { path: 'user', select: 'name profileImage email phone' },
      });

    res.status(201).json({
      success: true,
      message: 'Guide request submitted successfully. Awaiting guide confirmation.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests made by the logged-in tourist
// @route   GET /api/requests/tourist
// @access  Private (Tourist only)
export const getTouristRequests = async (req, res, next) => {
  try {
    const requests = await GuideRequest.find({ tourist: req.user._id })
      .populate('destination', 'name district image slug')
      .populate({
        path: 'guide',
        select: 'pricePerDay rating experience locationsServed isVerified',
        populate: { path: 'user', select: 'name profileImage phone email' },
      })
      .sort({ createdAt: -1 });

    // Attach whether each request has already been reviewed
    const requestsWithReviewStatus = await Promise.all(
      requests.map(async (reqItem) => {
        const itemObj = reqItem.toObject();
        if (itemObj.status === 'completed') {
          const review = await Review.findOne({ request: itemObj._id });
          itemObj.isReviewed = !!review;
          itemObj.review = review;
        } else {
          itemObj.isReviewed = false;
        }
        return itemObj;
      })
    );

    res.status(200).json({
      success: true,
      count: requestsWithReviewStatus.length,
      data: requestsWithReviewStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests received by the logged-in guide
// @route   GET /api/requests/guide
// @access  Private (Guide only)
export const getGuideRequests = async (req, res, next) => {
  try {
    const guideProfile = await GuideProfile.findOne({ user: req.user._id });

    if (!guideProfile) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found for this user',
      });
    }

    const requests = await GuideRequest.find({ guide: guideProfile._id })
      .populate('tourist', 'name email phone profileImage')
      .populate('destination', 'name district image slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status (accepted, rejected, completed, cancelled)
// @route   PUT /api/requests/:id/status
// @access  Private (Guide or Tourist)
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const request = await GuideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found',
      });
    }

    // Role-based status transition validation
    if (req.user.role === 'guide') {
      const guideProfile = await GuideProfile.findOne({ user: req.user._id });
      if (!guideProfile || request.guide.toString() !== guideProfile._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this guide request',
        });
      }

      // Guide can accept, reject, or complete
      if (!['accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Guides can only set status to accepted, rejected, or completed',
        });
      }
    } else if (req.user.role === 'tourist') {
      if (request.tourist.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to cancel this request',
        });
      }

      // Tourist can only cancel if request is still pending
      if (status !== 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Tourists can only cancel requests',
        });
      }
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Request status updated to '${status}' successfully`,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
