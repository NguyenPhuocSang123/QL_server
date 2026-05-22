import { useEffect, useState } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';

const roleLabels = {
  admin: 'Admin',
  technician: 'Kỹ thuật viên',
  viewer: 'Người xem',
};

const empty = { fullName: '', email: '', password: '', role: 'technician' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get('/auth/users').then((r) => setUsers(r.data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modal === 'create') await api.post('/auth/users', form);
    else {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        isActive: form.isActive,
      };
      if (form.password) payload.password = form.password;
      await api.put(`/auth/users/${form._id}`, payload);
    }
    setModal(null);
    load();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Quản lý tài khoản</h2>
          <p>Phân quyền người dùng hệ thống</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm(empty);
            setModal('create');
          }}
        >
          + Thêm tài khoản
        </button>
      </div>

      <div className="card table-wrap">
        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role}`}>{roleLabels[u.role]}</span>
                  </td>
                  <td>{u.isActive ? 'Hoạt động' : 'Đã khóa'}</td>
                  <td className="actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setForm({ ...u, password: '' });
                        setModal('edit');
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        if (confirm('Xóa tài khoản này?')) {
                          await api.delete(`/auth/users/${u._id}`);
                          load();
                        }
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !users.length && <p className="empty">Chưa có tài khoản</p>}
      </div>

      {modal && (
        <Modal
          title={modal === 'create' ? 'Thêm tài khoản' : 'Sửa tài khoản'}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Họ tên</label>
            <input
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>
              Mật khẩu {modal === 'edit' && '(để trống nếu không đổi)'}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              required={modal === 'create'}
            />
          </div>
          <div className="form-group">
            <label>Vai trò</label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)}>
              {Object.entries(roleLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          {modal === 'edit' && (
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={form.isActive ? 'true' : 'false'}
                onChange={(e) => set('isActive', e.target.value === 'true')}
              >
                <option value="true">Hoạt động</option>
                <option value="false">Khóa</option>
              </select>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
