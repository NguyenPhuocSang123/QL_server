const Server = require('../models/Server');
const ServerRoom = require('../models/ServerRoom');
const Rack = require('../models/Rack');
const NetworkDevice = require('../models/NetworkDevice');
const Incident = require('../models/Incident');
const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const BorrowRecord = require('../models/BorrowRecord');
const User = require('../models/User');

const ROLE_LABELS = { admin: 'Quản trị viên', technician: 'Kỹ thuật viên', viewer: 'Người xem' };
const NET_TYPE_LABELS = { router: 'Router', switch: 'Switch', firewall: 'Firewall', ups: 'UPS' };

/** Thu thập toàn bộ dữ liệu hệ thống làm ngữ cảnh cho chatbot AI */
async function getSystemContext(currentUser = null) {
  const [
    rooms,
    racks,
    servers,
    networkDevices,
    incidents,
    equipment,
    maintenance,
    activeBorrows,
    users,
    resolvedIncidents,
  ] = await Promise.all([
    ServerRoom.find().select('roomName roomCode temperature humidity status acStatus location area').lean(),
    Rack.find().populate('room', 'roomName roomCode').select('rackCode rackName floors position maxDevices room').lean(),
    Server.find()
      .populate({ path: 'rack', select: 'rackCode rackName', populate: { path: 'room', select: 'roomName' } })
      .select('serverName serverCode status ipAddress os cpu ram storage rack rackPosition notes')
      .lean(),
    NetworkDevice.find().populate('room', 'roomName roomCode').select('deviceCode deviceName type ipAddress status room notes').lean(),
    Incident.find()
      .populate('server', 'serverName serverCode')
      .populate('reportedBy', 'fullName')
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 })
      .lean(),
    Equipment.find()
      .populate('room', 'roomName')
      .select('equipmentName equipmentCode category quantity availableQuantity borrowedQuantity status room description')
      .lean(),
    Maintenance.find()
      .populate('server', 'serverName')
      .populate('networkDevice', 'deviceName')
      .populate('performedBy', 'fullName')
      .sort({ scheduledDate: -1 })
      .lean(),
    BorrowRecord.find({ status: { $in: ['borrowed', 'overdue'] } })
      .populate('equipment', 'equipmentName equipmentCode')
      .populate('room', 'roomName')
      .lean(),
    User.find().select('fullName email role isActive').lean(),
    Incident.countDocuments({ status: 'resolved' }),
  ]);

  const online = servers.filter((s) => s.status === 'online').length;
  const offline = servers.filter((s) => s.status === 'offline').length;
  const maintenanceServers = servers.filter((s) => s.status === 'maintenance').length;
  const openIncidents = incidents.filter((i) => i.status !== 'resolved');

  return {
    currentUser: currentUser
      ? {
          fullName: currentUser.fullName,
          email: currentUser.email,
          role: currentUser.role,
          roleLabel: ROLE_LABELS[currentUser.role] || currentUser.role,
        }
      : null,
    summary: {
      totalRooms: rooms.length,
      totalRacks: racks.length,
      totalServers: servers.length,
      serversOnline: online,
      serversOffline: offline,
      serversMaintenance: maintenanceServers,
      totalNetworkDevices: networkDevices.length,
      pendingIncidents: openIncidents.length,
      resolvedIncidents,
      totalIncidents: incidents.length,
      totalEquipment: equipment.length,
      activeBorrows: activeBorrows.length,
      totalUsers: users.length,
      scheduledMaintenance: maintenance.filter((m) => m.status === 'scheduled').length,
      inProgressMaintenance: maintenance.filter((m) => m.status === 'in_progress').length,
    },
    users,
    rooms,
    racks,
    servers,
    networkDevices,
    incidents,
    openIncidents,
    equipment,
    maintenance,
    activeBorrows,
  };
}

function contextToText(ctx) {
  const userLine = ctx.currentUser
    ? `Người đang hỏi: ${ctx.currentUser.fullName} (${ctx.currentUser.email}), vai trò: ${ctx.currentUser.roleLabel}`
    : 'Người đang hỏi: không xác định';

  const lines = [
    '=== TỔNG QUAN HỆ THỐNG QL SERVER ===',
    userLine,
    `Phòng server: ${ctx.summary.totalRooms} | Rack: ${ctx.summary.totalRacks}`,
    `Server: ${ctx.summary.totalServers} (online: ${ctx.summary.serversOnline}, offline: ${ctx.summary.serversOffline}, bảo trì: ${ctx.summary.serversMaintenance})`,
    `Thiết bị mạng: ${ctx.summary.totalNetworkDevices}`,
    `Sự cố: ${ctx.summary.pendingIncidents} đang mở / ${ctx.summary.resolvedIncidents} đã xử lý (tổng ${ctx.summary.totalIncidents})`,
    `Thiết bị phòng (kho): ${ctx.summary.totalEquipment} loại | Đang mượn: ${ctx.summary.activeBorrows} phiếu`,
    `Bảo trì: ${ctx.summary.scheduledMaintenance} lên lịch, ${ctx.summary.inProgressMaintenance} đang thực hiện`,
    `Tài khoản: ${ctx.summary.totalUsers} user`,
    '',
    '=== QUY ĐỊNH PHÂN QUYỀN ===',
    '- ADMIN: tạo/sửa/xóa tài khoản (menu Tài khoản /users).',
    '- TECHNICIAN: server, rack, phòng, thiết bị, mạng, bảo trì, sự cố — không tạo tài khoản.',
    '- VIEWER: chỉ xem.',
    '',
    '=== TÀI KHOẢN ===',
    ...ctx.users.map(
      (u) => `- ${u.fullName} (${u.email}): ${ROLE_LABELS[u.role] || u.role}, ${u.isActive ? 'hoạt động' : 'đã khóa'}`
    ),
    '',
    '=== PHÒNG SERVER ===',
    ...ctx.rooms.map(
      (r) =>
        `- ${r.roomName} (${r.roomCode}) @ ${r.location || 'N/A'}: ${r.temperature}°C, độ ẩm ${r.humidity}%, điều hòa ${r.acStatus}, trạng thái ${r.status}, diện tích ${r.area || '?'}m²`
    ),
    '',
    '=== RACK ===',
    ...ctx.racks.map(
      (r) =>
        `- ${r.rackName} (${r.rackCode}) tại ${r.room?.roomName || 'N/A'}: ${r.floors}U, vị trí ${r.position || 'N/A'}, tối đa ${r.maxDevices} thiết bị`
    ),
    '',
    '=== SERVER (chi tiết) ===',
    ...ctx.servers.map((s) => {
      const rackInfo = s.rack
        ? `${s.rack.rackName} (${s.rack.rackCode})${s.rack.room ? ` - ${s.rack.room.roomName}` : ''}, vị trí U${s.rackPosition || '?'}`
        : 'chưa gán rack';
      return (
        `- ${s.serverName} (${s.serverCode}): ${s.status}, IP ${s.ipAddress || 'N/A'}, OS ${s.os || 'N/A'}\n` +
        `  CPU: ${s.cpu || 'N/A'} | RAM: ${s.ram || 'N/A'} | Ổ: ${s.storage || 'N/A'} | Rack: ${rackInfo}`
      );
    }),
    '',
    '=== THIẾT BỊ MẠNG ===',
    ...ctx.networkDevices.map(
      (d) =>
        `- ${d.deviceName} (${d.deviceCode}): ${NET_TYPE_LABELS[d.type] || d.type}, IP ${d.ipAddress || 'N/A'}, phòng ${d.room?.roomName || 'N/A'}, trạng thái ${d.status}`
    ),
    '',
    '=== SỰ CỐ (tất cả) ===',
    ...(ctx.incidents.length
      ? ctx.incidents.map(
          (i) =>
            `- [${i.status}] ${i.title} (${i.severity}) — server: ${i.server?.serverName || 'N/A'}, báo bởi ${i.reportedBy?.fullName || 'N/A'}${i.assignedTo ? `, xử lý: ${i.assignedTo.fullName}` : ''}`
        )
      : ['- Không có sự cố']),
    '',
    '=== BẢO TRÌ ===',
    ...(ctx.maintenance.length
      ? ctx.maintenance.map(
          (m) =>
            `- [${m.status}] ${m.content} — ${m.server?.serverName || m.networkDevice?.deviceName || 'N/A'}, KTV: ${m.performedBy?.fullName || 'N/A'}, ngày ${m.scheduledDate ? new Date(m.scheduledDate).toLocaleDateString('vi-VN') : 'N/A'}`
        )
      : ['- Không có lịch bảo trì']),
    '',
    '=== THIẾT BỊ KHO (đầy đủ) ===',
    ...ctx.equipment.map(
      (e) =>
        `- ${e.equipmentName} (${e.equipmentCode}, ${e.category}): còn ${e.availableQuantity}/${e.quantity}, đang mượn ${e.borrowedQuantity || 0}, phòng ${e.room?.roomName || 'N/A'}, trạng thái ${e.status}`
    ),
    '',
    '=== PHIẾU MƯỢN ĐANG MỞ ===',
    ...(ctx.activeBorrows.length
      ? ctx.activeBorrows.map(
          (b) =>
            `- ${b.borrowNumber}: ${b.equipment?.equipmentName || 'N/A'} x${b.quantity}, phòng ${b.room?.roomName || 'N/A'}, người mượn ${b.borrowedBy}, trạng thái ${b.status}`
        )
      : ['- Không có phiếu mượn đang mở']),
  ];
  return lines.join('\n');
}

function isEquipmentStockQuestion(q) {
  if (q.includes('tai khoan') || q.includes('dang ky')) return false;
  return (
    q.includes('chuot') ||
    q.includes('ban phim') ||
    q.includes('man hinh') ||
    q.includes('muc in') ||
    q.includes('trong kho') ||
    q.includes('kho thiet bi') ||
    q.includes('ton kho') ||
    q.includes('thiet bi') ||
    q.includes('muon thiet bi') ||
    q.includes('rack') ||
    q.includes('switch') ||
    q.includes('router') ||
    q.includes('firewall')
  );
}

function isAccountQuestion(q) {
  return (
    q.includes('tai khoan') ||
    q.includes('dang ky') ||
    q.includes('tao user') ||
    q.includes('them user') ||
    q.includes('phan quyen') ||
    (q.includes('tao') && q.includes('user')) ||
    (q.includes('admin') && (q.includes('tao') || q.includes('quyen')))
  );
}

/** Trả lời nhanh khi không gọi được Gemini */
function answerFromRules(question, ctx) {
  const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const qRaw = question.toLowerCase();

  if (isAccountQuestion(qRaw) || isAccountQuestion(q)) {
    const role = ctx.currentUser?.role;
    if (role === 'admin') {
      return (
        `Có, bạn (${ctx.currentUser.fullName}) là Admin nên được tạo thêm tài khoản.\n\n` +
        `Cách làm: menu **Tài khoản** → **+ Thêm tài khoản**.\n\n` +
        `Hiện có ${ctx.summary.totalUsers} tài khoản.`
      );
    }
    if (role === 'technician') {
      return 'Không. Kỹ thuật viên không tạo tài khoản — chỉ Admin (menu Tài khoản).';
    }
    return `Chỉ **Admin** tạo tài khoản. Hệ thống có ${ctx.summary.totalUsers} tài khoản.`;
  }

  if (q.includes('nhiet') || qRaw.includes('nhiệt') || qRaw.includes('độ ẩm') || q.includes('do am')) {
    const hot = ctx.rooms.filter((r) => r.temperature > 26);
    if (!hot.length) return 'Tất cả phòng đang ở mức nhiệt độ ổn định (≤ 26°C).';
    return hot.map((r) => `• ${r.roomName}: ${r.temperature}°C, độ ẩm ${r.humidity}%`).join('\n');
  }

  if (q.includes('rack')) {
    if (!ctx.racks.length) return 'Chưa có rack trong hệ thống.';
    return ctx.racks.map((r) => `• ${r.rackName} (${r.rackCode}) — ${r.room?.roomName || 'N/A'}`).join('\n');
  }

  if (q.includes('router') || q.includes('switch') || q.includes('firewall') || q.includes('mang') || q.includes('network')) {
    if (!ctx.networkDevices.length) return 'Chưa có thiết bị mạng.';
    return ctx.networkDevices
      .map((d) => `• ${d.deviceName} (${NET_TYPE_LABELS[d.type] || d.type}): ${d.status}, IP ${d.ipAddress || 'N/A'}`)
      .join('\n');
  }

  if (q.includes('offline') || q.includes('mat ket noi')) {
    const off = ctx.servers.filter((s) => s.status === 'offline');
    if (!off.length) return 'Không có server offline.';
    return off.map((s) => `• ${s.serverName} (${s.ipAddress || 'không IP'})`).join('\n');
  }

  if (q.includes('online') && !q.includes('offline')) {
    return `Có ${ctx.summary.serversOnline}/${ctx.summary.totalServers} server online.`;
  }

  if (q.includes('su co') || qRaw.includes('sự cố') || q.includes('loi') || qRaw.includes('lỗi')) {
    if (!ctx.openIncidents.length) return 'Không có sự cố đang chờ xử lý.';
    return ctx.openIncidents.map((i) => `• [${i.status}] ${i.title} (${i.severity})`).join('\n');
  }

  if (isEquipmentStockQuestion(qRaw) || isEquipmentStockQuestion(q)) {
    const avail = ctx.equipment.filter((e) => e.availableQuantity > 0);
    if (!avail.length) return 'Không còn thiết bị sẵn trong kho.';
    return avail.map((e) => `• ${e.equipmentName}: còn ${e.availableQuantity} (${e.equipmentCode})`).join('\n');
  }

  if (q.includes('bao tri') || qRaw.includes('bảo trì')) {
    const active = ctx.maintenance.filter((m) => m.status !== 'completed' && m.status !== 'cancelled');
    if (!active.length) return 'Không có lịch bảo trì đang chờ.';
    return active.map((m) => `• [${m.status}] ${m.content}`).join('\n');
  }

  if (q.includes('muon') || qRaw.includes('mượn')) {
    if (!ctx.activeBorrows.length) return 'Không có phiếu mượn đang mở.';
    return ctx.activeBorrows
      .map((b) => `• ${b.borrowNumber}: ${b.equipment?.equipmentName} x${b.quantity} — ${b.borrowedBy}`)
      .join('\n');
  }

  if (q.includes('tong quan') || qRaw.includes('tổng quan') || q.includes('dashboard') || q.includes('thong ke')) {
    return (
      `Hệ thống: ${ctx.summary.totalRooms} phòng, ${ctx.summary.totalRacks} rack, ` +
      `${ctx.summary.totalServers} server (${ctx.summary.serversOnline} online), ` +
      `${ctx.summary.totalNetworkDevices} thiết bị mạng, ` +
      `${ctx.summary.pendingIncidents} sự cố mở, ${ctx.summary.totalEquipment} loại thiết bị kho, ` +
      `${ctx.summary.activeBorrows} phiếu mượn.`
    );
  }

  return (
    '⚠️ Đang dùng chế độ **trợ lý nội bộ** (giới hạn từ khóa).\n\n' +
    'Để hỏi tự do mọi dữ liệu (rack, mạng, CPU/RAM server, bảo trì...), cần **Gemini** hoạt động:\n' +
    '1. Đặt `GEMINI_API_KEY` trong `backend/.env` (không phải frontend)\n' +
    '2. Khởi động lại backend\n' +
    '3. Chat hiện nhãn **✨ Gemini AI** dưới câu trả lời\n\n' +
    'Thử: "Liệt kê tất cả server và cấu hình", "Có bao nhiêu switch?", "Sự cố nào đang pending?"'
  );
}

module.exports = { getSystemContext, contextToText, answerFromRules };
