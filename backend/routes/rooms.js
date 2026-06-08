const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const roomsController = require('../controllers/roomsController');

const router = express.Router();

// Sensor endpoints
router.get('/sensor/status', protect, roomsController.getSensorStatus);
router.post('/sensor/sync', protect, authorize('admin', 'technician'), roomsController.syncSensors);
router.post('/:id/sensor-reading', roomsController.applySensorReading);

// Room CRUD
router.get('/', protect, roomsController.getAllRooms);
router.get('/:id', protect, roomsController.getRoomById);
router.post('/', protect, authorize('admin', 'technician'), roomsController.createRoom);
router.put('/:id', protect, authorize('admin', 'technician'), roomsController.updateRoom);
router.delete('/:id', protect, authorize('admin'), roomsController.deleteRoom);

module.exports = router;
