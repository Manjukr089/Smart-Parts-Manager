

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  uploadPartInfo,
  getPartInfo,
  getUploadHistory,
  getPartMovement
} = require('../controllers/partInfoController');

// Upload CSV file
router.post('/upload', upload.single('file'), uploadPartInfo);

// Get part info by branch, month, year
router.get('/fetch', getPartInfo);

// Get recent upload logs
router.get('/history', getUploadHistory);

// Get detailed part movement and analytics
router.get('/movement', getPartMovement);

module.exports = router;
