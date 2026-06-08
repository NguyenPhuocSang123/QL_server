const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const equipmentController = require('../controllers/equipmentController');

const router = express.Router();

// Borrow records (specific routes FIRST - must be before /:id)
router.get('/borrow-records', protect, equipmentController.getBorrowRecords);
router.get('/borrow-records/:id', protect, equipmentController.getBorrowRecordById);
router.post('/borrow', protect, equipmentController.borrowEquipment);
router.put('/borrow/:id/return', protect, equipmentController.returnEquipment);

// Equipment CRUD (general routes AFTER specific ones)
router.get('/', protect, equipmentController.getAllEquipment);
router.post('/', protect, authorize('admin', 'technician'), equipmentController.createEquipment);
router.get('/:id', protect, equipmentController.getEquipmentById);
router.put('/:id', protect, authorize('admin', 'technician'), equipmentController.updateEquipment);
router.delete('/:id', protect, authorize('admin'), equipmentController.deleteEquipment);

// Quantity management
router.patch('/:id/quantity', protect, authorize('admin', 'technician'), equipmentController.adjustQuantity);

module.exports = router;
