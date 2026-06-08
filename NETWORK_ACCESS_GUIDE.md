# 🌐 Hướng Dẫn Truy Cập Dự Án Qua IP Mạng

## 📋 Bước 1: Tìm Địa Chỉ IP Của Máy Tính

### Windows:
Mở Command Prompt hoặc PowerShell và chạy:
```bash
ipconfig
```

Tìm dòng **IPv4 Address** (thường là `192.168.x.x` hoặc `10.x.x.x`)

**Ví dụ:** `192.168.1.100`

## 🚀 Bước 2: Cấu Hình Dự Án

### Tùy chọn A: Chỉ sửa .env backend (Đơn giản)
1. Tạo/sửa file `.env` trong thư mục `backend/`:
```
HOST=0.0.0.0
PORT=5000
```

2. Frontend sẽ tự động proxy qua `/api` (không cần cấu hình)

### Tùy chọn B: Cấu hình đầy đủ (Khuyến nghị)
1. Sửa file `.env` trong thư mục `backend/`:
```
HOST=0.0.0.0
PORT=5000
```

2. Tạo/sửa file `.env.local` trong thư mục `frontend/`:
```
VITE_BACKEND_URL=http://192.168.1.100:5000
```
(Thay `192.168.1.100` bằng IP thực của bạn)

## 🏃 Bước 3: Chạy Dự Án

### Cách 1: Từ Terminal VS Code
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Cách 2: Dùng NPM Script
```bash
npm run install:all
npm run seed  # Nếu cần seed dữ liệu
```
Sau đó chạy full stack hoặc từng phần riêng lẻ

## 🌍 Bước 4: Truy Cập Từ Máy Khác

### Truy Cập Frontend:
```
http://192.168.1.100:3000
```

### Truy Cập Backend API (Test):
```
http://192.168.1.100:5000/api/health
```

### Truy Cập Health Check:
```
http://192.168.1.100:5000/api/health
```
Nếu thấy `{"status":"ok","message":"QL Server API"}` là thành công! ✅

## 🔒 Bước 5: Kiểm Tra Firewall

Nếu không kết nối được, có thể Firewall chặn. Cho phép các port:

### Windows:
1. Mở **Windows Defender Firewall**
2. Nhấp **Allow an app through firewall**
3. Tìm **Node.js** hoặc add ports `3000` và `5000`
4. Đảm bảo cả **Private** và **Public** được check

### Hoặc dùng PowerShell (Admin):
```powershell
New-NetFirewallRule -DisplayName "Node Backend 5000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5000
New-NetFirewallRule -DisplayName "Vite Frontend 3000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000
```

## ⚠️ Các Vấn Đề Thường Gặp

### 1. "Connection Refused" (Kết nối bị từ chối)
- ✅ Kiểm tra backend có chạy không: `http://YOUR_IP:5000/api/health`
- ✅ Kiểm tra Firewall
- ✅ Kiểm tra IP chính xác: `ipconfig`

### 2. "Cannot GET /api/..." (Lỗi API)
- ✅ Kiểm tra backend đã start đúng không
- ✅ Kiểm tra MongoDB connection
- ✅ Xem logs trong terminal backend

### 3. Frontend không kết nối được Backend
- ✅ Kiểm tra `VITE_BACKEND_URL` trong `.env.local`
- ✅ Thử hardcode IP trong `vite.config.js`
- ✅ Xóa browser cache hoặc dùng Incognito

### 4. CORS Error
- ✅ Backend đã có `cors()` middleware - không cần lo
- ✅ Nếu vẫn lỗi, thêm vào `backend/server.js`:
```javascript
app.use(cors({
  origin: '*', // Cho phép từ mọi nơi
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

## 📱 Truy Cập Từ Mobile/Tablet

Cùng mạng WiFi rồi truy cập:
```
http://192.168.1.100:3000
```

## 🔧 Cấu Hình Chi Tiết

### Backend (server.js)
- **HOST**: `0.0.0.0` - Nghe trên tất cả network interfaces
- **PORT**: `5000` - Port backend

### Frontend (vite.config.js)
- **host**: `0.0.0.0` - Nghe trên tất cả network interfaces
- **port**: `3000` - Port frontend
- **proxy**: Tự động forward `/api` requests tới backend

## 💡 Tips Thêm

1. **Dùng một IP cố định**: 
   - Set static IP cho máy tính
   - Hoặc reserve IP trong router

2. **Lưu lại cấu hình**:
   ```bash
   # Copy lệnh này vào một script hoặc bookmark
   http://YOUR_IP:3000
   ```

3. **Testing từ máy khác**:
   ```bash
   # Ping để test kết nối
   ping 192.168.1.100
   ```

---

**Nếu vẫn có vấn đề, kiểm tra:**
- ✅ Cùng mạng WiFi/LAN
- ✅ IP chính xác
- ✅ Port không bị chiếm
- ✅ Firewall cho phép
- ✅ Backend/Frontend chạy bình thường
