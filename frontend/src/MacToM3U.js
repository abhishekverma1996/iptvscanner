import React, { useState } from "react";
import axios from "axios";

function App() {
  const [baseUrl, setBaseUrl] = useState("");
  const [mac, setMac] = useState("");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://iptvscannerbackend.vercel.app/api/get_channels", {
        base_url: baseUrl,
        mac: mac,
      });

      setSubscriptionInfo(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data. Please check the details and try again.");
      setSubscriptionInfo(null);
      setLoading(false);
    }
  };

  const handleDownloadM3U = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://iptvscannerbackend.vercel.app/api/download_m3u", {
        base_url: baseUrl,
        mac: mac,
      }, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: 'application/x-mpegURL' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'channels.m3u';
      link.click();

      setLoading(false);
    } catch (err) {
      setError("Failed to download M3U file. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>IPTV Channel Fetcher</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Base URL:</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>MAC Address:</label>
          <input
            type="text"
            value={mac}
            onChange={(e) => setMac(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Fetching Info..." : "Fetch Info"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {subscriptionInfo && (
        <div>
          <h2>Subscription Info</h2>
          <p>MAC: {subscriptionInfo.mac}</p>
          <p>Expiry: {subscriptionInfo.expiry}</p>

          <button onClick={handleDownloadM3U} disabled={loading}>
            {loading ? "Downloading..." : "Download M3U"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
