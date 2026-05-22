# API Documentation - Quản lý Thiết bị & Mượn

## Mô tả
Chức năng mượn/lấy thiết bị (chuột, bàn phím, tai nghe, v.v.) trong phòng server với:
- Quản lý danh sách thiết bị
- Lọc thiết bị theo loại, trạng thái, số lượng còn sẵn
- **Admin tạo bản ghi mượn** (người mượn → số lượng giảm)
- 2 loại lấy: **Sử dụng nội bộ** hoặc **Lắp cho phòng ban khác**
- Xem danh sách người mượn → **Trả thiết bị** với mô tả tình trạng (hư hại?)
- Cập nhật trực động số lượng còn sẵn

---

## API Endpoints

### 1. Quản lý Thiết bị

#### GET /api/equipment/equipment
**Lấy danh sách tất cả thiết bị (có lọc)**

**Query Parameters:**
- `room` (optional): ID phòng để lọc
- `category` (optional): Loại thiết bị (mouse, keyboard, monitor, headset, cable, power_supply, other)
- `status` (optional): Trạng thái (available, in_stock, damaged, lost)
- `onlyAvailable` (optional): 'true' - chỉ lấy thiết bị còn sẵn

**Example:**
```bash
GET /api/equipment/equipment?category=mouse&onlyAvailable=true
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "equipmentCode": "MOUSE-001",
    "equipmentName": "Chuột Logitech MX Master",
    "category": "mouse",
    "quantity": 10,
    "availableQuantity": 8,
    "borrowedQuantity": 2,
    "status": "available",
    "description": "Chuột không dây chuyên nghiệp",
    "room": { "_id": "...", "roomName": "Phòng Chủ" },
    "createdAt": "2026-01-15T10:30:00Z"
  }
]
```

---

#### GET /api/equipment/equipment/:id
**Lấy chi tiết một thiết bị**

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "equipmentCode": "MOUSE-001",
  "equipmentName": "Chuột Logitech MX Master",
  "category": "mouse",
  "quantity": 10,
  "availableQuantity": 8,
  "borrowedQuantity": 2,
  "room": { "_id": "...", "roomName": "Phòng Chủ" },
  "status": "available",
  "description": "Chuột không dây chuyên nghiệp",
  "purchaseDate": "2025-10-01T00:00:00Z"
}
```

---

#### POST /api/equipment/equipment
**Tạo thiết bị mới**

**Yêu cầu:**
- `equipmentCode` (string, required): Mã thiết bị, phải duy nhất
- `equipmentName` (string, required): Tên thiết bị
- `category` (string, required): Loại thiết bị
- `quantity` (number, required): Số lượng ban đầu
- `room` (string, required): ID phòng chứa thiết bị
- `description` (string, optional): Mô tả
- `status` (string, optional): Trạng thái mặc định (available)

**Request Body:**
```json
{
  "equipmentCode": "MOUSE-002",
  "equipmentName": "Chuột Razer DeathAdder",
  "category": "mouse",
  "quantity": 5,
  "room": "507f1f77bcf86cd799439012",
  "description": "Chuột gaming chuyên dụng"
}
```

**Response:** (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "equipmentCode": "MOUSE-002",
  "equipmentName": "Chuột Razer DeathAdder",
  "category": "mouse",
  "quantity": 5,
  "availableQuantity": 5,
  "borrowedQuantity": 0,
  "status": "available"
}
```

---

#### PUT /api/equipment/equipment/:id
**Cập nhật thông tin thiết bị**

**Request Body:** (bất kỳ trường nào cần cập nhật)
```json
{
  "quantity": 12,
  "status": "in_stock",
  "description": "Cập nhật mô tả"
}
```

---

#### DELETE /api/equipment/equipment/:id
**Xóa thiết bị (chỉ khi không còn bản ghi mượn chưa trả)**

**Error Response:**
```json
{
  "message": "Không thể xóa thiết bị còn được mượn"
}
```

---

### 2. Quản lý Mượn Thiết bị

#### POST /api/equipment/borrow
**Tạo bản ghi mượn (Admin thêm người mượn → giảm số lượng)**

**Yêu cầu:**
- `equipmentId` (string, required): ID thiết bị cần mượn
- `borrowedBy` (string, required): Tên người mượn hoặc phòng ban
- `quantity` (number, required): Số lượng mượn
- `expectedReturnDate` (date, optional): Ngày dự kiến trả
- `usageType` (string, optional): 'use' (sử dụng nội bộ) hoặc 'install' (lắp phòng ban khác), mặc định: 'use'
- `notes` (string, optional): Ghi chú khi lấy

**Request Body:**
```json
{
  "equipmentId": "507f1f77bcf86cd799439011",
  "borrowedBy": "Nguyễn Văn A - Phòng IT",
  "quantity": 2,
  "usageType": "use",
  "expectedReturnDate": "2026-05-25",
  "notes": "Lấy để test thiết bị mới"
}
```

**Response:** (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "borrowNumber": "BRW-1716135600000-abc123def",
  "equipment": {
    "_id": "507f1f77bcf86cd799439011",
    "equipmentName": "Chuột Logitech MX Master",
    "category": "mouse"
  },
  "room": { "_id": "...", "roomName": "Phòng Chủ" },
  "borrowedBy": "Nguyễn Văn A - Phòng IT",
  "quantity": 2,
  "usageType": "use",
  "borrowDate": "2026-05-19T10:30:00Z",
  "expectedReturnDate": "2026-05-25T00:00:00Z",
  "status": "borrowed",
  "notes": "Lấy để test thiết bị mới",
  "approvedBy": { "_id": "...", "username": "admin" }
}
```

**Error Cases:**
```json
{
  "message": "Không đủ số lượng. Còn lại: 1 cái"
}
```

---

#### PUT /api/equipment/borrow/:id/return
**Trả thiết bị (tăng số lượng sẵn có)**

**Yêu cầu:**
- `notes` (string, required): Mô tả tình trạng khi trả (hư hại? bẩn? còn nguyên vẹn không?)

**Request Body:**
```json
{
  "notes": "Thiết bị hoạt động bình thường, không hư hại. Tình trạng sạch sẽ."
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "borrowNumber": "BRW-1716135600000-abc123def",
  "borrowedBy": "Nguyễn Văn A - Phòng IT",
  "status": "returned",
  "actualReturnDate": "2026-05-20T14:45:00Z",
  "notes": "Thiết bị hoạt động bình thường, không hư hại. Tình trạng sạch sẽ.",
  "quantity": 2
}
```

---

#### GET /api/equipment/borrow-records
**Lấy danh sách bản ghi mượn (có lọc)**

**Query Parameters:**
- `status` (optional): Trạng thái (borrowed, returned, overdue, lost)
- `room` (optional): ID phòng
- `borrowedBy` (optional): Tên người mượn
- `onlyActive` (optional): 'true' - chỉ lấy chưa trả

**Example:**
```bash
GET /api/equipment/borrow-records?status=borrowed
GET /api/equipment/borrow-records?onlyActive=true
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "borrowNumber": "BRW-1716135600000-abc123def",
    "equipment": {
      "_id": "507f1f77bcf86cd799439011",
      "equipmentName": "Chuột Logitech MX Master",
      "equipmentCode": "MOUSE-001"
    },
    "room": { "_id": "...", "roomName": "Phòng Chủ" },
    "borrowedBy": "Nguyễn Văn A - Phòng IT",
    "quantity": 2,
    "usageType": "use",
    "borrowDate": "2026-05-19T10:30:00Z",
    "expectedReturnDate": "2026-05-25T00:00:00Z",
    "actualReturnDate": null,
    "status": "borrowed",
    "notes": "Lấy để test thiết bị mới",
    "approvedBy": { "_id": "...", "username": "admin" }
  }
]
```

---

#### GET /api/equipment/borrow-records/:id
**Lấy chi tiết một bản ghi mượn**

**Response:** (chi tiết như trên)

---

## Các Loại Thiết bị (Category)

| Code | Tên Việt |
|------|---------|
| mouse | Chuột |
| keyboard | Bàn phím |
| monitor | Màn hình |
| headset | Tai nghe |
| cable | Dây cáp |
| power_supply | Nguồn điện |
| other | Khác |

---

## Các Trạng thái

### Thiết bị (Equipment Status)
- `available` - Còn sẵn
- `in_stock` - Trong kho
- `damaged` - Hỏng
- `lost` - Mất

### Bản ghi mượn (Borrow Status)
- `borrowed` - Đang được mượn
- `returned` - Đã trả
- `overdue` - Quá hạn
- `lost` - Mất

---

## Logic Cập nhật Số lượng

### Khi Mượn:
```
availableQuantity -= quantity mượn
borrowedQuantity += quantity mươn
```

### Khi Trả:
```
availableQuantity += quantity mượn
borrowedQuantity -= quantity mươn
```

---

## Ví dụ Use Case

### Scenario: Admin tạo bản ghi lấy 2 chuột để sử dụng

1. **GET** danh sách thiết bị để kiểm tra số lượng còn sẵn
```bash
GET /api/equipment/equipment?category=mouse&onlyAvailable=true
```

2. **POST** tạo bản ghi lấy (Admin nhập người lấy và loại lấy)
```bash
POST /api/equipment/borrow
{
  "equipmentId": "507f1f77bcf86cd799439011",
  "borrowedBy": "Nguyễn Văn A - Phòng IT",
  "quantity": 2,
  "usageType": "use",
  "expectedReturnDate": "2026-05-25"
}
```
→ Số lượng thiết bị **giảm đi 2**

3. **GET** danh sách người đang mượn
```bash
GET /api/equipment/borrow-records?status=borrowed
```

4. **PUT** trả thiết bị kèm mô tả tình trạng
```bash
PUT /api/equipment/borrow/507f1f77bcf86cd799439020/return
{
  "notes": "Thiết bị hoạt động bình thường, không hư hại. Tình trạng sạch sẽ."
}
```
→ Số lượng thiết bị **tăng lên 2**

---

## Ghi chú Bảo mật

- Tất cả endpoints yêu cầu xác thực (`protect` middleware)
- Tạo thiết bị yêu cầu quyền: admin hoặc technician
- Xóa thiết bị yêu cầu quyền: admin
- **Tạo/Trả bản ghi mượn**: tất cả người dùng đã đăng nhập đều có thể (admin khi tạo sẽ ghi vào approvedBy)

## Luồng Công việc

### 1️⃣ Chuẩn bị Thiết bị
- Admin tạo danh sách thiết bị với số lượng ban đầu
- Mỗi thiết bị có thể lọc theo loại, trạng thái, số lượng

### 2️⃣ Lấy Thiết bị
- Admin bấm nút **"🖱️ Lấy để sử dụng"** hoặc **"🔧 Lắp phòng ban khác"**
- Nhập tên người lấy, số lượng, hạn trả
- Bản ghi tạo → **số lượng thiết bị giảm**

### 3️⃣ Xem Danh sách Mượn
- Tab "Danh sách Mượn" → xem những người đang mượn (status = borrowed)
- Có thể xem lịch sử toàn bộ (tất cả người từng mượn)

### 4️⃣ Trả Thiết bị
- Admin bấm nút **"📥 Trả"** trên bản ghi
- Nhập mô tả tình trạng (hư hại không? bẩn sạch?)
- Bản ghi cập nhật → **số lượng thiết bị tăng**

---

## Error Codes

| HTTP | Mô tả |
|------|-------|
| 201 | Created - Thành công (tạo mới) |
| 400 | Bad Request - Yêu cầu không hợp lệ |
| 404 | Not Found - Không tìm thấy |
| 500 | Internal Server Error - Lỗi server |

---

**Được tạo:** 19/05/2026
