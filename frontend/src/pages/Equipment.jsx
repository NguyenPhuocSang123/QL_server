import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Modal from '../components/Modal';
import '../styles/equipment.css';
import { useAuth } from '../context/AuthContext';

export default function Equipment() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('equipment'); // 'equipment' or 'borrow'
  const [borrowModalType, setBorrowModalType] = useState(null); // 'use', 'install', 'borrow' or null
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowForm, setBorrowForm] = useState({
    borrowerName: '',
    quantity: 1,
    returnDate: '',
    notes: '',
  });

  // Form states
  const [formData, setFormData] = useState({
    equipmentCode: '',
    equipmentName: '',
    category: 'mouse',
    quantity: 0,
    description: '',
    room: '',
  });

  const [returnForm, setReturnForm] = useState({
    conditionNotes: '',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    loadEquipment();
  }, [filterStatus, filterCategory, onlyAvailable]);

  useEffect(() => {
    loadBorrowRecords();
  }, []);

  useEffect(() => {
    if (activeTab === 'borrow') {
      loadBorrowRecords();
    }
  }, [activeTab]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('category', filterCategory);
      if (onlyAvailable) params.append('onlyAvailable', 'true');

      const response = await axios.get(`/equipment/equipment?${params}`);
      setEquipment(response.data);
    } catch (error) {
      alert('Lỗi tải danh sách thiết bị: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBorrowRecords = async () => {
    try {
      const response = await axios.get('/equipment/borrow-records');
      setBorrowRecords(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Lỗi tải lịch sử mượn:', error.response?.data || error.message);
      setBorrowRecords([]);
    }
  };

  const loadRooms = async () => {
    try {
      const response = await axios.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.log('Không thể tải danh sách phòng');
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/equipment/equipment', formData);
      setEquipment([response.data, ...equipment]);
      setShowAddModal(false);
      setFormData({
        equipmentCode: '',
        equipmentName: '',
        category: 'mouse',
        quantity: 0,
        description: '',
        room: '',
      });
      alert('Thêm thiết bị thành công');
    } catch (error) {
      alert('Lỗi: ' + error.response?.data?.message || error.message);
    }
  };

  const openBorrowModal = (item) => {
    setSelectedEquipment(item);
    setBorrowModalType('use');
    setBorrowForm({
      borrowerName: user?.fullName || '',
      quantity: 1,
      returnDate: '',
      notes: '',
    });
    setShowBorrowModal(true);
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!selectedEquipment) {
      alert('Vui lòng chọn thiết bị');
      return;
    }
    if (!borrowModalType) {
      alert('Vui lòng chọn loại mượn');
      return;
    }
    if (!borrowForm.borrowerName.trim()) {
      alert('Vui lòng nhập tên người mượn');
      return;
    }
    const qty = Number(borrowForm.quantity);
    if (!qty || qty <= 0 || qty > selectedEquipment.availableQuantity) {
      alert(`Số lượng không hợp lệ (còn sẵn: ${selectedEquipment.availableQuantity})`);
      return;
    }

    try {
      const response = await axios.post('/equipment/borrow', {
        equipmentId: selectedEquipment._id,
        borrowedBy: borrowForm.borrowerName.trim(),
        quantity: qty,
        expectedReturnDate: borrowForm.returnDate || null,
        notes: borrowForm.notes,
        usageType: borrowModalType,
      });

      await loadBorrowRecords();
      await loadEquipment();
      
      // Đóng modal và reset form
      setShowBorrowModal(false);
      setSelectedEquipment(null);
      setBorrowModalType(null);
      setBorrowForm({
        borrowerName: '',
        quantity: 1,
        returnDate: '',
        notes: '',
      });
      alert('Mượn thiết bị thành công');
    } catch (error) {
      console.error('Lỗi mượn:', error.response?.data || error.message);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/equipment/borrow/${selectedRecord._id}/return`,
        { notes: returnForm.conditionNotes }
      );
      await loadBorrowRecords();
      await loadEquipment();
      setShowReturnModal(false);
      setReturnForm({ conditionNotes: '' });
      alert('Trả thiết bị thành công');
    } catch (error) {
      alert('Lỗi: ' + error.response?.data?.message || error.message);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      mouse: 'Chuột',
      keyboard: 'Bàn phím',
      monitor: 'Màn hình',
      headset: 'Tai nghe',
      cable: 'Dây cáp',
      power_supply: 'Nguồn điện',
      cpu_case: 'Thùng CPU',
      network_switch: 'Switch Mạng',
      speaker: 'Loa',
      printer_ink: 'Mực Máy In',
      network_card: 'Card Mạng PC',
      scanner: 'Máy Scan',
      other: 'Khác',
    };
    return labels[category] || category;
  };

  const getUsageTypeLabel = (type) => {
    const labels = { use: 'Sử dụng', install: 'Lắp đặt', borrow: 'Mượn' };
    return labels[type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      available: 'Còn sẵn',
      in_stock: 'Trong kho',
      damaged: 'Hỏng',
      lost: 'Mất',
      borrowed: 'Đã mượn',
      returned: 'Đã trả',
      overdue: 'Quá hạn',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'green',
      in_stock: 'blue',
      damaged: 'orange',
      lost: 'red',
      borrowed: 'orange',
      returned: 'green',
      overdue: 'red',
    };
    return colors[status] || 'gray';
  };

  const activeBorrows = borrowRecords.filter((r) => r.status === 'borrowed');

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h1>Quản lý Thiết bị Phòng Server</h1>
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            Danh sách Thiết bị
          </button>
          <button
            className={`tab-btn ${activeTab === 'borrow' ? 'active' : ''}`}
            onClick={() => setActiveTab('borrow')}
          >
            Lịch sử Mượn ({borrowRecords.length})
          </button>
        </div>
      </div>

      {activeTab === 'equipment' && (
        <div className="equipment-section">
          <div className="controls">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              ➕ Thêm Thiết bị
            </button>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả Loại</option>
              <option value="mouse">Chuột</option>
              <option value="keyboard">Bàn phím</option>
              <option value="monitor">Màn hình</option>
              <option value="headset">Tai nghe</option>
              <option value="cable">Dây cáp</option>
              <option value="power_supply">Nguồn điện</option>
              <option value="cpu_case">Thùng CPU</option>
              <option value="network_switch">Switch Mạng</option>
              <option value="speaker">Loa</option>
              <option value="printer_ink">Mực Máy In</option>
              <option value="network_card">Card Mạng PC</option>
              <option value="scanner">Máy Scan</option>
              <option value="other">Khác</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="available">Còn sẵn</option>
              <option value="in_stock">Trong kho</option>
              <option value="damaged">Hỏng</option>
              <option value="lost">Mất</option>
            </select>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              Chỉ hiển thị còn sẵn
            </label>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <>
              {/* View Table */}
              <div className="equipment-table-section">
                <h2>📦 Kho Thiết bị - Chi tiết Số lượng</h2>
                {equipment.length === 0 ? (
                  <p className="no-data">Không có thiết bị nào</p>
                ) : (
                  <div className="table-responsive">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Mã</th>
                          <th>Tên Thiết bị</th>
                          <th>Loại</th>
                          <th>Tổng SL</th>
                          <th>Còn Sẵn</th>
                          <th>Đã Mượn</th>
                          <th>Trạng thái</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipment.map((item) => (
                          <tr key={item._id}>
                            <td>{item.equipmentCode}</td>
                            <td>{item.equipmentName}</td>
                            <td>{getCategoryLabel(item.category)}</td>
                            <td>{item.quantity}</td>
                            <td style={{ color: item.availableQuantity > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                              {item.availableQuantity}
                            </td>
                            <td style={{ color: (item.borrowedQuantity || 0) > 0 ? 'orange' : 'gray' }}>
                              {item.borrowedQuantity || 0}
                            </td>
                            <td>
                              <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(item.status) }}
                              >
                                {getStatusLabel(item.status)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-table">
                                <button
                                  className="btn btn-sm btn-borrow"
                                  disabled={item.availableQuantity === 0}
                                  onClick={() => openBorrowModal(item)}
                                  style={{ backgroundColor: '#9C27B0' }}
                                >
                                  📋 Mượn
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Grid View */}
              <div className="equipment-grid-section" style={{ marginTop: '40px' }}>
                <h2>🎴 Xem Chi tiết - Thẻ</h2>
                <div className="equipment-grid">
                  {equipment.length === 0 ? (
                    <p className="no-data">Không có thiết bị nào</p>
                  ) : (
                    equipment.map((item) => (
                      <div key={item._id} className="equipment-card">
                        <div className="card-header">
                          <h3>{item.equipmentName}</h3>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(item.status) }}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                        <div className="card-body">
                          <p>
                            <strong>Mã:</strong> {item.equipmentCode}
                          </p>
                          <p>
                            <strong>Loại:</strong> {getCategoryLabel(item.category)}
                          </p>
                          <p>
                            <strong>Tổng số:</strong> {item.quantity}
                          </p>
                          <p style={{ color: item.availableQuantity > 0 ? 'green' : 'red' }}>
                            <strong>Còn sẵn:</strong> {item.availableQuantity}
                          </p>
                          <p style={{ color: (item.borrowedQuantity || 0) > 0 ? 'orange' : 'gray' }}>
                            <strong>Đã mượn:</strong> {item.borrowedQuantity || 0}
                          </p>
                          {item.description && (
                            <p>
                              <strong>Mô tả:</strong> {item.description}
                            </p>
                          )}
                        </div>
                        <div className="card-footer">
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-borrow"
                              disabled={item.availableQuantity === 0}
                              onClick={() => openBorrowModal(item)}
                              style={{ backgroundColor: '#9C27B0' }}
                            >
                              📋 Mượn
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'borrow' && (
        <div className="borrow-section">
          <div className="borrow-list">
            <h2>Danh sách Mượn (Chưa Trả)</h2>
            {activeBorrows.length === 0 ? (
              <p className="no-data">Không có bản ghi mượn chưa trả</p>
            ) : (
              <div className="table-responsive">
                <table className="borrow-table">
                  <thead>
                    <tr>
                      <th>Số Hiệu</th>
                      <th>Thiết bị</th>
                      <th>Loại Lấy</th>
                      <th>Số lượng</th>
                      <th>Người mượn</th>
                      <th>Ngày mượn</th>
                      <th>Hạn trả</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBorrows.map((record) => (
                      <tr key={record._id}>
                        <td>{record.borrowNumber}</td>
                        <td>{record.equipment?.equipmentName}</td>
                        <td>
                          <span className={`type-badge ${record.usageType || 'use'}`}>
                            {record.usageType === 'install' ? '🔧 Lắp' : record.usageType === 'borrow' ? '📋 Mượn' : '🖱️ Sử dụng'}
                          </span>
                        </td>
                        <td>{record.quantity}</td>
                        <td>{record.borrowedBy}</td>
                        <td>{new Date(record.borrowDate).toLocaleDateString('vi-VN')}</td>
                        <td>
                          {record.expectedReturnDate
                            ? new Date(record.expectedReturnDate).toLocaleDateString('vi-VN')
                            : '—'}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-return"
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowReturnModal(true);
                            }}
                          >
                            📥 Trả
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="history-list" style={{ marginTop: '40px' }}>
            <h2>Lịch sử Mượn (Tất cả)</h2>
            {borrowRecords.length === 0 ? (
              <p className="no-data">Không có bản ghi nào</p>
            ) : (
              <div className="table-responsive">
                <table className="borrow-table">
                  <thead>
                    <tr>
                      <th>Số Hiệu</th>
                      <th>Thiết bị</th>
                      <th>Loại Lấy</th>
                      <th>Số lượng</th>
                      <th>Người mượn</th>
                      <th>Ngày mượn</th>
                      <th>Ngày trả</th>
                      <th>Trạng thái</th>
                      <th>Ghi chú khi trả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowRecords.map((record) => (
                      <tr key={record._id}>
                        <td>{record.borrowNumber}</td>
                        <td>{record.equipment?.equipmentName}</td>
                        <td>
                          <span className={`type-badge ${record.usageType || 'use'}`}>
                            {record.usageType === 'install' ? '🔧 Lắp' : record.usageType === 'borrow' ? '📋 Mượn' : '🖱️ Sử dụng'}
                          </span>
                        </td>
                        <td>{record.quantity}</td>
                        <td>{record.borrowedBy}</td>
                        <td>{new Date(record.borrowDate).toLocaleDateString('vi-VN')}</td>
                        <td>
                          {record.actualReturnDate
                            ? new Date(record.actualReturnDate).toLocaleDateString('vi-VN')
                            : '—'}
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(record.status),
                            }}
                          >
                            {getStatusLabel(record.status)}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', maxWidth: '200px' }}>{record.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEquipment}
        title="Thêm Thiết bị"
        submitLabel="Thêm"
      >
        <div className="form-group">
          <label>Mã Thiết bị *</label>
          <input
            type="text"
            value={formData.equipmentCode}
            onChange={(e) =>
              setFormData({ ...formData, equipmentCode: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Tên Thiết bị *</label>
          <input
            type="text"
            value={formData.equipmentName}
            onChange={(e) =>
              setFormData({ ...formData, equipmentName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Loại *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="mouse">Chuột</option>
            <option value="keyboard">Bàn phím</option>
            <option value="monitor">Màn hình</option>
            <option value="headset">Tai nghe</option>
            <option value="cable">Dây cáp</option>
            <option value="power_supply">Nguồn điện</option>
            <option value="cpu_case">Thùng CPU</option>
            <option value="network_switch">Switch Mạng</option>
            <option value="speaker">Loa</option>
            <option value="printer_ink">Mực Máy In</option>
            <option value="network_card">Card Mạng PC</option>
            <option value="scanner">Máy Scan</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div className="form-group">
          <label>Phòng Server *</label>
          <select
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            required
          >
            <option value="">-- Chọn Phòng --</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.roomName} ({r.roomCode})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Số lượng *</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </Modal>

      {/* Borrow Modal */}
      <Modal
        show={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onSubmit={handleBorrow}
        title="📋 Mượn Thiết bị"
        submitLabel="✓ Xác nhận Mượn"
      >
        {selectedEquipment && (
          <div className="info-box">
            <p>
              <strong>{selectedEquipment.equipmentName}</strong>
            </p>
            <p>Còn sẵn: {selectedEquipment.availableQuantity} cái</p>
          </div>
        )}
        <div className="form-group">
          <label>Loại Mượn *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="borrowType"
                value="use"
                checked={borrowModalType === 'use'}
                onChange={() => setBorrowModalType('use')}
              />
              🖱️ Sử dụng nội bộ
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="borrowType"
                value="install"
                checked={borrowModalType === 'install'}
                onChange={() => setBorrowModalType('install')}
              />
              🔧 Lắp cho phòng ban khác
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="borrowType"
                value="borrow"
                checked={borrowModalType === 'borrow'}
                onChange={() => setBorrowModalType('borrow')}
              />
              📋 Mượn thông thường
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Tên Người Mượn *</label>
          <input
            type="text"
            value={borrowForm.borrowerName}
            onChange={(e) =>
              setBorrowForm({
                ...borrowForm,
                borrowerName: e.target.value,
              })
            }
            placeholder="Nhập tên người mượn"
            required
          />
        </div>
        <div className="form-group">
          <label>Số Lượng *</label>
          <input
            type="number"
            value={borrowForm.quantity}
            onChange={(e) =>
              setBorrowForm({
                ...borrowForm,
                quantity: parseInt(e.target.value),
              })
            }
            min="1"
            max={selectedEquipment?.availableQuantity || 1}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày Hạn Trả</label>
          <input
            type="date"
            value={borrowForm.returnDate}
            onChange={(e) =>
              setBorrowForm({
                ...borrowForm,
                returnDate: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Ghi chú</label>
          <textarea
            value={borrowForm.notes}
            onChange={(e) =>
              setBorrowForm({
                ...borrowForm,
                notes: e.target.value,
              })
            }
            placeholder="Ghi chú thêm..."
          />
        </div>
      </Modal>

      {/* Return Modal */}
      <Modal
        show={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSubmit={handleReturn}
        title="Trả Thiết bị"
        submitLabel="📥 Xác nhận Trả"
      >
        {selectedRecord && (
          <div className="info-box">
            <p>
              <strong>Số hiệu:</strong> {selectedRecord.borrowNumber}
            </p>
            <p>
              <strong>Thiết bị:</strong> {selectedRecord.equipment?.equipmentName}
            </p>
            <p>
              <strong>Số lượng:</strong> {selectedRecord.quantity}
            </p>
            <p>
              <strong>Loại Mượn:</strong>{' '}
              {getUsageTypeLabel(selectedRecord.usageType)}
            </p>
            <p>
              <strong>Người mượn:</strong> {selectedRecord.borrowedBy}
            </p>
            <p>
              <strong>Ngày Mượn:</strong>{' '}
              {new Date(selectedRecord.borrowDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        )}
        <div className="form-group">
          <label>Mô tả Tình trạng Khi Trả *</label>
          <textarea
            value={returnForm.conditionNotes}
            onChange={(e) => setReturnForm({ conditionNotes: e.target.value })}
            placeholder="Ghi nhận tình trạng: có hư hại không? Bẩn/sạch? Còn nguyên vẹn không?..."
            required
          />
        </div>
      </Modal>
    </div>
  );
}
