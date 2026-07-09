const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendBookingConfirmation, sendPaymentReceipt } = require('../services/email.service.js');

// @desc    Submit manual payment verification
// @route   POST /api/payments/manual
// @access  Private
const submitManualPayment = async (req, res) => {
  try {
    const { bookingId, method, transactionId, amount } = req.body;
    
    // 1. Verify booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const userId = req.user._id || req.user.id;
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    if (booking.status === 'confirmed' || booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking is already paid and confirmed' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is cancelled' });
    }

    // 2. Handle file upload (if any)
    const screenshot = req.file ? `/uploads/${req.file.filename}` : null;

    // 3. Create payment record
    const payment = await Payment.create({
      booking: booking._id,
      user: userId,
      method,
      transactionId,
      amount,
      screenshot,
      status: 'pending',
    });

    // 4. Update booking status
    booking.status = 'waiting_verification';
    booking.paymentStatus = 'pending';
    await booking.save();

    res.status(201).json({
      message: 'Payment verification submitted. An admin will review it shortly.',
      payment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify/Approve a manual payment
// @route   PUT /api/payments/:id/verify
// @access  Admin
const verifyPayment = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const payment = await Payment.findById(req.params.id).populate('booking').populate('user');
    
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'pending') return res.status(400).json({ message: `Payment is already ${payment.status}` });

    const adminId = req.user._id || req.user.id;

    if (action === 'approve') {
      // 1. Update Payment
      payment.status = 'approved';
      payment.verifiedAt = new Date();
      payment.verifiedBy = adminId;
      await payment.save();

      // 2. Update Booking
      const booking = payment.booking;
      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
      await booking.save();

      await booking.populate('room', 'name type');

      // 3. Send Emails
      await sendBookingConfirmation({
        name: payment.user.name,
        email: payment.user.email,
        room: booking.room.name,
        checkIn: booking.checkIn.toDateString(),
        checkOut: booking.checkOut.toDateString(),
        guests: booking.guests,
        total: booking.totalPrice,
      });

      await sendPaymentReceipt({
        name: payment.user.name,
        email: payment.user.email,
        txRef: payment.transactionId,
        amount: payment.amount,
        date: payment.verifiedAt.toDateString(),
      });

      return res.json({ message: 'Payment approved and booking confirmed.', payment });

    } else if (action === 'reject') {
      payment.status = 'rejected';
      payment.verifiedAt = new Date();
      payment.verifiedBy = adminId;
      await payment.save();

      const booking = payment.booking;
      booking.status = 'pending';
      booking.paymentStatus = 'unpaid';
      await booking.save();

      return res.json({ message: 'Payment rejected. Booking reverted to pending.', payment });
    } else {
      return res.status(400).json({ message: 'Invalid action. Use approve or reject.' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending payments
// @route   GET /api/payments/pending
// @access  Admin
const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('booking', 'bookingNumber totalPrice status checkIn checkOut')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('user', 'name email')
      .populate('booking', 'bookingNumber totalPrice status checkIn checkOut')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitManualPayment, verifyPayment, getPendingPayments, getAllPayments };
