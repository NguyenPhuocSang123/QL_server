# 🎯 QUICK REFERENCE - HƯỚNG DẪN NHANH

## 📌 Tất cả Collections trong MongoDB

| Tên Collection | Mã Code | Số Field | Mô Tả | Khóa Duy Nhất |
|---|---|---|---|---|
| **users** | USER | 8 | Tài khoản người dùng | `email` |
| **serverrooms** | ROOM | 13 | Phòng Data Center | `roomCode` |
| **racks** | RACK | 8 | Tủ máy chủ | `rackCode` |
| **servers** | SRV | 14 | Máy chủ vật lý | `serverCode` |
| **networkdevices** | NET | 10 | Thiết bị mạng | `deviceCode` |
| **equipments** | EQ | 14 | Thiết bị phụ kiện | `equipmentCode` |
| **maintenances** | MTN | 12 | Bảo trì/sửa chữa | - |
| **incidents** | INC | 11 | Sự cố/vấn đề | - |
| **borrowrecords** | BRW | 14 | Bản ghi mượn | `borrowNumber` |
| **logs** | LOG | 5 | Nhật ký hoạt động | - |

---

## 🔑 Khóa Chính (Primary Key)

**Tất cả collections đều sử dụng: `_id` (ObjectId)**

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011")
}
```

---

## 🌐 Khóa Ngoại (Foreign Keys)

```
USER
  ← reportedBy (INCIDENT, BORROWRECORD, LOG)
  ← assignedTo (INCIDENT)
  ← performedBy (MAINTENANCE)
  ← approvedBy (BORROWRECORD)

SERVERROOM
  ← room (RACK, NETWORKDEVICE, EQUIPMENT, BORROWRECORD)

RACK
  ← room (SERVER)

SERVER
  ← server (MAINTENANCE, INCIDENT)

NETWORKDEVICE
  ← networkDevice (MAINTENANCE)

EQUIPMENT
  ← equipment (BORROWRECORD)
```

---

## 📊 Kiểu Dữ Liệu Được Sử Dụng

| Kiểu | Ví dụ | Mô Tả |
|-----|-------|-------|
| **String** | "admin", "DC-01" | Chuỗi văn bản |
| **Number** | 42, 120, 15000 | Số nguyên hoặc thập phân |
| **Boolean** | true, false | Giá trị logic |
| **Date/DateTime** | ISODate("2024-05-26T10:15:30Z") | Ngày giờ |
| **ObjectId** | ObjectId("507f1f77bcf86cd799439011") | ID tham chiếu |
| **Array** | [...] | Mảng dữ liệu (hiện tại không sử dụng) |

---

## 📝 Enum Values Được Sử Dụng

### User.role
```
admin | technician | viewer
```

### ServerRoom Status
```
acStatus:    on | off | maintenance
status:      normal | warning | critical
sensorMode:  auto | manual
```

### Server/NetworkDevice Status
```
status: online | offline | maintenance
```

### NetworkDevice Type
```
router | switch | firewall | ups
```

### Equipment Category
```
mouse | keyboard | monitor | headset | cable | power_supply
cpu_case | network_switch | speaker | printer_ink | network_card | scanner | other
```

### Equipment Status
```
available | in_stock | damaged | lost
```

### Maintenance Status
```
scheduled | in_progress | completed | cancelled
```

### Incident
```
severity: low | medium | high | critical
status:   pending | in_progress | resolved
```

### BorrowRecord
```
status:    borrowed | returned | overdue | lost
usageType: use | install | borrow
```

### Log Type
```
login | operation | error | system
```

---

## 🔗 Relationship Map (Bản đồ Quan Hệ)

```
┌─────────────────────────────────────────┐
│           USER (3 người)                │
│ ├─ admin@qlserver.com (Admin)          │
│ ├─ tech@qlserver.com (Technician)      │
│ └─ viewer@qlserver.com (Viewer)        │
└─────────────────────────────────────────┘
           ↓           ↓          ↓
      ┌────────┐  ┌──────────┐  ┌─────────┐
      │INCIDENT│  │MAINTENANCE│  │BORROW   │
      │ (2)    │  │ (2)      │  │ RECORD  │
      └────────┘  └──────────┘  └─────────┘

┌─────────────────────────────────────────┐
│    SERVERROOM (2 phòng)                 │
│ ├─ DC-01 (120m² - Tầng 2 Tòa A)       │
│ └─ DC-02 (80m² - Tầng 3 Tòa A)        │
└─────────────────────────────────────────┘
       ↓              ↓              ↓
   ┌──────┐     ┌─────────┐    ┌─────────┐
   │ RACK │     │NETWORK  │    │EQUIPMENT│
   │ (3)  │     │DEVICE(4)│    │(15)     │
   └──────┘     └─────────┘    └─────────┘
      ↓
  ┌────────┐
  │ SERVER │
  │ (4)    │
  └────────┘
    ↓    ↓
   MTN  INC
   (2)  (2)
```

---

## 📈 Lượng Dữ Liệu Mẫu (Seed Data)

```
Total Collections: 10
Total Documents:  ~66 (khi khởi tạo)
Total Unique IDs: ~66

Phân bổ:
  USER:         3 documents
  SERVERROOM:   2 documents
  RACK:         3 documents
  SERVER:       4 documents
  NETWORKDEVICE: 4 documents
  EQUIPMENT:   15 documents
  MAINTENANCE:  2 documents
  INCIDENT:     2 documents
  BORROWRECORD: 0 documents (sẽ tạo khi mượn)
  LOG:          0 documents (sẽ tạo khi có hoạt động)
  ─────────────────────────────
  TOTAL:       35 documents (mặc định)
```

---

## 🎯 Các Chức Năng Chính

### 1. **Quản lý Người Dùng & Phân Quyền**
- **Collection**: `users`
- **Thao tác**: Tạo tài khoản, phân quyền, cập nhật thông tin
- **Quyền hạn**: admin, technician, viewer
- **Dữ liệu**: 3 tài khoản mặc định

### 2. **Quản lý Cơ Sở Hạ Tầng**
- **Collections**: `serverrooms`, `racks`, `servers`, `networkdevices`
- **Thao tác**: Quản lý phòng, tủ, máy chủ, thiết bị mạng
- **Dữ liệu mẫu**: 2 phòng → 3 rack → 4 server + 4 network device

### 3. **Quản lý Thiết Bị**
- **Collections**: `equipments`, `borrowrecords`
- **Thao tác**: Quản lý kho, theo dõi số lượng, mượn trả
- **Dữ liệu mẫu**: 15 loại thiết bị (chuột, bàn phím, màn hình, etc.)

### 4. **Quản lý Bảo Trì**
- **Collection**: `maintenances`
- **Thao tác**: Lên lịch, theo dõi, ghi chi phí
- **Dữ liệu mẫu**: 2 bản ghi bảo trì

### 5. **Quản lý Sự Cố**
- **Collection**: `incidents`
- **Thao tác**: Báo cáo, gán người xử lý, theo dõi
- **Mức độ**: low, medium, high, critical
- **Dữ liệu mẫu**: 2 sự cố

### 6. **Nhật Ký Hoạt Động**
- **Collection**: `logs`
- **Thao tác**: Ghi nhận đăng nhập, thao tác, lỗi
- **Loại**: login, operation, error, system

---

## 🏗️ Cấu Trúc Hierarchy

```
DATA CENTER STRUCTURE:
─────────────────────

DC-01 (Room)
  ├─ R-A01 (Rack)
  │  ├─ SRV-001 (Server)
  │  │  ├─ Maintenance (Bảo trì)
  │  │  └─ Incident (Sự cố)
  │  └─ SRV-002 (Server)
  │     ├─ Maintenance
  │     └─ Incident
  │
  ├─ R-A02 (Rack)
  │  └─ SRV-003 (Server)
  │
  ├─ NET-001 (Router)
  │  └─ Maintenance
  ├─ NET-002 (Switch)
  ├─ NET-003 (Firewall)
  ├─ NET-004 (UPS)
  │
  └─ Equipment (15 loại)
     ├─ EQ-001: Mouse (200 cái)
     ├─ EQ-002: Keyboard (200 cái)
     ├─ EQ-003: Monitor (50 cái)
     └─ ... (12 loại khác)

DC-02 (Room)
  ├─ R-B01 (Rack)
  │  └─ SRV-004 (Server)
  └─ (cùng cấu trúc như DC-01)
```

---

## 🔐 Validate Rules

### Quantity Rules (Equipment)
```
availableQuantity + borrowedQuantity = quantity

Ví dụ:
  quantity: 200
  availableQuantity: 195
  borrowedQuantity: 5
  ✓ 195 + 5 = 200 (Hợp lệ)
```

### Status Transitions
```
INCIDENT:
  pending → in_progress → resolved
  pending ← → cancelled (từ any status)

MAINTENANCE:
  scheduled → in_progress → completed
  scheduled ← → cancelled

BORROWRECORD:
  borrowed → returned
  borrowed → overdue
  borrowed → lost
```

### Position Rules
```
SERVER in RACK:
  rackPosition: 1 ~ floors (tối đa 42)
  
EQUIPMENT in ROOM:
  quantity > 0
  availableQuantity > 0
```

---

## 📊 Index cần tạo

```mongodb
// Unique Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.serverrooms.createIndex({ roomCode: 1 }, { unique: true })
db.racks.createIndex({ rackCode: 1 }, { unique: true })
db.servers.createIndex({ serverCode: 1 }, { unique: true })
db.networkdevices.createIndex({ deviceCode: 1 }, { unique: true })
db.equipments.createIndex({ equipmentCode: 1 }, { unique: true })
db.borrowrecords.createIndex({ borrowNumber: 1 }, { unique: true })

// Foreign Key Indexes
db.racks.createIndex({ room: 1 })
db.servers.createIndex({ rack: 1 })
db.networkdevices.createIndex({ room: 1 })
db.equipments.createIndex({ room: 1 })
db.maintenances.createIndex({ server: 1 })
db.maintenances.createIndex({ networkDevice: 1 })
db.maintenances.createIndex({ performedBy: 1 })
db.incidents.createIndex({ server: 1 })
db.incidents.createIndex({ reportedBy: 1 })
db.incidents.createIndex({ assignedTo: 1 })
db.borrowrecords.createIndex({ equipment: 1 })
db.borrowrecords.createIndex({ room: 1 })
db.logs.createIndex({ user: 1 })

// Status Indexes
db.servers.createIndex({ status: 1 })
db.incidents.createIndex({ severity: 1 })
db.borrowrecords.createIndex({ status: 1 })
db.equipments.createIndex({ category: 1 })

// Time-based Indexes
db.logs.createIndex({ createdAt: -1 })
db.maintenances.createIndex({ scheduledDate: 1 })
```

---

## 🔄 Các API Endpoints & Collections

| Chức năng | Endpoint | Method | Collection |
|-----------|----------|--------|-----------|
| **Auth** | /api/auth/register | POST | users |
| | /api/auth/login | POST | users, logs |
| **Rooms** | /api/rooms | GET/POST | serverrooms |
| | /api/rooms/:id | PUT/DELETE | serverrooms |
| **Racks** | /api/racks | GET/POST | racks |
| | /api/racks/:id | PUT/DELETE | racks |
| **Servers** | /api/servers | GET/POST | servers |
| | /api/servers/:id | PUT/DELETE | servers |
| **Network** | /api/networkDevices | GET/POST | networkdevices |
| | /api/networkDevices/:id | PUT/DELETE | networkdevices |
| **Equipment** | /api/equipment | GET/POST | equipments |
| | /api/equipment/:id | PUT/DELETE | equipments |
| **Borrow** | /api/borrows | GET/POST | borrowrecords |
| | /api/borrows/:id | PUT/DELETE | borrowrecords |
| **Maintenance** | /api/maintenance | GET/POST | maintenances |
| | /api/maintenance/:id | PUT/DELETE | maintenances |
| **Incidents** | /api/incidents | GET/POST | incidents |
| | /api/incidents/:id | PUT/DELETE | incidents |
| **Logs** | /api/logs | GET | logs |
| **Dashboard** | /api/dashboard | GET | (all collections) |

---

## 📌 Lưu ý Quan Trọng

1. **MongoDB không thực thi Foreign Key** ở DB level
   - Cần kiểm tra ở Application Level (Mongoose)

2. **Tất cả timestamps** được tự động cập nhật
   - `createdAt`: Lúc tạo
   - `updatedAt`: Mỗi lần sửa

3. **Mật khẩu được mã hóa** bằng bcrypt
   - Min 6 ký tự
   - Hash factor: 10

4. **Enum values** được kiểm tra ở application
   - Mongoose schema định nghĩa các giá trị hợp lệ

5. **Dữ liệu có thể lồng nhau** (nested)
   - MongoDB hỗ trợ sub-documents (hiện tại không sử dụng)

---

## 🎓 Ví dụ Truy vấn Thường Gặp

### Tìm tất cả server trong một phòng
```javascript
db.servers.find({
  "rack": ObjectId("room_id")
}).populate('rack')
```

### Tìm thiết bị mượn chưa trả
```javascript
db.borrowrecords.find({
  "status": { $in: ["borrowed", "overdue"] }
})
```

### Tìm sự cố chưa giải quyết
```javascript
db.incidents.find({
  "status": { $ne: "resolved" }
}).sort({ severity: -1 })
```

### Tìm bảo trì hôm nay
```javascript
db.maintenances.find({
  "scheduledDate": {
    $gte: ISODate("2024-05-26T00:00:00Z"),
    $lt: ISODate("2024-05-27T00:00:00Z")
  }
})
```

### Thống kê số lượng equipment đang mượn
```javascript
db.borrowrecords.aggregate([
  { $match: { status: "borrowed" } },
  { $group: { _id: "$equipment", totalBorrowed: { $sum: "$quantity" } } }
])
```

---

## 📚 Tài Liệu Liên Quan

1. **DATABASE_SCHEMA_FULL.md** - Tài liệu chi tiết đầy đủ
2. **DATABASE_ERD_FORMAT.md** - Định dạng ERD cho các công cụ
3. **DATABASE_SAMPLE_DATA.md** - Dữ liệu mẫu thực tế
4. **QUICK_REFERENCE.md** - Tài liệu này (hướng dẫn nhanh)

---

## 🛠️ Công Cụ Vẽ Diagram

Các công cụ được khuyến nghị:
- **DbDiagram.io** - Hỗ trợ MongoDB, tự động tạo ERD
- **DrawDB** - Hỗ trợ export SQL/MongoDB
- **Lucidchart** - Hỗ trợ visual diagram
- **Miro** - Hỗ trợ collaborative diagramming
- **Diagrams.net** - Free, hỗ trợ ERD

**Cách sử dụng**: Copy định dạng từ DATABASE_ERD_FORMAT.md vào công cụ để auto-generate ERD

