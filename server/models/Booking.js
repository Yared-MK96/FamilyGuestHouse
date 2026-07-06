const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    // Guest info (in case user books for someone else)
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },

    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    nights: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'waiting_verification', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending', 'paid'],
      default: 'unpaid',
    },

    bookingNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Generate booking number before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingNumber) {
    const date = new Date(this.checkIn);
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    this.bookingNumber = `FGH-${dateStr}-${this._id.toString().slice(-4).toUpperCase()}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
