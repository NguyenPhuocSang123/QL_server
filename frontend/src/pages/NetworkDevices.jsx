import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const typeLabels = { router: 'Router', switch: 'Switch', firewall: 'Firewall', ups: 'UPS' };
const empty = { deviceCode: '', deviceName: '', type: 'switch', ipAddress: '', room: '', status: 'online', notes: '' };

export default function NetworkDevices() {
  const { canEdit, isAdmin } = useAuth();
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/network-devices').then((r) => setDevices(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); api.get('/rooms').then((r) => setRooms(r.data)); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modal === 'create') await api.post('/network-devices', form);
    else await api.put(`/network-devices/${form._id}`, form);
    setModal(null);
    load();
  };

  return (
    <>
      <div className="page-header">
        <div><h2>Thiết bị mạng</h2><p>Router, Switch, Firewall, UPS</p></div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setForm(empty); setModal('create'); }}>+ Thêm thiết bị</button>}
      </div>

      <div className="card table-wrap">
        {loading ? <p className="loading">Đang tải...</p> : (
          <table>
            <thead><tr><th>Mã</th><th>Tên</th><th>Loại</th><th>IP</th><th>Phòng</th><th>Trạng thái</th>{canEdit && <th>Thao tác</th>}</tr></thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d._id}>
                  <td>{d.deviceCode}</td>
                  <td>{d.deviceName}</td>
                  <td>{typeLabels[d.type] || d.type}</td>
                  <td>{d.ipAddress}</td>
                  <td>{d.room?.roomName || '-'}</td>
                  <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                  {canEdit && (
                    <td className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ ...d, room: d.room?._id || d.room }); setModal('edit'); }}>Sửa</button>
                      {isAdmin && <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/network-devices/${d._id}`); load(); } }}>Xóa</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Thêm thiết bị' : 'Sửa thiết bị'} onClose={() => setModal(null)} onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Mã thiết bị</label><input value={form.deviceCode} onChange={(e) => set('deviceCode', e.target.value)} required /></div>
            <div className="form-group"><label>Tên thiết bị</label><input value={form.deviceName} onChange={(e) => set('deviceName', e.target.value)} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Loại</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group"><label>IP</label><input value={form.ipAddress} onChange={(e) => set('ipAddress', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phòng</label>
              <select value={form.room} onChange={(e) => set('room', e.target.value)}>
                <option value="">-- Chọn phòng --</option>
                {rooms.map((rm) => <option key={rm._id} value={rm._id}>{rm.roomName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
