'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Page = () => {
  const [bulkInput, setBulkInput] = useState('');
  const [sheetName, setSheetName] = useState('UserData'); // Default sheet name

  const handleDownload = () => {
    // Split input into individual entries using "Name :" as the separator
    const entries = bulkInput
      .split(/Name\s*:/) // Split by "Name :"
      .slice(1) // Ignore everything before the first "Name :"
      .filter((entry) => entry.trim() !== ''); // Filter out empty entries

    // Parse each entry and structure it into an array of objects
    const data = entries.map((entry) => {
      const lines = entry.trim().split('\n').map((line) => line.trim());
      const name = lines[0];
      const address = lines.find((line) => line.startsWith('Address :'))?.replace('Address :', '').trim();
      const pincode = lines.find((line) => line.startsWith('Pincode :'))?.replace('Pincode :', '').trim();
      const district = lines.find((line) => line.startsWith('District :'))?.replace('District :', '').trim();
      const phoneLine = lines.find((line) => line.startsWith('Mob :') || line.startsWith('Phone :'));
      const phone = phoneLine
        ?.replace('Mob :', '')
        .replace('Phone :', '')
        .split('/')[0]
        .trim();

      return {
        name: name || '',
        city: district || '',
        pincode: pincode || '',
        address: address || '',
        mobile: phone || '',
      };
    });

    // Create Excel worksheet and file
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Sheet1');

    // Download the Excel file
    XLSX.writeFile(workbook, `${sheetName || 'UserData'}.xlsx`);
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: "'Arial', sans-serif",
        backgroundColor: '#f4f4f9',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Bulk User Data to Excel</h2>
      <textarea
        rows={10}
        style={{
          width: '100%',
          marginBottom: '20px',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
        placeholder="Paste your bulk data here..."
        value={bulkInput}
        onChange={(e) => setBulkInput(e.target.value)}
      ></textarea>
       <h4 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Enter the excel sheet name below !</h4>
      <input
        type="text"
        placeholder="Enter Excel Sheet Name"
        value={sheetName}
        onChange={(e) => setSheetName(e.target.value)}
        style={{
          width: '100%',
          marginBottom: '20px',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />
      <button
        onClick={handleDownload}
        style={{
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          width: '100%',
        }}
      >
        Download Excel
      </button>
    </div>
  );
};

export default Page;
