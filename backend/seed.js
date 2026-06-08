require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const ServerRoom = require('./models/ServerRoom');
const Rack = require('./models/Rack');
const Server = require('./models/Server');
const NetworkDevice = require('./models/NetworkDevice');
const Maintenance = require('./models/Maintenance');
const Incident = require('./models/Incident');
const Equipment = require('./models/Equipment');
const Workshop = require('./models/Workshop');
const ProductionLine = require('./models/ProductionLine');

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    ServerRoom.deleteMany(),
    Rack.deleteMany(),
    Server.deleteMany(),
    NetworkDevice.deleteMany(),
    Maintenance.deleteMany(),
    Incident.deleteMany(),
    Equipment.deleteMany(),
    Workshop.deleteMany(),
    ProductionLine.deleteMany(),
  ]);

  const admin = await User.create({
    fullName: 'Quản trị viên',
    email: 'admin@qlserver.com',
    password: 'admin123',
    role: 'admin',
  });
  const tech = await User.create({
    fullName: 'Kỹ thuật viên Nguyễn Văn A',
    email: 'tech@qlserver.com',
    password: 'tech123',
    role: 'technician',
  });
  await User.create({
    fullName: 'Người xem',
    email: 'viewer@qlserver.com',
    password: 'viewer123',
    role: 'viewer',
  });

  const room1 = await ServerRoom.create({
    roomCode: 'DC-01',
    roomName: 'Phòng Data Center 1',
    area: 120,
    temperature: 22,
    humidity: 45,
    powerConsumption: 15000,
    acStatus: 'on',
    location: 'Tầng 2 - Tòa A',
    status: 'normal',
  });
  const room2 = await ServerRoom.create({
    roomCode: 'DC-02',
    roomName: 'Phòng Data Center 2',
    area: 80,
    temperature: 23,
    humidity: 48,
    powerConsumption: 8000,
    acStatus: 'on',
    location: 'Tầng 3 - Tòa A',
    status: 'normal',
  });

  const rack1 = await Rack.create({ rackCode: 'R-A01', rackName: 'Rack A01', room: room1._id, floors: 42, position: 'Hàng A - Cột 1' });
  const rack2 = await Rack.create({ rackCode: 'R-A02', rackName: 'Rack A02', room: room1._id, floors: 42, position: 'Hàng A - Cột 2' });
  const rack3 = await Rack.create({ rackCode: 'R-B01', rackName: 'Rack B01', room: room2._id, floors: 42, position: 'Hàng B - Cột 1' });

  const srv1 = await Server.create({
    serverCode: 'SRV-001',
    serverName: 'Web Server 01',
    cpu: 'Intel Xeon E5-2680',
    ram: '64GB DDR4',
    storage: '2TB SSD RAID1',
    ipAddress: '192.168.1.10',
    os: 'Ubuntu Server 22.04',
    status: 'online',
    rack: rack1._id,
    rackPosition: 5,
  });
  const srv2 = await Server.create({
    serverCode: 'SRV-002',
    serverName: 'Database Server',
    cpu: 'Intel Xeon Gold 6248',
    ram: '128GB DDR4',
    storage: '4TB NVMe RAID10',
    ipAddress: '192.168.1.11',
    os: 'CentOS 8',
    status: 'online',
    rack: rack1._id,
    rackPosition: 8,
  });
  const srv3 = await Server.create({
    serverCode: 'SRV-003',
    serverName: 'Backup Server',
    cpu: 'Intel Xeon E3-1230',
    ram: '32GB DDR4',
    storage: '8TB HDD',
    ipAddress: '192.168.1.12',
    os: 'Windows Server 2022',
    status: 'offline',
    rack: rack2._id,
    rackPosition: 3,
  });
  const srv4 = await Server.create({
    serverCode: 'SRV-004',
    serverName: 'App Server',
    cpu: 'AMD EPYC 7302',
    ram: '64GB DDR4',
    storage: '1TB SSD',
    ipAddress: '192.168.1.13',
    os: 'Debian 12',
    status: 'maintenance',
    rack: rack3._id,
    rackPosition: 10,
  });

  await NetworkDevice.create([
    { deviceCode: 'NET-001', deviceName: 'Core Router', type: 'router', ipAddress: '192.168.1.1', room: room1._id, status: 'online' },
    { deviceCode: 'NET-002', deviceName: 'Switch Layer 3', type: 'switch', ipAddress: '192.168.1.2', room: room1._id, status: 'online' },
    { deviceCode: 'NET-003', deviceName: 'Firewall Main', type: 'firewall', ipAddress: '192.168.1.3', room: room1._id, status: 'online' },
    { deviceCode: 'NET-004', deviceName: 'UPS 10KVA', type: 'ups', room: room1._id, status: 'online' },
  ]);

  // Seed Equipment
  await Equipment.create([
    { equipmentCode: 'EQ-001', equipmentName: 'Chuột Logitech Wireless', category: 'mouse', quantity: 200, availableQuantity: 200, room: room1._id, status: 'available', description: 'Chuột không dây tiêu chuẩn cho văn phòng' },
    { equipmentCode: 'EQ-002', equipmentName: 'Bàn Phím Cơ SteelSeries', category: 'keyboard', quantity: 200, availableQuantity: 200, room: room1._id, status: 'available', description: 'Bàn phím cơ cho nhân viên IT' },
    { equipmentCode: 'EQ-003', equipmentName: 'Màn Hình Dell 27 inch', category: 'monitor', quantity: 50, availableQuantity: 50, room: room1._id, status: 'available', description: 'Màn hình 4K cho thiết kế đồ họa' },
    { equipmentCode: 'EQ-004', equipmentName: 'Thùng CPU Dell Precision', category: 'cpu_case', quantity: 50, availableQuantity: 50, room: room1._id, status: 'available', description: 'Thùng CPU cho máy tính trạm' },
    { equipmentCode: 'EQ-005', equipmentName: 'Switch Mạng Cisco 48 Cổng', category: 'network_switch', quantity: 30, availableQuantity: 30, room: room1._id, status: 'available', description: 'Switch Layer 2 cho mạng LAN văn phòng' },
    { equipmentCode: 'EQ-006', equipmentName: 'Loa Treble Studio Monitor', category: 'speaker', quantity: 50, availableQuantity: 50, room: room1._id, status: 'available', description: 'Loa studio cho bộ phòng đa phương tiện' },
    { equipmentCode: 'EQ-007', equipmentName: 'Mực In HP LaserJet Pro', category: 'printer_ink', quantity: 150, availableQuantity: 150, room: room1._id, status: 'available', description: 'Mực in laser cho máy in văn phòng' },
    { equipmentCode: 'EQ-008', equipmentName: 'Card Mạng Intel Gigabit PCI-E', category: 'network_card', quantity: 30, availableQuantity: 30, room: room1._id, status: 'available', description: 'Card mạng 1 Gbps cho máy tính' },
    { equipmentCode: 'EQ-009', equipmentName: 'Máy Scan Canon ImageRunner', category: 'scanner', quantity: 30, availableQuantity: 30, room: room1._id, status: 'available', description: 'Máy quét công suất cao cho ban quản lý' },
    { equipmentCode: 'EQ-010', equipmentName: 'Tai Nghe Headset Sennheiser', category: 'headset', quantity: 80, availableQuantity: 80, room: room1._id, status: 'available', description: 'Tai nghe với microphone cho cuộc gọi' },
    { equipmentCode: 'EQ-011', equipmentName: 'Cáp Mạng Ethernet Cat6 (mét)', category: 'cable', quantity: 500, availableQuantity: 500, room: room1._id, status: 'available', description: 'Cáp mạng cat6 cuộn 500 mét' },
    { equipmentCode: 'EQ-012', equipmentName: 'Nguồn Điện UPS 5KVA', category: 'power_supply', quantity: 20, availableQuantity: 20, room: room1._id, status: 'available', description: 'Bộ lưu điện UPS cho máy chủ' },
    { equipmentCode: 'EQ-013', equipmentName: 'Hub USB 7 Cổng Anker', category: 'other', quantity: 60, availableQuantity: 60, room: room1._id, status: 'available', description: 'Hub USB mở rộng cho máy tính xách tay' },
    { equipmentCode: 'EQ-014', equipmentName: 'Dock Station Thunderbolt', category: 'other', quantity: 25, availableQuantity: 25, room: room1._id, status: 'available', description: 'Dock cấp năng lượng và kết nối cho MacBook' },
    { equipmentCode: 'EQ-015', equipmentName: 'Adapter HDMI to DisplayPort', category: 'cable', quantity: 40, availableQuantity: 40, room: room1._id, status: 'available', description: 'Adapter chuyển đổi tín hiệu hình ảnh' },
  ]);

  await Maintenance.create([
    { server: srv4._id, performedBy: tech._id, scheduledDate: new Date(), content: 'Nâng cấp RAM và kiểm tra ổ cứng', cost: 5000000, status: 'in_progress' },
    { server: srv3._id, performedBy: tech._id, scheduledDate: new Date(Date.now() + 7 * 86400000), content: 'Khôi phục hệ thống backup', cost: 0, status: 'scheduled' },
  ]);

  await Incident.create([
    { server: srv3._id, reportedBy: tech._id, title: 'Server backup không phản hồi', description: 'Không ping được IP 192.168.1.12', severity: 'high', status: 'pending' },
    { server: srv2._id, reportedBy: tech._id, assignedTo: tech._id, title: 'Disk usage cao', description: 'Ổ cứng đạt 92% dung lượng', severity: 'medium', status: 'in_progress' },
  ]);

  // Seed Workshops and Production Lines
  const workshopA = await Workshop.create({ workshopName: 'A', description: 'Xưởng sản xuất A' });
  const workshopB = await Workshop.create({ workshopName: 'B', description: 'Xưởng sản xuất B' });
  const workshopC = await Workshop.create({ workshopName: 'C', description: 'Xưởng sản xuất C' });
  const workshopD = await Workshop.create({ workshopName: 'D', description: 'Xưởng sản xuất D' });
  const workshopE = await Workshop.create({ workshopName: 'E', description: 'Xưởng sản xuất E' });

  // Create 16 production lines for each workshop
  const workshops = [workshopA, workshopB, workshopC, workshopD, workshopE];
  const productionLineData = [];

  for (const workshop of workshops) {
    for (let i = 1; i <= 16; i++) {
      productionLineData.push({
        workshop: workshop._id,
        lineNumber: i,
        lineName: `${workshop.workshopName}${i}`,
        description: `Chuyền ${i} - Xưởng ${workshop.workshopName}`,
        status: 'active',
      });
    }
  }

  await ProductionLine.create(productionLineData);

  console.log('Seed data created successfully!');
  console.log('--- Tài khoản đăng nhập ---');
  console.log('Admin:      admin@qlserver.com / admin123');
  console.log('Technician: tech@qlserver.com / tech123');
  console.log('Viewer:     viewer@qlserver.com / viewer123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
