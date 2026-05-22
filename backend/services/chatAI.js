const { getSystemContext, contextToText, answerFromRules } = require('./aiContext');

const SYSTEM_PROMPT = `Bạn là trợ lý AI của hệ thống Quản lý Phòng Server (QL Server).
Trả lời bằng tiếng Việt, rõ ràng, đúng trọng tâm.
BẮT BUỘC dựa trên mục "DỮ LIỆU HỆ THỐNG" bên dưới — đó là dữ liệu thật từ database.
- Liệt kê đầy đủ khi người dùng hỏi "tất cả", "danh sách", "có những gì".
- Câu hỏi tài khoản: theo phân quyền Admin/Technician/Viewer.
- Không bịa số liệu. Nếu không có trong dữ liệu, nói "không có trong hệ thống".`;

/** Thứ tự ưu tiên — model đầu tiên gọi được sẽ dùng (free tier hay hết quota 2.0-flash) */
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
];

async function callGemini(question, contextText) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return { text: null, error: 'Chưa cấu hình GEMINI_API_KEY trong backend/.env' };

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n--- DỮ LIỆU HỆ THỐNG ---\n${contextText}\n\n--- CÂU HỎI ---\n${question}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = `${model}: HTTP ${res.status}`;
        try {
          const errJson = JSON.parse(errText);
          lastError += ` — ${errJson.error?.message || errText.slice(0, 120)}`;
        } catch {
          lastError += ` — ${errText.slice(0, 120)}`;
        }
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) return { text, model };
      lastError = `${model}: không có nội dung trả về`;
    } catch (err) {
      lastError = `${model}: ${err.message}`;
    }
  }

  return { text: null, error: lastError || 'Gọi Gemini thất bại' };
}

async function chat(question, currentUser = null) {
  const ctx = await getSystemContext(currentUser);
  const contextText = contextToText(ctx);

  let answer = null;
  let source = 'rules';
  let geminiError = null;
  let geminiModel = null;

  if (process.env.GEMINI_API_KEY?.trim()) {
    const gemini = await callGemini(question, contextText);
    if (gemini.text) {
      answer = gemini.text;
      source = 'gemini';
      geminiModel = gemini.model;
    } else {
      geminiError = gemini.error;
      console.error('Gemini failed, using rules:', geminiError);
    }
  } else {
    geminiError = 'Chưa cấu hình GEMINI_API_KEY';
  }

  if (!answer) {
    answer = answerFromRules(question, ctx);
    if (geminiError && !answer.includes('trợ lý nội bộ')) {
      answer = `_(Gemini chưa dùng được: ${geminiError})_\n\n${answer}`;
    }
    source = 'rules';
  }

  return {
    answer,
    source,
    geminiModel,
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY?.trim()),
    geminiError: source === 'rules' ? geminiError : undefined,
    contextStats: {
      rooms: ctx.summary.totalRooms,
      servers: ctx.summary.totalServers,
      equipment: ctx.summary.totalEquipment,
      incidents: ctx.summary.totalIncidents,
      racks: ctx.summary.totalRacks,
      networkDevices: ctx.summary.totalNetworkDevices,
    },
  };
}

/** Kiểm tra nhanh API key (gọi 1 lần khi mở chat / GET /ai/status) */
async function verifyGeminiKey() {
  const result = await callGemini('Trả lời đúng một từ: OK', 'Kiểm tra kết nối.');
  if (result.text) return { ok: true, model: result.model };
  return { ok: false, error: result.error };
}

module.exports = { chat, callGemini, verifyGeminiKey };
