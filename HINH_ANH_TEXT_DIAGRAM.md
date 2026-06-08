# 🎨 HÌNH ẢNH TEXT - DỰ ÁN QL SERVER

## PHẦN 1: USE CASE DIAGRAM - HÌNH ẢNH HOÀN CHỈNH

### Diagram Tổng Thể (Có Actors)

```
     👤 Admin              👨‍🔧 Technician            👁️ Viewer
       │                       │                       │
       │                       │                       │
       │    ┌──────────────────────────────────────────┤
       ├───→│  QL SERVER SYSTEM                        │
       │    │                                          │
       │    │  ┌─────────────────────────────────────┐ │
       ├───→│  │ AUTHENTICATION                      │ │ ←───┘
       │    │  │  ┌──────────────┐                   │ │
       │    │  │  │    Login     │                   │ │
       │    │  │  └──────────────┘                   │ │
       │    │  │  ┌──────────────┐                   │ │
       │    │  │  │   Logout     │                   │ │
       │    │  │  └──────────────┘                   │ │
       │    │  └─────────────────────────────────────┘ │
       │    │                                          │
       │    │  ┌─────────────────────────────────────┐ │
       ├───→│  │ SERVER MANAGEMENT                   │ │
       │    │  │  ┌────────────────────┐             │ │ ←─────┐
       │    │  │  │  View Servers      │             │ │       │
       │    │  │  └────────────────────┘             │ │       Technician
       │    │  │  ┌────────────────────┐             │ │       can view
       ├───→│  │  │  Add Server        │             │ │
       │    │  │  └────────────────────┘             │ │
       │    │  │  ┌────────────────────┐             │ │
       ├───→│  │  │  Update Server     │             │ │
       │    │  │  └────────────────────┘             │ │
       │    │  │  ┌────────────────────┐             │ │
       ├───→│  │  │  Delete Server     │             │ │
       │    │  │  └────────────────────┘             │ │
       │    │  │  ┌───────────────────────┐          │ │
       │    │  │  │Update Server Status   │←─────────┼─┘
       │    │  │  └───────────────────────┘          │
       │    │  └─────────────────────────────────────┘ │
       │    │                                          │
       │    │  ┌─────────────────────────────────────┐ │
       ├───→│  │ EQUIPMENT MANAGEMENT                │ │
       │    │  │  ┌────────────────────┐             │ │ ←─────┐
       │    │  │  │  View Equipment    │             │ │       │
       │    │  │  └────────────────────┘             │ │       Technician
       ├───→│  │  ┌────────────────────┐             │ │       can manage
       │    │  │  │  Add Equipment     │             │ │       equipment
       │    │  │  └────────────────────┘             │ │
       │    │  │  ┌──────────────────────┐           │ │
       │    │  │  │Create Borrow Record  │←──────────┼─┘
       │    │  │  └──────────────────────┘           │
       │    │  │  ┌──────────────────────┐           │
       │    │  │  │Return Equipment      │←──────────┼─┘
       │    │  │  └──────────────────────┘           │
       │    │  └─────────────────────────────────────┘ │
       │    │                                          │
       │    │  ┌─────────────────────────────────────┐ │
       ├───→│  │ INCIDENT MANAGEMENT                 │ │
       │    │  │  ┌────────────────────┐             │ │ ←─────┐
       │    │  │  │ Report Incident    │             │ │       │
       │    │  │  └────────────────────┘             │ │       Technician
       ├───→│  │  ┌────────────────────┐             │ │       can report
       │    │  │  │ Assign Incident    │             │ │       & resolve
       │    │  │  └────────────────────┘             │ │
       │    │  │  ┌───────────────────┐              │ │
       │    │  │  │Resolve Incident   │←─────────────┼─┘
       │    │  │  └───────────────────┘              │
       │    │  └─────────────────────────────────────┘ │
       │    │                                          │
       │    │  ┌─────────────────────────────────────┐ │
       ├───→│  │ MAINTENANCE MANAGEMENT              │ │
       │    │  │  ┌──────────────────────┐           │ │
       │    │  │  │Schedule Maintenance  │           │ │
       │    │  │  └──────────────────────┘           │ │
       │    │  │  ┌──────────────────────┐           │ │ ←─────┐
       │    │  │  │Complete Maintenance  │           │ │       │
       │    │  │  └──────────────────────┘           │ │       Technician
       │    │  └─────────────────────────────────────┘ │       can complete
       │    │                                          │
       │    │  ┌─────────────────────────────────────┐ │
       ├───→│  │ REPORTS & DASHBOARD                 │ │
       │    │  │  ┌────────────────────┐             │ │ ←─────┐
       │    │  │  │ View Dashboard     │             │ │       │
       │    │  │  └────────────────────┘             │ │       All can view
       ├───→│  │  ┌────────────────────┐             │ │ ←─────┘
       │    │  │  │ View Reports       │             │ │
       │    │  │  └────────────────────┘             │ │
       ├───→│  │  ┌────────────────────┐             │ │
       │    │  │  │ Export Report      │             │ │
       │    │  │  └────────────────────┘             │ │
       │    │  └─────────────────────────────────────┘ │
       │    │                                          │
       └───→└──────────────────────────────────────────┘

LEGEND:
─────────
→  = Uses / Has Permission
←  = Used by
───→ = Admin can do (all)
─────→ = Technician can do (some)
──────→ = Viewer can do (reports only)
```

---

## PHẦN 1.5: ACTORS MAPPING TABLE (BẢNG PHÂN QUYỀN)

```
┌─────────────────────────────────────────────────────────────────────────┐
│         QUICK REFERENCE: USE CASE & ACTOR PERMISSIONS                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  👤 ADMIN (admin@qlserver.com / admin123)                              │
│  ════════════════════════════════════════════════════════════════════  │
│  Tài khoản test, full permission trên tất cả features                 │
│                                                                         │
│  Có thể làm:                                                            │
│  ✅ Login / Logout                                                      │
│  ✅ Manage Users (CRUD)                                                 │
│  ✅ Server Management: View, Add, Update, Delete, Change Status       │
│  ✅ Equipment Management: View, Add, Update, Delete                   │
│  ✅ Borrow Records: View, Create, Return, Approve                    │
│  ✅ Incidents: View, Create, Assign, Resolve                          │
│  ✅ Maintenance: Schedule, View, Complete                             │
│  ✅ Reports & Dashboard: View, Export                                  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  👨‍🔧 TECHNICIAN (tech@qlserver.com / tech123)                           │
│  ════════════════════════════════════════════════════════════════════  │
│  Kỹ thuật viên, có quyền trên tài nguyên & xử lý sự cố               │
│                                                                         │
│  Có thể làm:                                                            │
│  ✅ Login / Logout                                                      │
│  ✅ Server Management: View only, Update Status                       │
│  ✅ Equipment Management: View, Borrow/Return                         │
│  ✅ Borrow Records: View, Create, Return                             │
│  ✅ Incidents: View, Create, Resolve (khôngAssign)                   │
│  ✅ Maintenance: View, Start, Complete (not Schedule)                │
│  ✅ Reports & Dashboard: View (not Export)                            │
│                                                                         │
│  KHÔNG thể làm:                                                         │
│  ❌ Add/Edit/Delete Server                                             │
│  ❌ Add/Edit/Delete Equipment                                          │
│  ❌ Manage Users                                                        │
│  ❌ Assign Incidents                                                    │
│  ❌ Schedule Maintenance                                               │
│  ❌ Export Reports                                                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  👁️ VIEWER (viewer@qlserver.com / viewer123)                          │
│  ════════════════════════════════════════════════════════════════════  │
│  Người xem, CHỈ CÓ QUYỀN ĐỌC                                          │
│                                                                         │
│  Có thể làm:                                                            │
│  ✅ Login / Logout                                                      │
│  ✅ View Dashboard (READ ONLY)                                         │
│  ✅ View Reports (READ ONLY)                                           │
│                                                                         │
│  KHÔNG thể làm:                                                         │
│  ❌ Mọi thứ khác                                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

BẢNG SO SÁNH NHANH:
═════════════════════════════════════════════════════════════════════════

│ Chức Năng                    │  Admin  │  Tech  │ Viewer │
├──────────────────────────────┼─────────┼────────┼────────┤
│ 1. Login / Logout            │   ✅    │   ✅   │   ✅   │
│ 2. View Dashboard            │   ✅    │   ✅   │   ✅   │
│ 3. View Reports              │   ✅    │   ✅   │   ✅   │
│ 4. Export Reports            │   ✅    │   ✅   │   ❌   │
├──────────────────────────────┼─────────┼────────┼────────┤
│ 5. Manage Users              │   ✅    │   ❌   │   ❌   │
├──────────────────────────────┼─────────┼────────┼────────┤
│ 6. View Servers              │   ✅    │   ✅   │   ❌   │
│ 7. Add Server                │   ✅    │   ❌   │   ❌   │
│ 8. Update Server Info        │   ✅    │   ❌   │   ❌   │
│ 9. Delete Server             │   ✅    │   ❌   │   ❌   │
│ 10. Update Server Status     │   ✅    │   ✅   │   ❌   │
├──────────────────────────────┼─────────┼────────┼────────┤
│ 11. View Equipment           │   ✅    │   ✅   │   ❌   │
│ 12. Add Equipment            │   ✅    │   ❌   │   ❌   │
│ 13. Update Equipment         │   ✅    │   ❌   │   ❌   │
│ 14. Create Borrow Record     │   ✅    │   ✅   │   ❌   │
│ 15. Return Equipment         │   ✅    │   ✅   │   ❌   │
├──────────────────────────────┼─────────┼────────┼────────┤
│ 16. Report Incident          │   ✅    │   ✅   │   ❌   │
│ 17. Assign Incident          │   ✅    │   ❌   │   ❌   │
│ 18. Resolve Incident         │   ✅    │   ✅   │   ❌   │
├──────────────────────────────┼─────────┼────────┼────────┤
│ 19. Schedule Maintenance     │   ✅    │   ❌   │   ❌   │
│ 20. Start Maintenance        │   ✅    │   ✅   │   ❌   │
│ 21. Complete Maintenance     │   ✅    │   ✅   │   ❌   │
└──────────────────────────────┴─────────┴────────┴────────┘

TÓMSƠ:
- Admin: Toàn quyền (21/21 UC)
- Technician: 15/21 UC (quản lý tài nguyên & xử lý sự cố)
- Viewer: 4/21 UC (chỉ xem)
```

---

## PHẦN 2: USE CASE - CHI TIẾT ACTORS & FLOWS

### Actors & Permissions

```
┌──────────────────────────────────────────────────┐
│               ACTORS (3 vai trò)                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  👤 ADMIN                                       │
│     └─ Toàn quyền trên hệ thống               │
│        ├─ Quản lý user                          │
│        ├─ Tạo/sửa/xóa server, equipment       │
│        ├─ Gán sự cố                            │
│        └─ Lập bảo trì                          │
│                                                  │
│  👨‍🔧 TECHNICIAN (Kỹ thuật viên)                │
│     └─ Quản lý tài nguyên & xử lý sự cố       │
│        ├─ Xem server, thiết bị                 │
│        ├─ Cập nhật trạng thái server           │
│        ├─ Mượn/trả thiết bị                    │
│        ├─ Báo cáo & giải quyết sự cố          │
│        └─ Thực hiện bảo trì                    │
│                                                  │
│  👁️ VIEWER (Người xem)                         │
│     └─ Chỉ xem báo cáo & dashboard            │
│        ├─ Xem dashboard                        │
│        └─ Xem báo cáo                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Use Cases & Relationships

```
┌──────────────────────────────────────────────────────────────────────┐
│ USE CASE FLOW CHART - ADMIN VỀ SERVER                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Admin                                                               │
│    │                                                                 │
│    ├──→ [Login] ──────→ Hệ thống xác thực → Trả token              │
│    │                                                                 │
│    ├──→ [View Servers] ──→ Display danh sách                        │
│    │                                                                 │
│    ├──→ [Add Server]                                                │
│    │      └──┬──→ Validate input                                    │
│    │         ├──→ <<include>> [Update DB]                           │
│    │         └──→ Return confirmation                               │
│    │                                                                 │
│    ├──→ [Update Server]                                             │
│    │      └──┬──→ Validate                                          │
│    │         ├──→ <<include>> [Update DB]                           │
│    │         └──→ Return confirmation                               │
│    │                                                                 │
│    ├──→ [Delete Server]                                             │
│    │      └──┬──→ Confirm delete                                    │
│    │         ├──→ <<include>> [Update DB]                           │
│    │         └──→ Return confirmation                               │
│    │                                                                 │
│    └──→ [Logout] ──────→ Clear token → Logout                       │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## PHẦN 3: ERD MODEL - HÌNH ẢNH HOÀN CHỈNH

### ERD - Sơ Đồ Toàn Bộ

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

## PHẦN 4: ERD - CHI TIẾT TỪNG ENTITY

### Entity: USER
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

### Entity: SERVERROOM
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

### Entity: RACK
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

### Entity: SERVER
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

### Entity: EQUIPMENT
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

### Entity: NETWORKDEVICE
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

### Entity: BORROWRECORD
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

### Entity: INCIDENT
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

### Entity: MAINTENANCE
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

---

## PHẦN 5: CHÚ THÍCH VỀ CARDINALITY

```
┌─────────────────────────────────────────────────────┐
│        CARDINALITY NOTATION (Ký Hiệu)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CROW'S FOOT NOTATION (cách vẽ trong Draw.io):     │
│                                                     │
│  ||  ┬───→ "1 và chỉ 1"                           │
│      │     (EXACTLY ONE)                           │
│                                                     │
│  o|  ┬───→ "0 hoặc 1"                             │
│      │     (ZERO OR ONE)                           │
│                                                     │
│  |{  ┬───→ "1 hoặc nhiều"                         │
│      │     (ONE OR MORE)                           │
│                                                     │
│  o{  ┬───→ "0 hoặc nhiều"                         │
│      │     (ZERO OR MANY)                          │
│                                                     │
│  VÍ DỤ:                                             │
│  ┌─────────┐ o{ ───→ |{ ┌──────────┐              │
│  │ Parent  │           │ Child    │              │
│  └─────────┘           └──────────┘              │
│                                                     │
│  Nghĩa: 1 Parent có 0..N Children               │
│         1 Child thuộc 1..N Parents              │
│                                                     │
└─────────────────────────────────────────────────────┘

CARDINALITY CHO DỰ ÁN QL SERVER:

1. ServerRoom (1) ── o{ ── Equipment (0..N)
   → 1 phòng có 0 đến nhiều thiết bị

2. Rack (1) ── |{ ── Server (1..N)
   → 1 tủ phải có ít nhất 1 server

3. Server (1) ── |{ ── Incident (1..N)
   → 1 server có thể có 1 hoặc nhiều sự cố

4. User (1) ── |{ ── Incident (1..N)
   → 1 user có thể báo cáo nhiều sự cố

5. Equipment (1) ── o{ ── BorrowRecord (0..N)
   → 1 thiết bị có thể mượn 0 đến nhiều lần
```

---

## PHẦN 6: FLOW RELATIONSHIPS

```
CHI TIẾT CÁC QUAN HỆ (12 relationships):

┌─────────────────────────────────────────────────────────┐
│ R1: ServerRoom (1:N) RACK                              │
│    Mối quan hệ: chứa                                    │
│    FK: Rack.room → ServerRoom._id                      │
│    Cardinality: 1 phòng có 1..N tủ rack               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R2: ServerRoom (1:N) EQUIPMENT                          │
│    Mối quan hệ: chứa                                    │
│    FK: Equipment.room → ServerRoom._id                 │
│    Cardinality: 1 phòng có 0..N thiết bị              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R3: ServerRoom (1:N) NETWORKDEVICE                      │
│    Mối quan hệ: chứa                                    │
│    FK: NetworkDevice.room → ServerRoom._id             │
│    Cardinality: 1 phòng có 0..N thiết bị mạng        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R4: Rack (1:N) SERVER                                  │
│    Mối quan hệ: chứa                                    │
│    FK: Server.rack → Rack._id                          │
│    Cardinality: 1 tủ có 1..N server                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R5: Server (1:N) INCIDENT                              │
│    Mối quan hệ: có                                      │
│    FK: Incident.server → Server._id                    │
│    Cardinality: 1 server có 0..N sự cố               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R6: Server (1:N) MAINTENANCE                           │
│    Mối quan hệ: bảo trì                                │
│    FK: Maintenance.server → Server._id (optional)     │
│    Cardinality: 1 server có 0..N lịch bảo trì        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R7: Equipment (1:N) BORROWRECORD                        │
│    Mối quan hệ: mượn                                    │
│    FK: BorrowRecord.equipment → Equipment._id          │
│    Cardinality: 1 thiết bị có 0..N phiếu mượn        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R8: NetworkDevice (1:N) MAINTENANCE                     │
│    Mối quan hệ: bảo trì                                │
│    FK: Maintenance.networkDevice → NetworkDevice._id   │
│    Cardinality: 1 thiết bị mạng có 0..N lần bảo trì  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R9: User (1:N) INCIDENT (báo cáo)                       │
│    Mối quan hệ: báo cáo                                │
│    FK: Incident.reportedBy → User._id                  │
│    Cardinality: 1 user có 0..N sự cố báo cáo         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R10: User (1:N) INCIDENT (gán)                          │
│     Mối quan hệ: gán                                    │
│     FK: Incident.assignedTo → User._id                 │
│     Cardinality: 1 user nhận 0..N sự cố để xử lý      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R11: User (1:N) MAINTENANCE                             │
│     Mối quan hệ: thực hiện                              │
│     FK: Maintenance.performedBy → User._id             │
│     Cardinality: 1 user thực hiện 0..N lần bảo trì    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ R12: User (1:N) BORROWRECORD                            │
│     Mối quan hệ: phê duyệt                              │
│     FK: BorrowRecord.approvedBy → User._id             │
│     Cardinality: 1 user phê duyệt 0..N phiếu mượn    │
└─────────────────────────────────────────────────────────┘
```

---

## PHẦN 7: BẢNG TÓM TẮT QUICK LOOKUP

### Use Cases Quick Reference

```
┌──────────────┬─────────────────────────────────────┐
│ Category     │ Use Cases (14 cái)                  │
├──────────────┼─────────────────────────────────────┤
│ Auth         │ 1. Login ✅                         │
│              │ 2. Logout ✅                        │
├──────────────┼─────────────────────────────────────┤
│ Server       │ 3. View Servers ✅                  │
│              │ 4. Add Server ✅                    │
│              │ 5. Update Server ✅                 │
│              │ 6. Delete Server ✅                 │
│              │ 7. Update Status ✅                 │
├──────────────┼─────────────────────────────────────┤
│ Equipment    │ 8. View Equipment ✅                │
│              │ 9. Add Equipment ✅                 │
│              │ 10. Create Borrow ✅                │
│              │ 11. Return Equipment ✅             │
├──────────────┼─────────────────────────────────────┤
│ Incident     │ 12. Report Incident ✅              │
│              │ 13. Assign Incident ✅              │
│              │ 14. Resolve Incident ✅             │
├──────────────┼─────────────────────────────────────┤
│ Maintenance  │ 15. Schedule Maintenance ✅         │
│              │ 16. Complete Maintenance ✅         │
├──────────────┼─────────────────────────────────────┤
│ Reports      │ 17. View Dashboard ✅               │
│              │ 18. View Reports ✅                 │
│              │ 19. Export Report ✅                │
└──────────────┴─────────────────────────────────────┘
```

### Entities Quick Reference

```
┌────────────┬─────────┬──────────────────────────────┐
│ Entity     │ Count   │ Main Fields                  │
├────────────┼─────────┼──────────────────────────────┤
│ User       │ 1 cái   │ email, role, password        │
│ ServerRoom │ 1 cái   │ roomCode, temp, humidity     │
│ Rack       │ 1 cái   │ rackCode, floors             │
│ Server     │ 1 cái   │ serverCode, cpu, status      │
│ Equipment  │ 1 cái   │ equipmentCode, quantity      │
│ NetworkDev │ 1 cái   │ deviceCode, type             │
│ BorrowRec  │ 1 cái   │ borrowNumber, quantity       │
│ Incident   │ 1 cái   │ title, severity, status      │
│ Mainten.   │ 1 cái   │ scheduledDate, content       │
│ Log        │ 1 cái   │ userId, action, timestamp    │
├────────────┼─────────┼──────────────────────────────┤
│ TOTAL      │ 10 cái  │                              │
└────────────┴─────────┴──────────────────────────────┘
```

---

**CHỊ CHỂ ĐÃY - NHỮNG ĐỘI VẼ VỪA RỒI VỊ VẬN TRONG DRAW.IO HOẶC VẼ TAY! ✅**
