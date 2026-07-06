const Payment = require('../models/Payment');

// @desc    Initialize payment
// @route   POST /api/payments/initialize
// @access  Private
const initializePayment = async (req, res) => {
  try {
    // TODO: Integrate with payment gateway (e.g., Chapa, Stripe)
    const { bookingId, amount } = req.body;

    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount,
      status: 'pending',
    });

    res.status(201).json({ payment, checkoutUrl: '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify/:txRef
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ txRef: req.params.txRef });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('user booking');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { initializePayment, verifyPayment, getAllPayments };
