import React, { useState } from 'react';
import './XStreamToM3u.css';

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

    // Check if panel URL starts with "http://"
    let m3uLink = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;

    // If the panel is using http://, try to change it to https://
    if (panel.startsWith("http://")) {
      const httpsPanel = panel.replace("http://", "https://");
      
      // Test if the https:// version works
      fetch(httpsPanel)  // Try making a request to the HTTPS version
        .then((response) => {
          if (response.ok) {
            // If HTTPS works, use that URL
            m3uLink = `${httpsPanel}/get.php?username=${username}&password=${password}&type=m3u`;
          } else {
            // If HTTPS fails, fallback to HTTP (no need to do anything as m3uLink is already set)
            console.log("HTTPS request failed, using HTTP instead.");
          }
        })
        .catch((err) => {
          // Handle error if HTTPS fails (i.e., no response)
          console.log("HTTPS request failed, using HTTP instead.", err);
        })
        .finally(() => {
          // After attempting to update m3uLink, trigger the iframe download
          triggerIframeDownload(m3uLink);
        });
    } else {
      // If the panel already uses https://, proceed directly
      triggerIframeDownload(m3uLink);
    }
  };

  // Function to trigger iframe download
  const triggerIframeDownload = (m3uLink) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';  // Hide the iframe
    iframe.src = m3uLink;

    // Append iframe to body to start the download
    document.body.appendChild(iframe);
    iframe.onload = () => {
      document.body.removeChild(iframe); // Remove iframe after download starts
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
