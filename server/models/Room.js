const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: ['standard', 'deluxe', 'suite', 'family'],
      default: 'standard',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      default: 2,
    },
    images: [String],
    amenities: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
