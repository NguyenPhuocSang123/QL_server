import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const statusLabels = { scheduled: 'Đã lên lịch', in_progress: 'Đang thực hiện', completed: 'Hoàn thành', cancelled: 'Đã hủy' };
const empty = { server: '', content: '', scheduledDate: '', cost: 0, status: 'scheduled', notes: '' };

export default function Maintenance() {
  const { canEdit, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [servers, setServers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/maintenance').then((r) => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); api.get('/servers').then((r) => setServers(r.data)); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, cost: Number(form.cost) };
    if (modal === 'create') await api.post('/maintenance', payload);
    else await api.put(`/maintenance/${form._id}`, payload);
    setModal(null);
    load();
  };

  return (
    <>
      <div className="page-header">
        <div><h2>Quản lý bảo trì</h2><p>Lịch bảo trì và lịch sử sửa chữa</p></div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setForm({ ...empty, scheduledDate: new Date().toISOString().slice(0, 10) }); setModal('create'); }}>+ Tạo lịch bảo trì</button>}
      </div>

      <div className="card table-wrap">
        {loading ? <p className="loading">Đang tải...</p> : (
          <table>
            <thead><tr><th>Server</th><th>Nội dung</th><th>Ngày</th><th>Người TH</th><th>Chi phí</th><th>Trạng thái</th>{canEdit && <th>Thao tác</th>}</tr></thead>
            <tbody>
              {items.map((m) => (
                <tr key={m._id}>
                  <td>{m.server?.serverName || '-'}</td>
                  <td>{m.content}</td>
                  <td>{new Date(m.scheduledDate).toLocaleDateString('vi-VN')}</td>
                  <td>{m.performedBy?.fullName || '-'}</td>
                  <td>{m.cost?.toLocaleString('vi-VN')} đ</td>
                  <td><span className={`badge badge-${m.status}`}>{statusLabels[m.status]}</span></td>
                  {canEdit && (
                    <td className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ ...m, server: m.server?._id, scheduledDate: m.scheduledDate?.slice(0, 10) }); setModal('edit'); }}>Sửa</button>
                      {isAdmin && <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/maintenance/${m._id}`); load(); } }}>Xóa</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Tạo lịch bảo trì' : 'Cập nhật bảo trì'} onClose={() => setModal(null)} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Server</label>
            <select value={form.server} onChange={(e) => set('server', e.target.value)} required>
              <option value="">-- Chọn server --</option>
              {servers.map((s) => <option key={s._id} value={s._id}>{s.serverName}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Nội dung</label><textarea rows={3} value={form.content} onChange={(e) => set('content', e.target.value)} required /></div>
          <div className="form-row">
            <div className="form-group"><label>Ngày bảo trì</label><input type="date" value={form.scheduledDate} onChange={(e) => set('scheduledDate', e.target.value)} required /></div>
            <div className="form-group"><label>Chi phí (VNĐ)</label><input type="number" value={form.cost} onChange={(e) => set('cost', e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </>
  );
}
