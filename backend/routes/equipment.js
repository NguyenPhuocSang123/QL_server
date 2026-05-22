const express = require('express');
const Equipment = require('../models/Equipment');
const BorrowRecord = require('../models/BorrowRecord');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const router = express.Router();

// Lấy danh sách thiết bị với lọc trạng thái
router.get('/equipment', protect, async (req, res) => {
  try {
    const { room, status, category, onlyAvailable } = req.query;
    let filter = {};

    if (room) filter.room = room;
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Lọc chỉ thiết bị còn có sẵn
    if (onlyAvailable === 'true') {
      filter.availableQuantity = { $gt: 0 };
    }

    const equipment = await Equipment.find(filter)
      .populate('room', 'roomName roomCode')
      .sort('-createdAt');

    // Đồng bộ số lượng nếu dữ liệu cũ thiếu borrowedQuantity
    const normalized = equipment.map((item) => {
      const doc = item.toObject();
      if (doc.borrowedQuantity == null) doc.borrowedQuantity = 0;
      if (doc.availableQuantity == null) {
        doc.availableQuantity = Math.max(0, doc.quantity - doc.borrowedQuantity);
      }
      return doc;
    });

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy chi tiết thiết bị
router.get('/equipment/:id', protect, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('room', 'roomName roomCode');
    if (!equipment) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo thiết bị mới
router.post('/equipment', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const { equipmentCode, equipmentName, category, quantity, room } = req.body;

    // Kiểm tra mã thiết bị trùng
    const existing = await Equipment.findOne({ equipmentCode });
    if (existing) return res.status(400).json({ message: 'Mã thiết bị đã tồn tại' });

    const equipment = await Equipment.create({
      equipmentCode,
      equipmentName,
      category,
      quantity,
      availableQuantity: quantity,
      room,
      ...req.body,
    });

    await logAction(req.user._id, 'Thêm thiết bị', `${equipmentName} (${quantity} cái)`);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật thiết bị
router.put('/equipment/:id', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('room', 'roomName roomCode');

    if (!equipment) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });

    await logAction(req.user._id, 'Cập nhật thiết bị', equipment.equipmentName);
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mượn thiết bị (Admin tạo bản ghi mượn)
router.post('/borrow', protect, async (req, res) => {
  try {
    const { equipmentId, borrowedBy, quantity, expectedReturnDate, notes, usageType } = req.body;

    console.log('Borrow Request:', { equipmentId, borrowedBy, quantity, expectedReturnDate, usageType });

    // Kiểm tra thiết bị tồn tại
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      console.log('Equipment not found:', equipmentId);
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    console.log('Equipment found:', equipment.equipmentName, 'Available:', equipment.availableQuantity);

    // Kiểm tra số lượng có sẵn
    if (equipment.availableQuantity < quantity) {
      return res.status(400).json({
        message: `Không đủ số lượng. Còn lại: ${equipment.availableQuantity} cái`,
      });
    }

    // Tạo số hiệu mượn
    const borrowNumber = `BRW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Tạo bản ghi mượn
    const borrowRecord = await BorrowRecord.create({
      borrowNumber,
      equipment: equipmentId,
      room: equipment.room,
      borrowedBy: borrowedBy || 'Unknown',
      quantity: parseInt(quantity),
      borrowDate: Date.now(),
      expectedReturnDate: expectedReturnDate || null,
      notes: notes || '',
      usageType: usageType || 'use',
      approvedBy: req.user._id,
      status: 'borrowed',
    });

    console.log('Borrow record created:', borrowRecord._id);

    // Cập nhật số lượng thiết bị
    equipment.availableQuantity -= parseInt(quantity);
    equipment.borrowedQuantity += parseInt(quantity);
    await equipment.save();

    console.log('Equipment updated - Available:', equipment.availableQuantity, 'Borrowed:', equipment.borrowedQuantity);

    await logAction(
      req.user._id,
      'Tạo bản ghi mượn thiết bị',
      `${equipment.equipmentName} (${quantity} cái) - ${borrowNumber} - Người: ${borrowedBy}`
    );

    const populated = await BorrowRecord.findById(borrowRecord._id)
      .populate('equipment', 'equipmentName equipmentCode category quantity availableQuantity borrowedQuantity')
      .populate('room', 'roomName roomCode')
      .populate('approvedBy', 'fullName email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Borrow error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Trả thiết bị
router.put('/borrow/:id/return', protect, async (req, res) => {
  try {
    const { notes } = req.body;

    const borrowRecord = await BorrowRecord.findById(req.params.id);
    if (!borrowRecord) return res.status(404).json({ message: 'Không tìm thấy bản ghi mượn' });

    if (borrowRecord.status === 'returned') {
      return res.status(400).json({ message: 'Thiết bị này đã được trả rồi' });
    }

    // Cập nhật bản ghi mượn
    borrowRecord.status = 'returned';
    borrowRecord.actualReturnDate = Date.now();
    if (notes) borrowRecord.notes = notes;
    await borrowRecord.save();

    // Cập nhật số lượng thiết bị
    const equipment = await Equipment.findById(borrowRecord.equipment);
    equipment.availableQuantity += borrowRecord.quantity;
    equipment.borrowedQuantity -= borrowRecord.quantity;
    await equipment.save();

    await logAction(req.user._id, 'Trả thiết bị', `${borrowRecord.borrowNumber}`);

    const populated = await BorrowRecord.findById(borrowRecord._id)
      .populate('equipment', 'equipmentName equipmentCode category quantity availableQuantity borrowedQuantity')
      .populate('room', 'roomName roomCode')
      .populate('approvedBy', 'fullName email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tăng/giảm tổng số lượng tồn kho
router.patch('/equipment/:id/quantity', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const delta = parseInt(req.body.delta, 10);
    if (!delta || Number.isNaN(delta)) {
      return res.status(400).json({ message: 'delta phải là số khác 0' });
    }

    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });

    const borrowed = equipment.borrowedQuantity || 0;
    const newTotal = equipment.quantity + delta;
    if (newTotal < borrowed) {
      return res.status(400).json({
        message: `Không thể giảm. Đang có ${borrowed} thiết bị được mượn.`,
      });
    }
    if (newTotal < 0) {
      return res.status(400).json({ message: 'Tổng số lượng không được âm' });
    }

    equipment.quantity = newTotal;
    equipment.availableQuantity = newTotal - borrowed;
    await equipment.save();

    await logAction(req.user._id, 'Điều chỉnh số lượng thiết bị', `${equipment.equipmentName} (${delta > 0 ? '+' : ''}${delta})`);
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy lịch sử mượn với lọc trạng thái
router.get('/borrow-records', protect, async (req, res) => {
  try {
    const { status, room, borrowedBy, onlyActive } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (room) filter.room = room;
    if (borrowedBy) filter.borrowedBy = borrowedBy;

    // Lọc chỉ những bản ghi chưa trả
    if (onlyActive === 'true') {
      filter.status = { $in: ['borrowed', 'overdue'] };
    }

    const records = await BorrowRecord.find(filter)
      .populate('equipment', 'equipmentName equipmentCode category')
      .populate('room', 'roomName roomCode')
      .populate('approvedBy', 'fullName email')
      .sort('-borrowDate');

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy chi tiết bản ghi mượn
router.get('/borrow-records/:id', protect, async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id)
      .populate('equipment')
      .populate('room', 'roomName roomCode')
      .populate('approvedBy', 'fullName email');

    if (!record) return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa thiết bị
router.delete('/equipment/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });

    // Kiểm tra có bản ghi mượn chưa trả không
    const activeRecords = await BorrowRecord.find({
      equipment: req.params.id,
      status: { $in: ['borrowed', 'overdue'] },
    });

    if (activeRecords.length > 0) {
      return res.status(400).json({
        message: 'Không thể xóa thiết bị còn được mượn',
      });
    }

    await equipment.deleteOne();
    await logAction(req.user._id, 'Xóa thiết bị', equipment.equipmentName);

    res.json({ message: 'Đã xóa thiết bị' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
