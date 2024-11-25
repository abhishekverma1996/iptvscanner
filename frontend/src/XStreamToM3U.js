import React, { useState } from 'react';
import './XStreamToM3u.css';

const XStreamToM3u = () => {
  const [panel, setPanel] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

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

  // Function to construct the M3U URL and provide it as a link
  const checkAndGenerateM3ULink = () => {
    setLoading(true);
    setError('');
    setGeneratedLink('');

    if (!panel || !username || !password) {
      setError('Panel, Username, and Password are required!');
      setLoading(false);
      return;
    }

    // Construct the M3U URL
    const m3uLink = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;

    // Set the generated M3U link
    setGeneratedLink(m3uLink);

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
      <button onClick={checkAndGenerateM3ULink} disabled={loading}>
        {loading ? 'Checking...' : 'Generate M3U Link'}
      </button>

      {/* Error message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Display the generated link */}
      {generatedLink && (
        <div style={{ marginTop: '10px' }}>
          <p>Click the link below to open the M3U file in a new tab:</p>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer">
            Open M3U in a new tab
          </a>
        </div>
      )}
    </div>
  );
};

export default XStreamToM3u;
