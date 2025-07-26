
// server/models/UploadLog.js
const mongoose = require('mongoose');

const uploadLogSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  period: { type: String }, // only for sales uploads
  fileType: { type: String, enum: ['sales', 'partinfo'], required: true },
  partCount: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: String }, // optional if you skip this
  role: { type: String }         // optional if you skip this
});

module.exports = mongoose.model('UploadLog', uploadLogSchema);
