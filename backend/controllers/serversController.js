const Server = require('../models/Server');
const { logAction } = require('../middleware/logger');

/**
 * @desc    Lấy danh sách server với tìm kiếm
 * @route   GET /api/servers
 * @access  Private
 */
exports.getAllServers = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Lấy chi tiết server
 * @route   GET /api/servers/:id
 * @access  Private
 */
exports.getServerById = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id).populate({
      path: 'rack',
      populate: { path: 'room', select: 'roomName roomCode' },
    });
    if (!server) return res.status(404).json({ message: 'Không tìm thấy server' });
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo server mới
 * @route   POST /api/servers
 * @access  Private/Admin/Technician
 */
exports.createServer = async (req, res) => {
  try {
    const server = await Server.create(req.body);
    await server.populate('rack', 'rackName rackCode');
    await logAction(req.user._id, 'Thêm server', server.serverName);
    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cập nhật server
 * @route   PUT /api/servers/:id
 * @access  Private/Admin/Technician
 */
exports.updateServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('rack', 'rackName rackCode');
    if (!server) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật server', server.serverName);
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Xóa server
 * @route   DELETE /api/servers/:id
 * @access  Private/Admin
 */
exports.deleteServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) return res.status(404).json({ message: 'Không tìm thấy' });
    await server.deleteOne();
    await logAction(req.user._id, 'Xóa server', server.serverName);
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
