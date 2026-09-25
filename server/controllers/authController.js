import User from '../models/User.js';
import GuideProfile from '../models/GuideProfile.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user (Tourist or Guide)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, profileImage } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Security check: Admin role cannot be self-registered
    let assignedRole = role === 'guide' ? 'guide' : 'tourist';

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Create User record
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      profileImage: profileImage || undefined,
    });

    let guideProfile = null;
    // If registered as a guide, automatically initialize an empty GuideProfile
    if (assignedRole === 'guide') {
      guideProfile = await GuideProfile.create({
        user: user._id,
        locationsServed: ['Raipur'],
        specializations: ['Cultural', 'Historical'],
      });
    }

    // Generate JWT and respond
    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        guideProfileId: guideProfile ? guideProfile._id : null,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user and explicitly select password (which is excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // If guide, fetch their profile ID
    let guideProfileId = null;
    if (user.role === 'guide') {
      const guideProfile = await GuideProfile.findOne({ user: user._id });
      if (guideProfile) {
        guideProfileId = guideProfile._id;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        guideProfileId,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private (Requires token)
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let guideProfile = null;
    if (user.role === 'guide') {
      guideProfile = await GuideProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        guideProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};
