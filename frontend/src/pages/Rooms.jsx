import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const empty = {
  roomCode: '',
  roomName: '',
  area: 0,
  temperature: 25,
  humidity: 50,
  powerConsumption: 0,
  acStatus: 'on',
  location: '',
  status: 'normal',
  sensorMode: 'auto',
};

function formatSensorTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('vi-VN');
}

export default function Rooms() {
  const { canEdit, isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [sensorStatus, setSensorStatus] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(() => {
    return api.get('/rooms').then((r) => setRooms(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    api.get('/rooms/sensor/status').then((r) => setSensorStatus(r.data)).catch(() => {});
  }, [load]);

  useEffect(() => {
    if (!sensorStatus?.autoUpdate) return undefined;
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [sensorStatus?.autoUpdate, load]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSyncSensor = async () => {
    setSyncing(true);
    try {
      await api.post('/rooms/sensor/sync');
      await load();
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      area: Number(form.area),
      powerConsumption: Number(form.powerConsumption),
      sensorMode: form.sensorMode || 'auto',
    };
    if (form.sensorMode === 'manual') {
      payload.temperature = Number(form.temperature);
      payload.humidity = Number(form.humidity);
    }
    if (modal === 'create') {
      if (form.sensorMode !== 'manual') {
        delete payload.temperature;
        delete payload.humidity;
      }
      await api.post('/rooms', payload);
    } else {
      await api.put(`/rooms/${form._id}`, payload);
    }
    setModal(null);
    load();
  };

  const isAutoSensor = (r) => r.sensorMode !== 'manual';
  const formAuto = form.sensorMode !== 'manual';

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Quản lý phòng server</h2>
          <p>
            {sensorStatus?.autoUpdate
              ? `Nhiệt độ/độ ẩm tự động cập nhật mỗi ${sensorStatus.intervalSeconds}s (theo tải server & điều hòa)`
              : 'Nhập nhiệt độ thủ công (cảm biến tự động đang tắt)'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {canEdit && sensorStatus?.autoUpdate && (
            <button type="button" className="btn btn-ghost" onClick={handleSyncSensor} disabled={syncing}>
              {syncing ? 'Đang đo...' : '🌡 Đo ngay'}
            </button>
          )}
          {canEdit && (
            <button type="button" className="btn btn-primary" onClick={() => { setForm(empty); setModal('create'); }}>
              + Thêm phòng
            </button>
          )}
        </div>
      </div>

      <div className="card table-wrap">
        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên phòng</th>
                <th>Diện tích</th>
                <th>Nhiệt độ</th>
                <th>Độ ẩm</th>
                <th>Điện năng</th>
                <th>Điều hòa</th>
                <th>Cảm biến</th>
                <th>Trạng thái</th>
                {canEdit && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id}>
                  <td>{r.roomCode}</td>
                  <td>{r.roomName}</td>
                  <td>{r.area} m²</td>
                  <td style={{ color: r.temperature > 28 ? 'var(--warning)' : 'inherit' }}>{r.temperature}°C</td>
                  <td>{r.humidity}%</td>
                  <td>{r.powerConsumption} W</td>
                  <td>
                    <span className={`badge badge-${r.acStatus === 'on' ? 'online' : 'offline'}`}>{r.acStatus}</span>
                  </td>
                  <td>
                    {isAutoSensor(r) ? (
                      <span className="badge badge-online" title={`Cập nhật: ${formatSensorTime(r.lastSensorAt)}`}>
                        Tự động
                      </span>
                    ) : (
                      <span className="badge badge-offline">Nhập tay</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${r.status}`}>{r.status}</span>
                  </td>
                  {canEdit && (
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setForm({ ...empty, ...r, sensorMode: r.sensorMode || 'auto' });
                          setModal('edit');
                        }}
                      >
                        Sửa
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={async () => {
                            if (confirm('Xóa?')) {
                              await api.delete(`/rooms/${r._id}`);
                              load();
                            }
                          }}
                        >
                          Xóa
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Thêm phòng' : 'Sửa phòng'} onClose={() => setModal(null)} onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Mã phòng</label>
              <input value={form.roomCode} onChange={(e) => set('roomCode', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tên phòng</label>
              <input value={form.roomName} onChange={(e) => set('roomName', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Diện tích (m²)</label>
              <input type="number" value={form.area} onChange={(e) => set('area', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vị trí</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Chế độ cảm biến</label>
            <select value={form.sensorMode || 'auto'} onChange={(e) => set('sensorMode', e.target.value)}>
              <option value="auto">Tự động (không cần nhập nhiệt độ)</option>
              <option value="manual">Nhập tay nhiệt độ / độ ẩm</option>
            </select>
          </div>
          {formAuto ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Nhiệt độ & độ ẩm do hệ thống đo tự động
              {form.lastSensorAt ? ` (lần cuối: ${formatSensorTime(form.lastSensorAt)})` : ''}.
              {form.temperature != null ? ` Hiện tại: ${form.temperature}°C, ${form.humidity}% độ ẩm.` : ''}
            </p>
          ) : (
            <div className="form-row">
              <div className="form-group">
                <label>Nhiệt độ (°C)</label>
                <input type="number" value={form.temperature} onChange={(e) => set('temperature', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Độ ẩm (%)</label>
                <input type="number" value={form.humidity} onChange={(e) => set('humidity', e.target.value)} />
              </div>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Điện năng (W)</label>
              <input type="number" value={form.powerConsumption} onChange={(e) => set('powerConsumption', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Điều hòa</label>
              <select value={form.acStatus} onChange={(e) => set('acStatus', e.target.value)}>
                <option value="on">Bật</option>
                <option value="off">Tắt</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
          </div>
          {formAuto && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Tắt điều hòa hoặc tăng server online → nhiệt độ tự tăng trong vài chục giây.
            </p>
          )}
        </Modal>
      )}
    </>
  );
}
