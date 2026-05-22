const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
    networkDevice: { type: mongoose.Schema.Types.ObjectId, ref: 'NetworkDevice' },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    content: { type: String, required: true },
    cost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
