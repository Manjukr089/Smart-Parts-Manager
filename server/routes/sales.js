// // routes/sales.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// const {
//   uploadSalesData,
//   getConsumptionStats
// } = require('../controllers/salesController');

// // Upload sales report
// router.post('/upload', upload.single('file'), uploadSalesData);

// // Get stats (top consumed + non-moving)
// router.get('/stats', getConsumptionStats);

// module.exports = router;










const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// const { uploadSalesData } = require('../controllers/salesController');
const verifyToken = require('../middleware/authMiddleware');
const {
  uploadSalesData,
  getConsumptionStats
} = require('../controllers/salesController');

// router.post('/upload', upload.single('file'), uploadSalesData);
router.post('/upload', verifyToken, upload.single('file'), uploadSalesData);

// Get stats (top consumed + non-moving)
router.get('/stats', getConsumptionStats);

module.exports = router;
