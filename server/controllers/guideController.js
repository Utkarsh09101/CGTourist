import GuideProfile from '../models/GuideProfile.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// @desc    Get all guides with search, filtering, and sorting
// @route   GET /api/guides
// @access  Public
export const getGuides = async (req, res, next) => {
  try {
    const {
      search,
      location,
      language,
      specialization,
      minRating,
      maxPrice,
      sort,
    } = req.query;

    let profileQuery = {};

    // Filter by Location / District served
    if (location && location !== 'All') {
      profileQuery.locationsServed = { $regex: new RegExp(location, 'i') };
    }

    // Filter by Language
    if (language && language !== 'All') {
      profileQuery.languages = { $regex: new RegExp(language, 'i') };
    }

    // Filter by Specialization
    if (specialization && specialization !== 'All') {
      profileQuery.specializations = { $regex: new RegExp(specialization, 'i') };
    }

    // Filter by Minimum Rating
    if (minRating) {
      profileQuery.rating = { $gte: Number(minRating) };
    }

    // Filter by Maximum Price per Day
    if (maxPrice) {
      profileQuery.pricePerDay = { $lte: Number(maxPrice) };
    }

    // Sorting definition
    let sortOptions = { rating: -1, reviewCount: -1 }; // default: highest rated
    if (sort === 'priceAsc') sortOptions = { pricePerDay: 1 };
    else if (sort === 'priceDesc') sortOptions = { pricePerDay: -1 };
    else if (sort === 'experience') sortOptions = { experience: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };

    // Query GuideProfile with user populated
    let guides = await GuideProfile.find(profileQuery)
      .populate('user', 'name email phone profileImage')
      .sort(sortOptions);

    // If search term provided, filter guides by their user name or bio
    if (search) {
      const term = search.toLowerCase();
      guides = guides.filter(
        (g) =>
          g.user?.name?.toLowerCase().includes(term) ||
          g.bio?.toLowerCase().includes(term) ||
          g.locationsServed?.some((loc) => loc.toLowerCase().includes(term)) ||
          g.specializations?.some((s) => s.toLowerCase().includes(term))
      );
    }

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single guide by ID with reviews
// @route   GET /api/guides/:id
// @access  Public
export const getGuideById = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findById(req.params.id).populate(
      'user',
      'name email phone profileImage createdAt'
    );

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found',
      });
    }

    // Fetch all verified tourist reviews for this guide
    const reviews = await Review.find({ guide: guide._id })
      .populate('tourist', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        guide,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged-in guide's profile
// @route   GET /api/guides/me/profile
// @access  Private (Guide only)
export const getMyGuideProfile = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone profileImage'
    );

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'No guide profile found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: guide,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update currently logged-in guide's profile
// @route   PUT /api/guides/profile
// @access  Private (Guide only)
export const updateMyGuideProfile = async (req, res, next) => {
  try {
    let guide = await GuideProfile.findOne({ user: req.user._id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found',
      });
    }

    const {
      bio,
      experience,
      languages,
      locationsServed,
      specializations,
      pricePerDay,
      availability,
    } = req.body;

    if (bio !== undefined) guide.bio = bio;
    if (experience !== undefined) guide.experience = Number(experience);
    if (languages !== undefined) guide.languages = Array.isArray(languages) ? languages : languages.split(',').map((s) => s.trim());
    if (locationsServed !== undefined) guide.locationsServed = Array.isArray(locationsServed) ? locationsServed : locationsServed.split(',').map((s) => s.trim());
    if (specializations !== undefined) guide.specializations = Array.isArray(specializations) ? specializations : specializations.split(',').map((s) => s.trim());
    if (pricePerDay !== undefined) guide.pricePerDay = Number(pricePerDay);
    if (availability !== undefined) guide.availability = Boolean(availability);

    const updatedGuide = await guide.save();

    res.status(200).json({
      success: true,
      message: 'Guide profile updated successfully',
      data: updatedGuide,
    });
  } catch (error) {
    next(error);
  }
};
