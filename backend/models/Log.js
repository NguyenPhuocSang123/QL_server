const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    details: { type: String, default: '' },
    type: {
      type: String,
      enum: ['login', 'operation', 'error', 'system'],
      default: 'operation',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
