const mongoose = require('mongoose');

const productionLineSchema = new mongoose.Schema(
  {
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
    },
    lineNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 16,
    },
    lineName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Ensure unique workshop + lineNumber combination
productionLineSchema.index({ workshop: 1, lineNumber: 1 }, { unique: true });

module.exports = mongoose.model('ProductionLine', productionLineSchema);
