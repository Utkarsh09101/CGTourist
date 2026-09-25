import mongoose from 'mongoose';

const guideRequestSchema = new mongoose.Schema(
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
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide the tour date'],
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: [1, 'Number of tourists must be at least 1'],
      default: 1,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

guideRequestSchema.index({ tourist: 1, guide: 1, status: 1 });

const GuideRequest = mongoose.model('GuideRequest', guideRequestSchema);
export default GuideRequest;
