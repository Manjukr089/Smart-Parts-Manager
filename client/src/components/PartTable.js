//previously working

// import React, { useState } from 'react';

// function PartTable({ parts, lowStockThreshold = 3, isLoggedIn }) {
//   const [filters, setFilters] = useState({
//     partNo: '',
//     description: '',
//     icc: '',
//     modelCode: '',
//     location: '',
//     openingStock: '',
//     purchase: '',
//     consumption: '',
//     ohQty: '',
//     price: '',
//     total: ''
//   });

//   const handleFilterChange = (field, value) => {
//     setFilters({ ...filters, [field]: value });
//   };

//   // Columns for logged in vs non logged in
//   const columns = isLoggedIn
//     ? ['partNo', 'description', 'icc', 'modelCode', 'location', 'openingStock', 'purchase', 'consumption', 'ohQty', 'price', 'total']
//     : ['partNo', 'description', 'modelCode', 'ohQty', 'price'];

//   const columnLabels = {
//     partNo: 'Part No',
//     description: 'Description',
//     icc: 'ICC',
//     modelCode: 'Model Code',
//     location: 'Primary Location',
//     openingStock: 'Opening Stock',
//     purchase: 'Purchase',
//     consumption: 'Sale',
//     ohQty: 'O/H QTY',
//     price: 'Price',
//     total: 'Total'
//   };

//   const filteredParts = parts.filter(part => {
//     const getStr = (val) => (val ?? '').toString().toLowerCase();
//     return columns.every(col =>
//       filters[col] === '' || getStr(part[col]).includes(filters[col].toLowerCase())
//     );
//   });

//   return (
//     <div style={{ overflowX: 'auto', marginTop: '20px' }}>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr style={{ background: '#eee' }}>
//             {columns.map(col => (
//               <th key={col} style={thStyle}>{columnLabels[col]}</th>
//             ))}
//           </tr>
//           <tr>
//             {columns.map(field => (
//               <th key={field}>
//                 <input
//                   style={inputStyle}
//                   placeholder="Search..."
//                   value={filters[field]}
//                   onChange={(e) => handleFilterChange(field, e.target.value)}
//                 />
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredParts.length === 0 ? (
//             <tr><td colSpan={columns.length} style={emptyCellStyle}>No matching records</td></tr>
//           ) : (
//             filteredParts.map((part, index) => {
//               const qty = part.ohQty || 0;
//               const price = part.price || 0;
//               const total = part.total || (qty * price);
//               const isLow = qty < lowStockThreshold;

//               return (
//                 <tr key={index} style={{ background: isLow ? '#ffe6e6' : '#fff' }}>
//                   {columns.map(col => (
//                     <td key={col} style={tdStyle}>
//                       {col === 'price'
//                         ? `₹ ${price.toFixed(2)}`
//                         : col === 'total'
//                         ? `₹ ${total.toFixed(2)}`
//                         : part[col] ?? '-'}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // Styles
// const thStyle = { background: 'gold', border: '1px solid #ccc', padding: '8px', textAlign: 'left', whiteSpace: 'nowrap' };
// const tdStyle = { border: '1px solid #ccc', padding: '8px', whiteSpace: 'nowrap' };
// const inputStyle = { width: '95%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' };
// const emptyCellStyle = { padding: '15px', textAlign: 'center', fontStyle: 'italic', color: '#666' };

// export default PartTable;







import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // ✅ NEW

function PartTable({ parts, lowStockThreshold = 3, isLoggedIn }) {
  const [filters, setFilters] = useState({
    partNo: '',
    description: '',
    icc: '',
    modelCode: '',
    location: '',
    openingStock: '',
    purchase: '',
    consumption: '',
    ohQty: '',
    price: '',
    total: ''
  });

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // Columns for logged in vs non logged in
  const columns = isLoggedIn
    ? ['partNo', 'description', 'icc', 'modelCode', 'location', 'openingStock', 'purchase', 'consumption', 'ohQty', 'price', 'total']
    : ['partNo', 'description', 'modelCode', 'ohQty', 'price'];

  const columnLabels = {
    partNo: 'Part No',
    description: 'Description',
    icc: 'ICC',
    modelCode: 'Model Code',
    location: 'Primary Location',
    openingStock: 'Opening Stock',
    purchase: 'Purchase',
    consumption: 'Sale',
    ohQty: 'O/H QTY',
    price: 'Price',
    total: 'Total'
  };

  const filteredParts = parts.filter(part => {
    const getStr = (val) => (val ?? '').toString().toLowerCase();
    return columns.every(col =>
      filters[col] === '' || getStr(part[col]).includes(filters[col].toLowerCase())
    );
  });

  // ✅ NEW: Export to Excel function
  const handleExportExcel = () => {
    if (filteredParts.length === 0) {
      alert('No data to export.');
      return;
    }

    // Prepare export data with labels
    const exportData = filteredParts.map(part => {
      const row = {};
      columns.forEach(col => {
        if (col === 'price') row[columnLabels[col]] = part[col] ? part[col].toFixed(2) : '0.00';
        else if (col === 'total') row[columnLabels[col]] = (part.total || (part.ohQty * part.price || 0)).toFixed(2);
                // 🟢 NEW: Skip negative consumption (sale) values
        else if (col === 'consumption') row[columnLabels[col]] = Math.max(0, part[col] || 0);
        else row[columnLabels[col]] = part[col] ?? '';
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Parts Data');
    XLSX.writeFile(wb, 'Parts_Report.xlsx');
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      {/* ✅ NEW: Export button */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button
          onClick={handleExportExcel}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2e7d32',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ⬇️ Export to Excel
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            {columns.map(col => (
              <th key={col} style={thStyle}>{columnLabels[col]}</th>
            ))}
          </tr>
          <tr>
            {columns.map(field => (
              <th key={field}>
                <input
                  style={inputStyle}
                  placeholder="Search..."
                  value={filters[field]}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredParts.length === 0 ? (
            <tr><td colSpan={columns.length} style={emptyCellStyle}>No matching records</td></tr>
          ) : (
            filteredParts.map((part, index) => {
              const qty = part.ohQty || 0;
              const price = part.price || 0;
              const total = part.total || (qty * price);
              const isLow = qty < lowStockThreshold;

              return (
                <tr key={index} style={{ background: isLow ? '#ffe6e6' : '#fff' }}>
                  {columns.map(col => (

                    //previously worked code
                    // <td key={col} style={tdStyle}>
                    //   {col === 'price'
                    //     ? `₹ ${price.toFixed(2)}`
                    //     : col === 'total'
                    //     ? `₹ ${total.toFixed(2)}`
                    //     : part[col] ?? '-'}
                    // </td>
                    
                     <td key={col} style={tdStyle}>
                      {/* 🟢 NEW: Display consumption as 0 if negative */}
                      {col === 'consumption'
                        ? Math.max(0, part[col] || 0)
                        : col === 'price'
                        ? `₹ ${price.toFixed(2)}`
                        : col === 'total'
                        ? `₹ ${total.toFixed(2)}`
                        : part[col] ?? '-'}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const thStyle = { background: 'gold', border: '1px solid #ccc', padding: '8px', textAlign: 'left', whiteSpace: 'nowrap' };
const tdStyle = { border: '1px solid #ccc', padding: '8px', whiteSpace: 'nowrap' };
const inputStyle = { width: '95%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' };
const emptyCellStyle = { padding: '15px', textAlign: 'center', fontStyle: 'italic', color: '#666' };

export default PartTable;
