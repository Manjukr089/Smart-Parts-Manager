
// models/SalesData.js
const mongoose = require('mongoose');

const SalesDataSchema = new mongoose.Schema({
  partNo: String,
  description: String,
  quantity: Number,
  branch: String,
  month: Number,
  year: Number,
  period: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('SalesData', SalesDataSchema);  // ✅ must export Mongoose model
