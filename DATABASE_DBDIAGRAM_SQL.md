# 📐 ERD DBDIAGRAM.IO - FORMAT SQL (Fix Lỗi)

## ✅ Sao chép Cái Này Vào DbDiagram.io

**Xóa hết code cũ, paste toàn bộ cái này:**

```sql
Table users {
  id bigint [primary key]
  fullName varchar [not null]
  email varchar [unique, not null]
  password varchar [not null]
  role varchar [not null, default: 'technician']
  isActive boolean [default: true]
  createdAt timestamp
  updatedAt timestamp
}

Table serverrooms {
  id bigint [primary key]
  roomCode varchar [unique, not null]
  roomName varchar [not null]
  area int [default: 0]
  temperature int [default: 25]
  humidity int [default: 50]
  powerConsumption int [default: 0]
  acStatus varchar [note: 'on, off, maintenance']
  location varchar [default: '']
  status varchar [note: 'normal, warning, critical']
  sensorMode varchar [note: 'auto, manual']
  lastSensorAt timestamp
  createdAt timestamp
  updatedAt timestamp
}

Table racks {
  id bigint [primary key]
  rackCode varchar [unique, not null]
  rackName varchar [not null]
  room_id bigint [not null, ref: > serverrooms.id]
  floors int [default: 42]
  position varchar [default: '']
  maxDevices int [default: 42]
  createdAt timestamp
  updatedAt timestamp
}

Table servers {
  id bigint [primary key]
  serverCode varchar [unique, not null]
  serverName varchar [not null]
  cpu varchar [default: '']
  ram varchar [default: '']
  storage varchar [default: '']
  ipAddress varchar [default: '']
  os varchar [default: '']
  installDate timestamp
  status varchar [note: 'online, offline, maintenance']
  rack_id bigint [ref: > racks.id]
  rackPosition int [default: 0]
  notes varchar [default: '']
  createdAt timestamp
  updatedAt timestamp
}

Table networkdevices {
  id bigint [primary key]
  deviceCode varchar [unique, not null]
  deviceName varchar [not null]
  type varchar [not null, note: 'router, switch, firewall, ups']
  ipAddress varchar [default: '']
  room_id bigint [ref: > serverrooms.id]
  status varchar [note: 'online, offline, maintenance']
  lastMaintenance timestamp
  notes varchar [default: '']
  createdAt timestamp
  updatedAt timestamp
}

Table equipments {
  id bigint [primary key]
  equipmentCode varchar [unique, not null]
  equipmentName varchar [not null]
  category varchar [not null]
  description varchar [default: '']
  quantity int [not null]
  availableQuantity int [not null]
  borrowedQuantity int [default: 0]
  room_id bigint [not null, ref: > serverrooms.id]
  status varchar [note: 'available, in_stock, damaged, lost']
  purchaseDate timestamp
  notes varchar [default: '']
  createdAt timestamp
  updatedAt timestamp
}

Table maintenances {
  id bigint [primary key]
  server_id bigint [ref: > servers.id]
  networkDevice_id bigint [ref: > networkdevices.id]
  performedBy_id bigint [not null, ref: > users.id]
  scheduledDate timestamp [not null]
  completedDate timestamp
  content varchar [not null]
  cost int [default: 0]
  status varchar [note: 'scheduled, in_progress, completed, cancelled']
  notes varchar [default: '']
  createdAt timestamp
  updatedAt timestamp
}

Table incidents {
  id bigint [primary key]
  server_id bigint [ref: > servers.id]
  reportedBy_id bigint [not null, ref: > users.id]
  assignedTo_id bigint [ref: > users.id]
  title varchar [not null]
  description text [not null]
  severity varchar [note: 'low, medium, high, critical']
  status varchar [note: 'pending, in_progress, resolved']
  resolution varchar [default: '']
  resolvedAt timestamp
  createdAt timestamp
  updatedAt timestamp
}

Table borrowrecords {
  id bigint [primary key]
  borrowNumber varchar [unique, not null]
  equipment_id bigint [not null, ref: > equipments.id]
  room_id bigint [not null, ref: > serverrooms.id]
  borrowedBy varchar [not null]
  quantity int [not null]
  borrowDate timestamp
  expectedReturnDate timestamp
  actualReturnDate timestamp
  status varchar [note: 'borrowed, returned, overdue, lost']
  usageType varchar [note: 'use, install, borrow']
  notes varchar [default: '']
  approvedBy_id bigint [ref: > users.id]
  createdAt timestamp
  updatedAt timestamp
}

Table logs {
  id bigint [primary key]
  user_id bigint [ref: > users.id]
  action varchar [not null]
  details varchar [default: '']
  type varchar [note: 'login, operation, error, system']
  createdAt timestamp
  updatedAt timestamp
}
```

---

## 📋 Hướng Dẫn (Chi Tiết)

### Bước 1: Mở DbDiagram.io
→ https://dbdiagram.io

### Bước 2: Xóa Code Cũ
- Chọn tất cả editor (Ctrl+A)
- Xóa (Delete)

### Bước 3: Paste Code SQL Trên
- Copy từ code block trên ⬆️
- Paste vào editor
- Tự động format

### Bước 4: Xem Diagram
- Diagram sẽ generate tự động
- Có 10 tables với tất cả relationships

### Bước 5: Export
- Nút "Export" bên phải
- Chọn PNG, SVG, hoặc PDF

---

## 🔧 Giải Thích Sự Thay Đổi

| Cũ (MongoDB) | Mới (SQL) | Lý Do |
|---|---|---|
| ObjectId | bigint | DbDiagram chỉ support SQL types |
| DateTime | timestamp | SQL standard type |
| Number | int | SQL numeric type |
| String | varchar | SQL text type |
| Boolean | boolean | SQL boolean type |
| _id | id | SQL primary key naming |
| ref: > | [ref: >] | DBML syntax cho SQL |

---

## ✅ Kết Quả Mong Muốn

Diagram sẽ show:
- ✅ 10 bảng (tables)
- ✅ 14+ mối quan hệ (relationships)
- ✅ Tất cả fields, data types
- ✅ Primary keys và foreign keys
- ✅ Constraints (unique, not null, default)

**Không lỗi, render sạch sẽ!** 🎉

