const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const workshopController = require('../controllers/workshopController');

const router = express.Router();

// Workshop routes
router.get('/workshops', protect, workshopController.getAllWorkshops);
router.get('/workshops/:id', protect, workshopController.getWorkshopById);
router.post('/workshops', protect, authorize('admin', 'technician'), workshopController.createWorkshop);
router.put('/workshops/:id', protect, authorize('admin', 'technician'), workshopController.updateWorkshop);
router.delete('/workshops/:id', protect, authorize('admin'), workshopController.deleteWorkshop);

// Production Line routes
router.get('/workshops/:workshopId/lines', protect, workshopController.getProductionLinesForWorkshop);
router.get('/production-lines', protect, workshopController.getAllProductionLines);
router.post('/production-lines', protect, authorize('admin', 'technician'), workshopController.createProductionLine);
router.put('/production-lines/:id', protect, authorize('admin', 'technician'), workshopController.updateProductionLine);
router.delete('/production-lines/:id', protect, authorize('admin'), workshopController.deleteProductionLine);

module.exports = router;
