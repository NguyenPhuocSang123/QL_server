/**
 * Phân tích nhiệt độ thông minh — chỉ dựa trên số đo thực tế (nhiệt độ, độ ẩm, điều hòa)
 * Không dùng trường status cũ trên DB để tránh cảnh báo "treo" sau khi đã hạ nhiệt độ
 */

const IDEAL_MIN = 18;
const IDEAL_MAX = 24;
const WARN_TEMP = 26;
const CRITICAL_TEMP = 30;
const WARN_HUMIDITY = 60;
const CRITICAL_HUMIDITY = 70;

/** Tính trạng thái phòng từ chỉ số cảm biến (dùng khi lưu phòng) */
function computeRoomStatusFromMetrics(room) {
  const analysis = analyzeRoom(room);
  return analysis.level;
}

function analyzeRoom(room) {
  const temp = Number(room.temperature ?? 25);
  const humidity = Number(room.humidity ?? 50);
  const acStatus = room.acStatus || 'on';
  const issues = [];
  let riskScore = 0;
  let level = 'normal';

  if (temp > CRITICAL_TEMP) {
    riskScore += 50;
    issues.push(`Nhiệt độ nguy hiểm (${temp}°C)`);
    level = 'critical';
  } else if (temp > WARN_TEMP) {
    riskScore += 35;
    issues.push(`Nhiệt độ cao (${temp}°C, ngưỡng an toàn ≤ ${WARN_TEMP}°C)`);
    level = 'warning';
  } else if (temp < IDEAL_MIN) {
    riskScore += 20;
    issues.push(`Nhiệt độ thấp bất thường (${temp}°C)`);
    level = 'warning';
  }

  if (humidity > CRITICAL_HUMIDITY) {
    riskScore += 30;
    issues.push(`Độ ẩm quá cao (${humidity}%)`);
    if (level !== 'critical') level = 'critical';
  } else if (humidity > WARN_HUMIDITY) {
    riskScore += 20;
    issues.push(`Độ ẩm cao (${humidity}%, ngưỡng ≤ ${WARN_HUMIDITY}%)`);
    if (level === 'normal') level = 'warning';
  }

  if (acStatus === 'off' && temp > IDEAL_MAX) {
    riskScore += 25;
    issues.push('Điều hòa đang tắt trong khi nhiệt độ cao');
    if (level !== 'critical') level = 'warning';
  }

  if (acStatus === 'maintenance' && temp > IDEAL_MAX) {
    riskScore += 15;
    issues.push('Điều hòa đang bảo trì, nhiệt độ chưa ổn định');
    if (level === 'normal') level = 'warning';
  }

  // Không có vấn đề thực tế → bình thường, không cảnh báo
  if (issues.length === 0) {
    level = 'normal';
    riskScore = 0;
  } else {
    riskScore = Math.min(100, riskScore);
    if (riskScore >= 50) level = 'critical';
    else if (riskScore >= 15) level = 'warning';
  }

  const recommendations = [];
  if (temp > WARN_TEMP) {
    recommendations.push('Kiểm tra và bật điều hòa, tăng công suất làm mát');
    recommendations.push('Rà soát luồng gió rack, dọn filter điều hòa');
  }
  if (humidity > WARN_HUMIDITY) {
    recommendations.push('Bật hệ thống hút ẩm hoặc kiểm tra máy dehumidifier');
  }
  if (temp > CRITICAL_TEMP || humidity > CRITICAL_HUMIDITY) {
    recommendations.push('Ưu tiên xử lý ngay, thông báo kỹ thuật viên trực ca');
  }
  if (acStatus === 'off' && temp > IDEAL_MAX) {
    recommendations.push('Bật lại điều hòa phòng ngay');
  }
  if (!recommendations.length) {
    recommendations.push('Tiếp tục giám sát định kỳ');
  }

  let prediction = 'Ổn định trong 24h tới';
  if (temp > WARN_TEMP && acStatus !== 'on') {
    prediction = 'Có thể tăng thêm 2–4°C nếu không xử lý điều hòa';
  } else if (temp > WARN_TEMP) {
    prediction = 'Có thể duy trì cao nếu tải server tăng';
  } else if (humidity > WARN_HUMIDITY) {
    prediction = 'Độ ẩm có thể ảnh hưởng thiết bị nếu không xử lý';
  }

  return {
    roomId: room._id,
    roomName: room.roomName,
    roomCode: room.roomCode,
    temperature: temp,
    humidity,
    acStatus,
    level,
    riskScore,
    issues,
    recommendations,
    prediction,
    idealRange: `${IDEAL_MIN}–${IDEAL_MAX}°C`,
    message:
      level === 'critical'
        ? `⚠️ ${room.roomName}: Nguy hiểm — ${issues.join('; ')}`
        : level === 'warning'
          ? `⚡ ${room.roomName}: Cảnh báo — ${issues.join('; ')}`
          : `✓ ${room.roomName}: Bình thường (${temp}°C, độ ẩm ${humidity}%)`,
  };
}

async function getSmartTemperatureAlerts(rooms) {
  const analyses = rooms.map(analyzeRoom);
  const critical = analyses.filter((a) => a.level === 'critical');
  const warning = analyses.filter((a) => a.level === 'warning');
  const normal = analyses.filter((a) => a.level === 'normal');

  const overallRisk =
    critical.length > 0 ? 'critical' : warning.length > 0 ? 'warning' : 'normal';

  const summary =
    overallRisk === 'critical'
      ? `Hệ thống có ${critical.length} phòng nguy hiểm, cần xử lý ngay.`
      : overallRisk === 'warning'
        ? `Có ${warning.length} phòng cần theo dõi nhiệt độ/độ ẩm.`
        : 'Tất cả phòng server trong ngưỡng an toàn.';

  return {
    overallRisk,
    summary,
    totalRooms: analyses.length,
    criticalCount: critical.length,
    warningCount: warning.length,
    normalCount: normal.length,
    analyses: analyses.sort((a, b) => b.riskScore - a.riskScore),
    alerts: analyses
      .filter((a) => a.level !== 'normal')
      .map((a) => ({
        type: 'ai_temperature',
        room: a.roomName,
        level: a.level,
        riskScore: a.riskScore,
        message: a.message,
        recommendations: a.recommendations,
        prediction: a.prediction,
      })),
  };
}

module.exports = { getSmartTemperatureAlerts, analyzeRoom, computeRoomStatusFromMetrics };
