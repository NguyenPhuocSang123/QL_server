const Maintenance = require('../models/Maintenance');
const { logAction } = require('../middleware/logger');

/**
 * @desc    Lấy danh sách bảo trì
 * @route   GET /api/maintenance
 * @access  Private
 */
exports.getAllMaintenance = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo bảo trì mới
 * @route   POST /api/maintenance
 * @access  Private/Admin/Technician
 */
exports.createMaintenance = async (req, res) => {
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
};

/**
 * @desc    Cập nhật bảo trì
 * @route   PUT /api/maintenance/:id
 * @access  Private/Admin/Technician
 */
exports.updateMaintenance = async (req, res) => {
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
};

/**
 * @desc    Xóa bảo trì
 * @route   DELETE /api/maintenance/:id
 * @access  Private/Admin
 */
exports.deleteMaintenance = async (req, res) => {
  try {
    const item = await Maintenance.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    await item.deleteOne();
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
