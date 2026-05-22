const express = require('express');
const Maintenance = require('../models/Maintenance');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const { status, server } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (server) filter.server = server;
  const items = await Maintenance.find(filter)
    .populate('server', 'serverName serverCode')
    .populate('networkDevice', 'deviceName deviceCode')
    .populate('performedBy', 'fullName email')
    .sort('-scheduledDate');
  res.json(items);
});

router.post('/', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const data = { ...req.body, performedBy: req.user._id };
    const item = await Maintenance.create(data);
    await item.populate([
      { path: 'server', select: 'serverName serverCode' },
      { path: 'performedBy', select: 'fullName' },
    ]);
    await logAction(req.user._id, 'Tạo lịch bảo trì', item.content);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('server', 'serverName serverCode')
      .populate('performedBy', 'fullName email');
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật bảo trì', item.content);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const item = await Maintenance.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
  await item.deleteOne();
  res.json({ message: 'Đã xóa' });
});

module.exports = router;
