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

    // Encode the dynamic parts of the URL to avoid special character issues
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const encodedPanel = encodeURIComponent(panel);

    // Construct the M3U URL based on user inputs
    const generatedM3uLink = `${encodedPanel}/get.php?username=${encodedUsername}&password=${encodedPassword}&type=m3u`;

    // Set the generated M3U URL in the state
    setM3uLink(generatedM3uLink);

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

      {/* Display the generated M3U URL as text */}
      {m3uLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Generated M3U URL:</p>
          {/* Display the M3U URL as plain text */}
          <pre>{m3uLink}</pre>
        </div>
      )}
    </div>
  );
};

export default XStreamToM3u;
