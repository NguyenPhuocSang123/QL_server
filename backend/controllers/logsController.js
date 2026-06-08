const Log = require('../models/Log');

/**
 * @desc    Lấy danh sách logs
 * @route   GET /api/logs
 * @access  Private/Admin
 */
exports.getLogs = async (req, res) => {
  try {
    const { type, limit = 100 } = req.query;
    const filter = type ? { type } : {};
    const logs = await Log.find(filter)
      .populate('user', 'fullName email role')
      .sort('-createdAt')
      .limit(Number(limit));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
