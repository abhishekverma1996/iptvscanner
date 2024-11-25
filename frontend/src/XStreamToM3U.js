import React, { useState } from 'react';
import './XStreamToM3u.css';

const XStreamToM3u = () => {
  const [panel, setPanel] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadLink, setDownloadLink] = useState(''); // State to store the generated download link

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

  // Function to generate M3U link (direct download URL)
  const checkAndGenerateDownloadLink = () => {
    setLoading(true);
    setError('');

    if (!panel || !username || !password) {
      setError('Panel, Username, and Password are required!');
      setLoading(false);
      return;
    }

    // Construct the M3U download URL
    const m3uDownloadLink = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;

    // Set the generated download link state
    setDownloadLink(m3uDownloadLink);

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
      <button onClick={checkAndGenerateDownloadLink} disabled={loading}>
        {loading ? 'Generating Link...' : 'Generate M3U Link'}
      </button>

      {/* Error message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Display the generated download link below the button */}
      {downloadLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Click below to open the M3U link in a new tab:</p>
          {/* Use target="_blank" to open the URL in a new tab */}
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            Open M3U File in New Tab
          </a>
        </div>
      )}
    </div>
  );
};

export default XStreamToM3u;
