// previously working
// import React, { useState } from 'react';

// function PartTable({ parts, lowStockThreshold = 3 }) {
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

//   const filteredParts = parts.filter(part => {
//     const getStr = (val) => (val ?? '').toString().toLowerCase();
//     return (
//       getStr(part.partNo).includes(filters.partNo.toLowerCase()) &&
//       getStr(part.description).includes(filters.description.toLowerCase()) &&
//       getStr(part.icc).includes(filters.icc.toLowerCase()) &&
//       getStr(part.modelCode).includes(filters.modelCode.toLowerCase()) &&
//       getStr(part.location).includes(filters.location.toLowerCase()) &&
//       (filters.openingStock === '' || getStr(part.openingStock).includes(filters.openingStock)) &&
//       (filters.purchase === '' || getStr(part.purchase).includes(filters.purchase)) &&
//       (filters.consumption === '' || getStr(part.consumption).includes(filters.consumption)) &&
//       (filters.ohQty === '' || getStr(part.ohQty).includes(filters.ohQty)) &&
//       (filters.price === '' || getStr(part.price).includes(filters.price)) &&
//       (filters.total === '' || getStr(part.total || (part.ohQty * part.price)).includes(filters.total))
//     );
//   });

//   return (
//     <div style={{ overflowX: 'auto', marginTop: '20px' }}>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr style={{ background: '#eee' }}>
//             <th style={thStyle}>Part No</th>
//             <th style={thStyle}>Description</th>
//             <th style={thStyle}>ICC</th>
//             <th style={thStyle}>Model Code</th>
//             <th style={thStyle}>Primary Location</th>
//             <th style={thStyle}>Opening Stock</th>
//             <th style={thStyle}>Purchase</th>
//             <th style={thStyle}>Consumption</th>
//             <th style={thStyle}>Closing Stock(O/H QTY)</th>
//             <th style={thStyle}>Price</th>
//             <th style={thStyle}>Total</th>
//           </tr>
//           <tr>
//             {['partNo', 'description', 'icc', 'modelCode', 'location', 'openingStock', 'purchase', 'consumption', 'ohQty', 'price', 'total'].map(field => (
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
//             <tr><td colSpan="11" style={emptyCellStyle}>No matching records</td></tr>
//           ) : (
//             filteredParts.map((part, index) => {
//               const qty = part.ohQty || 0;
//               const price = part.price || 0;
//               const total = part.total || (qty * price);
//               const isLow = qty < lowStockThreshold;

//               return (
//                 <tr key={index} style={{ background: isLow ? '#ffe6e6' : '#fff' }}>
//                   <td style={tdStyle}>{part.partNo || '-'}</td>
//                   <td style={tdStyle}>{part.description || '-'}</td>
//                   <td style={tdStyle}>{part.icc || '-'}</td>
//                   <td style={tdStyle}>{part.modelCode || '-'}</td>
//                   <td style={tdStyle}>{part.location || '-'}</td>
//                   <td style={tdStyle}>{part.openingStock ?? '-'}</td>
//                   <td style={tdStyle}>{part.purchase ?? '-'}</td>
//                   <td style={tdStyle}>{part.consumption ?? 0}</td>
//                   <td style={tdStyle}>{qty}</td>
//                   <td style={tdStyle}>₹ {price.toFixed(2)}</td>
//                   <td style={tdStyle}>₹ {total.toFixed(2)}</td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// const thStyle = { background:'gold' ,border: '1px solid #ccc', padding: '8px', textAlign: 'left', whiteSpace: 'nowrap' };
// const tdStyle = { border: '1px solid #ccc', padding: '8px', whiteSpace: 'nowrap' };
// const inputStyle = { width: '95%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' };
// const emptyCellStyle = { padding: '15px', textAlign: 'center', fontStyle: 'italic', color: '#666' };

// export default PartTable;



import React, { useState } from 'react';

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
    consumption: 'Consumption',
    ohQty: 'Closing Stock (O/H QTY)',
    price: 'Price',
    total: 'Total'
  };

  const filteredParts = parts.filter(part => {
    const getStr = (val) => (val ?? '').toString().toLowerCase();
    return columns.every(col =>
      filters[col] === '' || getStr(part[col]).includes(filters[col].toLowerCase())
    );
  });

  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
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
                    <td key={col} style={tdStyle}>
                      {col === 'price'
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
