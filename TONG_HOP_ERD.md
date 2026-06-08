# 📊 TỔNG HỢP ERD - DỰ ÁN QL SERVER

**Tài liệu này chứa toàn bộ thông tin về Entity Relationship Diagram (ERD) cho hệ thống QL Server**

---

## MỤC LỤC
1. [Hình ảnh ERD tổng quát](#hình-ảnh-erd-tổng-quát)
2. [Chi tiết từng Entity](#chi-tiết-từng-entity)
3. [Các Relationships](#các-relationships)
4. [Cardinality & Notation](#cardinality--notation)
5. [Hướng dẫn vẽ ERD](#hướng-dẫn-vẽ-erd)
6. [Database Schema](#database-schema)

---

## PHẦN 1: HÌNH ẢNH ERD TỔNG QUÁT

### 1.1. Sơ Đồ Toàn Bộ Hệ Thống

```
                                    ┌─────────────┐
                                    │    USER     │
                                    ├─────────────┤
                                    │• email (UK) │
                                    │  fullName   │
                                    │  password   │
                                    │  role       │
                                    └──────┬──────┘
                                           │
                                  ┌────────┼────────┐
                                  │        │        │
                              báo cáo  gán  thực hiện
                                  │        │        │
                  ┌────────────────┼────────┼────────┬──────────────────┐
                  │                │        │        │                  │
                  ↓                ↓        ↓        ↓                  ↓
           ┌────────────┐   ┌────────────┐    ┌──────────────┐   ┌──────────────┐
           │  INCIDENT  │   │ INCIDENT   │    │ MAINTENANCE  │   │     LOG      │
           │(reported)  │   │(assigned)  │    │              │   │              │
           └────────────┘   └────────────┘    └──────┬───────┘   └──────────────┘
                  ▲                                    │
                  │                                    │
                  │                    ┌───────────────┼───────────────┐
                  │                    │               │               │
                  │                từ/từ            từ              từ
                  │                    │               │               │
                  ├────────────────────┤       ┌───────▼──────┐  ┌──────────────┐
                  │                    │       │NETWORKDEVICE │  │ (Audit Log)  │
                  │               ┌────▼──────┐│              │  │              │
                  │               │   SERVER   │├──────────────┤  └──────────────┘
                  │               ├────────────┤│• deviceCode  │
                  │               │• serverCode││  type        │
                  │               │  cpu, ram  │└──────────────┘
                  │               │  status    │
                  │               └────┬───────┘
                  │                    │
                  │                 trong
                  │                    │
                  └────────────────────┼──────────────────┐
                                       │                  │
                                    ┌──▼──┐           ┌──▼─────────────┐
                                    │RACK │           │  SERVERROOM    │
                                    ├─────┤           ├────────────────┤
                                    │ • rackCode     │• roomCode (UK) │
                                    │   maxDevices   │  temperature   │
                                    └──┬──┘           │  humidity      │
                                       │              │  status        │
                                   trong└──┬───────────┤ acStatus       │
                                           │           │ sensorMode     │
                                           │ chứa      └────┬───────────┘
                                           │               │
                                           │          ┌────┴─────┬──────────┐
                                           │          │chứa  chứa│ quản lý  │
                                           │          │          │          │
                                           │      ┌───▼─┐  ┌───▼──────┐  ┌─▼────────────┐
                                           │      │EQUIP│  │NETWORK..│  │BORROW RECORD│
                                           │      ├────┤  └──────────┘  ├──────────────┤
                                           │      │• equipmentCode    │• borrowNumber
                                           │      │  quantity          │  quantity
                                           │      │  status            │  status
                                           │      └──┬────────────────┘  borrowDate
                                           │         │                  returnDate
                                           │         └──mượn─────→ BORROWRECORD
                                           │
                                           └─────────────────────→ SERVERROOM


LEGEND:
────────────────────────────────
• _id (PK): Primary Key (khóa chính)
• (UK): Unique Key (khóa duy nhất)
• FK: Foreign Key (khóa ngoại)
1:N  = 1 entity có N entity khác
```

---

## PHẦN 2: CHI TIẾT TỪNG ENTITY

### 2.1. Entity: USER

```
┌─────────────────────────────────────┐
│            USER                     │
├─────────────────────────────────────┤
│ • _id (PK) [ObjectId]              │
│ • email (UK) [String]              │
│ • fullName [String]                │
│ • password [String - hashed]       │
│ • role [Enum]                      │
│   └─ admin / technician / viewer   │
│ • isActive [Boolean]               │
│ • createdAt [Date]                 │
│ • updatedAt [Date]                 │
│                                    │
│ RELATIONSHIPS:                      │
│ ├─ báo cáo → INCIDENT (1:N)        │
│ ├─ gán → INCIDENT (1:N)            │
│ ├─ thực hiện → MAINTENANCE (1:N)   │
│ └─ phê duyệt → BORROWRECORD (1:N)  │
└─────────────────────────────────────┘
```

### 2.2. Entity: SERVERROOM

```
┌──────────────────────────────────────┐
│         SERVERROOM                   │
├──────────────────────────────────────┤
│ • _id (PK) [ObjectId]               │
│ • roomCode (UK) [String]            │
│ • roomName [String]                 │
│ • area [Number]                     │
│ • temperature [Number]              │
│ • humidity [Number]                 │
│ • powerConsumption [Number]         │
│ • acStatus [Enum]                   │
│   └─ on / off / maintenance         │
│ • sensorMode [Enum]                 │
│   └─ auto / manual                  │
│ • status [Enum]                     │
│   └─ normal / warning / critical    │
│ • location [String]                 │
│ • lastSensorAt [Date]               │
│ • createdAt [Date]                  │
│ • updatedAt [Date]                  │
│                                     │
│ RELATIONSHIPS:                       │
│ ├─ chứa → RACK (1:N)               │
│ ├─ chứa → EQUIPMENT (1:N)          │
│ ├─ chứa → NETWORKDEVICE (1:N)      │
│ └─ quản lý → BORROWRECORD (1:N)    │
└──────────────────────────────────────┘
```

### 2.3. Entity: RACK

```
┌────────────────────────────────┐
│          RACK                  │
├────────────────────────────────┤
│ • _id (PK) [ObjectId]          │
│ • rackCode (UK) [String]       │
│ • rackName [String]            │
│ • room (FK) [ObjectId]         │
│   └─ ref: SERVERROOM           │
│ • floors [Number]              │
│ • position [String]            │
│ • maxDevices [Number]          │
│ • createdAt [Date]             │
│ • updatedAt [Date]             │
│                                │
│ RELATIONSHIPS:                  │
│ └─ chứa → SERVER (1:N)         │
└────────────────────────────────┘
```

### 2.4. Entity: SERVER

```
┌───────────────────────────────────────┐
│          SERVER                       │
├───────────────────────────────────────┤
│ • _id (PK) [ObjectId]                │
│ • serverCode (UK) [String]           │
│ • serverName [String]                │
│ • cpu [String]                       │
│ • ram [String]                       │
│ • storage [String]                   │
│ • ipAddress [String]                 │
│ • os [String]                        │
│ • installDate [Date]                 │
│ • status [Enum]                      │
│   └─ online / offline / maintenance  │
│ • rack (FK) [ObjectId]               │
│   └─ ref: RACK                       │
│ • rackPosition [Number]              │
│ • notes [String]                     │
│ • createdAt [Date]                   │
│ • updatedAt [Date]                   │
│                                      │
│ RELATIONSHIPS:                        │
│ ├─ có → INCIDENT (1:N)               │
│ └─ bảo trì → MAINTENANCE (1:N)       │
└───────────────────────────────────────┘
```

### 2.5. Entity: EQUIPMENT

```
┌──────────────────────────────────────┐
│         EQUIPMENT                    │
├──────────────────────────────────────┤
│ • _id (PK) [ObjectId]                │
│ • equipmentCode (UK) [String]        │
│ • equipmentName [String]             │
│ • category [String]                  │
│   └─ mouse/keyboard/monitor/etc      │
│ • quantity [Number]                  │
│ • availableQuantity [Number]         │
│ • borrowedQuantity [Number]          │
│ • room (FK) [ObjectId]               │
│   └─ ref: SERVERROOM                 │
│ • status [Enum]                      │
│   └─ available/in_stock/damaged/lost │
│ • purchaseDate [Date]                │
│ • notes [String]                     │
│ • createdAt [Date]                   │
│ • updatedAt [Date]                   │
│                                      │
│ RELATIONSHIPS:                        │
│ └─ mượn → BORROWRECORD (1:N)         │
└──────────────────────────────────────┘
```

### 2.6. Entity: NETWORKDEVICE

```
┌────────────────────────────────┐
│     NETWORKDEVICE              │
├────────────────────────────────┤
│ • _id (PK) [ObjectId]          │
│ • deviceCode (UK) [String]     │
│ • deviceName [String]          │
│ • type [String]                │
│   └─ router/switch/firewall    │
│ • ipAddress [String]           │
│ • room (FK) [ObjectId]         │
│   └─ ref: SERVERROOM           │
│ • status [Enum]                │
│   └─ online/offline/maintenance│
│ • lastMaintenance [Date]       │
│ • notes [String]               │
│ • createdAt [Date]             │
│ • updatedAt [Date]             │
│                                │
│ RELATIONSHIPS:                  │
│ └─ bảo trì → MAINTENANCE (1:N) │
└────────────────────────────────┘
```

### 2.7. Entity: BORROWRECORD

```
┌──────────────────────────────────┐
│     BORROWRECORD (Phiếu mượn)    │
├──────────────────────────────────┤
│ • _id (PK) [ObjectId]            │
│ • borrowNumber (UK) [String]     │
│ • equipment (FK) [ObjectId]      │
│   └─ ref: EQUIPMENT              │
│ • room (FK) [ObjectId]           │
│   └─ ref: SERVERROOM             │
│ • borrowedBy [String]            │
│ • quantity [Number]              │
│ • borrowDate [Date]              │
│ • expectedReturnDate [Date]      │
│ • actualReturnDate [Date]        │
│ • status [Enum]                  │
│   └─ borrowed/returned/overdue   │
│ • usageType [Enum]               │
│   └─ use/install/borrow          │
│ • notes [String]                 │
│ • approvedBy (FK) [ObjectId]     │
│   └─ ref: USER                   │
│ • createdAt [Date]               │
│ • updatedAt [Date]               │
└──────────────────────────────────┘
```

### 2.8. Entity: INCIDENT

```
┌────────────────────────────────────┐
│         INCIDENT (Sự cố)           │
├────────────────────────────────────┤
│ • _id (PK) [ObjectId]              │
│ • server (FK) [ObjectId]           │
│   └─ ref: SERVER                   │
│ • reportedBy (FK) [ObjectId]       │
│   └─ ref: USER (người báo)        │
│ • assignedTo (FK) [ObjectId]       │
│   └─ ref: USER (người gán)        │
│ • title [String]                   │
│ • description [String]             │
│ • severity [Enum]                  │
│   └─ low/medium/high/critical     │
│ • status [Enum]                    │
│   └─ pending/in_progress/resolved │
│ • resolution [String]              │
│ • resolvedAt [Date]                │
│ • createdAt [Date]                 │
│ • updatedAt [Date]                 │
└────────────────────────────────────┘
```

### 2.9. Entity: MAINTENANCE

```
┌────────────────────────────────┐
│      MAINTENANCE (Bảo trì)    │
├────────────────────────────────┤
│ • _id (PK) [ObjectId]          │
│ • server (FK) [ObjectId]       │
│   └─ ref: SERVER (tùy chọn)   │
│ • networkDevice (FK) [ObjectId]│
│   └─ ref: NETWORKDEVICE       │
│ • performedBy (FK) [ObjectId]  │
│   └─ ref: USER                 │
│ • scheduledDate [Date]         │
│ • completedDate [Date]         │
│ • content [String]             │
│ • cost [Number]                │
│ • status [Enum]                │
│   └─ scheduled/in_progress    │
│      /completed/cancelled      │
│ • notes [String]               │
│ • createdAt [Date]             │
│ • updatedAt [Date]             │
└────────────────────────────────┘
```

### 2.10. Entity: LOG

```
┌────────────────────────────────┐
│      LOG (Nhật ký hệ thống)   │
├────────────────────────────────┤
│ • _id (PK) [ObjectId]          │
│ • userId (FK) [ObjectId]       │
│   └─ ref: USER                 │
│ • action [String]              │
│ • entity [String]              │
│ • entityId [ObjectId]          │
│ • details [Object]             │
│ • timestamp [Date]             │
│ • ipAddress [String]           │
│ • userAgent [String]           │
└────────────────────────────────┘
```

---

## PHẦN 3: CÁC RELATIONSHIPS (12 Quan Hệ)

### 3.1. Danh Sách Toàn Bộ Relationships

| # | Relationship | Cardinality | FK | Nghĩa |
|---|---|---|---|---|
| R1 | ServerRoom → Rack | 1:N | Rack.room | 1 phòng chứa 0..N tủ rack |
| R2 | ServerRoom → Equipment | 1:N | Equipment.room | 1 phòng chứa 0..N thiết bị |
| R3 | ServerRoom → NetworkDevice | 1:N | NetworkDevice.room | 1 phòng chứa 0..N thiết bị mạng |
| R4 | Rack → Server | 1:N | Server.rack | 1 tủ chứa 1..N server |
| R5 | Server → Incident | 1:N | Incident.server | 1 server có 0..N sự cố |
| R6 | Server → Maintenance | 1:N | Maintenance.server | 1 server có 0..N lần bảo trì |
| R7 | Equipment → BorrowRecord | 1:N | BorrowRecord.equipment | 1 thiết bị có 0..N phiếu mượn |
| R8 | NetworkDevice → Maintenance | 1:N | Maintenance.networkDevice | 1 thiết bị mạng có 0..N lần bảo trì |
| R9 | User → Incident (báo cáo) | 1:N | Incident.reportedBy | 1 user báo cáo 0..N sự cố |
| R10 | User → Incident (gán) | 1:N | Incident.assignedTo | 1 user nhận 0..N sự cố để xử lý |
| R11 | User → Maintenance | 1:N | Maintenance.performedBy | 1 user thực hiện 0..N lần bảo trì |
| R12 | User → BorrowRecord | 1:N | BorrowRecord.approvedBy | 1 user phê duyệt 0..N phiếu mượn |

---

## PHẦN 4: CARDINALITY & NOTATION

### 4.1. Ký Hiệu Cardinality

```
┌─────────────────────────────────────────────────┐
│      Crow's Foot Cardinality (Phổ biến)        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Zero or One (0..1):        o|                  │
│  Exactly One (1..1):        ||                  │
│  Zero or Many (0..N):       o{                  │
│  One or Many (1..N):        |{                  │
│                                                 │
│  Chen's Notation:                               │
│  1 (exactly one):           ─1─                 │
│  M/N (many):                ─M─ hoặc ─N─        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.2. Ví Dụ Cardinality

```
1:1 RELATIONSHIP (One-to-One)
[USER] ─ 1 ───── 1 ─ [PROFILE]
Nghĩa: 1 User có 1 Profile, 1 Profile thuộc 1 User

1:N RELATIONSHIP (One-to-Many)
[SERVERROOM]
    1 |
      |─────────── chứa ──────────┐
      |                           N
  [RACK]  ────────────────────  (0..N)
Nghĩa: 1 ServerRoom có 0..N Racks, 1 Rack thuộc 1 ServerRoom

N:M RELATIONSHIP (Many-to-Many)
[USER] ─ N ───── M ─ [PROJECT]
Cần bảng junction: USER_PROJECT
```

---

## PHẦN 5: HƯỚNG DẪN VẼ ERD BẰNG DRAW.IO

### 5.1. Bước 1: Chuẩn Bị

1. Mở https://draw.io
2. "Create New Diagram" → chọn "Entity Relation Diagram"
3. Chuẩn bị danh sách:
   - **10 Entities**: User, ServerRoom, Rack, Server, Equipment, NetworkDevice, BorrowRecord, Incident, Maintenance, Log
   - **12 Relationships** (xem Phần 3)
   - **Attributes** cho mỗi Entity (xem Phần 2)

### 5.2. Bước 2: VẼ ENTITIES

```
Trong Draw.io:
1. Kéo "Entity" từ sidebar → đặt trên canvas
2. Double-click để ghi tên entity
3. Thêm attributes:
   ├─ Right-click → Edit Data
   ├─ Thêm PK (Primary Key) gạch dưới
   ├─ Thêm FK (Foreign Key) nếu có
   └─ Thêm các attributes khác

VÍ DỤ cho USER:
┌─────────────┐
│    USER     │
├─────────────┤
│_id (PK)     │  ← gạch dưới
│email (UK)   │  ← Unique
│fullName     │
│password     │
│role         │
│isActive     │
└─────────────┘
```

### 5.3. Bước 3: VẼ RELATIONSHIPS

```
1. Kéo "Relationship" từ sidebar hoặc "Many to One" relationship
2. Kết nối từ entity này đến entity khác
3. GHI tên relationship
4. CHỈNH CARDINALITY (Crow's Foot):
   ├─ Double-click trên connector
   ├─ Edit cardinality ở đầu
   ├─ Chọn: o|, ||, o{, |{
   └─ Áp dụng

VÍ DỤ:
[SERVERROOM] o|────chứa────|{ [RACK]
               ↑                 ↑
          0 or 1           1 or many
```

### 5.4. Bước 4: KIỂM TRA & VALIDATE

```
Checklist trước khi export:
✅ 10 Entities có mặt
✅ Tất cả attributes được liệt kê
✅ PK (Primary Key) được gạch dưới
✅ FK (Foreign Key) được đánh dấu
✅ 12 Relationships được vẽ
✅ Cardinality đúng cho mỗi relationship
✅ Tên relationship rõ ràng
✅ Layout sạch sẽ & dễ đọc
```

### 5.5. Bước 5: EXPORT

```
Draw.io → File → Export as
├─ PDF (được khuyến khích)
├─ PNG (dùng cho bài thuyết trình)
└─ Lưu thành: ERD_QLServer.pdf
```

---

## PHẦN 6: DATABASE SCHEMA (MongoDB Collections)

### 6.1. User Collection

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "fullName", "password", "role"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { 
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        fullName: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { 
          enum: ["admin", "technician", "viewer"]
        },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true });
```

### 6.2. ServerRoom Collection

```javascript
db.createCollection("serverrooms", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["roomCode", "roomName", "area"],
      properties: {
        _id: { bsonType: "objectId" },
        roomCode: { bsonType: "string" },
        roomName: { bsonType: "string" },
        area: { bsonType: "number" },
        temperature: { bsonType: "number" },
        humidity: { bsonType: "number" },
        powerConsumption: { bsonType: "number" },
        acStatus: { enum: ["on", "off", "maintenance"] },
        sensorMode: { enum: ["auto", "manual"] },
        status: { enum: ["normal", "warning", "critical"] },
        location: { bsonType: "string" },
        lastSensorAt: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.serverrooms.createIndex({ roomCode: 1 }, { unique: true });
```

### 6.3. Rack Collection

```javascript
db.createCollection("racks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["rackCode", "rackName", "room"],
      properties: {
        _id: { bsonType: "objectId" },
        rackCode: { bsonType: "string" },
        rackName: { bsonType: "string" },
        room: { bsonType: "objectId", description: "FK to ServerRoom" },
        floors: { bsonType: "number" },
        position: { bsonType: "string" },
        maxDevices: { bsonType: "number" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.racks.createIndex({ rackCode: 1 }, { unique: true });
db.racks.createIndex({ room: 1 });
```

### 6.4. Server Collection

```javascript
db.createCollection("servers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["serverCode", "serverName", "rack"],
      properties: {
        _id: { bsonType: "objectId" },
        serverCode: { bsonType: "string" },
        serverName: { bsonType: "string" },
        cpu: { bsonType: "string" },
        ram: { bsonType: "string" },
        storage: { bsonType: "string" },
        ipAddress: { bsonType: "string" },
        os: { bsonType: "string" },
        installDate: { bsonType: "date" },
        status: { enum: ["online", "offline", "maintenance"] },
        rack: { bsonType: "objectId", description: "FK to Rack" },
        rackPosition: { bsonType: "number" },
        notes: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.servers.createIndex({ serverCode: 1 }, { unique: true });
db.servers.createIndex({ rack: 1 });
```

### 6.5. Equipment Collection

```javascript
db.createCollection("equipment", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["equipmentCode", "equipmentName", "quantity", "room"],
      properties: {
        _id: { bsonType: "objectId" },
        equipmentCode: { bsonType: "string" },
        equipmentName: { bsonType: "string" },
        category: { bsonType: "string" },
        quantity: { bsonType: "number" },
        availableQuantity: { bsonType: "number" },
        borrowedQuantity: { bsonType: "number" },
        room: { bsonType: "objectId", description: "FK to ServerRoom" },
        status: { enum: ["available", "in_stock", "damaged", "lost"] },
        purchaseDate: { bsonType: "date" },
        notes: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.equipment.createIndex({ equipmentCode: 1 }, { unique: true });
db.equipment.createIndex({ room: 1 });
```

### 6.6. NetworkDevice Collection

```javascript
db.createCollection("networkdevices", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["deviceCode", "deviceName", "type", "room"],
      properties: {
        _id: { bsonType: "objectId" },
        deviceCode: { bsonType: "string" },
        deviceName: { bsonType: "string" },
        type: { enum: ["router", "switch", "firewall", "ups"] },
        ipAddress: { bsonType: "string" },
        room: { bsonType: "objectId", description: "FK to ServerRoom" },
        status: { enum: ["online", "offline", "maintenance"] },
        lastMaintenance: { bsonType: "date" },
        notes: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.networkdevices.createIndex({ deviceCode: 1 }, { unique: true });
db.networkdevices.createIndex({ room: 1 });
```

### 6.7. BorrowRecord Collection

```javascript
db.createCollection("borrowrecords", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["borrowNumber", "equipment", "borrowedBy", "quantity"],
      properties: {
        _id: { bsonType: "objectId" },
        borrowNumber: { bsonType: "string" },
        equipment: { bsonType: "objectId", description: "FK to Equipment" },
        room: { bsonType: "objectId", description: "FK to ServerRoom" },
        borrowedBy: { bsonType: "string" },
        quantity: { bsonType: "number" },
        borrowDate: { bsonType: "date" },
        expectedReturnDate: { bsonType: "date" },
        actualReturnDate: { bsonType: "date" },
        status: { enum: ["borrowed", "returned", "overdue", "lost"] },
        usageType: { enum: ["use", "install", "borrow"] },
        approvedBy: { bsonType: "objectId", description: "FK to User" },
        notes: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.borrowrecords.createIndex({ borrowNumber: 1 }, { unique: true });
db.borrowrecords.createIndex({ equipment: 1 });
db.borrowrecords.createIndex({ borrowedBy: 1 });
```

### 6.8. Incident Collection

```javascript
db.createCollection("incidents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["server", "reportedBy", "title", "severity"],
      properties: {
        _id: { bsonType: "objectId" },
        server: { bsonType: "objectId", description: "FK to Server" },
        reportedBy: { bsonType: "objectId", description: "FK to User" },
        assignedTo: { bsonType: "objectId", description: "FK to User" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        severity: { enum: ["low", "medium", "high", "critical"] },
        status: { enum: ["pending", "in_progress", "resolved"] },
        resolution: { bsonType: "string" },
        resolvedAt: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.incidents.createIndex({ server: 1 });
db.incidents.createIndex({ reportedBy: 1 });
db.incidents.createIndex({ assignedTo: 1 });
db.incidents.createIndex({ status: 1 });
```

### 6.9. Maintenance Collection

```javascript
db.createCollection("maintenances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["performedBy"],
      properties: {
        _id: { bsonType: "objectId" },
        server: { bsonType: "objectId", description: "FK to Server (optional)" },
        networkDevice: { bsonType: "objectId", description: "FK to NetworkDevice" },
        performedBy: { bsonType: "objectId", description: "FK to User" },
        scheduledDate: { bsonType: "date" },
        completedDate: { bsonType: "date" },
        content: { bsonType: "string" },
        cost: { bsonType: "number" },
        status: { enum: ["scheduled", "in_progress", "completed", "cancelled"] },
        notes: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.maintenances.createIndex({ server: 1 });
db.maintenances.createIndex({ networkDevice: 1 });
db.maintenances.createIndex({ performedBy: 1 });
db.maintenances.createIndex({ status: 1 });
```

### 6.10. Log Collection

```javascript
db.createCollection("logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "action", "timestamp"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId", description: "FK to User" },
        action: { bsonType: "string" },
        entity: { bsonType: "string" },
        entityId: { bsonType: "objectId" },
        details: { bsonType: "object" },
        timestamp: { bsonType: "date" },
        ipAddress: { bsonType: "string" },
        userAgent: { bsonType: "string" }
      }
    }
  }
});

db.logs.createIndex({ userId: 1 });
db.logs.createIndex({ timestamp: 1 });
db.logs.createIndex({ action: 1 });
```

---

## TÓM TẮT

**Số Entities:** 10 cái
**Số Relationships:** 12 cái (tất cả 1:N)
**Số Attributes:** ~120+ (tính cả PK, FK)

**Cardinality chính:**
- Tất cả là **1:N** (One-to-Many)
- Không có N:M hay 1:1

**Files cần export:**
1. **ERD_QLServer.pdf** - Sơ đồ ER hoàn chỉnh
2. **Danh sách Entities & Attributes**
3. **Danh sách Relationships & Cardinality**

---

**✅ Tài liệu này cung cấp đầy đủ thông tin để bạn vẽ ERD chính xác!**
