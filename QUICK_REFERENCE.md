# QUICK REFERENCE - TRA CỨU NHANH

## 1. BẢNG TÓMBẬT CÁC ENTITY VÀ ATTRIBUTES

| Entity | Mã | Mô Tả | Attributes Chính | Relationships |
|--------|-----|-------|-----------------|-----------------|
| **User** | US | Người dùng | email, role, password | báo/gán Incident, thực Maintenance |
| **ServerRoom** | SR | Phòng máy chủ | roomCode, temperature, humidity | chứa Rack/Equipment/NetworkDevice |
| **Rack** | RK | Tủ rack | rackCode, floors, maxDevices | chứa Server, in ServerRoom |
| **Server** | SV | Máy chủ | serverCode, cpu, ram, status | in Rack, có Incident/Maintenance |
| **NetworkDevice** | ND | Thiết bị mạng | deviceCode, type, ipAddress | in ServerRoom, bảo trì Maintenance |
| **Equipment** | EQ | Thiết bị phụ | equipmentCode, quantity, status | in ServerRoom, mượn BorrowRecord |
| **BorrowRecord** | BR | Phiếu mượn | borrowNumber, borrowDate, status | từ Equipment, in ServerRoom |
| **Incident** | IC | Sự cố | title, severity, status | của Server, báo/gán bởi User |
| **Maintenance** | MN | Bảo trì | scheduledDate, content, status | của Server/NetworkDevice, thực User |
| **Log** | LG | Nhật ký | action, userId, timestamp | ghi lại hoạt động |

---

## 2. ROLES VÀ PERMISSIONS

| Chức Năng | Admin | Technician | Viewer |
|----------|-------|-----------|--------|
| Xem Dashboard | ✅ | ✅ | ✅ |
| Quản lý User | ✅ | ❌ | ❌ |
| CRUD Server | ✅ | ❌ | ❌ |
| View Server | ✅ | ✅ | ✅ |
| Update Server Status | ✅ | ✅ | ❌ |
| Quản lý Equipment | ✅ | ❌ | ❌ |
| Tạo Phiếu Mượn | ✅ | ✅ | ❌ |
| Trả Equipment | ✅ | ✅ | ❌ |
| Báo Cáo Sự Cố | ✅ | ✅ | ❌ |
| Gán Sự Cố | ✅ | ❌ | ❌ |
| Giải Quyết Sự Cố | ✅ | ✅ | ❌ |
| Lập Bảo Trì | ✅ | ❌ | ❌ |
| Thực Hiện Bảo Trì | ✅ | ✅ | ❌ |
| Xem Báo Cáo | ✅ | ✅ | ✅ |
| Xuất Báo Cáo | ✅ | ✅ | ❌ |

---

## 3. STATUS WORKFLOWS

### 3.1. Server Status
```
offline ↔ online ↔ maintenance → online
```

### 3.2. Equipment Status
```
available → borrowed → available
         ↘ damaged ↗
         ↘ lost ↗
```

### 3.3. Incident Status
```
pending → in_progress → resolved
```

### 3.4. Maintenance Status
```
scheduled → in_progress → completed
        ↘ cancelled ↗
```

### 3.5. BorrowRecord Status
```
borrowed → returned
      ↘ overdue → returned/lost
```

---

## 4. DATABASE RELATIONSHIPS CHEAT SHEET

### 4.1. Foreign Keys
```
Server.rack → Rack._id (N:1)
Server.status → Enum (1:1)
Rack.room → ServerRoom._id (N:1)
Equipment.room → ServerRoom._id (N:1)
NetworkDevice.room → ServerRoom._id (N:1)
BorrowRecord.equipment → Equipment._id (N:1)
BorrowRecord.room → ServerRoom._id (N:1)
BorrowRecord.approvedBy → User._id (N:1)
Incident.server → Server._id (N:1)
Incident.reportedBy → User._id (N:1)
Incident.assignedTo → User._id (N:1)
Maintenance.server → Server._id (N:1, optional)
Maintenance.networkDevice → NetworkDevice._id (N:1, optional)
Maintenance.performedBy → User._id (N:1)
```

### 4.2. Cardinality Summary
```
1:N Relationships:
- ServerRoom (1) ─── chứa ───── (N) Rack
- ServerRoom (1) ─── chứa ───── (N) Equipment
- ServerRoom (1) ─── chứa ───── (N) NetworkDevice
- Rack (1) ───────── chứa ───── (N) Server
- Server (1) ───────── có ──────── (N) Incident
- Server (1) ───────── bảo trì ─── (N) Maintenance
- Equipment (1) ───── mượn ───── (N) BorrowRecord
- User (1) ────────── báo ────── (N) Incident
- User (1) ────────── gán ────── (N) Incident
- User (1) ────────── thực ───── (N) Maintenance
```

---

## 5. USE CASE SUMMARY

### 5.1. Admin Only UC
- UC1.3: Quản lý tài khoản user
- UC1.4: Phân quyền theo role
- UC2.2: Thêm phòng server
- UC2.4: Xóa phòng server
- UC3.2: Thêm server mới
- UC3.4: Xóa server
- UC3.6: Gán server vào Rack
- UC6.2: Thêm thiết bị mới
- UC6.4: Cập nhật số lượng
- UC8.1: Lập lịch bảo trì
- UC9.2: Gán sự cố cho tech

### 5.2. Technician UC
- UC2.1: Xem danh sách phòng
- UC3.1: Xem danh sách server
- UC3.5: Cập nhật trạng thái server
- UC6.1: Xem danh sách thiết bị
- UC6.5: Tạo phiếu mượn
- UC6.7: Trả thiết bị
- UC8.2: Cập nhật bảo trì
- UC8.3: Hoàn thành bảo trì
- UC9.1: Báo cáo sự cố
- UC9.3: Giải quyết sự cố
- UC10.1: Xem dashboard

### 5.3. Viewer UC
- UC2.1: Xem danh sách phòng
- UC10.1: Xem dashboard
- UC10.2: Xem báo cáo

---

## 6. API ENDPOINTS QUICK REFERENCE

```
AUTH:
  POST   /api/auth/login                 - Đăng nhập
  POST   /api/auth/logout                - Đăng xuất
  
ROOMS:
  GET    /api/rooms                      - Danh sách phòng
  GET    /api/rooms/:id                  - Chi tiết phòng
  POST   /api/rooms                      - Tạo phòng
  PUT    /api/rooms/:id                  - Cập nhật phòng
  
SERVERS:
  GET    /api/servers                    - Danh sách server
  GET    /api/servers/:id                - Chi tiết server
  POST   /api/servers                    - Tạo server
  PUT    /api/servers/:id                - Cập nhật
  PUT    /api/servers/:id/status         - Cập nhật status
  
EQUIPMENT:
  GET    /api/equipment                  - Danh sách thiết bị
  POST   /api/equipment                  - Thêm thiết bị
  PUT    /api/equipment/:id              - Cập nhật thiết bị
  
BORROW:
  GET    /api/borrow-records             - Danh sách phiếu
  POST   /api/borrow-records             - Tạo phiếu
  PUT    /api/borrow-records/:id/return  - Trả thiết bị
  
INCIDENTS:
  GET    /api/incidents                  - Danh sách sự cố
  POST   /api/incidents                  - Báo cáo sự cố
  PUT    /api/incidents/:id              - Cập nhật/gán
  
MAINTENANCE:
  GET    /api/maintenance                - Danh sách bảo trì
  POST   /api/maintenance                - Lập lịch bảo trì
  PUT    /api/maintenance/:id/start      - Bắt đầu bảo trì
  PUT    /api/maintenance/:id/complete   - Hoàn thành
  
DASHBOARD:
  GET    /api/dashboard/stats            - Thống kê
```

---

## 7. DATA VALIDATION RULES

| Field | Type | Validation |
|-------|------|-----------|
| email | String | Required, Unique, Email format |
| password | String | Required, Min 6 chars, Hash with bcrypt |
| role | Enum | ['admin', 'technician', 'viewer'] |
| roomCode | String | Required, Unique |
| roomName | String | Required |
| temperature | Number | 10-50°C (Optional range) |
| quantity | Number | Required, Min 0 |
| borrowedQuantity | Number | ≤ quantity |
| status | Enum | Depends on entity |
| severity | Enum | ['low', 'medium', 'high', 'critical'] |

---

## 8. NOTIFICATION EVENTS

| Sự Kiện | Người Nhận | Loại |
|--------|-----------|------|
| Server offline | Admin + Tech | Alert |
| Temperature > 30°C | Admin + Tech | Warning |
| Humidity > 80% | Admin + Tech | Warning |
| Phiếu mượn quá hạn | Admin + Borrower | Alert |
| Lịch bảo trì sắp tới | Tech | Reminder |
| Sự cố được gán | Tech | Notification |
| Sự cố được giải quyết | Reporter | Notification |
| Maintenance hoàn thành | Admin | Notification |

---

## 9. LUỒNG CHÍNH (MAIN FLOWS)

### 9.1. Luồng Đăng Nhập
```
1. User nhập email + password
2. Server validate credentials
3. Tạo JWT token
4. Lưu token ở client
5. Chuyển đến dashboard
```

### 9.2. Luồng Tạo Phiếu Mượn
```
1. Tech chọn equipment
2. Nhập số lượng + ngày trả
3. Validate: availableQty >= requested
4. Tạo BorrowRecord
5. Cập nhật Equipment (quantity giảm)
6. Trả phiếu số
```

### 9.3. Luồng Báo Cáo Sự Cố
```
1. Tech mở form
2. Nhập title + description + severity
3. Chọn server liên quan
4. Gửi report
5. Admin thông báo được nhận
6. Admin gán cho tech khác
```

### 9.4. Luồng Bảo Trì
```
1. Admin lập lịch: chọn server/device + date
2. Tech thấy lịch
3. Tech nhấp "Bắt Đầu" → status = in_progress
4. Tech nhập nội dung thực hiện
5. Tech nhấp "Hoàn Thành" + nhập chi phí
6. Server status cập nhật → online
7. Admin thấy báo cáo
```

### 9.5. Luồng Trả Thiết Bị
```
1. Tech tìm phiếu mượn
2. Nhấp "Trả"
3. Nhập ngày trả thực tế
4. Kiểm tra: nếu quá hạn → overdue
5. Cập nhật BorrowRecord: status = returned/overdue
6. Cập nhật Equipment: quantity tăng lại
```

---

## 10. ERROR HANDLING CODES

| Code | Meaning | HTTP Status |
|------|---------|------------|
| 200 | Success | OK |
| 201 | Created | Created |
| 400 | Bad Request | Bad Request |
| 401 | Unauthorized | Unauthorized |
| 403 | Forbidden | Forbidden |
| 404 | Not Found | Not Found |
| 409 | Duplicate | Conflict |
| 422 | Validation Error | Unprocessable |
| 500 | Server Error | Internal Error |

---

## 11. SECURITY BEST PRACTICES

- ✅ Hash passwords với bcrypt
- ✅ Dùng JWT cho authentication
- ✅ Validate input server-side
- ✅ Implement CORS
- ✅ Rate limiting
- ✅ HTTPS chỉ
- ✅ Audit logs cho sensitive actions
- ✅ Role-based access control (RBAC)

---

## 12. PERFORMANCE TIPS

- ✅ Dùng pagination (limit, offset)
- ✅ Index fields thường query: email, roomCode, serverCode
- ✅ Cache dashboard stats
- ✅ Use aggregate pipeline cho reports
- ✅ Optimize image sizes
- ✅ Lazy load large lists
- ✅ Database connection pooling

---

## 13. TESTING STRATEGY

### Unit Tests
- Validate functions
- Helper functions
- Utility methods

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- User workflows
- Form submission
- State transitions

### Load Tests
- Dashboard loading
- Report generation
- Concurrent users

---

## 14. DEPLOYMENT CHECKLIST

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data loaded (production)
- [ ] SSL certificates installed
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Logging setup
- [ ] Error tracking enabled
- [ ] Performance metrics collected
- [ ] Documentation updated

---

## 15. FILE STRUCTURE GUIDE

```
QL_SVer/
├── backend/
│   ├── models/          ← Database schemas
│   ├── routes/          ← API endpoints
│   ├── controllers/     ← Business logic
│   ├── middleware/      ← Auth, logging, etc
│   ├── services/        ← Business services
│   ├── config/          ← Database config
│   └── server.js        ← Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  ← Reusable components
│   │   ├── pages/       ← Page components
│   │   ├── context/     ← Auth context
│   │   ├── api/         ← API calls
│   │   └── styles/      ← CSS
│   └── vite.config.js
│
└── Documentation/
    ├── PHAN_TICH_HE_THONG.md
    ├── CHI_TIET_USECASE_DFD.md
    └── HUONG_DAN_VE_DIAGRAM.md
```

---

## 16. SHORTCUT COMMANDS

```bash
# Backend
npm run dev                 - Chạy backend
npm run seed              - Tạo dữ liệu mẫu

# Frontend
npm run dev               - Chạy frontend dev server
npm run build             - Build production

# Full Stack
npm run install:all       - Cài đặt tất cả dependencies

# Database
mongod                    - Start MongoDB
```

---

## 17. COMMON WORKFLOWS

### Thêm Feature Mới
```
1. Tạo Model (backend/models/)
2. Tạo Routes (backend/routes/)
3. Tạo Controller (backend/controllers/)
4. Tạo Page/Component (frontend/pages/)
5. Thêm API call (frontend/api/)
6. Test API
7. Test UI
```

### Fix Bug
```
1. Reproduce bug
2. Check logs
3. Identify root cause
4. Fix code
5. Test fix
6. Commit & Push
```

---

## 18. LIÊN HỆ & HỖ TRỢ

- MongoDB docs: https://docs.mongodb.com
- Express docs: https://expressjs.com
- React docs: https://react.dev
- JWT: https://jwt.io
- Mongoose: https://mongoosejs.com

---

**Tài liệu Quick Reference này giúp bạn tra cứu nhanh các thông tin quan trọng của dự án QL Server.**

Lưu bookmark hoặc in ra để dễ tham khảo!
