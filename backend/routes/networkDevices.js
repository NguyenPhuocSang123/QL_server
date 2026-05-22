const express = require('express');
const NetworkDevice = require('../models/NetworkDevice');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const { type, status } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  const devices = await NetworkDevice.find(filter).populate('room', 'roomName roomCode').sort('deviceCode');
  res.json(devices);
});

router.post('/', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const device = await NetworkDevice.create(req.body);
    await device.populate('room', 'roomName roomCode');
    await logAction(req.user._id, 'Thêm thiết bị mạng', device.deviceName);
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const device = await NetworkDevice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('room', 'roomName roomCode');
    if (!device) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật thiết bị mạng', device.deviceName);
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const device = await NetworkDevice.findById(req.params.id);
  if (!device) return res.status(404).json({ message: 'Không tìm thấy' });
  await device.deleteOne();
  await logAction(req.user._id, 'Xóa thiết bị mạng', device.deviceName);
  res.json({ message: 'Đã xóa' });
});

module.exports = router;
