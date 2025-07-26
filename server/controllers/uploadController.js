const UploadLog = require('../models/UploadLog');
await UploadLog.create({
  uploadedBy: req.user.username,
  role: req.user.role,
  branch: req.user.branch,
  fileType: 'sales',
  period: req.body.period,
  month: req.body.month,
  year: req.body.year,
  filename: req.file.originalname
});
