const Rack = require('../models/Rack');
const { logAction } = require('../middleware/logger');

/**
 * @desc    Lấy danh sách rack
 * @route   GET /api/racks
 * @access  Private
 */
exports.getAllRacks = async (req, res) => {
  try {
    const filter = req.query.room ? { room: req.query.room } : {};
    const racks = await Rack.find(filter).populate('room', 'roomName roomCode').sort('rackCode');
    res.json(racks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Lấy chi tiết rack
 * @route   GET /api/racks/:id
 * @access  Private
 */
exports.getRackById = async (req, res) => {
  try {
    const Server = require('../models/Server');
    const rack = await Rack.findById(req.params.id).populate('room', 'roomName roomCode');
    if (!rack) return res.status(404).json({ message: 'Không tìm thấy rack' });
    const servers = await Server.find({ rack: rack._id });
    res.json({ rack, servers, deviceCount: servers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo rack mới
 * @route   POST /api/racks
 * @access  Private/Admin/Technician
 */
exports.createRack = async (req, res) => {
  try {
    const rack = await Rack.create(req.body);
    await rack.populate('room', 'roomName roomCode');
    await logAction(req.user._id, 'Thêm rack', rack.rackName);
    res.status(201).json(rack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cập nhật rack
 * @route   PUT /api/racks/:id
 * @access  Private/Admin/Technician
 */
exports.updateRack = async (req, res) => {
  try {
    const rack = await Rack.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('room', 'roomName roomCode');
    if (!rack) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật rack', rack.rackName);
    res.json(rack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Xóa rack
 * @route   DELETE /api/racks/:id
 * @access  Private/Admin
 */
exports.deleteRack = async (req, res) => {
  try {
    const rack = await Rack.findById(req.params.id);
    if (!rack) return res.status(404).json({ message: 'Không tìm thấy' });
    await rack.deleteOne();
    await logAction(req.user._id, 'Xóa rack', rack.rackName);
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
