const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    equipmentCode: { type: String, required: true, unique: true },
    equipmentName: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'mouse',
        'keyboard',
        'monitor',
        'headset',
        'cable',
        'power_supply',
        'cpu_case',
        'network_switch',
        'speaker',
        'printer_ink',
        'network_card',
        'scanner',
        'other'
      ],
      required: true,
    },
    description: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0 },
    availableQuantity: { type: Number, required: true, min: 0 },
    borrowedQuantity: { type: Number, default: 0, min: 0 },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServerRoom',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'in_stock', 'damaged', 'lost'],
      default: 'available',
    },
    purchaseDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
