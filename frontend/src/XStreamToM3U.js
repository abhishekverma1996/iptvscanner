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

  // Function to construct the M3U URL and download it
  const checkAndDownloadM3U = () => {
    setLoading(true);
    setError('');

    if (!panel || !username || !password) {
      setError('Panel, Username, and Password are required!');
      setLoading(false);
      return;
    }

    const m3uLink = `/api/proxy?username=${username}&password=${password}&panel=${panel}&action=get_m3u`;

    // Directly download the M3U file if the link is valid
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';  // Hide the iframe
    iframe.src = m3uLink;

    // Append iframe to body and trigger download
    document.body.appendChild(iframe);
    iframe.onload = () => {
      document.body.removeChild(iframe); // Remove iframe after the download starts
    };

    setLoading(false);
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
