import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PartTable from './PartTable';

function Dashboard() {
  const [branch, setBranch] = useState('Shimoga');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [parts, setParts] = useState([]);
  const [totalParts, setTotalParts] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [topConsumed, setTopConsumed] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];

  const fetchParts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/parts/fetch', {
        params: { branch, month, year }
      });

      const enriched = res.data.parts.map(part => {
        const opening = part.openingStock || 0;
        const purchase = part.purchaseQty || 0;
        const consumed = part.consumedQty || 0;
        const closing = part.ohQty || 0;

        return {
          ...part,
          openingStock: opening,
          purchaseQty: purchase,
          consumedQty: consumed,
          ohQty: closing,
          total: part.price * closing
        };
      });

      setParts(enriched);
      setTotalParts(res.data.totalParts || enriched.length);
      setTotalValue(
        enriched.reduce((sum, p) => sum + (p.total || 0), 0).toFixed(2)
      );
    } catch (err) {
      console.error('Error fetching parts:', err.message);
    }
  };


  // Fetch top consumed parts
  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sales/stats`, {
        params: { branch, month, year }
      });
      setTopConsumed(res.data.topConsumed || []);
    } catch (err) {
      console.error('Failed to fetch top consumed parts:', err.message);
    }
  };


  const handleFetch = () => {
    fetchParts();
    fetchStats();
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI' }}>
      <h2 style={{ marginBottom: '20px' }}>📦 MyParts Assistant - Dashboard</h2>




      {/* previously working */}
      {/* <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option>Shimoga</option>
          <option>Sagara</option>
          <option>Hassan</option>
          <option>Kaduru</option>
          <option>Chikkamagaluru</option>
        </select>

        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {months.map((m, idx) => (
            <option key={idx} value={idx + 1}>{m}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <button onClick={handleFetch} style={{ padding: '6px 14px' }}>Fetch</button>
      </div> */}
<div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: '12px 16px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  marginBottom: '20px'
}}>
  <select value={branch} onChange={(e) => setBranch(e.target.value)} style={selectStyle}>
    <option>Shimoga</option>
    <option>Sagara</option>
    <option>Hassan</option>
    <option>Kaduru</option>
    <option>Chikkamagaluru</option>
  </select>

  <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={selectStyle}>
    {months.map((m, idx) => (
      <option key={idx} value={idx + 1}>{m}</option>
    ))}
  </select>

  <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={selectStyle}>
    {years.map((y) => (
      <option key={y}>{y}</option>
    ))}
  </select>

  <button onClick={handleFetch} style={buttonStyle}>Fetch</button>
</div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4>Total Parts</h4>
          <p>{totalParts}</p>
        </div>
        <div style={cardStyle}>
          <h4>Total Value</h4>
          <p>₹ {totalValue}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4 style={{ fontSize: '20px' }}>🔥 Top Consumed Parts</h4>
        <ul style={{ background: '#fff', padding: '15px', borderRadius: '10px', listStyle: 'disc inside' }}>

          {topConsumed.length === 0 ? <li>No data</li> :
            topConsumed.map((item, index) => (
              <li key={index}>
                {item._id.partNo} - {item.totalQuantity} sold
              </li>
            ))}

        </ul>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h4 style={{ fontSize: '20px' }}>🧾 All Part Info</h4>
        <PartTable parts={parts} />
      </div>
    </div>
  );
}

const cardStyle = {
  flex: '1',
  background: '#f0f8ff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};
const selectStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#f9f9f9',
  fontSize: '14px',
  cursor: 'pointer',
  minWidth: '150px'
};

const buttonStyle = {
  padding: '8px 18px',
  backgroundColor: '#d32f2f',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
};

export default Dashboard;