import { useEffect, useState } from 'react';
import api from '../api/axios';

const typeLabels = { login: 'Đăng nhập', operation: 'Thao tác', error: 'Lỗi', system: 'Hệ thống' };

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    const params = typeFilter ? { type: typeFilter } : {};
    api.get('/logs', { params }).then((r) => setLogs(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="page-header">
        <div><h2>Nhật ký hệ thống</h2><p>Log đăng nhập và thao tác</p></div>
      </div>

      <div className="search-bar">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">Tất cả loại</option>
          {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={load}>Lọc</button>
      </div>

      <div className="card table-wrap">
        {loading ? <p className="loading">Đang tải...</p> : (
          <table>
            <thead><tr><th>Thời gian</th><th>Người dùng</th><th>Loại</th><th>Hành động</th><th>Chi tiết</th></tr></thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                  <td>{log.user?.fullName || 'Hệ thống'}</td>
                  <td>{typeLabels[log.type] || log.type}</td>
                  <td>{log.action}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !logs.length && <p className="empty">Chưa có nhật ký</p>}
      </div>
    </>
  );
}
