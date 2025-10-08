const csv = require('csv-parser');
const xlsx = require('xlsx'); // ✅ Add for Excel support
const path = require('path');

const fs = require('fs');
const PartInfo = require('../models/PartInfo');
const UploadLog = require('../models/UploadLog');
const SalesData = require('../models/SalesData');




//working code
const uploadPartInfo = async (req, res) => {
  const { branch, month, year } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'Part info file is required' });

  try {
    const ext = path.extname(file.originalname);
    let raw = [];

    // ✅ Parse CSV or Excel
    if (ext === '.csv') {
      const data = fs.readFileSync(file.path, 'utf8');
      const rows = data.split('\n').map(row => row.split(','));
      const headers = rows[0].map(h => h.trim());

      for (let i = 1; i < rows.length; i++) {
        if (rows[i].length < headers.length) continue;
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = rows[i][j]?.trim();
        }
        raw.push(row);
      }
    } else {
      const workbook = xlsx.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      raw = xlsx.utils.sheet_to_json(sheet);
    }

    // ✅ Transform and validate rows
    const parts = raw.map(row => ({
      branch,
      month,
      year,
      partNo: row['Part No']?.trim(),
      description: row['Part Desc']?.trim(),
      modelCode: row['Model Code']?.trim(),
      icc: row['ICC']?.trim(),
      franchise: row['Franchise']?.trim(),
      location: row['Primary Loc']?.trim() || row['Location']?.trim(),
      ohQty: Number(row['O/H Qty']) || 0,
      price: Number(row['Price']) || 0,
      total: (Number(row['Price']) || 0) * (Number(row['O/H Qty']) || 0)

    })).filter(p => p.partNo); // ❗ Only insert rows with partNo

    await PartInfo.deleteMany({ branch, month, year });
    await PartInfo.insertMany(parts);

    await UploadLog.create({
      branch,
      month,
      year,
      fileType: 'partinfo',
      partCount: parts.length
    });

    fs.unlinkSync(file.path);
    res.json({ message: '✅ Part info uploaded successfully', count: parts.length });
  } catch (err) {
    if (process.env.DEBUG === 'true') {

      console.error('❌ Part info upload failed:', err);
      res.status(500).json({ error: 'Error saving part data', details: err.message });
    }
  }
};









const calculateMovementData = async (branch, month, year) => {
  const parts = await PartInfo.find({ branch, month, year });
  const totalParts = parts.length;
  const totalValue = parts.reduce((sum, part) => sum + (part.total || 0), 0);

  //previously worked code
  const sales = await SalesData.find({ branch, month, year });
  const consumptionMap = {};

  sales.forEach(s => {
    const qty = consumptionMap[s.partNo] || 0;
    consumptionMap[s.partNo] = qty + s.quantity;
  });




  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevParts = await PartInfo.find({ branch, month: prevMonth, year: prevYear });
  const openingMap = {};
  prevParts.forEach(p => {
    openingMap[p.partNo] = p.ohQty;
  });

  const enrichedParts = parts.map(part => {
    const openingStock = openingMap[part.partNo] || 0;
    const consumption = consumptionMap[part.partNo] || 0;
    // const purchase = part.ohQty - openingStock + consumption;

    const ohQty = part.ohQty || 0;

    let rawPurchase = ohQty - openingStock + consumption; // raw calculation
    let purchase = Math.max(0, rawPurchase); // clamp to zero

    

    return {
      ...part.toObject(),
      openingStock,
      purchase,
      consumption,
      closingStock: part.ohQty
    };
  });

  return { parts: enrichedParts, totalParts, totalValue };
};

const getPartInfo = async (req, res) => {
  try {
    const { branch, month, year } = req.query;
    if (!branch || !month || !year) {
      return res.status(400).json({ error: 'Branch, month, and year are required' });
    }

    const { parts, totalParts, totalValue } = await calculateMovementData(branch, Number(month), Number(year));
    res.json({ parts, totalParts, totalValue });
  } catch (err) {
    if (process.env.DEBUG === 'true') {

      res.status(500).json({ error: 'Failed to fetch parts info', details: err.message });
    }
  }
};

// ✅ Add this route for /api/parts/movement
const getPartMovement = async (req, res) => {
  try {
    const { branch, month, year } = req.query;
    if (!branch || !month || !year) {
      return res.status(400).json({ error: 'Branch, month, and year are required' });
    }

    const { parts, totalParts, totalValue } = await calculateMovementData(branch, Number(month), Number(year));
    res.json({ parts, totalParts, totalValue });
  } catch (err) {
    if (process.env.DEBUG === 'true') {

      res.status(500).json({ error: 'Failed to fetch part movement', details: err.message });
    }
  }
};

const getUploadHistory = async (req, res) => {
  try {
    const logs = await UploadLog.find({ fileType: 'partinfo' }).sort({ uploadedAt: -1 }).limit(20);
    res.json(logs);
  } catch (err) {
    if (process.env.DEBUG === 'true') {

      res.status(500).json({ error: 'Failed to fetch upload logs' });
    }
  }
};

module.exports = {
  uploadPartInfo,
  getPartInfo,
  getUploadHistory,
  getPartMovement // ✅ Exported properly
};
