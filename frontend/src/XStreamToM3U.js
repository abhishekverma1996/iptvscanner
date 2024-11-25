import React, { useState } from 'react';
import './XStreamToM3u.css';

const XStreamToM3u = () => {
  const [panel, setPanel] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [m3uLink, setM3uLink] = useState(''); // State to store the generated M3U link

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

  // Function to generate the M3U link (direct URL for downloading)
  const checkAndGenerateDownloadLink = () => {
    setLoading(true);
    setError('');

    if (!panel || !username || !password) {
      setError('Panel, Username, and Password are required!');
      setLoading(false);
      return;
    }

    // Construct the M3U URL based on user inputs
    const generatedM3uLink = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;

    // Set the generated M3U URL in the state
    setM3uLink(generatedM3uLink);

    setLoading(false);
  };

  // Function to open the M3U link in a new tab
  const openM3uLink = () => {
    // Check if the link exists and open it in a new tab
    if (m3uLink) {
      window.open(m3uLink, '_blank'); // Open the M3U link in a new tab
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
      <button onClick={checkAndGenerateDownloadLink} disabled={loading}>
        {loading ? 'Generating Link...' : 'Generate M3U Link'}
      </button>

      {/* Error message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Display the generated M3U URL as a clickable link */}
      {m3uLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Generated M3U URL:</p>
          {/* Display the URL as a clickable link */}
          <button onClick={openM3uLink}>Open M3U File in New Tab</button>
          <div style={{ marginTop: '10px' }}>
            <p>Or manually open the following link:</p>
            <a href={m3uLink} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
              {m3uLink}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default XStreamToM3u;
