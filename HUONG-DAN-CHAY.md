# Hướng dẫn chạy dự án QL Server (VS Code)

## Cách nhanh nhất (Windows)

1. Cài **Node.js** (https://nodejs.org) và **MongoDB Community** (https://www.mongodb.com/try/download/community)
2. Bật dịch vụ MongoDB (Windows Services → **MongoDB Server** → Start)
3. Double-click file **`start.bat`** trong thư mục dự án
4. Mở trình duyệt: **http://localhost:3000**
5. Đăng nhập: `admin@qlserver.com` / `admin123`

---

## Chạy bằng VS Code (Visual Studio Code)

### Bước 1: Mở project

`File` → `Open Folder` → chọn thư mục `QL_SVer`

### Bước 2: Cài package (chỉ lần đầu)

Mở Terminal (`Ctrl + `` `):

```bash
npm run setup
```

(Lệnh này cài dependency + tạo dữ liệu mẫu)

### Bước 3: Chạy ứng dụng

**Cách A – 2 terminal:**

Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev:frontend
```

**Cách B – Task VS Code:**

`Terminal` → `Run Task` → **Run Full Stack**

### Bước 4: Truy cập

| Thành phần | Địa chỉ |
|------------|---------|
| Giao diện web | http://localhost:3000 |
| API backend | http://localhost:5000/api/health |

---

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@qlserver.com | admin123 |
| Kỹ thuật viên | tech@qlserver.com | tech123 |
| Người xem | viewer@qlserver.com | viewer123 |

---

## Lỗi thường gặp

### `MongoDB error` / `ECONNREFUSED`

- MongoDB chưa chạy → mở **Services** → start **MongoDB Server**
- Hoặc chạy: `net start MongoDB`

### `Port 5000 already in use`

- Đóng terminal backend cũ, hoặc đổi `PORT` trong `backend/.env`

### Trang web trắng / không đăng nhập được

- Kiểm tra backend đã chạy: mở http://localhost:5000/api/health
- Phải chạy **cả backend và frontend**

### Chạy lại dữ liệu mẫu

```bash
npm run seed
```

---

## Cấu trúc port

- **Frontend (Vite):** 3000  
- **Backend (Express):** 5000  
- **MongoDB:** 27017  
