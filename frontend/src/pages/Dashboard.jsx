import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tempAI, setTempAI] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/ai/temperature-alerts'),
    ])
      .then(([statsRes, aiRes]) => {
        setStats(statsRes.data);
        setTempAI(aiRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Đang tải dashboard...</div>;
  if (!stats) return <div className="loading">Không tải được dữ liệu</div>;

  const atRiskRooms = tempAI?.analyses?.filter((a) => a.level !== 'normal') || [];
  const safeRooms = tempAI?.analyses?.filter((a) => a.level === 'normal') || [];

  const riskClass = {
    critical: 'ai-risk-critical',
    warning: 'ai-risk-warning',
    normal: 'ai-risk-normal',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Tổng quan hệ thống phòng server</p>
        </div>
      </div>

      {tempAI && (
        <div className={`card ai-temp-banner ${riskClass[tempAI.overallRisk] || ''}`} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>🤖 AI — Cảnh báo nhiệt độ thông minh</h3>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>{tempAI.summary}</p>
          <div className="ai-temp-stats">
            <span>Phòng an toàn: {tempAI.normalCount ?? safeRooms.length}</span>
            <span>Cảnh báo: {tempAI.warningCount}</span>
            <span>Nguy hiểm: {tempAI.criticalCount}</span>
          </div>
          {atRiskRooms.length > 0 ? (
            <div className="ai-temp-list" style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phòng cần chú ý</h4>
              {atRiskRooms.map((a) => (
                <div key={a.roomId} className={`ai-temp-item ai-level-${a.level}`}>
                  <div className="ai-temp-item-head">
                    <strong>{a.roomName}</strong>
                    <span className="ai-risk-badge">{a.riskScore}% rủi ro</span>
                  </div>
                  <p>{a.temperature}°C · Độ ẩm {a.humidity}% · Điều hòa: {a.acStatus}</p>
                  {a.issues?.length > 0 && (
                    <ul className="ai-issues">
                      {a.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  )}
                  <p className="ai-prediction"><em>Dự báo: {a.prediction}</em></p>
                  {a.recommendations?.length > 0 && (
                    <div className="ai-recommendations">
                      <strong>Gợi ý xử lý:</strong>
                      <ul>
                        {a.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: '1rem', color: 'var(--success)' }}>
              ✓ Tất cả phòng đang trong ngưỡng nhiệt độ và độ ẩm an toàn.
            </p>
          )}
          {safeRooms.length > 0 && (
            <div className="ai-temp-safe" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Phòng an toàn ({safeRooms.length})
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {safeRooms.map((a) => (
                  <li key={a.roomId}>
                    {a.roomName} — {a.temperature}°C, độ ẩm {a.humidity}%, điều hòa {a.acStatus}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-card info">
          <span className="label">Tổng Server</span>
          <span className="value">{stats.servers.total}</span>
        </div>
        <div className="stat-card online">
          <span className="label">Online</span>
          <span className="value">{stats.servers.online}</span>
        </div>
        <div className="stat-card offline">
          <span className="label">Offline</span>
          <span className="value">{stats.servers.offline}</span>
        </div>
        <div className="stat-card warning">
          <span className="label">Bảo trì</span>
          <span className="value">{stats.servers.maintenance}</span>
        </div>
        <div className="stat-card">
          <span className="label">Phòng Server</span>
          <span className="value">{stats.rooms.total}</span>
        </div>
        <div className="stat-card">
          <span className="label">Tủ Rack</span>
          <span className="value">{stats.racks}</span>
        </div>
        <div className="stat-card warning">
          <span className="label">Sự cố chờ xử lý</span>
          <span className="value">{stats.incidents.pending}</span>
        </div>
        <div className="stat-card">
          <span className="label">Bảo trì đã lên lịch</span>
          <span className="value">{stats.maintenance.scheduled}</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Nhiệt độ phòng server</h3>
          {stats.rooms.list?.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Phòng</th><th>Nhiệt độ</th><th>Độ ẩm</th><th>Điều hòa</th><th>Trạng thái</th></tr>
                </thead>
                <tbody>
                  {stats.rooms.list.map((r) => (
                    <tr key={r._id}>
                      <td>{r.roomName}</td>
                      <td style={{ color: r.temperature > 28 ? 'var(--warning)' : 'inherit' }}>{r.temperature}°C</td>
                      <td>{r.humidity}%</td>
                      <td><span className={`badge badge-${r.acStatus === 'on' ? 'online' : 'offline'}`}>{r.acStatus}</span></td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty">Chưa có phòng server</p>}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Cảnh báo</h3>
          {(tempAI?.alerts?.length || stats.alerts?.length) ? (
            <div className="alert-list">
              {tempAI?.alerts?.map((a, i) => (
                <div key={`ai-${i}`} className={`alert-item alert-${a.level}`}>{a.message}</div>
              ))}
              {stats.alerts?.map((a, i) => (
                <div key={i} className="alert-item">{a.message} — {a.room}</div>
              ))}
            </div>
          ) : <p style={{ color: 'var(--success)' }}>Không có cảnh báo</p>}

          <h3 style={{ margin: '1.5rem 0 1rem' }}>Sự cố gần đây</h3>
          {stats.recentIncidents?.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Tiêu đề</th><th>Server</th><th>Trạng thái</th></tr></thead>
                <tbody>
                  {stats.recentIncidents.map((inc) => (
                    <tr key={inc._id}>
                      <td><Link to="/incidents">{inc.title}</Link></td>
                      <td>{inc.server?.serverName || '-'}</td>
                      <td><span className={`badge badge-${inc.status}`}>{inc.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty">Không có sự cố</p>}
        </div>
      </div>
    </>
  );
}
