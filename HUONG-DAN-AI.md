# Hướng dẫn tích hợp AI — Chatbot & Cảnh báo nhiệt độ

Dự án đã có sẵn code cho 2 tính năng. Tài liệu này giải thích **từng bước** cách hoạt động và cách bạn tự mở rộng.

---

## Tổng quan kiến trúc

```
Frontend (React)
  ├── Chatbot.jsx          → POST /api/ai/chat
  └── Dashboard.jsx        → GET  /api/ai/temperature-alerts

Backend (Node.js)
  ├── routes/ai.js
  └── services/
        ├── aiContext.js       → Lấy dữ liệu MongoDB
        ├── temperatureAI.js   → Phân tích nhiệt độ (rule-based AI)
        └── chatAI.js          → Chat (Gemini hoặc fallback từ khóa)
```

---

## PHẦN 1: Cảnh báo nhiệt độ thông minh

### Bước 1 — Hiểu logic AI

File: `backend/services/temperatureAI.js`

| Ngưỡng | Ý nghĩa |
|--------|---------|
| 18–24°C | Lý tưởng |
| > 26°C | Cảnh báo |
| > 30°C | Nguy hiểm |
| Độ ẩm > 60% | Cảnh báo |
| Điều hòa tắt + nóng | Tăng điểm rủi ro |

AI tính **riskScore (0–100)**, **dự báo xu hướng**, **gợi ý xử lý**.

### Bước 2 — API

```
GET /api/ai/temperature-alerts
Header: Authorization: Bearer <token>
```

Response mẫu:
```json
{
  "overallRisk": "warning",
  "summary": "Có 1 phòng cần theo dõi...",
  "criticalCount": 0,
  "warningCount": 1,
  "analyses": [...],
  "alerts": [...]
}
```

### Bước 3 — Giao diện

File: `frontend/src/pages/Dashboard.jsx`

- Gọi API khi load Dashboard
- Hiển thị banner **AI — Cảnh báo nhiệt độ thông minh**
- CSS: `frontend/src/index.css` (class `ai-temp-*`)

### Bước 4 — Kiểm tra

1. Chạy backend + frontend
2. Vào **Dashboard**
3. Sửa nhiệt độ phòng > 28°C tại **Phòng Server** → refresh Dashboard → thấy cảnh báo AI

### Bước 5 — Mở rộng (đồ án)

- Lưu lịch sử nhiệt độ theo thời gian → dự báo bằng ML
- Gửi email khi `overallRisk === 'critical'`

---

## PHẦN 2: Chatbot hỏi đáp

### Bước 1 — Thu thập ngữ cảnh (RAG đơn giản)

File: `backend/services/aiContext.js`

Hàm `getSystemContext()` đọc **toàn bộ** MongoDB:
- Phòng, rack, server (CPU/RAM/ổ/OS/rack)
- Thiết bị mạng, sự cố, bảo trì
- Kho thiết bị (đầy đủ), phiếu mượn, tài khoản

→ Chuyển thành text đưa vào Gemini. Nếu Gemini lỗi → fallback từ khóa (giới hạn).

### Bước 2 — Hai chế độ trả lời

| Chế độ | Điều kiện | File |
|--------|-----------|------|
| **Gemini** | Có `GEMINI_API_KEY` trong `.env` | `chatAI.js` → Google API |
| **Nội bộ** | Không có key | `answerFromRules()` — khớp từ khóa |

### Bước 3 — Lấy API key Gemini (miễn phí)

**Lưu ý:** Key đặt trong file `backend/.env`, **không** dán vào ô chat chatbot.

1. Vào https://aistudio.google.com/apikey
2. Tạo API key mới (copy đủ, không thừa khoảng trắng)
3. Thêm vào `backend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```
4. **Restart backend** (`npm run dev`)
5. Mở chatbot — góc header phải hiện **Gemini**; câu trả lời có nhãn **✨ Gemini AI**

### Bước 4 — API Chat

```
POST /api/ai/chat
Body: { "message": "Phòng nào nhiệt độ cao?" }
```

Response:
```json
{
  "answer": "...",
  "source": "gemini" | "rules"
}
```

### Bước 5 — Giao diện Chatbot

- `frontend/src/components/Chatbot.jsx` — nút 🤖 góc phải
- `frontend/src/styles/chatbot.css`
- Gắn trong `Layout.jsx` → hiện mọi trang sau đăng nhập

### Bước 6 — Câu hỏi mẫu để demo

- "Phòng nào nhiệt độ cao?"
- "Server nào đang offline?"
- "Còn bao nhiêu chuột trong kho?"
- "Tổng quan hệ thống"
- "Có sự cố nào chưa xử lý?"

### Bước 7 — Thêm từ khóa mới (không cần Gemini)

Sửa `answerFromRules()` trong `aiContext.js`:

```javascript
if (q.includes('rack')) {
  return '... trả lời từ ctx ...';
}
```

---

## PHẦN 3: Chạy thử nhanh

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

1. Đăng nhập http://localhost:3000
2. **Dashboard** → xem block AI nhiệt độ
3. Bấm **🤖** → hỏi chatbot

---

## PHẦN 4: Ghi vào báo cáo đồ án

### Use Case gợi ý

- **UC-AI-01:** Hệ thống phân tích nhiệt độ và đưa cảnh báo
- **UC-AI-02:** Người dùng hỏi chatbot về trạng thái hệ thống

### Sơ đồ tuần tự (Chatbot)

```
User → Frontend → POST /api/ai/chat
                → Backend lấy context MongoDB
                → Gemini API (hoặc rules)
                → Trả answer → Hiển thị chat
```

### Công nghệ ghi trong báo cáo

- Rule-based Expert System (cảnh báo nhiệt độ)
- RAG-lite (Retrieval từ MongoDB + LLM)
- Google Gemini 1.5 Flash (optional)

---

## File đã thêm/sửa

| File | Mô tả |
|------|--------|
| `backend/services/aiContext.js` | Context + rules chat |
| `backend/services/temperatureAI.js` | AI nhiệt độ |
| `backend/services/chatAI.js` | Gọi Gemini |
| `backend/routes/ai.js` | API routes |
| `backend/server.js` | Mount `/api/ai` |
| `frontend/src/components/Chatbot.jsx` | UI chat |
| `frontend/src/pages/Dashboard.jsx` | Banner AI |
| `frontend/src/styles/chatbot.css` | Style chat |

---

## Lỗi thường gặp

| Lỗi | Cách xử lý |
|-----|------------|
| Chatbot trả lời chung chung | Key trong `backend/.env` (không phải ô chat); restart backend; xem nhãn ✨ Gemini AI |
| Hiện "Trợ lý nội bộ" / Gemini lỗi | Key sai hoặc hết quota — tạo key mới tại AI Studio |
| 401 khi gọi AI | Đăng nhập lại |
| Không thấy cảnh báo | Tăng nhiệt độ phòng trong **Phòng Server** |
| Gemini lỗi 429 | Hết quota — dùng chế độ Nội bộ (rules) |
