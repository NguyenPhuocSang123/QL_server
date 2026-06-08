# 📚 HỌC VẤN CƠ SỞ DỮ LIỆU - INDEX & HƯỚNG DẪN SỬ DỤNG

Tài liệu này giới thiệu toàn bộ tài liệu về cấu trúc cơ sở dữ liệu của dự án

---

## 📖 Các Tài Liệu Đã Tạo

### 1. **DATABASE_SCHEMA_FULL.md** ⭐⭐⭐
   
**Dành cho:** Người muốn hiểu chi tiết cấu trúc toàn bộ
   
**Nội dung:**
- ✅ Chi tiết đầy đủ của tất cả 10 collections
- ✅ Mô tả từng field, kiểu dữ liệu, ràng buộc
- ✅ Tất cả mối quan hệ (relationships)
- ✅ Enum values toàn bộ
- ✅ Constraints & validations
- ✅ Dung lượng lưu trữ ước tính
- ✅ Indexes cần tạo
- ✅ Ghi chú quan trọng

**Kích thước:** ~350 dòng

**Dùng khi:**
- Cần tìm hiểu chi tiết một field nào đó
- Xác định ràng buộc dữ liệu
- Thiết lập MongoDB indexes
- Viết documentation hoàn chỉnh

---

### 2. **DATABASE_ERD_FORMAT.md** ⭐⭐⭐

**Dành cho:** Người muốn vẽ sơ đồ ERD

**Nội dung:**
- ✅ Định dạng DbDiagram.io (Có thể copy-paste trực tiếp)
- ✅ Định dạng Mermaid Diagram
- ✅ CSV format cho tất cả fields
- ✅ Tóm tắt relationships
- ✅ Enum values reference

**Kích thước:** ~450 dòng

**Dùng khi:**
- Muốn vẽ ERD sơ đồ quan hệ
- Copy vào DbDiagram.io để tạo diagram tự động
- Export sang Mermaid diagram
- Cần format CSV cho import vào các công cụ khác

**Hướng dẫn sử dụng:**
1. Mở https://dbdiagram.io (hoặc https://drawdb.app)
2. Tạo project mới
3. Copy nội dung từ "Format DbDiagram.io" section
4. Paste vào công cụ
5. Diagram sẽ tự động generate!

---

### 3. **DATABASE_SAMPLE_DATA.md** ⭐⭐

**Dành cho:** Người muốn hiểu dữ liệu thực tế

**Nội dung:**
- ✅ Cấu trúc JSON của tất cả entities
- ✅ Dữ liệu mẫu thực từ seed.js
- ✅ Ví dụ mối quan hệ giữa các entities
- ✅ Quy trình hoàn chỉnh (từ User → Incident → Resolution)
- ✅ Tóm tắt dữ liệu seed (66 documents)

**Kích thước:** ~550 dòng

**Dùng khi:**
- Muốn hiểu dữ liệu thực tế trông như thế nào
- Cần ví dụ JSON cho các API
- Theo dõi quy trình từ đầu đến cuối
- Làm bài test/mock data

**Ví dụ:**
- Xem structure JSON của User, Server, Equipment
- Hiểu quy trình "Báo cáo sự cố → Gán người xử lý → Bảo trì → Giải quyết"
- Hiểu quy trình "Mượn thiết bị → Dùng → Trả"

---

### 4. **DATABASE_QUICK_REFERENCE.md** ⭐⭐⭐

**Dành cho:** Người muốn tra cứu nhanh

**Nội dung:**
- ✅ Bảng tóm tắt 10 collections
- ✅ Quick lookup cho từng entity
- ✅ Enum values tất cả
- ✅ Relationship map dạng biểu đồ
- ✅ Status transitions
- ✅ Các truy vấn thường gặp
- ✅ API endpoints

**Kích thước:** ~400 dòng

**Dùng khi:**
- Cần tra cứu nhanh 1 thông tin
- Muốn biết tất cả enum values
- Cần ví dụ truy vấn MongoDB
- Xem relationship structure nhanh
- Tra cứu validate rules

**Highlight:**
- Bảng 10 collections + số field
- Bảng enum values toàn bộ
- ASCII diagram relationships
- 7 ví dụ truy vấn thực tế
- 15+ status transitions

---

## 🎯 Lựa Chọn Tài Liệu Theo Nhu Cầu

```
┌─────────────────────────────────────────────────────────┐
│ BẠN MUỐN LÀM GÌ?                                        │
└─────────────────────────────────────────────────────────┘

┌─ Vẽ sơ đồ ERD?
│  └─ DATABASE_ERD_FORMAT.md ⭐⭐⭐
│     - DbDiagram.io format
│     - Mermaid format
│     - Copy-paste trực tiếp

├─ Tìm hiểu chi tiết một field?
│  └─ DATABASE_SCHEMA_FULL.md ⭐⭐⭐
│     - Tất cả field details
│     - Constraints
│     - Relationships

├─ Xem dữ liệu mẫu?
│  └─ DATABASE_SAMPLE_DATA.md ⭐⭐
│     - JSON structure
│     - Ví dụ thực từ seed
│     - Ví dụ quy trình

├─ Tra cứu nhanh?
│  └─ DATABASE_QUICK_REFERENCE.md ⭐⭐⭐
│     - Bảng tóm tắt
│     - Enum values
│     - Truy vấn mẫu

├─ Thiết lập MongoDB?
│  └─ DATABASE_SCHEMA_FULL.md
│     - Field types
│     - Indexes
│     - Constraints

├─ Viết API?
│  └─ DATABASE_SAMPLE_DATA.md
│     - JSON examples
│     - Relationships

├─ Tạo Unit test?
│  └─ DATABASE_SAMPLE_DATA.md
│     - Mock data
│     - Sample values

└─ Tất cả?
   └─ Đọc theo thứ tự:
      1. DATABASE_QUICK_REFERENCE.md (overview)
      2. DATABASE_SCHEMA_FULL.md (chi tiết)
      3. DATABASE_SAMPLE_DATA.md (ví dụ)
      4. DATABASE_ERD_FORMAT.md (diagram)
```

---

## 📊 So Sánh Các Tài Liệu

| Tiêu Chí | Schema Full | ERD Format | Sample Data | Quick Ref |
|----------|-------------|-----------|-------------|-----------|
| **Chi tiết field** | ✅✅✅ | ✅ | ✅ | ✅ |
| **Ví dụ JSON** | ✅ | ❌ | ✅✅✅ | ❌ |
| **Vẽ diagram** | ❌ | ✅✅✅ | ❌ | ❌ |
| **Tra cứu nhanh** | ❌ | ❌ | ❌ | ✅✅✅ |
| **Dễ đọc** | ❌ | ❌ | ✅✅ | ✅✅✅ |
| **Độ chi tiết** | ✅✅✅ | ✅✅ | ✅ | ✅ |
| **Dành cho** | DBA, Dev | Designer | Dev, QA | Everyone |
| **Số dòng** | 350 | 450 | 550 | 400 |

---

## 🚀 Bắt Đầu (Getting Started)

### Bước 1: Hiểu Overview (5 phút)
```
Đọc: DATABASE_QUICK_REFERENCE.md
- Phần "📊 Kiểu Dữ Liệu"
- Phần "🌐 Khóa Ngoại"
- Phần "📊 Relationship Map"
```

### Bước 2: Vẽ ERD (10 phút)
```
Dùng: DATABASE_ERD_FORMAT.md
1. Mở DbDiagram.io
2. Copy phần "Format DbDiagram.io"
3. Paste vào
4. Auto-generate!
```

### Bước 3: Tìm hiểu Chi tiết (20 phút)
```
Đọc: DATABASE_SCHEMA_FULL.md
- Section entity quan tâm nhất
- Ví dụ: EQUIPMENT, BORROWRECORD, etc.
```

### Bước 4: Xem Ví dụ Dữ liệu (10 phút)
```
Xem: DATABASE_SAMPLE_DATA.md
- JSON structure
- Seed data thực tế
```

**Tổng thời gian: ~45 phút để hiểu toàn bộ**

---

## 📋 Danh Sách 10 Collections

1. **users** - Tài khoản người dùng (3 records)
2. **serverrooms** - Phòng Data Center (2 records)
3. **racks** - Tủ máy chủ (3 records)
4. **servers** - Máy chủ vật lý (4 records)
5. **networkdevices** - Thiết bị mạng: router, switch, firewall, UPS (4 records)
6. **equipments** - Thiết bị phụ kiện: chuột, bàn phím, v.v (15 records)
7. **maintenances** - Bảo trì, sửa chữa (2 records)
8. **incidents** - Sự cố, vấn đề (2 records)
9. **borrowrecords** - Bản ghi mươi thiết bị (0 records mặc định)
10. **logs** - Nhật ký hoạt động (0 records mặc định)

---

## 🔗 Các Mối Quan Hệ Chính (Top 10)

| Từ | Đến | Loại | Ý Nghĩa |
|---|---|---|----|
| SERVERROOM | RACK | 1:N | Một phòng chứa nhiều rack |
| RACK | SERVER | 1:N | Một rack chứa nhiều server |
| SERVER | MAINTENANCE | 1:N | Một server có nhiều lịch bảo trì |
| SERVER | INCIDENT | 1:N | Một server có nhiều sự cố |
| USER | MAINTENANCE | 1:N | Một technician bảo trì nhiều server |
| USER | INCIDENT | 1:N | Một người có thể báo cáo/xử lý nhiều sự cố |
| EQUIPMENT | BORROWRECORD | 1:N | Một loại thiết bị được mượn nhiều lần |
| SERVERROOM | EQUIPMENT | 1:N | Một phòng lưu trữ nhiều loại thiết bị |
| BORROWRECORD | USER | N:1 | Mỗi bản ghi mượn được người nào đó phê duyệt |
| LOG | USER | N:1 | Mỗi log được ghi lại hành động của ai |

---

## 💡 Lưu Ý Quan Trọng

### ⚠️ MongoDB vs SQL
- **MongoDB**: NoSQL, document-based, không enforced foreign key ở database
- **Cần kiểm tra**: Foreign key relationships ở application level (Mongoose)

### ⚠️ Tất cả Collections có Timestamp
- `createdAt`: Tự động khi tạo
- `updatedAt`: Tự động cập nhật mỗi lần sửa

### ⚠️ Mật khẩu
- Được hash bằng bcrypt (salt rounds: 10)
- Không lưu plain text
- Tối thiểu 6 ký tự

### ⚠️ Enum Values
- Được kiểm tra ở application (Mongoose schema)
- Không enforced ở MongoDB level
- Nếu insert sai, cần validation tại app

### ⚠️ Quantity Logic (Equipment)
- `availableQuantity + borrowedQuantity = quantity`
- Cần kiểm tra logic này khi update

---

## 📞 Nếu Bạn Muốn...

**Viết MongoDB Query**
→ Xem DATABASE_QUICK_REFERENCE.md → Phần "Ví dụ Truy vấn"

**Hiểu Relationship**
→ Xem DATABASE_SCHEMA_FULL.md → Phần "BIỂU ĐỒ QUAN HỆ"

**Thêm Một Field Mới**
→ Xem DATABASE_SCHEMA_FULL.md → Tìm entity tương ứng → Thêm field

**Tạo Index**
→ Xem DATABASE_SCHEMA_FULL.md → Phần "INDEXES"

**Mock Data cho Test**
→ Xem DATABASE_SAMPLE_DATA.md → Copy JSON structure

**Vẽ ERD Diagram**
→ Xem DATABASE_ERD_FORMAT.md → Copy-paste vào DbDiagram.io

**Tra Cứu Enum Values**
→ Xem DATABASE_QUICK_REFERENCE.md → Phần "Enum Values Được Sử Dụng"

---

## 🎓 Hiểu Quy Trình Hoàn Chỉnh

### Ví dụ 1: Báo cáo và Xử lý Sự cố

```
1. User (technician) phát hiện sự cố
2. Tạo INCIDENT record
   - server_id: SRV-001
   - reportedBy: tech_user_id
   - title: "Server offline"
   - severity: "high"
   - status: "pending"

3. Admin xem và gán người xử lý
   - assignedTo: tech_user_id
   - status: "in_progress"

4. Technician xử lý
   - Tạo MAINTENANCE record
   - status: "in_progress"
   - content: "Khởi động lại server"
   - cost: 0

5. Hoàn thành bảo trì
   - MAINTENANCE.status: "completed"
   - MAINTENANCE.completedDate: now()
   - INCIDENT.status: "resolved"
   - INCIDENT.resolution: "Restarted and verified"
   - INCIDENT.resolvedAt: now()

6. Ghi log
   - LOG.user: tech_user_id
   - LOG.action: "INCIDENT_RESOLVED"
   - LOG.type: "operation"
```

### Ví dụ 2: Mượn Thiết Bị

```
1. Staff muốn mượn 5 chuột cho phòng IT
2. Tạo BORROWRECORD
   - equipment_id: EQ-001 (Mouse Logitech)
   - room_id: DC-01
   - borrowedBy: "Trần Văn A"
   - quantity: 5
   - status: "borrowed"
   - usageType: "use"

3. Admin phê duyệt
   - approvedBy: admin_user_id
   - status: vẫn "borrowed"

4. Cập nhật EQUIPMENT
   - availableQuantity: 195 (từ 200)
   - borrowedQuantity: 5 (từ 0)

5. Sau 1 tuần, trả lại
   - BORROWRECORD.status: "returned"
   - BORROWRECORD.actualReturnDate: now()

6. Cập nhật lại EQUIPMENT
   - availableQuantity: 200 (từ 195)
   - borrowedQuantity: 0 (từ 5)
```

---

## 📚 Tóm Tắt

| Tài Liệu | Loại | Kích Thước | Thời Gian Đọc | Mục Đích |
|---------|------|----------|--------------|---------|
| **Schema Full** | Reference | 350 dòng | 30 phút | Chi tiết đầy đủ |
| **ERD Format** | Technical | 450 dòng | 15 phút | Vẽ diagram |
| **Sample Data** | Example | 550 dòng | 20 phút | Ví dụ thực tế |
| **Quick Ref** | Quick Ref | 400 dòng | 10 phút | Tra cứu nhanh |

**Tất cả tài liệu:** ~1,750 dòng, ~4 tệp, 1-2 giờ để đọc kỹ lưỡng

---

## ✅ Checklist: Bạn Đã Sẵn Sàng Vẽ ERD!

- [ ] Đã đọc DATABASE_QUICK_REFERENCE.md
- [ ] Đã hiểu 10 collections
- [ ] Đã biết các enum values
- [ ] Đã mở DbDiagram.io hoặc DrawDB
- [ ] Đã copy nội dung từ DATABASE_ERD_FORMAT.md
- [ ] Đã paste vào công cụ
- [ ] Đã thấy diagram auto-generate
- [ ] Đã export/save diagram
- [ ] Đã xem DATABASE_SCHEMA_FULL.md cho chi tiết
- [ ] Đã sẵn sàng implement!

**Chúc mừng! Bạn đã có tất cả thông tin cần thiết! 🎉**

