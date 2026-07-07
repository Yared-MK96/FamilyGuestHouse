const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  exportUsersToExcel,
  exportBookingsToExcel
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Excel Export Routes
router.get('/users/export/excel', exportUsersToExcel);
router.get('/bookings/export/excel', exportBookingsToExcel);

module.exports = router;
