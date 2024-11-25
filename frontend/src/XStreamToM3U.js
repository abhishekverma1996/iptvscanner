import React, { useState } from 'react';
import './XStreamToM3u.css';

const XStreamToM3u = () => {
  const [panel, setPanel] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLink, setGeneratedLink] = useState(''); // State to store the generated link

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

  // Function to generate M3U link
  const checkAndGenerateM3ULink = () => {
    setLoading(true);
    setError('');

    if (!panel || !username || !password) {
      setError('Panel, Username, and Password are required!');
      setLoading(false);
      return;
    }

    // Construct the M3U URL
    const m3uLink = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;

    // Set the generated link state
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
        {loading ? 'Generating Link...' : 'Generate M3U Link'}
      </button>

      {/* Error message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Display the generated M3U link below the button */}
      {generatedLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Generated M3U Link:</p>
          <p>{generatedLink}</p>
        </div>
      )}
    </div>
  );
};

export default XStreamToM3u;
