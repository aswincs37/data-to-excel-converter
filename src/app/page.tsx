'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Page = () => {
  const [bulkInput, setBulkInput] = useState('');
  const [sheetName, setSheetName] = useState('UserData'); // Default sheet name
  const [senderNumber, setSenderNumber] = useState('7510957129');
  const [weight, setWeight] = useState('70');
  const [error, setError] = useState('');

  const validateMobileNumber = (value: string) => {
    const mobileNumberRegex = /^[6-9]\d{9}$/; // Starts with 6-9 and has exactly 10 digits
    if (!mobileNumberRegex.test(value)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
    } else {
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric input
    if (/^\d*$/.test(value)) {
      setSenderNumber(value);
      if (value.length === 10) {
        validateMobileNumber(value);
      } else {
        setError('Mobile number must be exactly 10 digits.');
      }
    }
  };

  const handleDownload = () => {
    const entries = bulkInput
      .split(/Name\s*:/i)
      .slice(1)
      .filter((entry) => entry.trim() !== '');

    const data = entries.map((entry, index) => {
      const lines = entry.trim().split('\n').map((line) => line.trim());
      const name = lines[0];
      const pincode = lines.find((line) => /Pincode\s*:/i.test(line))?.replace(/Pincode\s*:/i, '').trim();
      const district = lines.find((line) => /District\s*:/i.test(line))?.replace(/District\s*:/i, '').trim();
      const phoneLine = lines.find((line) => /Phone\s*:/i.test(line) || /Mob\s*:/i.test(line));
      const phone = phoneLine
        ?.replace(/Phone\s*:/i, '')
        .replace(/Mob\s*:/i, '')
        .split(',')[0]
        .trim();

      return {
        SL: index + 1,
        Barcode: '',
        REF: '',
        City: district || '',
        Pincode: pincode || '',
        Name: name || '',
        ADD1: district || '',
        ADD2: district || '',
        ADD3: district || '',
        ADDREMAIL: '',
        ADDREMOBILE: phone || '',
        SENDERMOBILE: senderNumber,
        'Weight(gm)': weight,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Sheet1');

    XLSX.writeFile(workbook, `${sheetName || 'UserData'}.xlsx`);
  };

  return (
    <div className="container">
      <h2>Bulk User Data to Excel</h2>

      <textarea
        rows={8}
        className="textarea"
        placeholder="Paste your bulk data here..."
        value={bulkInput}
        onChange={(e) => setBulkInput(e.target.value)}
      ></textarea>

      <label>Sender Mobile Number:</label>
      <input
        type="tel"
        placeholder="Enter the sender mobile number"
        value={senderNumber}
        onChange={handleInputChange}
        maxLength={10}
        className={`input ${error ? 'input-error' : ''}`}
      />
      {error && <span className="error">{error}</span>}
      <span className="char-counter">{senderNumber.length} / 10</span>

      <label>Weight (in grams):</label>
      <input
        type="text"
        placeholder="Enter weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="input"
      />

      <label>Excel Sheet Name:</label>
      <input
        type="text"
        placeholder="Enter Excel Sheet Name"
        value={sheetName}
        onChange={(e) => setSheetName(e.target.value)}
        className="input"
      />

      <button onClick={handleDownload} className="button">
        Download Excel
      </button>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 600px;
          margin: 20px auto;
          font-family: 'Roboto', sans-serif;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        h2 {
          text-align: center;
          color: #4a4a4a;
          margin-bottom: 20px;
        }
        .textarea {
          width: 100%;


          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 15px;
          background-color: #f9f9f9;
        }
        label {
          color: #4a4a4a;
          font-weight: bold;
        }
        .input {
          width: 95%;
          padding:15px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 15px;
        }
        .input-error {
          border-color: #ff4d4d;
        }
        .error {
          color: #ff4d4d;
          font-size: 14px;
        }
        .char-counter {
          font-size: 12px;
          color: #888;
          margin-top: -10px;
          text-align: right;
        }
        .button {
          padding: 12px 20px;
          cursor: pointer;
          background-color: #007bff;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .button:hover {
          background-color: #0056b3;
        }
        @media (max-width: 768px) {
          .container {
            max-width: 90%;
            padding: 15px;
          }
          .textarea,
          .input {
            font-size: 14px;
          }
          .button {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
