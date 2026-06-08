# 🎨 HƯỚNG DẪN VẼ USE CASE & ERD - THỰC HÀNH TỪNG BƯỚC

## ✨ PHẦN 1: VẼ USE CASE DIAGRAM

### Bước 1: Chuẩn Bị Công Cụ

**Cách 1: Dùng Draw.io (KHUYÊN DÙNG - DỄ NHẤT)**
```
1. Mở https://draw.io
2. Nhấp "Create New Diagram"
3. Chọn "UML Use Case" template
4. Bắt đầu vẽ
```

**Cách 2: Vẽ Tay**
```
- Giấy A3 (ngang, rộng hơn)
- Bút đen, bút đỏ
- Thước kẻ, com-pa (vẽ hình oval)
- Tẩy
```

---

### Bước 2: Xác Định Thành Phần

**Actors (Người dùng) - 3 cái:**
```
1. Admin
2. Technician (Kỹ thuật viên)
3. Viewer (Người xem)
```

**System Boundary:** Hình chữ nhật lớn chứa tất cả Use Cases

**Use Cases chính (14 cái):**
```
1. Login
2. Logout
3. Manage Servers (CUD - Create Update Delete)
4. Manage Equipment (CUD)
5. Create Borrow Record
6. Return Equipment
7. Create Incident
8. Assign Incident
9. Resolve Incident
10. Schedule Maintenance
11. Complete Maintenance
12. View Dashboard
13. Generate Report
14. View Equipment
```

---

### Bước 3: Vẽ Diagram Chi Tiết (Dùng Draw.io)

**VIDEO HƯỚNG DẪN TỰA:**

```
BƯỚC A: Tạo System Boundary
├─ Drag "Rectangle" từ toolbar
├─ Vẽ hình chữ nhật lớn
├─ Ghi "QL Server System" bên trong

BƯỚC B: Thêm Actors (bên trái)
├─ Tìm "Actor" trong UML shapes
├─ Hoặc dùng "Rectangle" + hình que diêu
├─ Vẽ 3 stick figures:
│  ├─ Admin (trên cùng)
│  ├─ Technician (giữa)
│  └─ Viewer (dưới cùng)

BƯỚC C: Thêm Use Cases (bên trong System Boundary)
├─ Tìm "Use Case" hoặc "Ellipse" từ toolbar
├─ Vẽ hình bầu dục
├─ Ghi tên Use Case bên trong
├─ Tạo các nhóm (packages):
│  ├─ Authentication (2 UC)
│  ├─ Server Management (3 UC)
│  ├─ Equipment Management (4 UC)
│  ├─ Incident Management (3 UC)
│  ├─ Maintenance Management (2 UC)

BƯỚC D: Nối Actors với Use Cases
├─ Dùng "Connection" từ toolbar
├─ Kéo từ Actor tới Use Case
├─ Nhấp vào Actor → drag tới Use Case
├─ Lặp lại cho tất cả mối quan hệ

BƯỚC E: Thêm <<include>> & <<extend>>
├─ Nếu UC A bắt buộc gọi UC B:
│  "Return Equipment" <<include>> "Update Equipment Qty"
├─ Nếu UC A tùy chọn gọi UC C:
│  "Create Incident" <<extend>> "Send Email Alert"
```

---

### Bước 4: Chi Tiết Use Cases & Mối Quan Hệ

**Use Case Diagram - Chi Tiết Từng Phần:**

#### **PHẦN 1: AUTHENTICATION (2 UC)**

```
┌─────────────────────────────────────────────────────┐
│              QL Server System                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│   All Users                                         │
│     │                                               │
│     ├─→ [Login]                                    │
│     │                                               │
│     └─→ [Logout]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### **PHẦN 2: SERVER MANAGEMENT (3 UC)**

```
┌─────────────────────────────────────────────────────┐
│              QL Server System                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Admin          Technician                        │
│     │                │                              │
│     ├─→ [View Servers]─←─┘                        │
│     │        ▲                                      │
│     │        │                                      │
│     ├─→ [Add Server]                              │
│     │        (<<include>> Update Server DB)        │
│     │                                               │
│     ├─→ [Update Server Info]                       │
│     │                                               │
│     ├─→ [Delete Server]                            │
│     │                                               │
│     └─→ [Update Server Status]─←─ Technician     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### **PHẦN 3: EQUIPMENT MANAGEMENT (4 UC)**

```
┌─────────────────────────────────────────────────────┐
│              QL Server System                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Admin          Technician                        │
│     │                │                              │
│     ├─→ [View Equipment]─←─┘                      │
│     │                                               │
│     ├─→ [Add Equipment]                            │
│     │                                               │
│     ├─→ [Update Equipment]                         │
│     │                                               │
│     └─→ [Delete Equipment]                         │
│                                                     │
│     Technician                                     │
│          │                                          │
│          ├─→ [Create Borrow Record]                │
│          │        (<<include>> Update Equipment Qty)
│          │                                          │
│          └─→ [Return Equipment]                    │
│                  (<<include>> Update Equipment Qty)
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### **PHẦN 4: INCIDENT MANAGEMENT (3 UC)**

```
┌─────────────────────────────────────────────────────┐
│              QL Server System                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Admin          Technician                        │
│     │                │                              │
│     ├─→ [View Incidents]─←─┘                      │
│     │                                               │
│     ├─→ [Assign Incident]                          │
│     │                                               │
│     └─→ [Resolve Incident]─←─ Technician         │
│                                                     │
│     Technician                                     │
│          │                                          │
│          └─→ [Create Incident]                     │
│                  (<<extend>> Send Email Alert)    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### **PHẦN 5: MAINTENANCE MANAGEMENT (2 UC)**

```
┌─────────────────────────────────────────────────────┐
│              QL Server System                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Admin          Technician                        │
│     │                │                              │
│     ├─→ [Schedule Maintenance]                     │
│     │                                               │
│     └─→ [View Maintenance]─←─┘                    │
│                                                     │
│     Technician                                     │
│          │                                          │
│          ├─→ [Start Maintenance]                   │
│          │                                          │
│          └─→ [Complete Maintenance]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### **PHẦN 6: REPORTS & DASHBOARD (3 UC)**

```
┌─────────────────────────────────────────────────────┐
│              QL Server System                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│   All Users                                         │
│     │                                               │
│     ├─→ [View Dashboard]                           │
│     │                                               │
│     ├─→ [View Reports]                             │
│     │                                               │
│     └─→ [Export Report] (Admin & Tech only)       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### Bước 5: USE CASE DIAGRAM HOÀN CHỈNH (CHO DRAW.IO)

**Cấu trúc tổng thể:**

```
                        Admin ◯
                         /│\
                        / │ \
                       /  │  \
                      /   │   \
                     /    │    \
                    /     │     \
        ┌──────────────────┼──────────────────┐
        │   QL SERVER      │   SYSTEM         │
        │                  │                  │
        │  ┌──────────────────────────────┐  │
        │  │  AUTHENTICATION              │  │
        │  │  ├─ [Login]                  │  │
        │  │  └─ [Logout]                 │  │
        │  └──────────────────────────────┘  │
        │                  │                  │
        │  ┌──────────────────────────────┐  │
        │  │  SERVER MANAGEMENT           │  │
        │  │  ├─ [View Servers]          │  │
        │  │  ├─ [Add Server]            │  │
        │  │  ├─ [Update Server]         │  │
        │  │  ├─ [Delete Server]         │  │
        │  │  └─ [Update Status]         │  │
        │  └──────────────────────────────┘  │
        │                  │                  │
        │  ┌──────────────────────────────┐  │
        │  │  EQUIPMENT MANAGEMENT        │  │
        │  │  ├─ [View Equipment]        │  │
        │  │  ├─ [Add Equipment]         │  │
        │  │  ├─ [Borrow Record]         │  │
        │  │  └─ [Return Equipment]      │  │
        │  └──────────────────────────────┘  │
        │                  │                  │
        │  ┌──────────────────────────────┐  │
        │  │  INCIDENT MANAGEMENT         │  │
        │  │  ├─ [Report Incident]       │  │
        │  │  ├─ [Assign Incident]       │  │
        │  │  └─ [Resolve Incident]      │  │
        │  └──────────────────────────────┘  │
        │                  │                  │
        │  ┌──────────────────────────────┐  │
        │  │  MAINTENANCE MANAGEMENT      │  │
        │  │  ├─ [Schedule Maintenance]  │  │
        │  │  ├─ [Start Maintenance]     │  │
        │  │  └─ [Complete Maintenance]  │  │
        │  └──────────────────────────────┘  │
        │                  │                  │
        │  ┌──────────────────────────────┐  │
        │  │  REPORTS                     │  │
        │  │  ├─ [View Dashboard]        │  │
        │  │  ├─ [View Reports]          │  │
        │  │  └─ [Export Report]         │  │
        │  └──────────────────────────────┘  │
        │                                      │
        └──────────────────┬───────────────────┘
                           │
                    Technician ◯
                           │
                        Viewer ◯
```

---

### Bước 6: Vẽ Mối Quan Hệ Chi Tiết (Draw.io)

**TRONG DRAW.IO:**

1. **Vẽ Actor Admin:**
   - Kéo "Actor" từ sidebar → đặt bên trái trên
   - Ghi "Admin"

2. **Vẽ Actor Technician:**
   - Kéo "Actor" → đặt bên trái giữa
   - Ghi "Technician"

3. **Vẽ Actor Viewer:**
   - Kéo "Actor" → đặt bên trái dưới
   - Ghi "Viewer"

4. **Vẽ System Boundary:**
   - Kéo "Rectangle" → tạo hình chữ nhật lớn
   - Ghi "QL Server System"

5. **Vẽ Use Cases:**
   - Kéo "Use Case" từ sidebar
   - Vẽ trong System Boundary
   - Nhóm lại theo categories (dùng Package)

6. **Nối mối quan hệ:**
   - Nhấp "Connector" từ toolbar
   - Kéo từ Actor → Use Case
   - Chỉnh sửa connection type nếu cần (include/extend)

---

## ✨ PHẦN 2: VẼ ERD MODEL

### Bước 1: Xác Định Entities

**10 Entities (10 chiếc hộp):**

```
1. User
2. ServerRoom
3. Rack
4. Server
5. NetworkDevice
6. Equipment
7. BorrowRecord
8. Incident
9. Maintenance
10. Log
```

---

### Bước 2: Liệt Kê Attributes Cho Mỗi Entity

#### **User Entity**
```
USER
├─ _id (PK)
├─ email (UK)
├─ fullName
├─ password
├─ role (enum)
├─ isActive
├─ createdAt
└─ updatedAt
```

#### **ServerRoom Entity**
```
SERVERROOM
├─ _id (PK)
├─ roomCode (UK)
├─ roomName
├─ area
├─ temperature
├─ humidity
├─ powerConsumption
├─ acStatus
├─ sensorMode
├─ status
├─ location
├─ lastSensorAt
├─ createdAt
└─ updatedAt
```

#### **Rack Entity**
```
RACK
├─ _id (PK)
├─ rackCode (UK)
├─ rackName
├─ room (FK → ServerRoom)
├─ floors
├─ position
├─ maxDevices
├─ createdAt
└─ updatedAt
```

#### **Server Entity**
```
SERVER
├─ _id (PK)
├─ serverCode (UK)
├─ serverName
├─ cpu
├─ ram
├─ storage
├─ ipAddress
├─ os
├─ installDate
├─ status
├─ rack (FK → Rack)
├─ rackPosition
├─ notes
├─ createdAt
└─ updatedAt
```

#### **Equipment Entity**
```
EQUIPMENT
├─ _id (PK)
├─ equipmentCode (UK)
├─ equipmentName
├─ category
├─ quantity
├─ availableQuantity
├─ borrowedQuantity
├─ room (FK → ServerRoom)
├─ status
├─ purchaseDate
├─ notes
├─ createdAt
└─ updatedAt
```

#### **NetworkDevice Entity**
```
NETWORKDEVICE
├─ _id (PK)
├─ deviceCode (UK)
├─ deviceName
├─ type
├─ ipAddress
├─ room (FK → ServerRoom)
├─ status
├─ lastMaintenance
├─ notes
├─ createdAt
└─ updatedAt
```

#### **BorrowRecord Entity**
```
BORROWRECORD
├─ _id (PK)
├─ borrowNumber (UK)
├─ equipment (FK → Equipment)
├─ room (FK → ServerRoom)
├─ borrowedBy
├─ quantity
├─ borrowDate
├─ expectedReturnDate
├─ actualReturnDate
├─ status
├─ usageType
├─ notes
├─ approvedBy (FK → User)
├─ createdAt
└─ updatedAt
```

#### **Incident Entity**
```
INCIDENT
├─ _id (PK)
├─ server (FK → Server)
├─ reportedBy (FK → User)
├─ assignedTo (FK → User)
├─ title
├─ description
├─ severity
├─ status
├─ resolution
├─ resolvedAt
├─ createdAt
└─ updatedAt
```

#### **Maintenance Entity**
```
MAINTENANCE
├─ _id (PK)
├─ server (FK → Server)
├─ networkDevice (FK → NetworkDevice)
├─ performedBy (FK → User)
├─ scheduledDate
├─ completedDate
├─ content
├─ cost
├─ status
├─ notes
├─ createdAt
└─ updatedAt
```

#### **Log Entity**
```
LOG
├─ _id (PK)
├─ userId (FK → User)
├─ action
├─ entity
├─ entityId
├─ changes
├─ timestamp
└─ ipAddress
```

---

### Bước 3: VẼ ERD BẰNG DRAW.IO

**CÁCH LÀM TỪNG BƯỚC:**

```
1. Mở https://draw.io
2. "Create New Diagram" → chọn "Entity Relation Diagram"
3. Bắt đầu vẽ:

   ├─ KÉO "Entity" từ sidebar → đặt trên canvas
   ├─ GIFF tên: "USER"
   ├─ THÊM attributes:
   │   ├─ Nhấp chuột phải trên box
   │   ├─ "Edit Data" hoặc ghi trực tiếp
   │   ├─ Viết: _id, email, fullName, ...
   │
   ├─ LẶP LẠI cho 10 entities
   │
   ├─ VẼ RELATIONSHIPS:
   │   ├─ Dùng "Connection" từ toolbar
   │   ├─ KÉO từ FK → PK
   │   ├─ GHI tên relationship
   │   ├─ CHỈNH CARDINALITY (1:1, 1:N, N:M)
   │
   └─ SẮPXẾP LAYOUT cho đẹp
```

---

### Bước 4: CHI TIẾT RELATIONSHIPS

**Tất cả 12 Relationships cần vẽ:**

| From | To | Relationship | Cardinality | FK Field |
|------|-----|-------------|------------|----------|
| ServerRoom | Rack | chứa | 1:N | Rack.room |
| ServerRoom | Equipment | chứa | 1:N | Equipment.room |
| ServerRoom | NetworkDevice | chứa | 1:N | NetworkDevice.room |
| ServerRoom | BorrowRecord | quản lý | 1:N | BorrowRecord.room |
| Rack | Server | chứa | 1:N | Server.rack |
| Server | Incident | có | 1:N | Incident.server |
| Server | Maintenance | bảo trì | 1:N | Maintenance.server |
| Equipment | BorrowRecord | mượn | 1:N | BorrowRecord.equipment |
| NetworkDevice | Maintenance | bảo trì | 1:N | Maintenance.networkDevice |
| User | Incident | báo cáo | 1:N | Incident.reportedBy |
| User | Incident | gán | 1:N | Incident.assignedTo |
| User | Maintenance | thực hiện | 1:N | Maintenance.performedBy |

---

### Bước 5: VẼ ERD HOÀN CHỈNH

**LAYOUT CHI TIẾT (Cách bố trí để đẹp mắt):**

```
                      ┌──────────────┐
                      │     USER     │
                      ├──────────────┤
                      │* email       │
                      │  fullName    │
                      │  role        │
                      └───────┬──────┘
                              │
                   ┌──────────┼──────────┐
                   │ báo cáo  │gán│thực  │
                   │          │  │hiện  │
                   ↓          ↓  ↓      ↓
          ┌──────────────┐  [INCIDENT] [MAINTENANCE]
          │  SERVERROOM  │       ▲           ▲
          ├──────────────┤       │           │
          │* roomCode    │       │           │
          │  temperature │       │           │
          │  humidity    │       │   từ      │từ
          └──┬──┬────┬───┘       │           │
             │  │    │          SERVER   NETWORKDEVICE
        chứa │  │chứa│chứa       ▲           ▲
             │  │    │          │           │
          ┌──▼┐ │    │       trong─┐     trong─┐
          │ RACK   │  │         │       │
          │   │    │  │         │       │
          │   │    ↓  ↓         │       │
          │   │ EQUIPMENT  NETWORKDEVICE
          │   │ ├─┼─────┬──────────┘
          │   │ │ mượn  │
          │   │ ↓       │
          │   │ BORROWRECORD
          │   │ └────────┴──────────┐
          │   │                     │
          ┌─▼─▼──────────┐          │
          │    SERVER    │◀─────────┘
          ├──────────────┤
          │* serverCode  │
          │  cpu, ram    │
          │  status      │
          └──────────────┘
```

---

### Bước 6: Điều Chỉnh Cardinality

**TRONG DRAW.IO:**

Khi nối 2 entities:
1. Kéo connection từ entity này sang entity khác
2. Nhấp chuột phải vào line
3. Chọn "Edit Connection" hoặc nhấp vào đầu/cuối
4. Chọn cardinality:
   - `||` = 1 (one)
   - `o|` = 0..1 (zero or one)
   - `|{` = 1..N (one or many)
   - `o{` = 0..N (zero or many)

**VÍ DỤ:**
```
ServerRoom (1) ─── o{ ──→ Equipment (0..N)
                                    
Nghĩa: 1 ServerRoom có 0 đến nhiều Equipment
       (Equipment có thể không có)
```

---

## 📋 TÓMBỘ CÔNG THỨC VẼ

### Use Case Diagram

```
CÔNG THỨC NHANH:
1. Vẽ System Boundary (hình chữ nhật lớn)
2. Vẽ 3 Actors bên ngoài trái (stick figures)
3. Vẽ 14 Use Cases bên trong (ellipses)
4. Nối Actors → Use Cases (đường solid)
5. Thêm <<include>>, <<extend>> nếu cần
6. Sắp xếp layout đẹp
7. Export PDF
```

### ERD Model

```
CÔNG THỨC NHANH:
1. Vẽ 10 Entities (hình chữ nhật)
2. Liệt kê attributes trong mỗi box
3. Ghi dấu * cho Primary Keys
4. Nối 12 Relationships (đường solid)
5. Chỉnh cardinality trên mỗi đầu
6. Ghi tên relationships
7. Sắp xếp layout đẹp
8. Export PDF
```

---

## 🎬 HƯỚNG DẪN VIDEO (TEXT-BASED)

### VẼ USE CASE TRÊN DRAW.IO (5 PHÚT)

```
Step 1: Mở Draw.io
├─ Vào https://draw.io
├─ Create New Diagram
└─ Chọn "UML Use Case"

Step 2: Thêm System Boundary
├─ Kéo "Rectangle" → canvas
├─ Vẽ hình chữ nhật lớn (chiếm 70% canvas)
├─ Double-click → ghi "QL Server System"
└─ Format: Màu xanh nhạt, border đậm

Step 3: Thêm Actors (bên trái)
├─ Kéo "Actor" (từ UML Shapes)
├─ Đặt 3 actors:
│  ├─ Admin (y=50)
│  ├─ Technician (y=200)
│  └─ Viewer (y=350)
└─ Ghi tên cho mỗi cái

Step 4: Thêm Use Cases (bên trong)
├─ Kéo "Use Case" → canvas
├─ Vẽ 14 use cases:
│  ├─ Login (x=150, y=50)
│  ├─ Logout (x=150, y=100)
│  ├─ View Servers (x=150, y=150)
│  ├─ Add Server (x=150, y=200)
│  ├─ ... (tiếp tục)
└─ Nhóm chúng bằng Package nếu cần

Step 5: Nối mối quan hệ
├─ Dùng "Connection"
├─ Kéo từ Actor → Use Case
├─ Lặp lại 30 lần 😅
└─ Kiểm tra xem có missing không

Step 6: Thêm <<include>> & <<extend>>
├─ Nhấp chuột phải trên connection
├─ Edit Label
├─ Ghi "<<include>>" hoặc "<<extend>>"
└─ Lặp lại cho 3-4 cases

Step 7: Export
├─ File → Export as → PDF
├─ Chọn tên file: "UseCase_QLServer.pdf"
└─ Lưu vào desktop
```

### VẼ ERD TRÊN DRAW.IO (8 PHÚT)

```
Step 1: Mở Draw.io mới
├─ Create New Diagram
└─ Chọn "Entity Relation Diagram"

Step 2: Thêm 10 Entities
├─ Kéo "Entity" từ sidebar
├─ Vẽ 10 cái entities:
│  ├─ USER (x=100, y=50)
│  ├─ SERVERROOM (x=250, y=150)
│  ├─ RACK (x=400, y=150)
│  ├─ SERVER (x=550, y=150)
│  ├─ EQUIPMENT (x=250, y=300)
│  ├─ NETWORKDEVICE (x=400, y=300)
│  ├─ BORROWRECORD (x=550, y=300)
│  ├─ INCIDENT (x=250, y=450)
│  ├─ MAINTENANCE (x=400, y=450)
│  └─ LOG (x=550, y=450)
└─ Ghi tên entity cho mỗi cái

Step 3: Thêm Attributes
├─ Double-click entity → Edit Data
├─ Thêm attributes (mỗi dòng 1 cái):
│  ├─ _id (PK)
│  ├─ field1
│  ├─ field2
│  └─ ...
├─ Hoặc ghi trực tiếp vào box
└─ Lặp lại cho 10 entities

Step 4: Nối Relationships
├─ Dùng "Connection"
├─ Nối 12 relationships:
│  ├─ ServerRoom → Rack (1:N)
│  ├─ ServerRoom → Equipment (1:N)
│  ├─ ServerRoom → NetworkDevice (1:N)
│  ├─ Rack → Server (1:N)
│  ├─ Server → Incident (1:N)
│  ├─ Server → Maintenance (1:N)
│  ├─ Equipment → BorrowRecord (1:N)
│  ├─ NetworkDevice → Maintenance (1:N)
│  ├─ User → Incident (báo cáo, 1:N)
│  ├─ User → Incident (gán, 1:N)
│  ├─ User → Maintenance (1:N)
│  └─ BorrowRecord → ServerRoom (1:N)
└─ Kiểm tra tất cả được nối

Step 5: Chỉnh Cardinality
├─ Nhấp chuột phải trên mỗi connection
├─ Chỉnh cardinality:
│  ├─ Start: chọn "1"
│  ├─ End: chọn "N" (hoặc "1" nếu 1:1)
└─ Lặp lại cho 12 relationships

Step 6: Ghi Tên Relationships
├─ Nhấp chuột phải trên connection
├─ Edit Label
├─ Ghi tên: "chứa", "mượn", "báo cáo", v.v.
└─ Lặp lại cho tất cả

Step 7: Sắp xếp Layout
├─ Kéo entities để không overlap
├─ Xếp theo logic:
│  ├─ ServerRoom ở giữa (hub)
│  ├─ Entities phụ thuộc ở ngoài
│  └─ User ở trên
└─ Format: Thêm màu, border

Step 8: Export
├─ File → Export as → PDF
├─ Chọn tên: "ERD_QLServer.pdf"
└─ Lưu vào desktop
```

---

## ✅ CHECKLIST TRƯỚC KHI NỘP

### Use Case Diagram
- [ ] Có 3 Actors: Admin, Technician, Viewer
- [ ] Có System Boundary rõ ràng
- [ ] Có 14+ Use Cases
- [ ] Tất cả UC đều có tên rõ ràng
- [ ] Mối quan hệ Actor→UC được vẽ
- [ ] Có <<include>> & <<extend>> (ít nhất 2-3 cái)
- [ ] Layout rõ ràng, không overlap
- [ ] Export PDF, file name: UseCase_QLServer.pdf

### ERD Model
- [ ] Có 10 Entities
- [ ] Mỗi Entity có tên rõ ràng
- [ ] Mỗi Entity có attributes (8-15 cái)
- [ ] Primary Keys được ghi (PK)
- [ ] Foreign Keys được ghi (FK)
- [ ] 12 Relationships được vẽ
- [ ] Cardinality chính xác (1:N, 1:1, N:M)
- [ ] Tên Relationships được ghi
- [ ] Layout rõ ràng, không overlap
- [ ] Export PDF, file name: ERD_QLServer.pdf

---

## 💡 TIPS & TRICKS

### Vẽ Nhanh Hơn
```
✅ Dùng keyboard shortcut:
   - Ctrl+C: Copy
   - Ctrl+V: Paste
   - Ctrl+Z: Undo
   
✅ Sử dụng Style formatting:
   - Highlight entities quan trọng (khác màu)
   - Dùng bold cho tên lớn
   
✅ Nhóm entities:
   - Dùng "Container" để nhóm
   - Giúp diagram gọn gàng hơn
```

### Tránh Lỗi Thường Gặp
```
❌ KHÔNG:
   - Quên PK/FK
   - Cardinality sai
   - Use Case overlap
   - Ghi tên không rõ ràng
   - Không export PDF

✅ NÊN:
   - Vẽ tay trước (10 phút)
   - Sau đó digitalize (20 phút)
   - Review lại trước khi nộp
   - Export với độ phân giải cao (300 dpi)
```

### Làm Đẹp Hơn
```
1. Thêm legend/key
2. Dùng color coding:
   - Entities chính: xanh
   - Entities phụ: xám
   - Relationships: đỏ
3. Chỉnh border thickness
4. Align căn chỉnh đúng
5. Dùng consistent font
```

---

## 📁 DANH SÁCH FILES CẦN NỘP

```
Nộp cho giảng viên:
├─ UseCase_QLServer.pdf         ← Use Case Diagram
├─ ERD_QLServer.pdf              ← ERD Model
└─ (tùy chọn) Presentation.pptx  ← Slide giải thích
```

---

## 🎓 ĐỀ XUẤT: VẼ THEO TRÌNH TỰ NÀY

**NGÀY 1: Vẽ Use Case (2-3 tiếng)**
```
1. Đọc hướng dẫn này (15 phút)
2. Vẽ tay sơ bộ (15 phút)
3. Mở Draw.io (5 phút)
4. Vẽ từng phần:
   - System Boundary + Actors (5 phút)
   - Authentication UC (3 phút)
   - Server Management UC (5 phút)
   - Equipment Management UC (5 phút)
   - Incident Management UC (5 phút)
   - Maintenance Management UC (5 phút)
   - Reports UC (3 phút)
5. Review & chỉnh sửa (10 phút)
6. Export PDF (2 phút)
```

**NGÀY 2: Vẽ ERD (2-3 tiếng)**
```
1. Vẽ tay sơ bộ (20 phút)
2. Mở Draw.io (5 phút)
3. Thêm 10 Entities (10 phút)
4. Thêm Attributes (15 phút)
5. Nối 12 Relationships (15 phút)
6. Chỉnh Cardinality (10 phút)
7. Ghi Tên Relationships (5 phút)
8. Sắp xếp Layout (10 phút)
9. Format & Màu (5 phút)
10. Review & chỉnh sửa (10 phút)
11. Export PDF (2 phút)
```

---

**GOOD LUCK! 🚀 Chúc bạn vẽ đẹp và nộp tốt! 💪**
