const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const serversController = require('../controllers/serversController');

const router = express.Router();

router.get('/', protect, serversController.getAllServers);
router.get('/:id', protect, serversController.getServerById);
router.post('/', protect, authorize('admin', 'technician'), serversController.createServer);
router.put('/:id', protect, authorize('admin', 'technician'), serversController.updateServer);
router.delete('/:id', protect, authorize('admin'), serversController.deleteServer);

module.exports = router;
