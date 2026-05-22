const express = require('express');
const Server = require('../models/Server');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const { search, status, rack } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (rack) filter.rack = rack;
  if (search) {
    filter.$or = [
      { serverName: { $regex: search, $options: 'i' } },
      { serverCode: { $regex: search, $options: 'i' } },
      { ipAddress: { $regex: search, $options: 'i' } },
    ];
  }
  const servers = await Server.find(filter).populate('rack', 'rackName rackCode').sort('serverCode');
  res.json(servers);
});

router.get('/:id', protect, async (req, res) => {
  const server = await Server.findById(req.params.id).populate({
    path: 'rack',
    populate: { path: 'room', select: 'roomName roomCode' },
  });
  if (!server) return res.status(404).json({ message: 'Không tìm thấy server' });
  res.json(server);
});

router.post('/', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const server = await Server.create(req.body);
    await server.populate('rack', 'rackName rackCode');
    await logAction(req.user._id, 'Thêm server', server.serverName);
    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('rack', 'rackName rackCode');
    if (!server) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật server', server.serverName);
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const server = await Server.findById(req.params.id);
  if (!server) return res.status(404).json({ message: 'Không tìm thấy' });
  await server.deleteOne();
  await logAction(req.user._id, 'Xóa server', server.serverName);
  res.json({ message: 'Đã xóa' });
});

module.exports = router;
