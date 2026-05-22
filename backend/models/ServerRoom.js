const mongoose = require('mongoose');

const serverRoomSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true },
    roomName: { type: String, required: true },
    area: { type: Number, default: 0 },
    temperature: { type: Number, default: 25 },
    humidity: { type: Number, default: 50 },
    powerConsumption: { type: Number, default: 0 },
    acStatus: {
      type: String,
      enum: ['on', 'off', 'maintenance'],
      default: 'on',
    },
    location: { type: String, default: '' },
    status: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal',
    },
    /** auto = hệ thống đọc cảm biến (mô phỏng/API); manual = nhập tay */
    sensorMode: {
      type: String,
      enum: ['auto', 'manual'],
      default: 'auto',
    },
    lastSensorAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServerRoom', serverRoomSchema);
