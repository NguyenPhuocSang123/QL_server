import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [customDates, setCustomDates] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const loadReport = async (type) => {
    try {
      setLoading(true);
      let response;
      if (type === 'custom') {
        response = await axios.get(
          `/reports/custom?startDate=${customDates.startDate}&endDate=${customDates.endDate}`
        );
      } else {
        response = await axios.get(`/reports/${type}`);
      }
      setReport(response.data);
      setReportType(type);
    } catch (error) {
      alert('Lỗi tải báo cáo: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport('daily');
  }, []);

  if (!report) {
    return <div style={{ padding: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>Đang tải báo cáo...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontWeight: 'bold', fontSize: '32px', color: '#333' }}>📊 Báo Cáo Hệ Thống</h1>

      {/* CONTROLS */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => loadReport('daily')}
          style={{
            padding: '8px 16px',
            backgroundColor: reportType === 'daily' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Hàng Ngày
        </button>
        <button
          onClick={() => loadReport('weekly')}
          style={{
            padding: '8px 16px',
            backgroundColor: reportType === 'weekly' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Hàng Tuần
        </button>

        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="date"
            value={customDates.startDate}
            onChange={(e) => setCustomDates({ ...customDates, startDate: e.target.value })}
          />
          <span style={{ fontWeight: 'bold' }}> đến </span>
          <input
            type="date"
            value={customDates.endDate}
            onChange={(e) => setCustomDates({ ...customDates, endDate: e.target.value })}
          />
          <button
            onClick={() => loadReport('custom')}
            style={{
              padding: '8px 16px',
              backgroundColor: reportType === 'custom' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Xem
          </button>
        </div>
      </div>

      {loading && <p style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>⏳ Đang tạo báo cáo...</p>}

      {report && !loading && (
        <>
          {/* HEADER */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 'bold', margin: '0 0 10px 0', color: '#000000' }}>{report.period}</h3>
            <p style={{ margin: '5px 0', fontSize: '12px', color: '#000000', fontWeight: '500' }}>
              Tạo: {new Date(report.generatedAt).toLocaleString('vi-VN')}
            </p>
          </div>

          {/* HEALTH SCORE */}
          <div
            style={{
              backgroundColor: getHealthColor(report.systemMetrics.healthScore),
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontWeight: 'bold', fontSize: '28px', margin: '0' }}>💪 Sức Khỏe Hệ Thống: {report.systemMetrics.healthScore}%</h2>
          </div>

          {/* METRICS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            {/* Phòng */}
            <MetricCard
              title="🏢 Phòng Máy"
              items={[
                { label: 'Tổng cộng', value: report.systemMetrics.rooms.total, color: '#007bff' },
                { label: 'Bình thường', value: report.systemMetrics.rooms.normal, color: '#28a745' },
                { label: 'Cảnh báo', value: report.systemMetrics.rooms.warning, color: '#ffc107' },
                { label: 'Nguy hiểm', value: report.systemMetrics.rooms.critical, color: '#dc3545' },
              ]}
            />

            {/* Thiết bị */}
            <MetricCard
              title="⚙️ Thiết Bị"
              items={[
                { label: 'Tổng cộng', value: report.systemMetrics.equipment.total, color: '#007bff' },
                { label: 'Có sẵn', value: report.systemMetrics.equipment.available, color: '#28a745' },
                { label: 'Bị hỏng', value: report.systemMetrics.equipment.damaged, color: '#dc3545' },
                {
                  label: 'Sử dụng',
                  value: `${report.equipmentStatus.utilizationRate}%`,
                  color: '#17a2b8',
                },
              ]}
            />

            {/* Server */}
            <MetricCard
              title="🖥️ Server"
              items={[
                { label: 'Tổng cộng', value: report.systemMetrics.servers.total, color: '#007bff' },
                { label: 'Online', value: report.systemMetrics.servers.online, color: '#28a745' },
                { label: 'Offline', value: report.systemMetrics.servers.offline, color: '#dc3545' },
              ]}
            />

            {/* Môi trường */}
            <MetricCard
              title="🌡️ Môi Trường"
              items={[
                {
                  label: 'Nhiệt độ TB',
                  value: `${report.systemMetrics.environment.avgTemp}°C`,
                  color: '#ff6b6b',
                },
                {
                  label: 'Độ ẩm TB',
                  value: `${report.systemMetrics.environment.avgHumidity}%`,
                  color: '#4ecdc4',
                },
              ]}
            />
          </div>

          {/* TEMPERATURE TRENDS */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 'bold', color: '#333', marginTop: 0 }}>📈 Xu Hướng Nhiệt Độ & Độ Ẩm</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold', color: '#000000' }}>Chỉ số</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', color: '#000000' }}>Tối thiểu</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', color: '#000000' }}>Tối đa</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', color: '#000000' }}>TB</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', color: '#000000' }}>Trung vị</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>
                    <strong style={{ color: '#000000' }}>Nhiệt độ (°C)</strong>
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.temperature.min}</td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.temperature.max}</td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.temperature.avg}</td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.temperature.median}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>
                    <strong style={{ color: '#000000' }}>Độ ẩm (%)</strong>
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.humidity.min}</td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.humidity.max}</td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.humidity.avg}</td>
                  <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: '#000000' }}>{report.tempTrends.humidity.median}</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#000000', fontWeight: '600' }}>
              ⚠️ Phòng vượt 26°C: {report.tempTrends.roomsAbove26} | Phòng dưới 18°C:{' '}
              {report.tempTrends.roomsBelow18}
            </p>
          </div>

          {/* MAINTENANCE SUMMARY */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: 0 }}>🔧 Tóm Tắt Bảo Trì</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  {report.maintenanceSummary.total}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Tổng bảo trì</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {report.maintenanceSummary.completed}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Hoàn thành</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                  {report.maintenanceSummary.scheduled}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Lên lịch</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                  {report.maintenanceSummary.inProgress}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Đang thực hiện</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e83e8c' }}>
                  {report.maintenanceSummary.totalCost.toLocaleString('vi-VN')} đ
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Tổng chi phí</div>
              </div>
            </div>
          </div>

          {/* INCIDENTS SUMMARY */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: 0 }}>🚨 Tóm Tắt Sự Cố</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  {report.incidentSummary.total}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Tổng sự cố</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                  {report.incidentSummary.bySeverity.critical}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Cấp độ cao</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                  {report.incidentSummary.bySeverity.high}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Cấp độ trung</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {report.incidentSummary.resolved}
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Đã giải quyết</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f42c1' }}>
                  {report.incidentSummary.avgResolutionTimeMinutes} phút
                </div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>Thời gian TB giải quyết</div>
              </div>
            </div>
          </div>

          {/* RECOMMENDATIONS */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: 0 }}>💡 Gợi Ý Cải Thiện</h4>
            {report.recommendations.map((rec, idx) => (
              <div
                key={idx}
                style={{
                  borderLeft: `4px solid ${getPriorityColor(rec.priority)}`,
                  padding: '12px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                }}
              >
                <div style={{ fontWeight: 'bold', color: getPriorityColor(rec.priority), fontSize: '14px' }}>
                  {getPriorityLabel(rec.priority)} - {rec.title}
                </div>
                <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: '500', color: '#000000' }}>{rec.description}</p>
                <div style={{ fontSize: '12px', color: '#000000', fontStyle: 'italic', fontWeight: '600' }}>
                  ✓ Hành động: {rec.action}
                </div>
              </div>
            ))}
          </div>

          {/* EXPORT BUTTON */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={async () => {
                try {
                  const response = await axios.get(`/reports/export-excel?type=${reportType}`, {
                    responseType: 'blob',
                  });
                  const url = URL.createObjectURL(response.data);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `BaoCao-${report.period.replace(/\//g, '-')}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (error) {
                  alert('Lỗi tải báo cáo: ' + (error.response?.data?.message || error.message));
                }
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              📊 Tải Báo Cáo (Excel)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// COMPONENTS
function MetricCard({ title, items }) {
  return (
    <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px' }}>
      <h5 style={{ margin: '0 0 10px 0', color: '#000000', fontWeight: '900', fontSize: '16px' }}>{title}</h5>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>{item.label}:</span>
          <span style={{ fontWeight: 'bold', color: item.color, fontSize: '16px' }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function getHealthColor(score) {
  if (score >= 80) return '#28a745';
  if (score >= 60) return '#ffc107';
  if (score >= 40) return '#fd7e14';
  return '#dc3545';
}

function getPriorityColor(priority) {
  const colors = { critical: '#dc3545', high: '#fd7e14', medium: '#ffc107', info: '#17a2b8' };
  return colors[priority] || '#6c757d';
}

function getPriorityLabel(priority) {
  const labels = { critical: '🔴 CẤP KHẨN', high: '🟠 CAO', medium: '🟡 TRUNG', info: '🔵 THÔNG TIN' };
  return labels[priority] || 'KHÁC';
}
