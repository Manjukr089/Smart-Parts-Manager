import React, { useState, useEffect} from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';  // adjust path if needed

// ✅ Helper to decode JWT
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};
function UploadForm() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const [branch, setBranch] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(currentYear);
  const [period, setPeriod] = useState('');
  const [partFile, setPartFile] = useState(null);
  const [salesFile, setSalesFile] = useState(null);

  // ✅ Load branch from token once on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = decodeToken(token);
    if (user && user.branch) {
      setBranch(user.branch);
    }
  }, []);


// 📂 Part file change handler — restrict to .xls and .xlsx
const handlePartFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedExtensions = ['.xls', '.xlsx'];
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

  // ❌ If not an allowed extension, show error and reset input
  if (!allowedExtensions.includes(ext)) {
    alert('❌ Only .xls or .xlsx files are allowed for Part Info!');
    e.target.value = ''; // Reset file picker
    return;
  }

  setPartFile(file); // ✅ Store file in state
};

// 📂 Sales file change handler — restrict to .xls and .xlsx
const handleSalesFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedExtensions = ['.xls', '.xlsx'];
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    alert('❌ Only .xls or .xlsx files are allowed for Sales Report!');
    e.target.value = '';
    return;
  }

  setSalesFile(file);
};


  const handleUpload = async (e) => {
    e.preventDefault();

    if (!branch || !month || !year) {
      alert('❌ Please select branch, month, and year');
      return;
    }

    if (!partFile && !salesFile) {
      alert('❌ Please select at least one file to upload');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ You are not logged in');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      if (partFile) {
        const partFormData = new FormData();
        partFormData.append('file', partFile);
        partFormData.append('branch', branch);
        partFormData.append('month', parseInt(month));
        partFormData.append('year', parseInt(year));

        // await axios.post('http://localhost:5000/api/parts/upload', partFormData, config);
        await axios.post(`${API_BASE_URL}/api/parts/upload`, partFormData, config);
      }

      if (salesFile) {
        if (!period) {
          alert('❌ Please select a period for sales upload');
          return;
        }

        const salesFormData = new FormData();
        salesFormData.append('file', salesFile);
        salesFormData.append('branch', branch);
        salesFormData.append('month', parseInt(month));
        salesFormData.append('year', parseInt(year));
        salesFormData.append('period', period);
console.log("🔐 Token in localStorage:", localStorage.getItem('token'));
const token = localStorage.getItem('token');
const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        // await axios.post('http://localhost:5000/api/sales/upload', salesFormData, config);
        await axios.post(`${API_BASE_URL}/api/sales/upload`, salesFormData, config);
      }

      alert('✅ Upload successful!');
      setPartFile(null);
      setSalesFile(null);
      setPeriod('');
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed: ' + (err.response?.data?.error || 'Check server logs'));
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📤 Upload Parts & Sales Report</h2>
      <form onSubmit={handleUpload} style={formStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>Branch:</label>
<select value={branch} disabled style={selectStyle}>
            
            <option value=''>-- Select Branch --</option>
            <option>Shimoga</option>
            <option>Sagara</option>
            <option>Hassan</option>
            <option>Kaduru</option>
            <option>Chikkamagaluru</option>
          </select>
        </div>

        <div style={rowStyle}>
          <label style={labelStyle}>Month:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={selectStyle} required>
            <option value=''>-- Select Month --</option>
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map((monthName, i) => (
              <option key={i + 1} value={i + 1}>{monthName}</option>
            ))}
          </select>
        </div>

        <div style={rowStyle}>
          <label style={labelStyle}>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle} required>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div style={rowStyle}>
          <label style={labelStyle}>Period (for Sales Report):</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={selectStyle}
            disabled={!salesFile}
            required={!!salesFile}
          >
            <option value="">-- Select Period --</option>
            <option value="1-7">1–7</option>
            <option value="8-14">8–14</option>
            <option value="15-21">15–21</option>
            <option value="22-28">22–28</option>
            <option value="29-31">29–31</option>
          </select>
        </div>

        <div style={fileBox}>
          <label style={labelStyle}>📦 Upload Part Info (.csv/.xls/.xlsx):</label>
          {/* <input type='file' accept='.xls,.xlsx,.csv' onChange={(e) => setPartFile(e.target.files[0])} /> */}
       <input type='file' accept='.xls,.xlsx' onChange={handlePartFileChange} />


        </div>

        <div style={fileBox}>
          <label style={labelStyle}>📊 Upload Sales Report (.csv/.xls/.xlsx):</label>
          {/* <input type='file' accept='.xls,.xlsx,.csv' onChange={(e) => setSalesFile(e.target.files[0])} /> */}
            <input type='file' accept='.xls,.xlsx' onChange={handleSalesFileChange} />

        </div>

        <button type='submit' style={buttonStyle}>🚀 Upload</button>
      </form>
    </div>
  );
}

const containerStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '30px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Arial, sans-serif'
};

const headingStyle = {
  marginBottom: '25px',
  textAlign: 'center',
  color: '#007bff'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: '5px'
};

const selectStyle = {
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const fileBox = {
  padding: '15px',
  background: '#f7f7f7',
  borderRadius: '8px',
  border: '1px dashed #aaa'
};

const buttonStyle = {
  padding: '12px',
  background: '#007bff',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

export default UploadForm;
