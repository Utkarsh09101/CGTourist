import Destination from '../models/Destination.js';
import GuideProfile from '../models/GuideProfile.js';

// @desc    Get all destinations with optional search and filters
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const { search, category, district } = req.query;

    let query = {};

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by District
    if (district && district !== 'All') {
      query.district = district;
    }

    const destinations = await Destination.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination by slug or ID
// @route   GET /api/destinations/:slugOrId
// @access  Public
export const getDestinationBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    // Check if queried by MongoDB ObjectId or URL slug
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const destination = isObjectId
      ? await Destination.findById(slugOrId)
      : await Destination.findOne({ slug: slugOrId });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found in Chhattisgarh catalog',
      });
    }

    // Find local guides who serve this destination's district
    const localGuides = await GuideProfile.find({
      locationsServed: { $regex: new RegExp(destination.district, 'i') },
      availability: true,
    })
      .populate('user', 'name profileImage email phone')
      .limit(4);

    res.status(200).json({
      success: true,
      data: {
        destination,
        localGuides,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private (Admin only)
export const createDestination = async (req, res, next) => {
  try {
    const { name, description, location, district, image, category, bestTimeToVisit, entryFee, coordinates } = req.body;

    if (!name || !description || !location || !district || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required destination fields',
      });
    }

    // Generate URL friendly slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingDestination = await Destination.findOne({ slug });
    if (existingDestination) {
      return res.status(400).json({
        success: false,
        message: 'A destination with a similar name already exists',
      });
    }

    const destination = await Destination.create({
      name,
      slug,
      description,
      location,
      district,
      image,
      category,
      bestTimeToVisit: bestTimeToVisit || 'October to March',
      entryFee: entryFee !== undefined ? Number(entryFee) : 0,
      coordinates: coordinates || { lat: 21.2787, lng: 81.8661 },
    });

    res.status(201).json({
      success: true,
      message: 'Destination added successfully',
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination details
// @route   PUT /api/destinations/:id
// @access  Private (Admin only)
export const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    // Update fields
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private (Admin only)
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    await destination.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully from catalog',
    });
  } catch (error) {
    next(error);
  }
};
