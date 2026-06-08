# 📊 SCHEMA CƠ SỞ DỮ LIỆU - HỆ THỐNG QUẢN LÝ SERVER & THIẾT BỊ

**Ngôn ngữ CSDL:** MongoDB (NoSQL - Document Database)  
**Số lượng Collections:** 10  
**Số lượng Mối quan hệ:** 15+

---

## 📋 DANH SÁCH CÁC ENTITIES

### 1️⃣ **USER** - Quản lý người dùng
**Bảng:** `users`  
**Mô tả:** Lưu trữ thông tin tài khoản người dùng và quyền hạn của họ

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất của người dùng |
| `fullName` | String | NOT NULL | Họ tên đầy đủ |
| `email` | String | NOT NULL, UNIQUE | Email duy nhất, chữ thường hóa |
| `password` | String | NOT NULL, MIN(6) | Mật khẩu mã hóa bcrypt |
| `role` | String | ENUM | Quyền hạn: `admin`, `technician`, `viewer` |
| `isActive` | Boolean | DEFAULT: true | Trạng thái kích hoạt tài khoản |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `email` phải unique và lowercase
- `password` tối thiểu 6 ký tự, được mã hóa bằng bcrypt
- `role` chỉ nhận 3 giá trị: admin, technician, viewer

---

### 2️⃣ **SERVERROOM** - Phòng máy chủ / Data Center
**Bảng:** `serverrooms`  
**Mô tả:** Lưu thông tin các phòng chứa máy chủ và thiết bị

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất của phòng |
| `roomCode` | String | UNIQUE, NOT NULL | Mã phòng (VD: DC-01, DC-02) |
| `roomName` | String | NOT NULL | Tên phòng |
| `area` | Number | DEFAULT: 0 | Diện tích phòng (m²) |
| `temperature` | Number | DEFAULT: 25 | Nhiệt độ hiện tại (°C) |
| `humidity` | Number | DEFAULT: 50 | Độ ẩm (%) |
| `powerConsumption` | Number | DEFAULT: 0 | Tiêu thụ điện (W) |
| `acStatus` | String | ENUM | Trạng thái AC: `on`, `off`, `maintenance` |
| `location` | String | DEFAULT: '' | Vị trí phòng (Tầng/Tòa nhà) |
| `status` | String | ENUM | Trạng thái: `normal`, `warning`, `critical` |
| `sensorMode` | String | ENUM | Chế độ cảm biến: `auto`, `manual` |
| `lastSensorAt` | Date | OPTIONAL | Lần đọc cảm biến cuối cùng |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `roomCode` phải unique
- `acStatus` chỉ nhận: on, off, maintenance
- `status` chỉ nhận: normal, warning, critical
- `sensorMode` chỉ nhận: auto (hệ thống đọc), manual (nhập tay)

**Mối quan hệ:**
- ← 1:N với RACK (một phòng có nhiều rack)
- ← 1:N với NETWORKDEVICE (một phòng có nhiều thiết bị mạng)
- ← 1:N với EQUIPMENT (một phòng chứa nhiều thiết bị)
- ← 1:N với BORROWRECORD (một phòng có nhiều bản ghi mượn)

---

### 3️⃣ **RACK** - Tủ máy chủ
**Bảng:** `racks`  
**Mô tả:** Lưu thông tin các tủ máy chủ (rack) trong phòng

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất của rack |
| `rackCode` | String | UNIQUE, NOT NULL | Mã rack (VD: R-A01, R-B01) |
| `rackName` | String | NOT NULL | Tên rack |
| `room` | ObjectId | REF: ServerRoom | ID phòng chứa rack |
| `floors` | Number | DEFAULT: 42 | Số U (đơn vị chiều cao rack) |
| `position` | String | DEFAULT: '' | Vị trí trong phòng (Hàng/Cột) |
| `maxDevices` | Number | DEFAULT: 42 | Số thiết bị tối đa |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `rackCode` phải unique
- `room` là foreign key tham chiếu đến ServerRoom (bắt buộc)

**Mối quan hệ:**
- → 1:N với ServerRoom (FK)
- ← 1:N với SERVER (một rack chứa nhiều server)

---

### 4️⃣ **SERVER** - Máy chủ
**Bảng:** `servers`  
**Mô tả:** Lưu thông tin các máy chủ vật lý

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất của server |
| `serverCode` | String | UNIQUE, NOT NULL | Mã server (VD: SRV-001) |
| `serverName` | String | NOT NULL | Tên server |
| `cpu` | String | DEFAULT: '' | Loại CPU (VD: Intel Xeon E5) |
| `ram` | String | DEFAULT: '' | Dung lượng RAM (VD: 64GB DDR4) |
| `storage` | String | DEFAULT: '' | Thông tin ổ cứng (VD: 2TB SSD RAID1) |
| `ipAddress` | String | DEFAULT: '' | Địa chỉ IP |
| `os` | String | DEFAULT: '' | Hệ điều hành (VD: Ubuntu 22.04) |
| `installDate` | Date | DEFAULT: now() | Ngày cài đặt |
| `status` | String | ENUM | Trạng thái: `online`, `offline`, `maintenance` |
| `rack` | ObjectId | REF: Rack | ID rack chứa server |
| `rackPosition` | Number | DEFAULT: 0 | Vị trí trong rack (từ 1 đến floors) |
| `notes` | String | DEFAULT: '' | Ghi chú thêm |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `serverCode` phải unique
- `status` chỉ nhận: online, offline, maintenance
- `rackPosition` từ 1 đến giá trị `floors` của rack

**Mối quan hệ:**
- → 1:N với Rack (FK - có thể NULL)
- ← 1:N với MAINTENANCE (một server có nhiều lịch bảo trì)
- ← 1:N với INCIDENT (một server có nhiều sự cố)

---

### 5️⃣ **NETWORKDEVICE** - Thiết bị mạng
**Bảng:** `networkdevices`  
**Mô tả:** Lưu thông tin các thiết bị mạng (router, switch, firewall, UPS)

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất |
| `deviceCode` | String | UNIQUE, NOT NULL | Mã thiết bị (VD: NET-001) |
| `deviceName` | String | NOT NULL | Tên thiết bị |
| `type` | String | ENUM, NOT NULL | Loại: `router`, `switch`, `firewall`, `ups` |
| `ipAddress` | String | DEFAULT: '' | Địa chỉ IP quản lý |
| `room` | ObjectId | REF: ServerRoom | ID phòng chứa thiết bị |
| `status` | String | ENUM | Trạng thái: `online`, `offline`, `maintenance` |
| `lastMaintenance` | Date | OPTIONAL | Lần bảo trì cuối cùng |
| `notes` | String | DEFAULT: '' | Ghi chú |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `deviceCode` phải unique
- `type` chỉ nhận: router, switch, firewall, ups
- `status` chỉ nhận: online, offline, maintenance

**Mối quan hệ:**
- → 1:N với ServerRoom (FK - có thể NULL)
- ← 1:N với MAINTENANCE (một device có nhiều lịch bảo trì)

---

### 6️⃣ **EQUIPMENT** - Thiết bị/Phụ kiện
**Bảng:** `equipments`  
**Mô tả:** Lưu thông tin các thiết bị phụ kiện (chuột, bàn phím, màn hình, cáp, etc.)

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất |
| `equipmentCode` | String | UNIQUE, NOT NULL | Mã thiết bị (VD: EQ-001) |
| `equipmentName` | String | NOT NULL | Tên thiết bị |
| `category` | String | ENUM, NOT NULL | Loại thiết bị |
| `description` | String | DEFAULT: '' | Mô tả chi tiết |
| `quantity` | Number | NOT NULL, MIN: 0 | Tổng số lượng |
| `availableQuantity` | Number | NOT NULL, MIN: 0 | Số lượng có sẵn |
| `borrowedQuantity` | Number | DEFAULT: 0, MIN: 0 | Số lượng đang mượn |
| `room` | ObjectId | REF: ServerRoom | ID phòng lưu trữ |
| `status` | String | ENUM | Trạng thái: `available`, `in_stock`, `damaged`, `lost` |
| `purchaseDate` | Date | DEFAULT: now() | Ngày mua |
| `notes` | String | DEFAULT: '' | Ghi chú |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Danh mục Equipment (category):**
```
mouse, keyboard, monitor, headset, cable, power_supply,
cpu_case, network_switch, speaker, printer_ink, network_card,
scanner, other
```

**Ràng buộc:**
- `equipmentCode` phải unique
- `quantity` ≥ 0
- `availableQuantity` ≥ 0, ≤ `quantity`
- `borrowedQuantity` ≥ 0, ≤ `quantity`
- `room` là FK tham chiếu ServerRoom
- `status` chỉ nhận: available, in_stock, damaged, lost
- `availableQuantity + borrowedQuantity` = `quantity`

**Mối quan hệ:**
- → 1:N với ServerRoom (FK)
- ← 1:N với BORROWRECORD (một thiết bị có nhiều bản ghi mượn)

---

### 7️⃣ **MAINTENANCE** - Bảo trì / Sửa chữa
**Bảng:** `maintenances`  
**Mô tả:** Lưu thông tin lịch bảo trì, sửa chữa máy chủ và thiết bị mạng

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất |
| `server` | ObjectId | REF: Server | ID server bảo trì (có thể NULL) |
| `networkDevice` | ObjectId | REF: NetworkDevice | ID thiết bị mạng bảo trì (có thể NULL) |
| `performedBy` | ObjectId | REF: User | ID người thực hiện (bắt buộc) |
| `scheduledDate` | Date | NOT NULL | Ngày lên lịch bảo trì |
| `completedDate` | Date | OPTIONAL | Ngày hoàn thành |
| `content` | String | NOT NULL | Nội dung bảo trì |
| `cost` | Number | DEFAULT: 0 | Chi phí bảo trì (VND) |
| `status` | String | ENUM | Trạng thái: `scheduled`, `in_progress`, `completed`, `cancelled` |
| `notes` | String | DEFAULT: '' | Ghi chú bổ sung |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `server` và `networkDevice` ít nhất một cái phải có giá trị
- `performedBy` phải là FK tham chiếu User (bắt buộc)
- `status` chỉ nhận: scheduled, in_progress, completed, cancelled
- `completedDate` chỉ có khi status = completed

**Mối quan hệ:**
- → 1:N với Server (FK - có thể NULL)
- → 1:N với NetworkDevice (FK - có thể NULL)
- → 1:N với User (FK - bắt buộc)

---

### 8️⃣ **INCIDENT** - Sự cố / Vấn đề
**Bảng:** `incidents`  
**Mô tả:** Lưu thông tin các sự cố, vấn đề xảy ra với máy chủ

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất |
| `server` | ObjectId | REF: Server | ID server gặp sự cố |
| `reportedBy` | ObjectId | REF: User | ID người báo cáo (bắt buộc) |
| `assignedTo` | ObjectId | REF: User | ID người được giao xử lý (có thể NULL) |
| `title` | String | NOT NULL | Tiêu đề sự cố |
| `description` | String | NOT NULL | Mô tả chi tiết sự cố |
| `severity` | String | ENUM | Mức độ: `low`, `medium`, `high`, `critical` |
| `status` | String | ENUM | Trạng thái: `pending`, `in_progress`, `resolved` |
| `resolution` | String | DEFAULT: '' | Cách giải quyết |
| `resolvedAt` | Date | OPTIONAL | Thời gian giải quyết |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `reportedBy` là FK bắt buộc (User)
- `assignedTo` có thể NULL
- `severity` chỉ nhận: low, medium, high, critical
- `status` chỉ nhận: pending, in_progress, resolved
- `resolvedAt` chỉ có khi status = resolved

**Mối quan hệ:**
- → 1:N với Server (FK - có thể NULL)
- → 1:N với User (FK - reportedBy - bắt buộc)
- → 1:N với User (FK - assignedTo - có thể NULL)

---

### 9️⃣ **BORROWRECORD** - Bản ghi mượn thiết bị
**Bảng:** `borrowrecords`  
**Mô tả:** Lưu thông tin mượn trả thiết bị phụ kiện

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất |
| `borrowNumber` | String | UNIQUE, NOT NULL | Số hiệu mượn (VD: BR-001) |
| `equipment` | ObjectId | REF: Equipment | ID thiết bị mượn (bắt buộc) |
| `room` | ObjectId | REF: ServerRoom | ID phòng mượn (bắt buộc) |
| `borrowedBy` | String | NOT NULL | Tên người mượn |
| `quantity` | Number | NOT NULL, MIN: 1 | Số lượng mượn |
| `borrowDate` | Date | DEFAULT: now() | Ngày mượn |
| `expectedReturnDate` | Date | OPTIONAL | Ngày dự kiến trả |
| `actualReturnDate` | Date | OPTIONAL | Ngày trả thực tế |
| `status` | String | ENUM | Trạng thái: `borrowed`, `returned`, `overdue`, `lost` |
| `usageType` | String | ENUM | Loại sử dụng: `use`, `install`, `borrow` |
| `notes` | String | DEFAULT: '' | Ghi chú |
| `approvedBy` | ObjectId | REF: User | ID người phê duyệt (có thể NULL) |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `borrowNumber` phải unique
- `equipment` là FK bắt buộc
- `room` là FK bắt buộc
- `quantity` ≥ 1, ≤ `availableQuantity` của equipment
- `status` chỉ nhận: borrowed, returned, overdue, lost
- `usageType` chỉ nhận: use, install, borrow
- `actualReturnDate` chỉ có khi status = returned

**Mối quan hệ:**
- → 1:N với Equipment (FK - bắt buộc)
- → 1:N với ServerRoom (FK - bắt buộc)
- → 1:N với User (FK - approvedBy - có thể NULL)

---

### 🔟 **LOG** - Nhật ký hệ thống
**Bảng:** `logs`  
**Mô tả:** Lưu nhật ký hoạt động của hệ thống (đăng nhập, thao tác, lỗi)

| Trường | Kiểu Dữ Liệu | Constraint | Mô Tả |
|--------|--------------|-----------|-------|
| `_id` | ObjectId | PRIMARY KEY | ID duy nhất |
| `user` | ObjectId | REF: User | ID người dùng (có thể NULL) |
| `action` | String | NOT NULL | Tên hành động |
| `details` | String | DEFAULT: '' | Chi tiết hành động |
| `type` | String | ENUM | Loại log: `login`, `operation`, `error`, `system` |
| `createdAt` | Date | AUTO | Thời gian tạo |
| `updatedAt` | Date | AUTO | Thời gian cập nhật |

**Ràng buộc:**
- `type` chỉ nhận: login, operation, error, system

**Mối quan hệ:**
- → 1:N với User (FK - có thể NULL)

---

## 📊 BIỂU ĐỒ QUAN HỆ (RELATIONSHIP DIAGRAM)

```
User (1) ──────────── (N) Incident       (reportedBy)
User (1) ──────────── (N) Incident       (assignedTo)
User (1) ──────────── (N) Maintenance    (performedBy)
User (1) ──────────── (N) BorrowRecord   (approvedBy)
User (1) ──────────── (N) Log            (user)

ServerRoom (1) ──────────── (N) Rack
ServerRoom (1) ──────────── (N) NetworkDevice
ServerRoom (1) ──────────── (N) Equipment
ServerRoom (1) ──────────── (N) BorrowRecord

Rack (1) ──────────── (N) Server

Server (1) ──────────── (N) Maintenance
Server (1) ──────────── (N) Incident

NetworkDevice (1) ──────────── (N) Maintenance

Equipment (1) ──────────── (N) BorrowRecord
```

---

## 🔄 CHÍ PHÍ MỐI QUAN HỆ

### Quan hệ 1:N (One-to-Many)
| Từ Entity | Đến Entity | Mối quan hệ | Khóa ngoại |
|-----------|-----------|-----------|-----------|
| User | Incident | 1:N | reportedBy, assignedTo |
| User | Maintenance | 1:N | performedBy |
| User | BorrowRecord | 1:N | approvedBy |
| User | Log | 1:N | user |
| ServerRoom | Rack | 1:N | room |
| ServerRoom | NetworkDevice | 1:N | room |
| ServerRoom | Equipment | 1:N | room |
| ServerRoom | BorrowRecord | 1:N | room |
| Rack | Server | 1:N | rack |
| Server | Maintenance | 1:N | server |
| Server | Incident | 1:N | server |
| NetworkDevice | Maintenance | 1:N | networkDevice |
| Equipment | BorrowRecord | 1:N | equipment |

---

## 🎯 CÁC CHỨC NĂNG CHÍNH

### 1. **Quản lý Tài khoản & Phân quyền**
- Entities: `User`
- Chức năng: Đăng nhập, phân quyền (admin/technician/viewer), quản lý tài khoản

### 2. **Quản lý Phòng Data Center**
- Entities: `ServerRoom`
- Chức năng: Quản lý thông tin phòng, nhiệt độ, độ ẩm, trạng thái AC, tiêu thụ điện

### 3. **Quản lý Cơ sở hạ tầng (Infrastructure)**
- Entities: `Rack`, `Server`, `NetworkDevice`
- Chức năng: Quản lý tủ máy, máy chủ, thiết bị mạng, IP, OS, trạng thái

### 4. **Quản lý Thiết bị Phụ kiện**
- Entities: `Equipment`, `BorrowRecord`
- Chức năng: Quản lý kho thiết bị, theo dõi số lượng, mượn trả

### 5. **Quản lý Bảo trì**
- Entities: `Maintenance`
- Chức năng: Lên lịch bảo trì, theo dõi lịch sử bảo trì, chi phí

### 6. **Quản lý Sự cố (Incident)**
- Entities: `Incident`
- Chức năng: Báo cáo sự cố, gán người xử lý, theo dõi tình trạng giải quyết

### 7. **Nhật ký Hoạt động**
- Entities: `Log`
- Chức năng: Ghi nhận đăng nhập, thao tác, lỗi hệ thống

---

## 📈 THỐNG KÊ CƠNG SUẤT

### Dung lượng lưu trữ ước tính:
- **User**: ~500 bản ghi × 200 bytes = 100 KB
- **ServerRoom**: ~10 bản ghi × 500 bytes = 5 KB
- **Rack**: ~50 bản ghi × 300 bytes = 15 KB
- **Server**: ~200 bản ghi × 500 bytes = 100 KB
- **NetworkDevice**: ~100 bản ghi × 400 bytes = 40 KB
- **Equipment**: ~100 bản ghi × 600 bytes = 60 KB
- **BorrowRecord**: ~10,000 bản ghi × 600 bytes = 6 MB
- **Maintenance**: ~5,000 bản ghi × 500 bytes = 2.5 MB
- **Incident**: ~2,000 bản ghi × 800 bytes = 1.6 MB
- **Log**: ~100,000 bản ghi × 300 bytes = 30 MB

**Tổng cộng (~): ~40 MB** (chỉ là dữ liệu thuần, không tính index)

---

## 🏗️ INDEXES (Chỉ mục cần tạo)

```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// ServerRoom
db.serverrooms.createIndex({ roomCode: 1 }, { unique: true });

// Rack
db.racks.createIndex({ rackCode: 1 }, { unique: true });
db.racks.createIndex({ room: 1 });

// Server
db.servers.createIndex({ serverCode: 1 }, { unique: true });
db.servers.createIndex({ rack: 1 });
db.servers.createIndex({ status: 1 });

// NetworkDevice
db.networkdevices.createIndex({ deviceCode: 1 }, { unique: true });
db.networkdevices.createIndex({ room: 1 });

// Equipment
db.equipments.createIndex({ equipmentCode: 1 }, { unique: true });
db.equipments.createIndex({ room: 1 });
db.equipments.createIndex({ category: 1 });

// BorrowRecord
db.borrowrecords.createIndex({ borrowNumber: 1 }, { unique: true });
db.borrowrecords.createIndex({ equipment: 1 });
db.borrowrecords.createIndex({ room: 1 });
db.borrowrecords.createIndex({ status: 1 });

// Maintenance
db.maintenances.createIndex({ server: 1 });
db.maintenances.createIndex({ networkDevice: 1 });
db.maintenances.createIndex({ performedBy: 1 });

// Incident
db.incidents.createIndex({ server: 1 });
db.incidents.createIndex({ reportedBy: 1 });
db.incidents.createIndex({ assignedTo: 1 });
db.incidents.createIndex({ severity: 1 });

// Log
db.logs.createIndex({ user: 1 });
db.logs.createIndex({ type: 1 });
db.logs.createIndex({ createdAt: -1 });
```

---

## 🔐 CONSTRAINTS & VALIDATIONS

### Foreign Key Relationships (MongoDB có thể sử dụng $lookup hoặc referential integrity)
- **Server.rack** → **Rack._id** (optional)
- **Rack.room** → **ServerRoom._id** (required)
- **NetworkDevice.room** → **ServerRoom._id** (optional)
- **Equipment.room** → **ServerRoom._id** (required)
- **Maintenance.server** → **Server._id** (optional)
- **Maintenance.networkDevice** → **NetworkDevice._id** (optional)
- **Maintenance.performedBy** → **User._id** (required)
- **Incident.server** → **Server._id** (optional)
- **Incident.reportedBy** → **User._id** (required)
- **Incident.assignedTo** → **User._id** (optional)
- **BorrowRecord.equipment** → **Equipment._id** (required)
- **BorrowRecord.room** → **ServerRoom._id** (required)
- **BorrowRecord.approvedBy** → **User._id** (optional)
- **Log.user** → **User._id** (optional)

### Unique Constraints
- **User.email** (lowercase, unique)
- **ServerRoom.roomCode**
- **Rack.rackCode**
- **Server.serverCode**
- **NetworkDevice.deviceCode**
- **Equipment.equipmentCode**
- **BorrowRecord.borrowNumber**

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **MongoDB Document**: Cấu trúc NoSQL linh hoạt, có thể lưu trữ dữ liệu lồng nhau
2. **Timestamps**: Tất cả entities có `createdAt` và `updatedAt` được tự động cập nhật
3. **Enum Values**: Được kiểm tra ở Application Level (Mongoose), không phải Database Level
4. **Password**: Tất cả mật khẩu được mã hóa bằng bcrypt trước khi lưu
5. **Foreign Keys**: MongoDB không thực thi foreign key ở DB level, nên cần kiểm tra ở application

---

## 🎨 CÔNG CỤ ĐỂ VẼ ERD

Bạn có thể sử dụng các công cụ sau để vẽ ERD:
- **Lucidchart**: https://www.lucidchart.com
- **DrawDB**: https://drawdb.app
- **ERDPlus**: https://erdplus.com
- **DbDiagram.io**: https://dbdiagram.io
- **Miro**: https://miro.com
- **Diagrams.net**: https://www.diagrams.net

**Định dạng ExportSQL**: Có thể sử dụng DbDiagram.io hoặc DrawDB, chúng hỗ trợ export schema sang SQL format

