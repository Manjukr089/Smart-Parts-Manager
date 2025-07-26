// models/PartInfo.js
const mongoose = require('mongoose');

const partInfoSchema = new mongoose.Schema({
  partNo: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  modelCode: { type: String },
  icc: {type: String},
  franchise: { type: String },
  ohQty: { type: Number },
  price: { type: Number },
  total: { type: Number },
  branch: { type: String },
  month: { type: Number },
  year: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('PartInfo', partInfoSchema);
