import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4'];
const statusMap = { online: 'Online', offline: 'Offline', maintenance: 'Bảo trì' };
const severityMap = { low: 'Thấp', medium: 'Trung bình', high: 'Cao', critical: 'Nghiêm trọng' };
const incidentStatusMap = { pending: 'Chờ xử lý', in_progress: 'Đang xử lý', resolved: 'Hoàn thành' };
const typeMap = { router: 'Router', switch: 'Switch', firewall: 'Firewall', ups: 'UPS' };

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/report').then((r) => setReport(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Đang tải báo cáo...</p>;
  if (!report) return <p className="loading">Không có dữ liệu</p>;

  const serverData = report.serversByStatus.map((s) => ({ name: statusMap[s._id] || s._id, value: s.count }));
  const incidentSeverity = report.incidentsBySeverity.map((s) => ({ name: severityMap[s._id] || s._id, value: s.count }));
  const incidentStatus = report.incidentsByStatus.map((s) => ({ name: incidentStatusMap[s._id] || s._id, value: s.count }));
  const deviceData = report.devicesByType.map((d) => ({ name: typeMap[d._id] || d._id, count: d.count }));

  return (
    <>
      <div className="page-header">
        <div><h2>Báo cáo thống kê</h2><p>Thống kê tổng quan hệ thống</p></div>
      </div>

      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card info">
          <span className="label">Tổng chi phí bảo trì</span>
          <span className="value" style={{ fontSize: '1.5rem' }}>{report.totalMaintenanceCost?.toLocaleString('vi-VN')} đ</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Server theo trạng thái</h3>
          <div className="chart-container">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={serverData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {serverData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Sự cố theo mức độ</h3>
          <div className="chart-container">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={incidentSeverity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {incidentSeverity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Sự cố theo trạng thái</h3>
          <div className="chart-container">
            <ResponsiveContainer>
              <BarChart data={incidentStatus}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Thiết bị mạng theo loại</h3>
          <div className="chart-container">
            <ResponsiveContainer>
              <BarChart data={deviceData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
