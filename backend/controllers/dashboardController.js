const Server = require('../models/Server');
const ServerRoom = require('../models/ServerRoom');
const Incident = require('../models/Incident');
const Maintenance = require('../models/Maintenance');
const NetworkDevice = require('../models/NetworkDevice');
const Rack = require('../models/Rack');

/**
 * @desc    Lấy thống kê dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalServers,
      onlineServers,
      offlineServers,
      maintenanceServers,
      totalRooms,
      totalRacks,
      totalNetworkDevices,
      pendingIncidents,
      inProgressIncidents,
      scheduledMaintenance,
      rooms,
      recentIncidents,
    ] = await Promise.all([
      Server.countDocuments(),
      Server.countDocuments({ status: 'online' }),
      Server.countDocuments({ status: 'offline' }),
      Server.countDocuments({ status: 'maintenance' }),
      ServerRoom.countDocuments(),
      Rack.countDocuments(),
      NetworkDevice.countDocuments(),
      Incident.countDocuments({ status: 'pending' }),
      Incident.countDocuments({ status: 'in_progress' }),
      Maintenance.countDocuments({ status: 'scheduled' }),
      ServerRoom.find().select('roomName roomCode temperature humidity status acStatus'),
      Incident.find({ status: { $ne: 'resolved' } })
        .populate('server', 'serverName')
        .sort('-createdAt')
        .limit(5),
    ]);

    const alerts = [];
    rooms.forEach((r) => {
      if (r.temperature > 30) alerts.push({ type: 'temperature', room: r.roomName, value: r.temperature, message: `Nhiệt độ cao: ${r.temperature}°C` });
      if (r.humidity > 70) alerts.push({ type: 'humidity', room: r.roomName, value: r.humidity, message: `Độ ẩm cao: ${r.humidity}%` });
      if (r.status === 'critical') alerts.push({ type: 'room', room: r.roomName, message: 'Phòng ở trạng thái nguy hiểm' });
    });

    res.json({
      servers: { total: totalServers, online: onlineServers, offline: offlineServers, maintenance: maintenanceServers },
      rooms: { total: totalRooms, list: rooms },
      racks: totalRacks,
      networkDevices: totalNetworkDevices,
      incidents: { pending: pendingIncidents, inProgress: inProgressIncidents },
      maintenance: { scheduled: scheduledMaintenance },
      alerts,
      recentIncidents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Lấy báo cáo chi tiết
 * @route   GET /api/dashboard/report
 * @access  Private
 */
exports.getDetailedReport = async (req, res) => {
  try {
    const serversByStatus = await Server.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const incidentsBySeverity = await Incident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);
    const incidentsByStatus = await Incident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const devicesByType = await NetworkDevice.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const maintenanceCost = await Maintenance.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$cost' } } },
    ]);

    res.json({
      serversByStatus,
      incidentsBySeverity,
      incidentsByStatus,
      devicesByType,
      totalMaintenanceCost: maintenanceCost[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
