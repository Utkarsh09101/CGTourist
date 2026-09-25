import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GuideProfile',
      required: true,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GuideRequest',
      required: true,
      unique: true, // Guarantees a tourist can review a specific request only once
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please write your review feedback'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
