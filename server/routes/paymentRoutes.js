const express = require('express');
const {
  submitManualPayment,
  verifyPayment,
  getPendingPayments,
  getAllPayments
} = require('../controllers/paymentController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

const router = express.Router();

// ── Authenticated User Routes ────────────────────────────────────────────────
// Submit manual payment verification with a screenshot
router.post('/manual', protect, upload.single('screenshot'), submitManualPayment);

// ── Admin Routes ─────────────────────────────────────────────────────────────
// Get all pending manual verifications
router.get('/pending', protect, admin, getPendingPayments);

// Verify (approve/reject) a manual payment
router.put('/:id/verify', protect, admin, verifyPayment);

// Get all payments history
router.get('/', protect, admin, getAllPayments);

module.exports = router;
