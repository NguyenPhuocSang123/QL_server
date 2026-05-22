const express = require('express');
const Log = require('../models/Log');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), async (req, res) => {
  const { type, limit = 100 } = req.query;
  const filter = type ? { type } : {};
  const logs = await Log.find(filter)
    .populate('user', 'fullName email role')
    .sort('-createdAt')
    .limit(Number(limit));
  res.json(logs);
});

module.exports = router;
