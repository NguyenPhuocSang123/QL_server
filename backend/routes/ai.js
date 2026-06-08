const express = require('express');
const { protect } = require('../middleware/auth');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.get('/temperature-alerts', protect, aiController.getTemperatureAlerts);
router.post('/chat', protect, aiController.chatWithAI);
router.get('/status', protect, aiController.getAIStatus);

module.exports = router;
