const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const incidentsController = require('../controllers/incidentsController');

const router = express.Router();

router.get('/', protect, incidentsController.getAllIncidents);
router.post('/', protect, authorize('admin', 'technician'), incidentsController.createIncident);
router.put('/:id', protect, authorize('admin', 'technician'), incidentsController.updateIncident);
router.delete('/:id', protect, authorize('admin'), incidentsController.deleteIncident);

module.exports = router;
