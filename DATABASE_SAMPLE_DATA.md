# 📑 DỮ LIỆU MẪU (SAMPLE DATA) VÀ CẤU TRÚC JSON

Tài liệu này cho thấy cấu trúc dữ liệu thực tế từ seed data của ứng dụng

---

## 1️⃣ USER - Tài khoản người dùng

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "fullName": "Quản trị viên",
  "email": "admin@qlserver.com",
  "password": "$2a$10$...bcrypt_hash...", // mã hóa
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-05-20T14:45:30Z")
}
```

### Dữ liệu thực từ seed:
```javascript
{
  fullName: 'Quản trị viên',
  email: 'admin@qlserver.com',
  password: 'admin123', // Sẽ được hash hóa
  role: 'admin'
}

{
  fullName: 'Kỹ thuật viên Nguyễn Văn A',
  email: 'tech@qlserver.com',
  password: 'tech123',
  role: 'technician'
}

{
  fullName: 'Người xem',
  email: 'viewer@qlserver.com',
  password: 'viewer123',
  role: 'viewer'
}
```

---

## 2️⃣ SERVERROOM - Phòng Data Center

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "roomCode": "DC-01",
  "roomName": "Phòng Data Center 1",
  "area": 120,
  "temperature": 22,
  "humidity": 45,
  "powerConsumption": 15000,
  "acStatus": "on",
  "location": "Tầng 2 - Tòa A",
  "status": "normal",
  "sensorMode": "auto",
  "lastSensorAt": ISODate("2024-05-26T10:15:30Z"),
  "createdAt": ISODate("2024-01-10T08:00:00Z"),
  "updatedAt": ISODate("2024-05-26T10:15:30Z")
}
```

### Dữ liệu thực từ seed:
```javascript
{
  roomCode: 'DC-01',
  roomName: 'Phòng Data Center 1',
  area: 120,
  temperature: 22,
  humidity: 45,
  powerConsumption: 15000,
  acStatus: 'on',
  location: 'Tầng 2 - Tòa A',
  status: 'normal'
}

{
  roomCode: 'DC-02',
  roomName: 'Phòng Data Center 2',
  area: 80,
  temperature: 23,
  humidity: 48,
  powerConsumption: 8000,
  acStatus: 'on',
  location: 'Tầng 3 - Tòa A',
  status: 'normal'
}
```

---

## 3️⃣ RACK - Tủ máy chủ

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "rackCode": "R-A01",
  "rackName": "Rack A01",
  "room": ObjectId("507f1f77bcf86cd799439012"),
  "floors": 42,
  "position": "Hàng A - Cột 1",
  "maxDevices": 42,
  "createdAt": ISODate("2024-01-10T09:00:00Z"),
  "updatedAt": ISODate("2024-05-20T11:30:00Z")
}
```

### Dữ liệu thực từ seed:
```javascript
{
  rackCode: 'R-A01',
  rackName: 'Rack A01',
  room: room1._id, // Reference đến DC-01
  floors: 42,
  position: 'Hàng A - Cột 1'
}

{
  rackCode: 'R-A02',
  rackName: 'Rack A02',
  room: room1._id, // Reference đến DC-01
  floors: 42,
  position: 'Hàng A - Cột 2'
}

{
  rackCode: 'R-B01',
  rackName: 'Rack B01',
  room: room2._id, // Reference đến DC-02
  floors: 42,
  position: 'Hàng B - Cột 1'
}
```

---

## 4️⃣ SERVER - Máy chủ

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "serverCode": "SRV-001",
  "serverName": "Web Server 01",
  "cpu": "Intel Xeon E5-2680",
  "ram": "64GB DDR4",
  "storage": "2TB SSD RAID1",
  "ipAddress": "192.168.1.10",
  "os": "Ubuntu Server 22.04",
  "installDate": ISODate("2024-01-15T00:00:00Z"),
  "status": "online",
  "rack": ObjectId("507f1f77bcf86cd799439013"),
  "rackPosition": 5,
  "notes": "Production server - High priority",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-05-26T09:00:00Z")
}
```

### Dữ liệu thực từ seed:
```javascript
{
  serverCode: 'SRV-001',
  serverName: 'Web Server 01',
  cpu: 'Intel Xeon E5-2680',
  ram: '64GB DDR4',
  storage: '2TB SSD RAID1',
  ipAddress: '192.168.1.10',
  os: 'Ubuntu Server 22.04',
  status: 'online',
  rack: rack1._id,
  rackPosition: 5
}

{
  serverCode: 'SRV-002',
  serverName: 'Database Server',
  cpu: 'Intel Xeon Gold 6248',
  ram: '128GB DDR4',
  storage: '4TB NVMe RAID10',
  ipAddress: '192.168.1.11',
  os: 'CentOS 8',
  status: 'online',
  rack: rack1._id,
  rackPosition: 8
}

{
  serverCode: 'SRV-003',
  serverName: 'Backup Server',
  cpu: 'Intel Xeon E3-1230',
  ram: '32GB DDR4',
  storage: '8TB HDD',
  ipAddress: '192.168.1.12',
  os: 'Windows Server 2022',
  status: 'offline',
  rack: rack2._id,
  rackPosition: 3
}

{
  serverCode: 'SRV-004',
  serverName: 'App Server',
  cpu: 'AMD EPYC 7302',
  ram: '64GB DDR4',
  storage: '1TB SSD',
  ipAddress: '192.168.1.13',
  os: 'Debian 12',
  status: 'maintenance',
  rack: rack3._id,
  rackPosition: 10
}
```

---

## 5️⃣ NETWORKDEVICE - Thiết bị mạng

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "deviceCode": "NET-001",
  "deviceName": "Core Router",
  "type": "router",
  "ipAddress": "192.168.1.1",
  "room": ObjectId("507f1f77bcf86cd799439012"),
  "status": "online",
  "lastMaintenance": ISODate("2024-05-01T14:00:00Z"),
  "notes": "Main network device - Critical",
  "createdAt": ISODate("2024-01-10T08:00:00Z"),
  "updatedAt": ISODate("2024-05-26T10:00:00Z")
}
```

### Dữ liệu thực từ seed:
```javascript
{
  deviceCode: 'NET-001',
  deviceName: 'Core Router',
  type: 'router',
  ipAddress: '192.168.1.1',
  room: room1._id,
  status: 'online'
}

{
  deviceCode: 'NET-002',
  deviceName: 'Switch Layer 3',
  type: 'switch',
  ipAddress: '192.168.1.2',
  room: room1._id,
  status: 'online'
}

{
  deviceCode: 'NET-003',
  deviceName: 'Firewall Main',
  type: 'firewall',
  ipAddress: '192.168.1.3',
  room: room1._id,
  status: 'online'
}

{
  deviceCode: 'NET-004',
  deviceName: 'UPS 10KVA',
  type: 'ups',
  room: room1._id,
  status: 'online'
}
```

---

## 6️⃣ EQUIPMENT - Thiết bị phụ kiện

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "equipmentCode": "EQ-001",
  "equipmentName": "Chuột Logitech Wireless",
  "category": "mouse",
  "description": "Chuột không dây tiêu chuẩn cho văn phòng",
  "quantity": 200,
  "availableQuantity": 195,
  "borrowedQuantity": 5,
  "room": ObjectId("507f1f77bcf86cd799439012"),
  "status": "available",
  "purchaseDate": ISODate("2023-12-01T00:00:00Z"),
  "notes": "Bulk purchase for office",
  "createdAt": ISODate("2024-01-10T08:00:00Z"),
  "updatedAt": ISODate("2024-05-26T10:30:00Z")
}
```

### Dữ liệu thực từ seed (15 mục):
```javascript
{
  equipmentCode: 'EQ-001',
  equipmentName: 'Chuột Logitech Wireless',
  category: 'mouse',
  quantity: 200,
  availableQuantity: 200,
  room: room1._id,
  status: 'available',
  description: 'Chuột không dây tiêu chuẩn cho văn phòng'
}

{
  equipmentCode: 'EQ-002',
  equipmentName: 'Bàn Phím Cơ SteelSeries',
  category: 'keyboard',
  quantity: 200,
  availableQuantity: 200,
  room: room1._id,
  status: 'available',
  description: 'Bàn phím cơ cho nhân viên IT'
}

{
  equipmentCode: 'EQ-003',
  equipmentName: 'Màn Hình Dell 27 inch',
  category: 'monitor',
  quantity: 50,
  availableQuantity: 50,
  room: room1._id,
  status: 'available',
  description: 'Màn hình 4K cho thiết kế đồ họa'
}

{
  equipmentCode: 'EQ-004',
  equipmentName: 'Thùng CPU Dell Precision',
  category: 'cpu_case',
  quantity: 50,
  availableQuantity: 50,
  room: room1._id,
  status: 'available',
  description: 'Thùng CPU cho máy tính trạm'
}

{
  equipmentCode: 'EQ-005',
  equipmentName: 'Switch Mạng Cisco 48 Cổng',
  category: 'network_switch',
  quantity: 30,
  availableQuantity: 30,
  room: room1._id,
  status: 'available',
  description: 'Switch Layer 2 cho mạng LAN văn phòng'
}

// ... 10 mục khác tương tự
```

---

## 7️⃣ MAINTENANCE - Bảo trì

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439017"),
  "server": ObjectId("507f1f77bcf86cd799439014"),
  "networkDevice": null,
  "performedBy": ObjectId("507f1f77bcf86cd799439011"),
  "scheduledDate": ISODate("2024-05-26T00:00:00Z"),
  "completedDate": ISODate("2024-05-26T14:30:00Z"),
  "content": "Nâng cấp RAM và kiểm tra ổ cứng",
  "cost": 5000000,
  "status": "completed",
  "notes": "Successfully upgraded from 32GB to 64GB",
  "createdAt": ISODate("2024-05-26T08:00:00Z"),
  "updatedAt": ISODate("2024-05-26T14:30:00Z")
}
```

### Dữ liệu thực từ seed:
```javascript
{
  server: srv4._id,
  performedBy: tech._id,
  scheduledDate: new Date(),
  content: 'Nâng cấp RAM và kiểm tra ổ cứng',
  cost: 5000000,
  status: 'in_progress'
}

{
  server: srv3._id,
  performedBy: tech._id,
  scheduledDate: new Date(Date.now() + 7 * 86400000),
  content: 'Khôi phục hệ thống backup',
  cost: 0,
  status: 'scheduled'
}
```

---

## 8️⃣ INCIDENT - Sự cố

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439018"),
  "server": ObjectId("507f1f77bcf86cd799439014"),
  "reportedBy": ObjectId("507f1f77bcf86cd799439011"),
  "assignedTo": null,
  "title": "Server backup không phản hồi",
  "description": "Không ping được IP 192.168.1.12",
  "severity": "high",
  "status": "pending",
  "resolution": "",
  "resolvedAt": null,
  "createdAt": ISODate("2024-05-26T08:30:00Z"),
  "updatedAt": ISODate("2024-05-26T08:30:00Z")
}
```

### Dữ liệu thực từ seed:
```javascript
{
  server: srv3._id,
  reportedBy: tech._id,
  title: 'Server backup không phản hồi',
  description: 'Không ping được IP 192.168.1.12',
  severity: 'high',
  status: 'pending'
}

{
  server: srv2._id,
  reportedBy: tech._id,
  assignedTo: tech._id,
  title: 'Disk usage cao',
  description: 'Ổ cứng đạt 92% dung lượng',
  severity: 'medium',
  status: 'in_progress'
}
```

---

## 9️⃣ BORROWRECORD - Bản ghi mượn

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439019"),
  "borrowNumber": "BR-001",
  "equipment": ObjectId("507f1f77bcf86cd799439016"),
  "room": ObjectId("507f1f77bcf86cd799439012"),
  "borrowedBy": "Trần Văn Hùng",
  "quantity": 5,
  "borrowDate": ISODate("2024-05-20T10:00:00Z"),
  "expectedReturnDate": ISODate("2024-06-02T17:00:00Z"),
  "actualReturnDate": null,
  "status": "borrowed",
  "usageType": "use",
  "notes": "Mượn 5 chuột cho phòng IT",
  "approvedBy": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-05-20T10:00:00Z"),
  "updatedAt": ISODate("2024-05-20T10:00:00Z")
}
```

### Ví dụ khác:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439020"),
  "borrowNumber": "BR-002",
  "equipment": ObjectId("507f1f77bcf86cd799439016"),
  "room": ObjectId("507f1f77bcf86cd799439012"),
  "borrowedBy": "Hoàng Minh Tuấn",
  "quantity": 2,
  "borrowDate": ISODate("2024-05-15T09:30:00Z"),
  "expectedReturnDate": ISODate("2024-05-25T17:00:00Z"),
  "actualReturnDate": ISODate("2024-05-25T14:00:00Z"),
  "status": "returned",
  "usageType": "install",
  "notes": "Đã trả lại đủ số lượng",
  "approvedBy": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-05-15T09:30:00Z"),
  "updatedAt": ISODate("2024-05-25T14:00:00Z")
}
```

---

## 🔟 LOG - Nhật ký

### Cấu trúc mẫu:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439021"),
  "user": ObjectId("507f1f77bcf86cd799439011"),
  "action": "LOGIN_SUCCESS",
  "details": "User logged in from IP 192.168.1.100",
  "type": "login",
  "createdAt": ISODate("2024-05-26T10:15:30Z"),
  "updatedAt": ISODate("2024-05-26T10:15:30Z")
}
```

### Các ví dụ khác:
```javascript
{
  user: user_id,
  action: 'CREATE_SERVER',
  details: 'Created server SRV-005',
  type: 'operation'
}

{
  user: user_id,
  action: 'UPDATE_INCIDENT',
  details: 'Changed incident INC-001 status to resolved',
  type: 'operation'
}

{
  user: null,
  action: 'SYSTEM_ERROR',
  details: 'Database connection timeout',
  type: 'error'
}

{
  user: null,
  action: 'SEED_DATA_LOADED',
  details: 'Initial seed data loaded successfully',
  type: 'system'
}
```

---

## 📊 Mối quan hệ qua các bản ghi ví dụ

### Ví dụ 1: Toàn bộ quy trình bảo trì
```javascript
// Room DC-01
const room = {
  _id: ObjectId("..."),
  roomCode: "DC-01"
}

// Rack trong DC-01
const rack = {
  _id: ObjectId("..."),
  rackCode: "R-A01",
  room: ObjectId("...") // -> room DC-01
}

// Server trong Rack
const server = {
  _id: ObjectId("..."),
  serverCode: "SRV-001",
  rack: ObjectId("...") // -> rack R-A01
}

// Sự cố trên Server
const incident = {
  _id: ObjectId("..."),
  title: "Server error",
  server: ObjectId("...") // -> server SRV-001
  reportedBy: ObjectId("...") // -> user tech
}

// Bảo trì Server
const maintenance = {
  _id: ObjectId("..."),
  server: ObjectId("..."), // -> server SRV-001
  performedBy: ObjectId("..."), // -> user tech
  content: "Fixed server issue"
}

// Nhật ký hành động
const log = {
  _id: ObjectId("..."),
  user: ObjectId("..."), // -> user tech
  action: "MAINTENANCE_COMPLETED",
  details: "Maintenance for SRV-001 completed"
}
```

### Ví dụ 2: Quy trình mượn thiết bị
```javascript
// Phòng DC-01
const room = {
  _id: ObjectId("..."),
  roomCode: "DC-01"
}

// Thiết bị trong DC-01
const equipment = {
  _id: ObjectId("..."),
  equipmentCode: "EQ-001",
  equipmentName: "Chuột Logitech",
  quantity: 200,
  availableQuantity: 195,
  borrowedQuantity: 5,
  room: ObjectId("...") // -> room DC-01
}

// Bản ghi mượn
const borrowRecord = {
  _id: ObjectId("..."),
  borrowNumber: "BR-001",
  equipment: ObjectId("..."), // -> equipment EQ-001
  room: ObjectId("..."), // -> room DC-01
  borrowedBy: "Trần Văn Hùng",
  quantity: 5,
  status: "borrowed",
  approvedBy: ObjectId("...") // -> user admin
}

// Nhật ký ghi lại hành động
const log = {
  _id: ObjectId("..."),
  user: ObjectId("..."), // -> user admin
  action: "BORROW_APPROVED",
  details: "Approved borrow request BR-001 for 5 mice"
}
```

---

## 📋 Tóm tắt Dữ liệu

| Entity | Số lượng trong Seed | Mô tả |
|--------|------------------|-------|
| User | 3 | 1 admin, 1 technician, 1 viewer |
| ServerRoom | 2 | DC-01, DC-02 |
| Rack | 3 | R-A01, R-A02, R-B01 |
| Server | 4 | SRV-001 đến SRV-004 |
| NetworkDevice | 4 | 1 router, 1 switch, 1 firewall, 1 UPS |
| Equipment | 15 | Chuột, bàn phím, màn hình, cáp, etc. |
| Maintenance | 2 | 1 in_progress, 1 scheduled |
| Incident | 2 | 1 pending, 1 in_progress |
| BorrowRecord | 0 | (không có trong seed mặc định) |
| Log | 0 | (được tạo khi có hoạt động) |

---

## 🔗 Dữ liệu Relationships

```
User (3)
├── Maintenance (2) [performedBy]
├── Incident (2) [reportedBy, assignedTo]
├── BorrowRecord [approvedBy]
└── Log [user]

ServerRoom (2)
├── Rack (3) [room]
├── NetworkDevice (4) [room]
├── Equipment (15) [room]
└── BorrowRecord [room]
    │
    └── Rack (3)
        └── Server (4) [rack]
            ├── Maintenance (2) [server]
            └── Incident (2) [server]

NetworkDevice (4)
└── Maintenance (2) [networkDevice]
```

