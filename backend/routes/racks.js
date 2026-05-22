const express = require('express');
const Rack = require('../models/Rack');
const Server = require('../models/Server');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = req.query.room ? { room: req.query.room } : {};
  const racks = await Rack.find(filter).populate('room', 'roomName roomCode').sort('rackCode');
  res.json(racks);
});

router.get('/:id', protect, async (req, res) => {
  const rack = await Rack.findById(req.params.id).populate('room', 'roomName roomCode');
  if (!rack) return res.status(404).json({ message: 'Không tìm thấy rack' });
  const servers = await Server.find({ rack: rack._id });
  res.json({ rack, servers, deviceCount: servers.length });
});

router.post('/', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const rack = await Rack.create(req.body);
    await rack.populate('room', 'roomName roomCode');
    await logAction(req.user._id, 'Thêm rack', rack.rackName);
    res.status(201).json(rack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const rack = await Rack.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('room', 'roomName roomCode');
    if (!rack) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật rack', rack.rackName);
    res.json(rack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const rack = await Rack.findById(req.params.id);
  if (!rack) return res.status(404).json({ message: 'Không tìm thấy' });
  await rack.deleteOne();
  await logAction(req.user._id, 'Xóa rack', rack.rackName);
  res.json({ message: 'Đã xóa' });
});

module.exports = router;
