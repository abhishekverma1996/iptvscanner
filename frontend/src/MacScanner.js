import React, { useState, useRef } from "react";

const MacScanner = () => {
  const [baseUrl, setBaseUrl] = useState("");
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [scanInProgress, setScanInProgress] = useState(false);

  const abortControllerRef = useRef(null);

  const handleBaseUrlChange = (e) => setBaseUrl(e.target.value.trim());
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Stop the scan process
      setLoading(false);
      setScanInProgress(false);
    }
  };

  const handleDownload = () => {
    // Convert results into a plain text string
    const textContent = results
      .map((result) => {
        return `Panel URL: ${baseUrl}\nMAC: ${result.mac}\nStatus: ${result.status}\nMessage: ${result.message || ""}\n${
          result.expiry ? `Expiry: ${result.expiry}\n` : ""
        }${result.channel_count ? `Channel Count: ${result.channel_count}\n` : ""}\n`;
      })
      .join("\n"); // Join each result with a blank line
  
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scan_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setSuccessCount(0);
    setFailureCount(0);

    // Ensure baseUrl is provided
    if (!baseUrl) {
      setError("Please enter the IPTV panel URL.");
      return;
    }

    // Validate that the baseUrl starts with http:// or https://
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      setError("Please enter a valid IPTV panel address starting with http:// or https://.");
      return;
    }

    // Ensure a file is selected
    if (!file) {
      setError("Please upload a file containing MAC addresses.");
      return;
    }

    setLoading(true);
    setScanInProgress(true);
    abortControllerRef.current = new AbortController(); // Create a new AbortController for this scan

    try {
      const macList = await file.text().then((text) =>
        text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line)
      );

      // Handle each MAC address one by one
      for (let i = 0; i < macList.length; i++) {
        if (abortControllerRef.current.signal.aborted) {
          break; // Stop scanning if abort signal is received
        }

        const macAddress = macList[i];
        const payload = { base_url: baseUrl, mac_address: macAddress };

        // Send MAC address to backend for scanning
        const response = await fetch("https://iptvscannerbackend.vercel.app/api/macscanner/scan_mac", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal, // Attach the abort signal
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unknown error occurred");
        }

        const result = await response.json();
        setResults((prevResults) => [...prevResults, result]);

        // Update success/failure counts dynamically
        if (result.status === "Success") {
          setSuccessCount((prevCount) => prevCount + 1);
        } else {
          setFailureCount((prevCount) => prevCount + 1);
        }

        // Optional: Add a small delay between scans for smoother UI interaction
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Scan stopped by user.");
      } else {
        setError(`An error occurred: ${err.message}`);
        console.error("Scanning Error: ", err);  // Log error for debugging
      }
    } finally {
      setLoading(false);
      setScanInProgress(false);
    }
  };

  return (
    <div>
      <h1>IPTV MAC Address Scanner</h1>

      {/* Show panel URL input only once */}
      {!baseUrl && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Panel URL:
              <input
                type="text"
                value={baseUrl}
                onChange={handleBaseUrlChange}
                placeholder="Enter IPTV panel address (http:// or https://)"
                required
              />
            </label>
          </div>
          <div>
            <label>
              Upload MAC List File:
              <input type="file" onChange={handleFileChange} accept=".txt" required />
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Scanning..." : "Start Scan"}
          </button>
        </form>
      )}

      {/* Show scan results after URL and file are provided */}
      {baseUrl && (
        <>
          <h2>Scanning with URL: {baseUrl}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Upload MAC List File:
                <input type="file" onChange={handleFileChange} accept=".txt" required />
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Scanning..." : "Start Scan"}
            </button>
          </form>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div>
          <h2>Scan Results:</h2>
          <div>
            <strong>Success:</strong> {successCount} | <strong>Failure:</strong> {failureCount}
          </div>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "scroll",
              marginTop: "10px",
              border: "1px solid #ddd",
              padding: "10px",
            }}
          >
            <ul>
              {results.map((result, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <div><strong>MAC:</strong> {result.mac}</div>
                  <div><strong>Status:</strong> {result.status}</div>
                  <div><strong>Message:</strong> {result.message}</div>
                  {result.expiry && <div><strong>Expiry:</strong> {result.expiry}</div>}
                  {result.channel_count && (
                    <div><strong>Channel Count:</strong> {result.channel_count}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleDownload}>Download Results</button>
        </div>
      )}

      {scanInProgress && (
        <button onClick={handleStop}>Stop Scan</button>
      )}
    </div>
  );
};

export default MacScanner;
