import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import '../styles/chatbot.css';

const SUGGESTIONS = [
  'Liệt kê tất cả server và cấu hình',
  'Có những thiết bị mạng nào?',
  'Danh sách thiết bị trong kho',
  'Sự cố nào đang chưa xử lý?',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Xin chào! Tôi trả lời từ dữ liệu thật trong hệ thống: phòng, rack, server, mạng, kho thiết bị, sự cố, bảo trì, mượn thiết bị...',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/ai/status').then((r) => setAiStatus(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: q });
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: data.answer,
          source: data.source,
          geminiError: data.geminiError,
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Lỗi: ' + (err.response?.data?.message || err.message) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        onClick={() => setOpen(!open)}
        title="Trợ lý AI"
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <strong>Trợ lý AI</strong>
              <span
                className={`chatbot-badge ${aiStatus?.geminiWorking ? 'chatbot-badge-ok' : aiStatus?.geminiEnabled ? 'chatbot-badge-warn' : ''}`}
                title={aiStatus?.geminiError || ''}
              >
                {aiStatus?.geminiWorking
                  ? `Gemini ✓${aiStatus.geminiModel ? ` (${aiStatus.geminiModel})` : ''}`
                  : aiStatus?.geminiEnabled
                    ? 'Gemini lỗi — xem .env'
                    : 'Nội bộ (chưa có key)'}
              </span>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                <div className="chat-bubble">{msg.text}</div>
                {msg.source && msg.role === 'bot' && (
                  <span className="chat-source">
                    {msg.source === 'gemini' ? '✨ Gemini AI (toàn bộ dữ liệu)' : '📋 Trợ lý nội bộ (giới hạn)'}
                  </span>
                )}
                {msg.geminiError && msg.role === 'bot' && msg.source === 'rules' && (
                  <span className="chat-source chat-source-warn" title={msg.geminiError}>
                    Gemini lỗi — kiểm tra key trong backend/.env và restart server
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-msg chat-msg-bot">
                <div className="chat-bubble chat-typing">Đang suy nghĩ...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>

          <form
            className="chatbot-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
}
