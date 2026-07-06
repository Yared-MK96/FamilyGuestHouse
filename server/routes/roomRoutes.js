const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', protect, admin, upload.array('images', 5), createRoom);
router.put('/:id', protect, admin, upload.array('images', 5), updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
