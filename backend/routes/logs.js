const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const logsController = require('../controllers/logsController');

const router = express.Router();

router.get('/', protect, authorize('admin'), logsController.getLogs);

module.exports = router;
