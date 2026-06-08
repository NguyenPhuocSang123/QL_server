const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const reportsController = require('../controllers/reportsController');

const router = express.Router();

// Tất cả báo cáo yêu cầu admin hoặc technician
router.get('/daily', protect, authorize('admin', 'technician'), reportsController.getDailyReport);
router.get('/weekly', protect, authorize('admin', 'technician'), reportsController.getWeeklyReport);
router.get('/custom', protect, authorize('admin', 'technician'), reportsController.getCustomReport);
router.get('/export', protect, authorize('admin', 'technician'), reportsController.exportReport);
router.get('/export-word', protect, authorize('admin', 'technician'), reportsController.exportReportToWord);
router.get('/export-excel', protect, authorize('admin', 'technician'), reportsController.exportReportToExcel);

module.exports = router;
