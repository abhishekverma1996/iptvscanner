import React, { useState } from 'react';
import './XStreamToM3u.css';
import axios from 'axios';

const XStreamToM3u = () => {
  const [panel, setPanel] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [m3uLink, setM3uLink] = useState('');

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

  // Function to check and generate the M3U link through the proxy API
  const checkAndGenerateM3U = async () => {
    setLoading(true);
    setError('');
    setM3uLink(''); // Clear previous M3U link

    if (!panel || !username || !password) {
      setError('Panel, Username, and Password are required!');
      setLoading(false);
      return;
    }

    try {
      // Construct the URL for the proxy server that will fetch the M3U link
      const proxyUrl = `/api/proxy?username=${username}&password=${password}&panel=${panel}&action=get_m3u`;

      // Make the API request to get the M3U link
      const response = await axios.get(proxyUrl, {
        timeout: 5000, // Timeout after 5 seconds
      });

      // Check if the response contains a valid M3U link
      if (response.data && response.data.m3uLink) {
        setM3uLink(response.data.m3uLink); // Set the received M3U link
      } else {
        setError('Failed to retrieve M3U link.');
      }

    } catch (error) {
      console.error('Error generating M3U link:', error);
      setError('An error occurred while generating the M3U link.');
    }

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
      <button onClick={checkAndGenerateM3U} disabled={loading}>
        {loading ? 'Checking...' : 'Check and Generate M3U'}
      </button>

      {/* Error message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Display the M3U link once generated */}
      {m3uLink && (
        <div style={{ marginTop: '20px' }}>
          <h4>Generated M3U Link:</h4>
          <a href={m3uLink} target="_blank" rel="noopener noreferrer">Download M3U</a>
        </div>
      )}
    </div>
  );
};

export default XStreamToM3u;
