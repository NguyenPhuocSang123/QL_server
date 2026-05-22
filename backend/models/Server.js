const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema(
  {
    serverCode: { type: String, required: true, unique: true },
    serverName: { type: String, required: true },
    cpu: { type: String, default: '' },
    ram: { type: String, default: '' },
    storage: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    os: { type: String, default: '' },
    installDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['online', 'offline', 'maintenance'],
      default: 'offline',
    },
    rack: { type: mongoose.Schema.Types.ObjectId, ref: 'Rack' },
    rackPosition: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Server', serverSchema);
