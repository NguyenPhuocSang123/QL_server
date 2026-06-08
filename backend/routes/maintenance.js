const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const maintenanceController = require('../controllers/maintenanceController');

const router = express.Router();

router.get('/', protect, maintenanceController.getAllMaintenance);
router.post('/', protect, authorize('admin', 'technician'), maintenanceController.createMaintenance);
router.put('/:id', protect, authorize('admin', 'technician'), maintenanceController.updateMaintenance);
router.delete('/:id', protect, authorize('admin'), maintenanceController.deleteMaintenance);

module.exports = router;
