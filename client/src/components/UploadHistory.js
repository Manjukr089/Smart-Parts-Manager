// components/UploadHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/partinfo/upload-history');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching upload history:', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded mt-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Upload History</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">File Type</th>
            <th className="p-2 border">Branch</th>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Year</th>
            <th className="p-2 border">Week</th>
            <th className="p-2 border">Parts Count</th>
            <th className="p-2 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{item.fileType}</td>
              <td className="p-2 border">{item.branch}</td>
              <td className="p-2 border">{item.month}</td>
              <td className="p-2 border">{item.year}</td>
              <td className="p-2 border">{item.week || '-'}</td>
              <td className="p-2 border">{item.partCount}</td>
              <td className="p-2 border">{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadHistory;
