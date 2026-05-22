const mongoose = require('mongoose');

const rackSchema = new mongoose.Schema(
  {
    rackCode: { type: String, required: true, unique: true },
    rackName: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'ServerRoom', required: true },
    floors: { type: Number, default: 42 },
    position: { type: String, default: '' },
    maxDevices: { type: Number, default: 42 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rack', rackSchema);
