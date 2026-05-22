import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const statusLabels = { pending: 'Chưa xử lý', in_progress: 'Đang xử lý', resolved: 'Hoàn thành' };
const severityLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao', critical: 'Nghiêm trọng' };
const empty = { server: '', title: '', description: '', severity: 'medium', status: 'pending', resolution: '' };

export default function Incidents() {
  const { canEdit, isAdmin } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [servers, setServers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/incidents').then((r) => setIncidents(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); api.get('/servers').then((r) => setServers(r.data)); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modal === 'create') await api.post('/incidents', form);
    else await api.put(`/incidents/${form._id}`, form);
    setModal(null);
    load();
  };

  return (
    <>
      <div className="page-header">
        <div><h2>Quản lý sự cố</h2><p>Báo lỗi và xử lý sự cố hệ thống</p></div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setForm(empty); setModal('create'); }}>+ Báo sự cố</button>}
      </div>

      <div className="card table-wrap">
        {loading ? <p className="loading">Đang tải...</p> : (
          <table>
            <thead><tr><th>Tiêu đề</th><th>Server</th><th>Mức độ</th><th>Trạng thái</th><th>Ngày</th>{canEdit && <th>Thao tác</th>}</tr></thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc._id}>
                  <td>{inc.title}</td>
                  <td>{inc.server?.serverName || '-'}</td>
                  <td><span className={`badge badge-${inc.severity}`}>{severityLabels[inc.severity]}</span></td>
                  <td><span className={`badge badge-${inc.status}`}>{statusLabels[inc.status]}</span></td>
                  <td>{new Date(inc.createdAt).toLocaleDateString('vi-VN')}</td>
                  {canEdit && (
                    <td className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ ...inc, server: inc.server?._id }); setModal('edit'); }}>Xử lý</button>
                      {isAdmin && <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/incidents/${inc._id}`); load(); } }}>Xóa</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Báo sự cố' : 'Xử lý sự cố'} onClose={() => setModal(null)} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Server</label>
            <select value={form.server} onChange={(e) => set('server', e.target.value)} required>
              <option value="">-- Chọn server --</option>
              {servers.map((s) => <option key={s._id} value={s._id}>{s.serverName}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Tiêu đề</label><input value={form.title} onChange={(e) => set('title', e.target.value)} required /></div>
          <div className="form-group"><label>Mô tả</label><textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required /></div>
          <div className="form-row">
            <div className="form-group">
              <label>Mức độ</label>
              <select value={form.severity} onChange={(e) => set('severity', e.target.value)}>
                {Object.entries(severityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {modal === 'edit' && (
              <div className="form-group">
                <label>Trạng thái</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            )}
          </div>
          {modal === 'edit' && (
            <div className="form-group"><label>Giải pháp</label><textarea rows={2} value={form.resolution} onChange={(e) => set('resolution', e.target.value)} /></div>
          )}
        </Modal>
      )}
    </>
  );
}
