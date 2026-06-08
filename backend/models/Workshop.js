const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    workshopName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: ['A', 'B', 'C', 'D', 'E'],
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

module.exports = mongoose.model('Workshop', workshopSchema);
