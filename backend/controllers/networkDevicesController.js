const NetworkDevice = require('../models/NetworkDevice');
const { logAction } = require('../middleware/logger');

/**
 * @desc    Lấy danh sách thiết bị mạng
 * @route   GET /api/network-devices
 * @access  Private
 */
exports.getAllNetworkDevices = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    const devices = await NetworkDevice.find(filter).populate('room', 'roomName roomCode').sort('deviceCode');
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo thiết bị mạng mới
 * @route   POST /api/network-devices
 * @access  Private/Admin/Technician
 */
exports.createNetworkDevice = async (req, res) => {
  try {
    const device = await NetworkDevice.create(req.body);
    await device.populate('room', 'roomName roomCode');
    await logAction(req.user._id, 'Thêm thiết bị mạng', device.deviceName);
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cập nhật thiết bị mạng
 * @route   PUT /api/network-devices/:id
 * @access  Private/Admin/Technician
 */
exports.updateNetworkDevice = async (req, res) => {
  try {
    const device = await NetworkDevice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('room', 'roomName roomCode');
    if (!device) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật thiết bị mạng', device.deviceName);
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Xóa thiết bị mạng
 * @route   DELETE /api/network-devices/:id
 * @access  Private/Admin
 */
exports.deleteNetworkDevice = async (req, res) => {
  try {
    const device = await NetworkDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy' });
    await device.deleteOne();
    await logAction(req.user._id, 'Xóa thiết bị mạng', device.deviceName);
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
