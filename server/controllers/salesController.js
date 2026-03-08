// server/controllers/salesController.js
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const SalesData = require('../models/SalesData');
const UploadLog = require('../models/UploadLog');
const parseExcelOrCSV = require('../utils/parseExcelOrCSV');
const { getUserFromToken } = require('../utils/jwtHelpers');

//woking previously

// const validateDateRange = (dateStr, month, year, period) => {
//   if (!dateStr || typeof dateStr !== 'string') return false;

//   // Parse dd/mm/yyyy or d/m/yyyy
//   const parts = dateStr.split('/');
//   if (parts.length !== 3) return false;

//   const [dayStr, monthStr, yearStr] = parts;
//   const day = parseInt(dayStr, 10);
//   const saleMonth = parseInt(monthStr, 10);
//   const saleYear = parseInt(yearStr, 10);

//   if (isNaN(day) || isNaN(saleMonth) || isNaN(saleYear)) return false;
//   if (saleMonth !== Number(month) || saleYear !== Number(year)) return false;

//   const [start, end] = period.split('-').map(Number);
//   return day >= start && day <= end;
// };








// Get Top Consumed Parts


const validateDateRange = (date, month, year, period) => {
  if (!(date instanceof Date)) return false;

  const saleDay = date.getDate();
  const saleMonth = date.getMonth() + 1;
  const saleYear = date.getFullYear();

  if (saleMonth !== Number(month) || saleYear !== Number(year)) return false;

  const [start, end] = period.split('-').map(Number);
  return saleDay >= start && saleDay <= end;
};



const getConsumptionStats = async (req, res) => {
  try {
    const { branch, month, year, limit = 10 } = req.query;

    if (!branch || !month || !year) {
      return res.status(400).json({ error: 'Branch, month, and year are required' });
    }

    const topConsumed = await SalesData.aggregate([
      {
        $match: {
          branch,
          month: parseInt(month),
          year: parseInt(year),
        }
      },
      {
        $group: {
          _id: { partNo: "$partNo", description: "$description" },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({ topConsumed });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top consumed parts", details: err.message });
  }
};



const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;

  const [day, month, year] = dateStr.split(/[\/\-]/).map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed
};

//this block will add after report column names change 
🔹 Normalize column names (remove spaces, dots, lowercase)
const normalizeKey = (key = "") =>
  key.toString().trim().toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

// 🔹 Get value from row using possible column names
const getValue = (row, possibleKeys = []) => {
  for (const k of Object.keys(row)) {
    const normalized = normalizeKey(k);
    if (possibleKeys.includes(normalized)) {
      return row[k];
    }
  }
//   return null;
// };


const uploadSalesData = async (req, res) => {
  const { branch, month, year, period } = req.body;
  const file = req.file;

  if (!file || !branch || !month || !year || !period) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = req.user; // ✅ set by auth middleware
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.branch !== branch && user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not allowed to upload for this branch' });
    }

    const raw = await parseExcelOrCSV(file);
    if (process.env.DEBUG === 'true') {

    console.log("📥 Sales upload hit with:", { user, branch, month, year, period });
    console.log("Parsed rows:", raw.length);
    console.log("First row from Excel:", raw[0]);
    }
      //previously working code before report column name change
    const sales = raw.map(row => ({
      partNo: row['PartNo']?.trim(),
      description: row['Part Name']?.trim(),
      quantity: parseInt(row['Sale Qty']) || 0,
      date: parseDate(row['SaleDate']),

      branch,
      month: parseInt(month),
      year: parseInt(year),
      period
    })).filter(r => r.partNo)

//     //this block will add after report column names change 
//       // 🔹 Flexible column detection for Toyota reports
// const sales = raw.map(row => {

//   // detect part number
//   const partNo = getValue(row, [
//     "PartNo",
//     "Part No.",
//     "partnumber"
//   ]);

//   // detect description
//   const description = getValue(row, [
//     "partdesc",
//     "PartName",
//     "Part Name",
//     "Part Desc."
//   ]);

//   // detect quantity
//   const qty = getValue(row, [
//     "Qty.",
//     "Sale Qty"
//   ]);

//   // detect sale date
//   const saleDateRaw = getValue(row, [
//     "Sale Date",
//     "SaleDate"
//   ]);

//   return {
//   partNo: partNo?.trim(),
//   description: description?.trim(),
//   quantity: parseInt(qty) || 0,
//   date: parseDate(saleDateRaw),

//   branch,
//   month: parseInt(month),
//   year: parseInt(year),
//   period
// };

// }).filter(r => r.partNo);




    
  //   .filter(r => {
  //   // Skip negative quantities (returns)
  //   if (r.quantity < 0) {
  //     console.log(`Skipped negative qty for part ${r.partNo}: ${r.quantity}`);
  //     return false;
  //   }
  //   if (isNaN(r.quantity)) {
  //     console.log(`⏩ Skipped invalid qty for part ${r.partNo}`);
  //     return false;
  //   }
  //   return true;
  // });

.filter(r => {
  // Keep negative quantities (returns) but skip invalid numbers
  if (isNaN(r.quantity)) {
    console.log(`⏩ Skipped invalid qty for part ${r.partNo}`);
    return false;
  }
  return true;
});



    // ✅ Skip records without valid date
    const invalidDates = sales.filter(r => {
      if (!r.date) return true;
      return !validateDateRange(r.date, month, year, period);
    });

    if (invalidDates.length > 0) {
      if (process.env.DEBUG === 'true') {

        console.log("❌ Invalid date rows:", invalidDates);

      return res.status(400).json({ error: 'Some dates are outside the selected period' });
      }
    }

    await SalesData.deleteMany({ branch, month, year, period });
    await SalesData.insertMany(sales);

    await UploadLog.create({
      branch,
      month,
      year,
      period,
      fileType: 'sales',
      partCount: sales.length,
      uploadedBy: user.username,
      role: user.role
    });

    fs.unlinkSync(file.path);
    res.json({ message: '✅ Sales report uploaded successfully', count: sales.length });

  }
   catch (err) {
    if (process.env.DEBUG === 'true') {

    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
    }
  }
};

module.exports = { uploadSalesData,
    getConsumptionStats
};
