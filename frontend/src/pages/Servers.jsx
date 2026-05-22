import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const emptyForm = {
  serverCode: '', serverName: '', cpu: '', ram: '', storage: '',
  ipAddress: '', os: '', status: 'offline', rack: '', rackPosition: 0,
};

export default function Servers() {
  const { canEdit, isAdmin } = useAuth();
  const [servers, setServers] = useState([]);
  const [racks, setRacks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    api.get('/servers', { params }).then((r) => setServers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/racks').then((r) => setRacks(r.data));
  }, []);

  const openCreate = () => { setForm(emptyForm); setModal('create'); };
  const openEdit = (s) => {
    setForm({ ...s, rack: s.rack?._id || s.rack || '', rackPosition: s.rackPosition || 0 });
    setModal('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, rack: form.rack || undefined, rackPosition: Number(form.rackPosition) };
    if (modal === 'create') await api.post('/servers', payload);
    else await api.put(`/servers/${form._id}`, payload);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa server này?')) return;
    await api.delete(`/servers/${id}`);
    load();
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <div className="page-header">
        <div><h2>Quản lý Server</h2><p>Danh sách máy chủ trong hệ thống</p></div>
        {canEdit && <button className="btn btn-primary" onClick={openCreate}>+ Thêm server</button>}
      </div>

      <div className="search-bar">
        <input placeholder="Tìm theo tên, mã, IP..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Bảo trì</option>
        </select>
        <button className="btn btn-ghost" onClick={load}>Tìm kiếm</button>
      </div>

      <div className="card table-wrap">
        {loading ? <p className="loading">Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>Mã</th><th>Tên</th><th>IP</th><th>CPU</th><th>RAM</th><th>Rack</th><th>Trạng thái</th>{canEdit && <th>Thao tác</th>}</tr>
            </thead>
            <tbody>
              {servers.map((s) => (
                <tr key={s._id}>
                  <td>{s.serverCode}</td>
                  <td>{s.serverName}</td>
                  <td>{s.ipAddress}</td>
                  <td>{s.cpu}</td>
                  <td>{s.ram}</td>
                  <td>{s.rack?.rackName || '-'}</td>
                  <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                  {canEdit && (
                    <td className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Sửa</button>
                      {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Xóa</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !servers.length && <p className="empty">Chưa có server</p>}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Thêm server' : 'Sửa server'} onClose={() => setModal(null)} onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Mã server</label><input value={form.serverCode} onChange={(e) => set('serverCode', e.target.value)} required /></div>
            <div className="form-group"><label>Tên server</label><input value={form.serverName} onChange={(e) => set('serverName', e.target.value)} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>CPU</label><input value={form.cpu} onChange={(e) => set('cpu', e.target.value)} /></div>
            <div className="form-group"><label>RAM</label><input value={form.ram} onChange={(e) => set('ram', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Ổ cứng</label><input value={form.storage} onChange={(e) => set('storage', e.target.value)} /></div>
            <div className="form-group"><label>IP</label><input value={form.ipAddress} onChange={(e) => set('ipAddress', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Hệ điều hành</label><input value={form.os} onChange={(e) => set('os', e.target.value)} /></div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Rack</label>
              <select value={form.rack} onChange={(e) => set('rack', e.target.value)}>
                <option value="">-- Chọn rack --</option>
                {racks.map((r) => <option key={r._id} value={r._id}>{r.rackName}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Vị trí U</label><input type="number" value={form.rackPosition} onChange={(e) => set('rackPosition', e.target.value)} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}
