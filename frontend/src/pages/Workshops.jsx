import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Modal from '../components/Modal';
import '../styles/equipment.css';

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [productionLines, setProductionLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddWorkshopModal, setShowAddWorkshopModal] = useState(false);
  const [showAddLineModal, setShowAddLineModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const [workshopForm, setWorkshopForm] = useState({
    workshopName: '',
    description: '',
  });

  const [lineForm, setLineForm] = useState({
    lineNumber: '',
    description: '',
  });

  useEffect(() => {
    loadWorkshops();
  }, []);

  useEffect(() => {
    if (selectedWorkshop) {
      loadProductionLines(selectedWorkshop._id);
    }
  }, [selectedWorkshop]);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/workshops/workshops');
      setWorkshops(Array.isArray(response.data) ? response.data : []);
      if (response.data.length > 0) {
        setSelectedWorkshop(response.data[0]);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách xưởng:', error.message);
      alert('Lỗi tải danh sách xưởng');
    } finally {
      setLoading(false);
    }
  };

  const loadProductionLines = async (workshopId) => {
    try {
      const response = await axios.get(`/workshops/workshops/${workshopId}/lines`);
      setProductionLines(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Lỗi tải danh sách chuyền:', error.message);
      setProductionLines([]);
    }
  };

  const handleAddWorkshop = async (e) => {
    e.preventDefault();
    if (!workshopForm.workshopName.trim()) {
      alert('Vui lòng nhập tên xưởng');
      return;
    }
    try {
      const response = await axios.post('/workshops/workshops', workshopForm);
      setWorkshops([...workshops, response.data]);
      setShowAddWorkshopModal(false);
      setWorkshopForm({ workshopName: '', description: '' });
      alert('Thêm xưởng thành công');
      loadWorkshops();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddLine = async (e) => {
    e.preventDefault();
    if (!selectedWorkshop) {
      alert('Vui lòng chọn xưởng');
      return;
    }
    if (!lineForm.lineNumber) {
      alert('Vui lòng nhập số chuyền');
      return;
    }
    const lineNum = parseInt(lineForm.lineNumber);
    if (lineNum < 1 || lineNum > 16) {
      alert('Số chuyền phải từ 1 đến 16');
      return;
    }

    try {
      const response = await axios.post('/workshops/production-lines', {
        workshop: selectedWorkshop._id,
        lineNumber: lineNum,
        description: lineForm.description,
      });
      setProductionLines([...productionLines, response.data]);
      setShowAddLineModal(false);
      setLineForm({ lineNumber: '', description: '' });
      alert('Thêm chuyền thành công');
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteLine = async (lineId) => {
    if (confirm('Bạn có chắc chắn muốn xóa chuyền này?')) {
      try {
        await axios.delete(`/workshops/production-lines/${lineId}`);
        setProductionLines(productionLines.filter((l) => l._id !== lineId));
        alert('Xóa chuyền thành công');
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h1>Quản lý Xưởng & Chuyền</h1>
      </div>

      <div className="equipment-section">
        <div className="controls">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddWorkshopModal(true)}
          >
            ➕ Thêm Xưởng
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedWorkshop}
            onClick={() => setShowAddLineModal(true)}
          >
            ➕ Thêm Chuyền
          </button>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Workshops List */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h2>📍 Danh sách Xưởng</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {workshops.map((workshop) => (
                  <button
                    key={workshop._id}
                    style={{
                      padding: '10px',
                      border: selectedWorkshop?._id === workshop._id ? '2px solid #007bff' : '1px solid #ddd',
                      backgroundColor: selectedWorkshop?._id === workshop._id ? '#e7f3ff' : 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                    }}
                    onClick={() => setSelectedWorkshop(workshop)}
                  >
                    <strong>Xưởng {workshop.workshopName}</strong>
                    <div style={{ fontSize: '12px', color: '#666' }}>{workshop.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Production Lines */}
            <div style={{ flex: 2, minWidth: '350px' }}>
              <h2>🔧 Danh sách Chuyền</h2>
              {selectedWorkshop ? (
                <>
                  <p>Xưởng: <strong>Xưởng {selectedWorkshop.workshopName}</strong></p>
                  {productionLines.length === 0 ? (
                    <p style={{ color: '#999' }}>Chưa có chuyền nào</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="equipment-table">
                        <thead>
                          <tr>
                            <th>Tên Chuyền</th>
                            <th>Số Chuyền</th>
                            <th>Mô tả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productionLines.map((line) => (
                            <tr key={line._id}>
                              <td><strong>{line.lineName}</strong></td>
                              <td>{line.lineNumber}</td>
                              <td>{line.description || '—'}</td>
                              <td>
                                <span
                                  style={{
                                    backgroundColor: line.status === 'active' ? 'green' : 'gray',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                  }}
                                >
                                  {line.status === 'active' ? '✓ Hoạt động' : 'Không hoạt động'}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => handleDeleteLine(line._id)}
                                  style={{ backgroundColor: '#dc3545' }}
                                >
                                  🗑️ Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: '#999' }}>Vui lòng chọn xưởng</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Workshop Modal */}
      <Modal
        show={showAddWorkshopModal}
        onClose={() => setShowAddWorkshopModal(false)}
        onSubmit={handleAddWorkshop}
        title="Thêm Xưởng"
        submitLabel="Thêm"
      >
        <div className="form-group">
          <label>Tên Xưởng (A, B, C, D, E) *</label>
          <input
            type="text"
            value={workshopForm.workshopName}
            onChange={(e) =>
              setWorkshopForm({
                ...workshopForm,
                workshopName: e.target.value.toUpperCase(),
              })
            }
            placeholder="Nhập tên xưởng (A-E)"
            maxLength="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            value={workshopForm.description}
            onChange={(e) =>
              setWorkshopForm({ ...workshopForm, description: e.target.value })
            }
            placeholder="Nhập mô tả xưởng"
          />
        </div>
      </Modal>

      {/* Add Production Line Modal */}
      <Modal
        show={showAddLineModal}
        onClose={() => setShowAddLineModal(false)}
        onSubmit={handleAddLine}
        title={`Thêm Chuyền - Xưởng ${selectedWorkshop?.workshopName}`}
        submitLabel="Thêm"
      >
        <div className="form-group">
          <label>Số Chuyền (1-16) *</label>
          <input
            type="number"
            value={lineForm.lineNumber}
            onChange={(e) =>
              setLineForm({ ...lineForm, lineNumber: e.target.value })
            }
            placeholder="Nhập số chuyền (1-16)"
            min="1"
            max="16"
            required
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            value={lineForm.description}
            onChange={(e) =>
              setLineForm({ ...lineForm, description: e.target.value })
            }
            placeholder="Nhập mô tả chuyền"
          />
        </div>
      </Modal>
    </div>
  );
}
