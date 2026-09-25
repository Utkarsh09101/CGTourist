import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide destination name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    location: {
      type: String,
      required: [true, 'Please provide location details'],
    },
    district: {
      type: String,
      required: [true, 'Please provide district in Chhattisgarh'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    category: {
      type: String,
      enum: ['Waterfall', 'Wildlife', 'Historical', 'Religious', 'Adventure', 'Nature', 'Cultural'],
      required: [true, 'Please specify category'],
    },
    bestTimeToVisit: {
      type: String,
      default: 'October to March',
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    coordinates: {
      lat: { type: Number, default: 21.2787 },
      lng: { type: Number, default: 81.8661 },
    },
  },
  {
    timestamps: true,
  }
);

destinationSchema.index({ district: 1, category: 1 });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
