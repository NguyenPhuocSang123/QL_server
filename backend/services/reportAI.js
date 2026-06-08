const ServerRoom = require('../models/ServerRoom');
const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const Incident = require('../models/Incident');
const Log = require('../models/Log');
const Server = require('../models/Server');

/**
 * Tạo báo cáo tổng hợp hệ thống
 * @param {String} period - 'daily' hoặc 'weekly'
 * @returns {Promise<Object>} Báo cáo tổng hợp
 */
async function generateReport(period = 'daily') {
  const now = new Date();
  let startDate, periodLabel;

  if (period === 'daily') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    periodLabel = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  } else {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay()); // Bắt đầu từ Chủ Nhật
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    periodLabel = `Tuần ${Math.ceil(now.getDate() / 7)} tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
  }

  try {
    // Collect dữ liệu
    const [rooms, equipment, maintenances, incidents, logs, servers] = await Promise.all([
      ServerRoom.find(),
      Equipment.find(),
      Maintenance.find({ createdAt: { $gte: startDate } }).populate('performedBy', 'fullName'),
      Incident.find({ createdAt: { $gte: startDate } }).populate('reportedBy', 'fullName'),
      Log.find({ createdAt: { $gte: startDate } }),
      Server.find(),
    ]);

    // 1. METRICS HỆ THỐNG
    const systemMetrics = calculateSystemMetrics(rooms, equipment, servers);

    // 2. TEMPERATURE TRENDS
    const tempTrends = calculateTemperatureTrends(rooms);

    // 3. EQUIPMENT STATUS
    const equipmentStatus = calculateEquipmentStatus(equipment);

    // 4. MAINTENANCE SUMMARY
    const maintenanceSummary = calculateMaintenanceSummary(maintenances);

    // 5. INCIDENT SUMMARY
    const incidentSummary = calculateIncidentSummary(incidents);

    // 6. ACTIVITY SUMMARY
    const activitySummary = calculateActivitySummary(logs);

    // 7. RECOMMENDATIONS
    const recommendations = generateRecommendations(
      systemMetrics,
      tempTrends,
      equipmentStatus,
      maintenanceSummary,
      incidentSummary
    );

    return {
      period: periodLabel,
      generatedAt: new Date().toISOString(),
      systemMetrics,
      tempTrends,
      equipmentStatus,
      maintenanceSummary,
      incidentSummary,
      activitySummary,
      recommendations,
    };
  } catch (error) {
    throw new Error(`Lỗi tạo báo cáo: ${error.message}`);
  }
}

/**
 * Tính toán metrics của hệ thống
 */
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

/**
 * Tính điểm sức khỏe hệ thống (0-100)
 */
function calculateHealthScore(normalRooms, totalRooms, onlineServers, totalServers) {
  if (totalRooms === 0 || totalServers === 0) return 100;
  const roomHealth = (normalRooms / totalRooms) * 100;
  const serverHealth = (onlineServers / totalServers) * 100;
  return Math.round((roomHealth + serverHealth) / 2);
}

/**
 * Tính xu hướng nhiệt độ
 */
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

/**
 * Tính trạng thái thiết bị
 */
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

/**
 * Tính tóm tắt bảo trì
 */
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

/**
 * Tính tóm tắt incidents
 */
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

  // Tính resolution time trung bình (phút)
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

/**
 * Tính tóm tắt hoạt động
 */
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

/**
 * Tạo gợi ý cải thiện dựa trên dữ liệu
 */
function generateRecommendations(systemMetrics, tempTrends, equipmentStatus, maintenanceSummary, incidentSummary) {
  const recommendations = [];

  // Phòng có vấn đề
  if (systemMetrics.rooms.critical > 0) {
    recommendations.push({
      priority: 'critical',
      title: 'Có phòng máy ở trạng thái nguy hiểm',
      description: `${systemMetrics.rooms.critical} phòng đang gặp vấn đề nghiêm trọng. Kiểm tra nhiệt độ, độ ẩm và hệ thống điều hòa ngay.`,
      action: 'Kiểm tra các phòng máy ngay lập tức',
    });
  }

  // Nhiệt độ cao
  if (tempTrends.roomsAbove26 > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Nhiệt độ phòng máy cao',
      description: `${tempTrends.roomsAbove26} phòng có nhiệt độ trên 26°C. Cảnh báo vượt ngưỡng an toàn.`,
      action: 'Tối ưu hóa hệ thống làm mát',
    });
  }

  // Thiết bị hỏng
  if (systemMetrics.equipment.damaged > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Có thiết bị bị hỏng',
      description: `${systemMetrics.equipment.damaged} thiết bị đang trong trạng thái hỏng. Cần sửa chữa hoặc thay thế.`,
      action: 'Liên hệ bộ phận bảo trì để sửa chữa',
    });
  }

  // Server offline
  if (systemMetrics.servers.offline > 0) {
    recommendations.push({
      priority: 'high',
      title: `${systemMetrics.servers.offline} server đang offline`,
      description: 'Một số server không hoạt động. Cần kiểm tra ngay để phục hồi dịch vụ.',
      action: 'Restart hoặc kiểm tra kết nối server',
    });
  }

  // Incidents chưa giải quyết
  if (incidentSummary.bySeverity.critical > 0) {
    recommendations.push({
      priority: 'critical',
      title: 'Có incidents cấp độ cao chưa xử lý',
      description: `${incidentSummary.bySeverity.critical} incident cấp độ cao cần xử lý ưu tiên.`,
      action: 'Ưu tiên xử lý các incident này',
    });
  }

  // Bảo trì
  if (maintenanceSummary.totalCost > 1000000) {
    recommendations.push({
      priority: 'medium',
      title: 'Chi phí bảo trì cao',
      description: `Chi phí bảo trì tích lũy: ${maintenanceSummary.totalCost.toLocaleString()}đ. Cân nhắc nâng cấp hệ thống.`,
      action: 'Lập kế hoạch nâng cấp thiết bị',
    });
  }

  // Độ ẩm
  if (tempTrends.humidity.max > 70) {
    recommendations.push({
      priority: 'medium',
      title: 'Độ ẩm vượt ngưỡng',
      description: 'Độ ẩm vượt 70%. Có thể gây mưa điện, cần khắc phục.',
      action: 'Kiểm tra hệ thống hút ẩm',
    });
  }

  // Health score thấp
  if (systemMetrics.healthScore < 70) {
    recommendations.push({
      priority: 'medium',
      title: `Sức khỏe hệ thống: ${systemMetrics.healthScore}%`,
      description: 'Hệ thống cần chú ý bảo trì và kiểm tra.',
      action: 'Thực hiện kiểm tra toàn bộ hệ thống',
    });
  }

  // Không có gợi ý
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'info',
      title: 'Hệ thống hoạt động tốt',
      description: 'Tất cả các chỉ số đều trong ngưỡng bình thường. Tiếp tục giám sát.',
      action: 'Tiếp tục theo dõi',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityMap = { critical: 0, high: 1, medium: 2, info: 3 };
    return priorityMap[a.priority] - priorityMap[b.priority];
  });
}

module.exports = {
  generateReport,
};
