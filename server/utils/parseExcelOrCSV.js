const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

const parseExcelOrCSV = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.csv') {
    const data = fs.readFileSync(file.path, 'utf8');
    const rows = data.split('\n').map(r => r.split(','));
    const headers = rows[0].map(h => h.trim());
    const output = [];

    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length < headers.length) continue;
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = rows[i][j]?.trim();
      }
      output.push(row);
    }

    return output;
  } else {
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
  }
};

module.exports = parseExcelOrCSV;
