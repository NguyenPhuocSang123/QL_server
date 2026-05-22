import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const empty = { rackCode: '', rackName: '', room: '', floors: 42, position: '', maxDevices: 42 };

export default function Racks() {
  const { canEdit, isAdmin } = useAuth();
  const [racks, setRacks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/racks').then((r) => setRacks(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); api.get('/rooms').then((r) => setRooms(r.data)); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, floors: Number(form.floors), maxDevices: Number(form.maxDevices) };
    if (modal === 'create') await api.post('/racks', payload);
    else await api.put(`/racks/${form._id}`, payload);
    setModal(null);
    load();
  };

  return (
    <>
      <div className="page-header">
        <div><h2>Quản lý tủ Rack</h2><p>Quản lý vị trí server trong rack</p></div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setForm(empty); setModal('create'); }}>+ Thêm rack</button>}
      </div>

      <div className="card table-wrap">
        {loading ? <p className="loading">Đang tải...</p> : (
          <table>
            <thead><tr><th>Mã</th><th>Tên</th><th>Phòng</th><th>Số tầng</th><th>Vị trí</th>{canEdit && <th>Thao tác</th>}</tr></thead>
            <tbody>
              {racks.map((r) => (
                <tr key={r._id}>
                  <td>{r.rackCode}</td>
                  <td>{r.rackName}</td>
                  <td>{r.room?.roomName || '-'}</td>
                  <td>{r.floors}U</td>
                  <td>{r.position}</td>
                  {canEdit && (
                    <td className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ ...r, room: r.room?._id || r.room }); setModal('edit'); }}>Sửa</button>
                      {isAdmin && <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/racks/${r._id}`); load(); } }}>Xóa</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Thêm rack' : 'Sửa rack'} onClose={() => setModal(null)} onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Mã rack</label><input value={form.rackCode} onChange={(e) => set('rackCode', e.target.value)} required /></div>
            <div className="form-group"><label>Tên rack</label><input value={form.rackName} onChange={(e) => set('rackName', e.target.value)} required /></div>
          </div>
          <div className="form-group">
            <label>Phòng server</label>
            <select value={form.room} onChange={(e) => set('room', e.target.value)} required>
              <option value="">-- Chọn phòng --</option>
              {rooms.map((rm) => <option key={rm._id} value={rm._id}>{rm.roomName}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Số tầng (U)</label><input type="number" value={form.floors} onChange={(e) => set('floors', e.target.value)} /></div>
            <div className="form-group"><label>Vị trí</label><input value={form.position} onChange={(e) => set('position', e.target.value)} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}
