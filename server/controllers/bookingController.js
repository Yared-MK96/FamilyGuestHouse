const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { sendBookingConfirmation, sendBookingCancellation } = require('../services/email.service.js');

// ─── Helper: calculate nights ───────────────────────────────────────────────
const calcNights = (checkIn, checkOut) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(checkOut) - new Date(checkIn)) / msPerDay);
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, name, email, phone } = req.body;

    // 1. Validate room exists and is available
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.isAvailable) return res.status(400).json({ message: "Room is not available" });

    // 2. Check for conflicting confirmed bookings
    const conflict = await Booking.findOne({
      room: roomId,
      status: { $in: ["pending", "waiting_verification", "confirmed"] },
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
    });
    if (conflict) {
      return res.status(409).json({ message: "Room is already booked for these dates" });
    }

    // 3. Calculate price
    const nights = calcNights(checkIn, checkOut);
    const totalPrice = nights * room.pricePerNight;

    // 4. Create booking
    const booking = await Booking.create({
      user: req.user._id || req.user.id,
      room: roomId,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await booking.populate("room", "name type images pricePerNight");

    res.status(201).json({
      message: "Booking created — please submit manual payment verification",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id || req.user.id })
      .populate('room', 'name type images')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('room', 'name type')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Admin
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const booking = await Booking.findOne({ _id: req.params.id, user: userId }).populate('room');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "Paid bookings cannot be cancelled here. Please contact support." });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Send cancellation email
    await sendBookingCancellation({
      name: req.user.name,
      email: req.user.email,
      room: booking.room?.name || booking.room,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    });

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking };
