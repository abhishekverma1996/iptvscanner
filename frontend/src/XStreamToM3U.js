import React, { useState } from 'react';
import './XStreamToM3u.css';
import axios from 'axios';

const XStreamToM3u = () => {
  const [panel, setPanel] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle panel address input change
  const handlePanelChange = (e) => {
    setPanel(e.target.value);
  };

  // Handle username input change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Function to extract the panel name from the URL
  const extractPanelName = (url) => {
    const hostname = new URL(url).hostname; // Extract hostname
    return hostname.replace(/[^a-zA-Z0-9]/g, '_'); // Replace any non-alphanumeric characters with underscores
  };

  // Function to construct the M3U URL and download it
  const checkAndDownloadM3U = async () => {
    setLoading(true);
    setError('');

    if (!panel || !username || !password) {
      setError('Panel, Username, and Password are required!');
      setLoading(false);
      return;
    }

    const m3uLink = `/api/proxy?username=${username}&password=${password}&panel=${panel}&action=get_m3u`;

    try {
      // Request to get the M3U content from the backend
      const response = await axios.get(m3uLink, { responseType: 'blob' });

      // Extract the panel name from the URL to use it as the filename
      const panelName = extractPanelName(panel);
      const fileName = `${panelName}.m3u`;

      // Create a URL for the file to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Set the dynamic file name based on panel name
      document.body.appendChild(link);
      link.click();

      // Clean up and reset
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      setError('Failed to generate M3U. Please check the details and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="generator">
      <h2>XStream to M3U Generator</h2>

      {/* Panel Address */}
      <div>
        <label>Panel Address (http://panel or https://panel):</label>
        <input
          type="text"
          value={panel}
          onChange={handlePanelChange}
        />
      </div>

      {/* Username */}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>

      {/* Password */}
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      {/* Check and Generate Button */}
      <button onClick={checkAndDownloadM3U} disabled={loading}>
        {loading ? 'Checking...' : 'Check and Generate M3U'}
      </button>

      {/* Error message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default XStreamToM3u;
