const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema(
  {
    borrowNumber: { type: String, required: true, unique: true },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServerRoom',
      required: true,
    },
    borrowedBy: {
      type: String,
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    borrowDate: { type: Date, default: Date.now },
    expectedReturnDate: { type: Date },
    actualReturnDate: { type: Date },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue', 'lost'],
      default: 'borrowed',
    },
    usageType: {
      type: String,
      enum: ['use', 'install', 'borrow'],
      default: 'use',
    },
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
    },
    productionLine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductionLine',
    },
    notes: { type: String, default: '' },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
