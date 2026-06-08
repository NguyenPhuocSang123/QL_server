# 📋 PHÂN QUYỀN ACTOR - DANH SÁCH CHỨC NĂNG

## 👤 ADMIN (admin@qlserver.com / admin123)

**Quyền:** Toàn quyền - Có thể access TẤT CẢ chức năng

```
✅ Dashboard                    - Xem tất cả thông tin
✅ Quản lý Server               - Xem, Thêm, Sửa, Xóa, Thay đổi trạng thái
✅ Phòng Server                 - Xem, Thêm, Sửa, Xóa, Quản lý nhiệt độ
✅ Tủ Rack                      - Xem, Thêm, Sửa, Xóa
✅ Thiết bị mạng                - Xem, Thêm, Sửa, Xóa
✅ Thiết bị phòng               - Xem, Thêm, Sửa, Xóa, Quản lý mượn/trả
✅ Bảo trì                      - Lập lịch, Xem, Cập nhật, Hoàn thành
✅ Sự cố                        - Báo cáo, Gán, Giải quyết
✅ Báo cáo                      - Xem, Export PDF/Excel/Word
✅ Tài khoản                    - Quản lý user (Tạo, Sửa, Xóa, Gán quyền)
✅ Nhật ký                      - Xem log tất cả hoạt động
```

---

## 👨‍🔧 TECHNICIAN (tech@qlserver.com / tech123)

**Quyền:** Quản lý tài nguyên & Xử lý sự cố - Chỉ có quyền với một số chức năng

```
✅ Dashboard                    - Xem thông tin (chỉ phòng & thiết bị liên quan)
✅ Quản lý Server               - CHỈ XEM, Thay đổi trạng thái ONLY
❌ Phòng Server                 - KHÔNG CÓ QUYỀN
❌ Tủ Rack                      - KHÔNG CÓ QUYỀN
✅ Thiết bị mạng                - CHỈ XEM
✅ Thiết bị phòng               - Xem, Tạo phiếu mượn, Trả thiết bị
✅ Bảo trì                      - Xem, Thực hiện, Hoàn thành (KHÔNG lập lịch)
✅ Sự cố                        - Báo cáo, Giải quyết (KHÔNG gán)
✅ Báo cáo                      - Xem ONLY (không Export)
❌ Tài khoản                    - KHÔNG CÓ QUYỀN quản lý user
✅ Nhật ký                      - Xem log của riêng mình
```

---

## 👁️ VIEWER (viewer@qlserver.com / viewer123)

**Quyền:** Chỉ xem - READ ONLY - Chỉ 3-4 chức năng

```
✅ Dashboard                    - Xem (chỉ thông tin công khai)
❌ Quản lý Server               - KHÔNG CÓ QUYỀN
❌ Phòng Server                 - KHÔNG CÓ QUYỀN
❌ Tủ Rack                      - KHÔNG CÓ QUYỀN
❌ Thiết bị mạng                - KHÔNG CÓ QUYỀN
❌ Thiết bị phòng               - KHÔNG CÓ QUYỀN
❌ Bảo trì                      - KHÔNG CÓ QUYỀN
❌ Sự cố                        - KHÔNG CÓ QUYỀN
✅ Báo cáo                      - Xem ONLY (không Export)
❌ Tài khoản                    - KHÔNG CÓ QUYỀN
❌ Nhật ký                      - KHÔNG CÓ QUYỀN
```

---

## 📊 BẢNG SO SÁNH NHANH

```
┌──────────────────────────────┬────────┬───────────┬────────┐
│ CHỨC NĂNG                    │ Admin  │Technician │ Viewer │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 1. Dashboard                 │   ✅   │    ✅     │   ✅   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 2. Quản lý Server            │   ✅   │   ✅*     │   ❌   │
│    - Xem                     │   ✅   │    ✅     │   ❌   │
│    - Thêm                    │   ✅   │    ❌     │   ❌   │
│    - Sửa                     │   ✅   │    ❌     │   ❌   │
│    - Xóa                     │   ✅   │    ❌     │   ❌   │
│    - Thay đổi trạng thái     │   ✅   │    ✅     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 3. Phòng Server              │   ✅   │    ❌     │   ❌   │
│    - Xem                     │   ✅   │    ❌     │   ❌   │
│    - Thêm/Sửa/Xóa           │   ✅   │    ❌     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 4. Tủ Rack                   │   ✅   │    ❌     │   ❌   │
│    - Xem                     │   ✅   │    ❌     │   ❌   │
│    - Thêm/Sửa/Xóa           │   ✅   │    ❌     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 5. Thiết bị mạng             │   ✅   │    ✅     │   ❌   │
│    - Xem                     │   ✅   │    ✅     │   ❌   │
│    - Thêm/Sửa/Xóa           │   ✅   │    ❌     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 6. Thiết bị phòng            │   ✅   │    ✅     │   ❌   │
│    - Xem                     │   ✅   │    ✅     │   ❌   │
│    - Thêm/Sửa/Xóa           │   ✅   │    ❌     │   ❌   │
│    - Mượn/Trả                │   ✅   │    ✅     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 7. Bảo trì                   │   ✅   │    ✅     │   ❌   │
│    - Xem                     │   ✅   │    ✅     │   ❌   │
│    - Lập lịch                │   ✅   │    ❌     │   ❌   │
│    - Thực hiện/Hoàn thành    │   ✅   │    ✅     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 8. Sự cố                     │   ✅   │    ✅     │   ❌   │
│    - Xem                     │   ✅   │    ✅     │   ❌   │
│    - Báo cáo                 │   ✅   │    ✅     │   ❌   │
│    - Gán                     │   ✅   │    ❌     │   ❌   │
│    - Giải quyết              │   ✅   │    ✅     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 9. Báo cáo                   │   ✅   │    ✅     │   ✅   │
│    - Xem                     │   ✅   │    ✅     │   ✅   │
│    - Export                  │   ✅   │    ✅     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 10. Tài khoản                │   ✅   │    ❌     │   ❌   │
│    - Quản lý User            │   ✅   │    ❌     │   ❌   │
├──────────────────────────────┼────────┼───────────┼────────┤
│ 11. Nhật ký (Log)            │   ✅   │    ✅     │   ❌   │
│    - Xem log                 │   ✅   │   ✅**    │   ❌   │
└──────────────────────────────┴────────┴───────────┴────────┘

*   = Technician chỉ có một số quyền
**  = Technician chỉ xem log của chính mình
✅  = CÓ QUYỀN
❌  = KHÔNG CÓ QUYỀN
```

---

## 🔐 CHI TIẾT QUYỀN ADMIN

| Chức năng | Hành động | Quyền |
|-----------|----------|-------|
| **Quản lý User** | Create User | ✅ |
| | Edit User | ✅ |
| | Delete User | ✅ |
| | Gán Role (Admin/Tech/Viewer) | ✅ |
| | Reset Password | ✅ |
| | Kích hoạt/Vô hiệu hóa | ✅ |
| **Dashboard** | Xem toàn bộ | ✅ |
| | Xem thống kê | ✅ |
| | Xem cảnh báo | ✅ |
| **Quản lý Server** | Create | ✅ |
| | Read | ✅ |
| | Update | ✅ |
| | Delete | ✅ |
| | Change Status | ✅ |
| **Phòng Server** | Quản lý toàn bộ | ✅ |
| | Cập nhật cảm biến | ✅ |
| **Tủ Rack** | CRUD | ✅ |
| **Thiết bị** | CRUD | ✅ |
| **Bảo trì** | Lập lịch | ✅ |
| | Xem | ✅ |
| | Update | ✅ |
| **Sự cố** | Báo cáo | ✅ |
| | Gán | ✅ |
| | Giải quyết | ✅ |
| **Báo cáo** | Xem | ✅ |
| | Export (PDF/Excel/Word) | ✅ |
| **Nhật ký** | Xem tất cả | ✅ |

---

## 🔐 CHI TIẾT QUYỀN TECHNICIAN

| Chức năng | Hành động | Quyền |
|-----------|----------|-------|
| **Dashboard** | Xem (phòng & thiết bị liên quan) | ✅ |
| **Quản lý Server** | Xem | ✅ |
| | Thêm/Sửa/Xóa | ❌ |
| | Thay đổi Status | ✅ |
| **Thiết bị mạng** | Xem | ✅ |
| | CRUD | ❌ |
| **Thiết bị phòng** | Xem | ✅ |
| | Tạo phiếu mượn | ✅ |
| | Trả thiết bị | ✅ |
| | Thêm mới | ❌ |
| **Bảo trì** | Xem | ✅ |
| | Lập lịch | ❌ |
| | Thực hiện | ✅ |
| | Hoàn thành | ✅ |
| **Sự cố** | Báo cáo | ✅ |
| | Xem | ✅ |
| | Gán | ❌ |
| | Giải quyết | ✅ |
| **Báo cáo** | Xem | ✅ |
| | Export | ✅ |
| **Nhật ký** | Xem log của mình | ✅ |
| | Xem log người khác | ❌ |

---

## 🔐 CHI TIẾT QUYỀN VIEWER

| Chức năng | Hành động | Quyền |
|-----------|----------|-------|
| **Dashboard** | Xem (công khai) | ✅ |
| **Báo cáo** | Xem | ✅ |
| | Export | ❌ |
| **Mọi chức năng khác** | - | ❌ |

---

## 📝 TÓM TẮT NHANH

**Tổng số chức năng:** 11 menu

| Actor | Số chức năng có quyền | %  |
|-------|----------------------|----|
| Admin | 11/11 | 100% |
| Technician | 7/11 | 63% |
| Viewer | 2/11 | 18% |

---

## 🎯 GỢI Ý KHI THIẾT KẾ CODE

```javascript
// Sử dụng role-based access control (RBAC)
const permissions = {
  admin: ['dashboard', 'server', 'room', 'rack', 'device', 'equipment', 'maintenance', 'incident', 'report', 'user', 'log'],
  technician: ['dashboard', 'server', 'device', 'equipment', 'maintenance', 'incident', 'report', 'log'],
  viewer: ['dashboard', 'report']
};

// Hoặc chi tiết từng action
const roleActions = {
  admin: {
    server: ['view', 'create', 'update', 'delete', 'changeStatus'],
    equipment: ['view', 'create', 'update', 'delete', 'borrow', 'return'],
    incident: ['view', 'create', 'assign', 'resolve'],
    report: ['view', 'export']
  },
  technician: {
    server: ['view', 'changeStatus'],
    equipment: ['view', 'borrow', 'return'],
    incident: ['view', 'create', 'resolve'],
    report: ['view', 'export']
  },
  viewer: {
    dashboard: ['view'],
    report: ['view']
  }
};
```

---

**✅ Tài liệu này ghi rõ từng chức năng thuộc actor nào!**

Bạn muốn tôi cập nhật hay sửa gì không?
