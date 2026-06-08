const Incident = require('../models/Incident');
const { logAction } = require('../middleware/logger');

/**
 * @desc    Lấy danh sách sự cố
 * @route   GET /api/incidents
 * @access  Private
 */
exports.getAllIncidents = async (req, res) => {
  try {
    const { status, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const incidents = await Incident.find(filter)
      .populate('server', 'serverName serverCode ipAddress')
      .populate('reportedBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort('-createdAt');
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo sự cố mới
 * @route   POST /api/incidents
 * @access  Private/Admin/Technician
 */
exports.createIncident = async (req, res) => {
  try {
    const data = { ...req.body, reportedBy: req.user._id };
    const incident = await Incident.create(data);
    await incident.populate([
      { path: 'server', select: 'serverName serverCode' },
      { path: 'reportedBy', select: 'fullName' },
    ]);
    await logAction(req.user._id, 'Báo sự cố', incident.title);
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cập nhật sự cố
 * @route   PUT /api/incidents/:id
 * @access  Private/Admin/Technician
 */
exports.updateIncident = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.status === 'resolved' && !updates.resolvedAt) {
      updates.resolvedAt = new Date();
    }
    const incident = await Incident.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('server', 'serverName serverCode')
      .populate('reportedBy', 'fullName')
      .populate('assignedTo', 'fullName');
    if (!incident) return res.status(404).json({ message: 'Không tìm thấy' });
    await logAction(req.user._id, 'Cập nhật sự cố', incident.title);
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Xóa sự cố
 * @route   DELETE /api/incidents/:id
 * @access  Private/Admin
 */
exports.deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Không tìm thấy' });
    await incident.deleteOne();
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
