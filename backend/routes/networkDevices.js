const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const networkDevicesController = require('../controllers/networkDevicesController');

const router = express.Router();

router.get('/', protect, networkDevicesController.getAllNetworkDevices);
router.post('/', protect, authorize('admin', 'technician'), networkDevicesController.createNetworkDevice);
router.put('/:id', protect, authorize('admin', 'technician'), networkDevicesController.updateNetworkDevice);
router.delete('/:id', protect, authorize('admin'), networkDevicesController.deleteNetworkDevice);

module.exports = router;
