const express = require('express');
const Incident = require('../models/Incident');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const router = express.Router();

router.get('/', protect, async (req, res) => {
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
});

router.post('/', protect, authorize('admin', 'technician'), async (req, res) => {
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
});

router.put('/:id', protect, authorize('admin', 'technician'), async (req, res) => {
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
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const incident = await Incident.findById(req.params.id);
  if (!incident) return res.status(404).json({ message: 'Không tìm thấy' });
  await incident.deleteOne();
  res.json({ message: 'Đã xóa' });
});

module.exports = router;
