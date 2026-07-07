const User = require('../models/User');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const ExcelJS = require('exceljs');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.json({ totalUsers, totalRooms, totalBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export users to Excel
// @route   GET /api/admin/users/export/excel
// @access  Admin
const exportUsersToExcel = async (req, res) => {
  try {
    const { role, startDate, endDate } = req.query;

    // Build filter
    let filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Registered Users');

    // Make the header bold
    sheet.getRow(1).font = { bold: true };
    // Freeze the first row
    sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    sheet.columns = [
      { header: 'ID', key: 'id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Registered On', key: 'registered', width: 20 },
    ];

    users.forEach((user) => {
      sheet.addRow({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role,
        registered: user.createdAt.toISOString().split('T')[0],
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=registered-users.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export bookings to Excel
// @route   GET /api/admin/bookings/export/excel
// @access  Admin
const exportBookingsToExcel = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    // Build filter
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('room', 'name')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bookings Report');

    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    sheet.columns = [
      { header: 'Booking #', key: 'bookingNumber', width: 20 },
      { header: 'Guest Name', key: 'guest', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Room', key: 'room', width: 20 },
      { header: 'Check In', key: 'checkIn', width: 15 },
      { header: 'Check Out', key: 'checkOut', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Payment', key: 'paymentStatus', width: 15 },
      { header: 'Total (ETB)', key: 'total', width: 15 },
    ];

    bookings.forEach((b) => {
      sheet.addRow({
        bookingNumber: b.bookingNumber,
        guest: b.name,
        email: b.email,
        room: b.room ? b.room.name : 'N/A',
        checkIn: b.checkIn.toISOString().split('T')[0],
        checkOut: b.checkOut.toISOString().split('T')[0],
        status: b.status.toUpperCase(),
        paymentStatus: b.paymentStatus.toUpperCase(),
        total: b.totalPrice,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=bookings-report.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  exportUsersToExcel,
  exportBookingsToExcel,
};
