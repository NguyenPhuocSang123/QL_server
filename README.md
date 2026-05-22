# Hệ thống quản lý phòng server (QL Server)

Ứng dụng web quản lý phòng server xây dựng bằng **Node.js + Express + MongoDB** (backend) và **React + Vite** (frontend).

## Chức năng

- Đăng nhập, phân quyền (Admin / Kỹ thuật viên / Người xem)
- Dashboard: tổng server, online/offline, nhiệt độ phòng, cảnh báo
- Quản lý server, phòng server, tủ rack
- Quản lý thiết bị mạng (Router, Switch, Firewall, UPS)
- Lịch bảo trì và sự cố
- Báo cáo thống kê (biểu đồ)
- Nhật ký hệ thống (Admin)

## Yêu cầu

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/try/download/community) (chạy tại `mongodb://127.0.0.1:27017`)

## Chạy nhanh (Windows)

Double-click **`start.bat`** → mở http://localhost:3000

Chi tiết: xem file **[HUONG-DAN-CHAY.md](./HUONG-DAN-CHAY.md)**

## Cài đặt

### 1. Cài dependency

```bash
cd d:\A\QL_SVer
npm run setup
```

### 2. Cấu hình backend

File `backend/.env` đã có sẵn. Chỉnh `MONGODB_URI` nếu MongoDB chạy port khác.

### 3. Tạo dữ liệu mẫu

```bash
npm run seed
```

### 4. Chạy ứng dụng

Mở **2 terminal** trong VS Code:

**Terminal 1 – Backend (port 5000):**
```bash
npm run dev:backend
```

**Terminal 2 – Frontend (port 3000):**
```bash
npm run dev:frontend
```

Mở trình duyệt: **http://localhost:3000**

## Tài khoản demo

| Vai trò        | Email                 | Mật khẩu  |
|----------------|-----------------------|-----------|
| Admin          | admin@qlserver.com    | admin123  |
| Kỹ thuật viên  | tech@qlserver.com     | tech123   |
| Người xem      | viewer@qlserver.com   | viewer123 |

## Cấu trúc thư mục

```
QL_SVer/
├── backend/          # API Node.js + Express + Mongoose
│   ├── models/       # User, Server, ServerRoom, Rack, ...
│   ├── routes/       # REST API
│   └── seed.js       # Dữ liệu mẫu
├── frontend/         # React + Vite
│   └── src/
│       ├── pages/    # Dashboard, Servers, Rooms, ...
│       └── components/
└── README.md
```

## API chính

| Method | Endpoint              | Mô tả              |
|--------|-----------------------|--------------------|
| POST   | /api/auth/login       | Đăng nhập          |
| GET    | /api/dashboard/stats  | Thống kê dashboard |
| GET    | /api/servers          | Danh sách server   |
| GET    | /api/rooms            | Danh sách phòng    |
| GET    | /api/incidents        | Sự cố              |

## Công nghệ

- **Backend:** Express, Mongoose, JWT, bcrypt
- **Frontend:** React 18, React Router, Axios, Recharts
- **Database:** MongoDB

## Gợi ý báo cáo đồ án

Dự án hỗ trợ các phần: Use Case, ERD (MongoDB collections), Class Diagram (models), giao diện dashboard, phân quyền, nhật ký log.
