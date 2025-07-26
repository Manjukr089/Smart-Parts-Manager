const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain text
  branch: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'uploader', 'viewer'],
    default: 'uploader'
  }
});

module.exports = mongoose.model('User', userSchema);
