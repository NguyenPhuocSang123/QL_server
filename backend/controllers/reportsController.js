const { generateReport } = require('../services/reportAI');
const { exportReportToWord, exportReportToExcel } = require('../services/exportReport');
const ServerRoom = require('../models/ServerRoom');
const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const Incident = require('../models/Incident');
const Log = require('../models/Log');
const Server = require('../models/Server');

/**
 * @desc    Tạo báo cáo hàng ngày
 * @route   GET /api/reports/daily
 * @access  Private/Admin/Technician
 */
exports.getDailyReport = async (req, res) => {
  try {
    const report = await generateReport('daily');
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo báo cáo hàng tuần
 * @route   GET /api/reports/weekly
 * @access  Private/Admin/Technician
 */
exports.getWeeklyReport = async (req, res) => {
  try {
    const report = await generateReport('weekly');
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo báo cáo tuỳ chỉnh theo date range
 * @route   GET /api/reports/custom?startDate=2024-01-01&endDate=2024-01-31
 * @access  Private/Admin/Technician
 */
exports.getCustomReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Vui lòng cung cấp startDate và endDate' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Collect dữ liệu
    const [rooms, equipment, maintenances, incidents, logs, servers] = await Promise.all([
      ServerRoom.find(),
      Equipment.find(),
      Maintenance.find({ createdAt: { $gte: start, $lte: end } }).populate('performedBy', 'fullName'),
      Incident.find({ createdAt: { $gte: start, $lte: end } }).populate('reportedBy', 'fullName'),
      Log.find({ createdAt: { $gte: start, $lte: end } }),
      Server.find(),
    ]);

    const report = {
      period: `${startDate} đến ${endDate}`,
      generatedAt: new Date().toISOString(),
      systemMetrics: calculateSystemMetrics(rooms, equipment, servers),
      tempTrends: calculateTemperatureTrends(rooms),
      equipmentStatus: calculateEquipmentStatus(equipment),
      maintenanceSummary: calculateMaintenanceSummary(maintenances),
      incidentSummary: calculateIncidentSummary(incidents),
      activitySummary: calculateActivitySummary(logs),
      recommendations: generateRecommendations(
        calculateSystemMetrics(rooms, equipment, servers),
        calculateTemperatureTrends(rooms),
        calculateEquipmentStatus(equipment),
        calculateMaintenanceSummary(maintenances),
        calculateIncidentSummary(incidents)
      ),
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Export báo cáo thành PDF (nếu cần)
 * @route   GET /api/reports/export?type=daily&format=pdf
 * @access  Private/Admin
 */
exports.exportReport = async (req, res) => {
  try {
    const { type = 'daily' } = req.query;
    const report = await generateReport(type);

    // Trả về JSON - client có thể convert thành PDF
    res.json({
      success: true,
      report,
      message: 'Báo cáo sẵn sàng để export',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Export báo cáo thành Word (.docx)
 * @route   GET /api/reports/export-word?type=daily
 * @access  Private/Admin/Technician
 */
exports.exportReportToWord = async (req, res) => {
  try {
    const { type = 'daily' } = req.query;
    const report = await generateReport(type);
    const buffer = await exportReportToWord(report);

    const fileName = `BaoCao-${report.period.replace(/\//g, '-')}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Export báo cáo thành Excel (.xlsx)
 * @route   GET /api/reports/export-excel?type=daily
 * @access  Private/Admin/Technician
 */
exports.exportReportToExcel = async (req, res) => {
  try {
    const { type = 'daily' } = req.query;
    const report = await generateReport(type);
    const buffer = await exportReportToExcel(report);

    const fileName = `BaoCao-${report.period.replace(/\//g, '-')}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ HELPERS ============

function calculateSystemMetrics(rooms, equipment, servers) {
  const totalRooms = rooms.length;
  const normalRooms = rooms.filter((r) => r.status === 'normal').length;
  const warningRooms = rooms.filter((r) => r.status === 'warning').length;
  const criticalRooms = rooms.filter((r) => r.status === 'critical').length;

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter((e) => e.availableQuantity > 0).length;
  const damagedEquipment = equipment.filter((e) => e.status === 'damaged').length;

  const totalServers = servers.length;
  const onlineServers = servers.filter((s) => s.status === 'online').length;
  const offlineServers = servers.filter((s) => s.status === 'offline').length;

  const avgTemp =
    totalRooms > 0
      ? (rooms.reduce((sum, r) => sum + (r.temperature || 0), 0) / totalRooms).toFixed(1)
      : 0;
  const avgHumidity =
    totalRooms > 0
      ? (rooms.reduce((sum, r) => sum + (r.humidity || 0), 0) / totalRooms).toFixed(1)
      : 0;

  return {
    rooms: { total: totalRooms, normal: normalRooms, warning: warningRooms, critical: criticalRooms },
    equipment: { total: totalEquipment, available: availableEquipment, damaged: damagedEquipment },
    servers: { total: totalServers, online: onlineServers, offline: offlineServers },
    environment: { avgTemp: parseFloat(avgTemp), avgHumidity: parseFloat(avgHumidity) },
    healthScore: calculateHealthScore(normalRooms, totalRooms, onlineServers, totalServers),
  };
}

function calculateHealthScore(normalRooms, totalRooms, onlineServers, totalServers) {
  if (totalRooms === 0 || totalServers === 0) return 100;
  const roomHealth = (normalRooms / totalRooms) * 100;
  const serverHealth = (onlineServers / totalServers) * 100;
  return Math.round((roomHealth + serverHealth) / 2);
}

function calculateTemperatureTrends(rooms) {
  const temps = rooms.map((r) => r.temperature || 25).sort((a, b) => a - b);
  const humidities = rooms.map((r) => r.humidity || 50).sort((a, b) => a - b);

  return {
    temperature: {
      min: temps[0],
      max: temps[temps.length - 1],
      avg: (temps.reduce((a, b) => a + b) / temps.length).toFixed(1),
      median: temps[Math.floor(temps.length / 2)],
    },
    humidity: {
      min: humidities[0],
      max: humidities[humidities.length - 1],
      avg: (humidities.reduce((a, b) => a + b) / humidities.length).toFixed(1),
      median: humidities[Math.floor(humidities.length / 2)],
    },
    roomsAbove26: rooms.filter((r) => r.temperature > 26).length,
    roomsBelow18: rooms.filter((r) => r.temperature < 18).length,
  };
}

function calculateEquipmentStatus(equipment) {
  const byCategory = {};
  equipment.forEach((e) => {
    if (!byCategory[e.category]) {
      byCategory[e.category] = {
        total: 0,
        available: 0,
        borrowed: 0,
        damaged: 0,
      };
    }
    byCategory[e.category].total++;
    if (e.availableQuantity > 0) byCategory[e.category].available++;
    if (e.borrowedQuantity > 0) byCategory[e.category].borrowed++;
    if (e.status === 'damaged') byCategory[e.category].damaged++;
  });

  return {
    byCategory,
    utilizationRate: equipment.length > 0
      ? Math.round(
          ((equipment.reduce((sum, e) => sum + (e.quantity - e.availableQuantity), 0) /
            equipment.reduce((sum, e) => sum + e.quantity, 0)) *
            100)
        )
      : 0,
  };
}

function calculateMaintenanceSummary(maintenances) {
  const completed = maintenances.filter((m) => m.status === 'completed').length;
  const scheduled = maintenances.filter((m) => m.status === 'scheduled').length;
  const inProgress = maintenances.filter((m) => m.status === 'in_progress').length;
  const cancelled = maintenances.filter((m) => m.status === 'cancelled').length;
  const totalCost = maintenances.reduce((sum, m) => sum + (m.cost || 0), 0);

  return {
    total: maintenances.length,
    completed,
    scheduled,
    inProgress,
    cancelled,
    totalCost,
    avgCost: maintenances.length > 0 ? Math.round(totalCost / maintenances.length) : 0,
  };
}

function calculateIncidentSummary(incidents) {
  const resolved = incidents.filter((i) => i.status === 'resolved').length;
  const inProgress = incidents.filter((i) => i.status === 'in_progress').length;
  const pending = incidents.filter((i) => i.status === 'pending').length;

  const bySeverity = {
    low: incidents.filter((i) => i.severity === 'low').length,
    medium: incidents.filter((i) => i.severity === 'medium').length,
    high: incidents.filter((i) => i.severity === 'high').length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
  };

  const resolvedIncidents = incidents.filter((i) => i.resolvedAt && i.createdAt);
  const avgResolutionTime =
    resolvedIncidents.length > 0
      ? Math.round(
          resolvedIncidents.reduce((sum, i) => sum + (i.resolvedAt - i.createdAt) / 60000, 0) /
            resolvedIncidents.length
        )
      : 0;

  return {
    total: incidents.length,
    resolved,
    inProgress,
    pending,
    bySeverity,
    avgResolutionTimeMinutes: avgResolutionTime,
  };
}

function calculateActivitySummary(logs) {
  const byType = {
    login: logs.filter((l) => l.type === 'login').length,
    operation: logs.filter((l) => l.type === 'operation').length,
    error: logs.filter((l) => l.type === 'error').length,
    system: logs.filter((l) => l.type === 'system').length,
  };

  return {
    totalActions: logs.length,
    byType,
  };
}

function generateRecommendations(systemMetrics, tempTrends, equipmentStatus, maintenanceSummary, incidentSummary) {
  const recommendations = [];

  if (systemMetrics.rooms.critical > 0) {
    recommendations.push({
      priority: 'critical',
      title: 'Có phòng máy ở trạng thái nguy hiểm',
      description: `${systemMetrics.rooms.critical} phòng đang gặp vấn đề nghiêm trọng.`,
      action: 'Kiểm tra các phòng máy ngay lập tức',
    });
  }

  if (tempTrends.roomsAbove26 > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Nhiệt độ phòng máy cao',
      description: `${tempTrends.roomsAbove26} phòng có nhiệt độ trên 26°C.`,
      action: 'Tối ưu hóa hệ thống làm mát',
    });
  }

  if (systemMetrics.equipment.damaged > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Có thiết bị bị hỏng',
      description: `${systemMetrics.equipment.damaged} thiết bị đang trong trạng thái hỏng.`,
      action: 'Liên hệ bộ phận bảo trì để sửa chữa',
    });
  }

  if (systemMetrics.servers.offline > 0) {
    recommendations.push({
      priority: 'high',
      title: `${systemMetrics.servers.offline} server đang offline`,
      description: 'Một số server không hoạt động.',
      action: 'Restart hoặc kiểm tra kết nối server',
    });
  }

  if (incidentSummary.bySeverity.critical > 0) {
    recommendations.push({
      priority: 'critical',
      title: 'Có incidents cấp độ cao chưa xử lý',
      description: `${incidentSummary.bySeverity.critical} incident cấp độ cao cần xử lý.`,
      action: 'Ưu tiên xử lý các incident này',
    });
  }

  if (maintenanceSummary.totalCost > 1000000) {
    recommendations.push({
      priority: 'medium',
      title: 'Chi phí bảo trì cao',
      description: `Chi phí bảo trì tích lũy: ${maintenanceSummary.totalCost.toLocaleString()}đ.`,
      action: 'Lập kế hoạch nâng cấp thiết bị',
    });
  }

  if (tempTrends.humidity.max > 70) {
    recommendations.push({
      priority: 'medium',
      title: 'Độ ẩm vượt ngưỡng',
      description: 'Độ ẩm vượt 70%. Có thể gây mưa điện.',
      action: 'Kiểm tra hệ thống hút ẩm',
    });
  }

  if (systemMetrics.healthScore < 70) {
    recommendations.push({
      priority: 'medium',
      title: `Sức khỏe hệ thống: ${systemMetrics.healthScore}%`,
      description: 'Hệ thống cần chú ý bảo trì và kiểm tra.',
      action: 'Thực hiện kiểm tra toàn bộ hệ thống',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'info',
      title: 'Hệ thống hoạt động tốt',
      description: 'Tất cả các chỉ số đều trong ngưỡng bình thường.',
      action: 'Tiếp tục theo dõi',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityMap = { critical: 0, high: 1, medium: 2, info: 3 };
    return priorityMap[a.priority] - priorityMap[b.priority];
  });
}
