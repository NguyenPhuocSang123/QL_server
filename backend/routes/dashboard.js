const express = require('express');
const { protect } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', protect, dashboardController.getDashboardStats);
router.get('/report', protect, dashboardController.getDetailedReport);

module.exports = router;
