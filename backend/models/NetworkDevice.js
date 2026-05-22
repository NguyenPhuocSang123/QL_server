const mongoose = require('mongoose');

const networkDeviceSchema = new mongoose.Schema(
  {
    deviceCode: { type: String, required: true, unique: true },
    deviceName: { type: String, required: true },
    type: {
      type: String,
      enum: ['router', 'switch', 'firewall', 'ups'],
      required: true,
    },
    ipAddress: { type: String, default: '' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'ServerRoom' },
    status: {
      type: String,
      enum: ['online', 'offline', 'maintenance'],
      default: 'online',
    },
    lastMaintenance: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NetworkDevice', networkDeviceSchema);
