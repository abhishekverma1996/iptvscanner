import React, { useState } from 'react';
import './App.css';

const MacGenerator = () => {
  const [macs, setMacs] = useState([]);
  const [numMacs, setNumMacs] = useState(0);
  const [macPrefix, setMacPrefix] = useState('00:1A:79:');
  const [isLoading, setIsLoading] = useState(false);

  const macPrefixes = [
    "00:1A:79:",
    "33:44:CF:",
    "10:27:BE:",
    "A0:BB:3E:",
    "18:C8:E7:",
    "78:A3:52:",
    "D4:CF:F9:",
    "55:93:EA:",
    "04:D6:AA:",
    "11:33:01:",
    "00:1C:19:",
    "1A:00:6A:",
    "1A:00:FB:",
    "00:1B:79:",
    "90:0E:B3:",
    "00:2A:79:",
  ];

  const generateMac = () => {
    const randomMac = `${macPrefix}${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`;
    return randomMac.toUpperCase();
  };

  const handleGenerate = () => {
    setIsLoading(true);
    const generatedMacs = [];
    for (let i = 0; i < numMacs; i++) {
      generatedMacs.push(generateMac());
    }
    setMacs(generatedMacs);
    setIsLoading(false);
  };

  const handleDownload = () => {
    // Convert results into a plain text string
    const macText = macs.join('\n'); // Join each MAC address with a new line
    const blob = new Blob([macText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated_macs.txt';
    link.click();
  };

  return (
    <div className="container">
      <h2>MAC Generator</h2>
      <div className="combo-input-container">
        <select value={macPrefix} onChange={(e) => setMacPrefix(e.target.value)}>
          {macPrefixes.map((prefix, index) => (
            <option key={index} value={prefix}>{prefix}</option>
          ))}
        </select>
        <input 
          type="number" 
          placeholder="Number of MACs" 
          value={numMacs} 
          onChange={(e) => setNumMacs(Number(e.target.value))} 
        />
        <button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate MACs'}
        </button>
      </div>

      <div className="scrollable-area">
        <div className="combo-list">
          {macs.map((mac, index) => (
            <span key={index}>{mac}</span>
          ))}
        </div>
      </div>

      {macs.length > 0 && (
        <button onClick={handleDownload}>
          Download MACs as Text File
        </button>
      )}
    </div>
  );
};

export default MacGenerator;
