const ServerRoom = require('../models/ServerRoom');
const Rack = require('../models/Rack');
const { logAction } = require('../middleware/logger');
const { computeRoomStatusFromMetrics } = require('../services/temperatureAI');
const { updateAllRoomSensors, applyExternalReading } = require('../services/roomSensorService');

/**
 * @desc    Lấy trạng thái cảm biến
 * @route   GET /api/rooms/sensor/status
 * @access  Private
 */
exports.getSensorStatus = (req, res) => {
  res.json({
    autoUpdate: process.env.SENSOR_AUTO_UPDATE !== 'false',
    intervalSeconds: Math.max(10, Number(process.env.SENSOR_INTERVAL_SECONDS) || 30),
  });
};

/**
 * @desc    Đồng bộ cảm biến ngay
 * @route   POST /api/rooms/sensor/sync
 * @access  Private/Admin/Technician
 */
exports.syncSensors = async (req, res) => {
  try {
    const result = await updateAllRoomSensors();
    res.json({ message: 'Đã đồng bộ cảm biến', ...result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Nhận dữ liệu từ cảm biến thực (ESP32, gateway IoT)
 * @route   POST /api/rooms/:id/sensor-reading
 * @access  Public (với SENSOR_API_KEY)
 */
exports.applySensorReading = async (req, res) => {
  try {
    const expectedKey = process.env.SENSOR_API_KEY?.trim();
    if (expectedKey) {
      const provided = req.headers['x-sensor-key'] || req.body?.apiKey;
      if (provided !== expectedKey) {
        return res.status(401).json({ message: 'Sensor API key không hợp lệ' });
      }
    }

    const { temperature, humidity, powerConsumption } = req.body;
    if (temperature == null && humidity == null) {
      return res.status(400).json({ message: 'Cần temperature hoặc humidity' });
    }

    const room = await applyExternalReading(req.params.id, {
      temperature,
      humidity,
      powerConsumption,
    });
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Lấy danh sách phòng server
 * @route   GET /api/rooms
 * @access  Private
 */
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await ServerRoom.find().sort('roomCode');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Lấy chi tiết phòng và racks
 * @route   GET /api/rooms/:id
 * @access  Private
 */
exports.getRoomById = async (req, res) => {
  try {
    const room = await ServerRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    const racks = await Rack.find({ room: room._id }).populate('room', 'roomName roomCode');
    res.json({ room, racks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo phòng server mới
 * @route   POST /api/rooms
 * @access  Private/Admin/Technician
 */
exports.createRoom = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.temperature != null && payload.humidity != null) {
      payload.status = computeRoomStatusFromMetrics(payload);
    }
    const room = await ServerRoom.create(payload);
    await logAction(req.user._id, 'Thêm phòng server', room.roomName);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cập nhật phòng server
 * @route   PUT /api/rooms/:id
 * @access  Private/Admin/Technician
 */
exports.updateRoom = async (req, res) => {
  try {
    const payload = { ...req.body };
    const existing = await ServerRoom.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy' });

    const merged = { ...existing.toObject(), ...payload };
    const willBeAuto = (payload.sensorMode ?? existing.sensorMode) !== 'manual';

    if (willBeAuto && (payload.temperature !== undefined || payload.humidity !== undefined)) {
      delete payload.temperature;
      delete payload.humidity;
    }

    if (
      payload.temperature !== undefined ||
      payload.humidity !== undefined ||
      payload.acStatus !== undefined
    ) {
      payload.status = computeRoomStatusFromMetrics(merged);
    }

    const room = await ServerRoom.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    await logAction(req.user._id, 'Cập nhật phòng server', room.roomName);
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Xóa phòng server
 * @route   DELETE /api/rooms/:id
 * @access  Private/Admin
 */
exports.deleteRoom = async (req, res) => {
  try {
    const room = await ServerRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy' });
    await room.deleteOne();
    await logAction(req.user._id, 'Xóa phòng server', room.roomName);
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
