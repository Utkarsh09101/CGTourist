import mongoose from 'mongoose';

const guideProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: 'Passionate local guide dedicated to showing the true cultural and natural beauty of Chhattisgarh.',
      trim: true,
    },
    experience: {
      type: Number,
      default: 1, // in years
      min: [0, 'Experience cannot be negative'],
    },
    languages: {
      type: [String],
      default: ['Hindi', 'Chhattisgarhi'],
    },
    locationsServed: {
      type: [String],
      default: ['Raipur'],
    },
    specializations: {
      type: [String],
      default: ['Historical', 'Cultural'],
    },
    pricePerDay: {
      type: Number,
      default: 1500, // INR per day
      min: [100, 'Price per day must be at least ₹100'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for fast filtering by rating and price
guideProfileSchema.index({ rating: -1, pricePerDay: 1 });
guideProfileSchema.index({ locationsServed: 1 });

const GuideProfile = mongoose.model('GuideProfile', guideProfileSchema);
export default GuideProfile;
