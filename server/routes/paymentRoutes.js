const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment, getAllPayments } = require('../controllers/paymentController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/initialize', protect, initializePayment);
router.get('/verify/:txRef', protect, verifyPayment);
router.get('/', protect, admin, getAllPayments);

module.exports = router;
