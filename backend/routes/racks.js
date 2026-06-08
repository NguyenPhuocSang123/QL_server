const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const racksController = require('../controllers/racksController');

const router = express.Router();

router.get('/', protect, racksController.getAllRacks);
router.get('/:id', protect, racksController.getRackById);
router.post('/', protect, authorize('admin', 'technician'), racksController.createRack);
router.put('/:id', protect, authorize('admin', 'technician'), racksController.updateRack);
router.delete('/:id', protect, authorize('admin'), racksController.deleteRack);

module.exports = router;
