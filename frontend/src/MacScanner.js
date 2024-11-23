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

  const handleBaseUrlChange = (e) => {
    setBaseUrl(e.target.value); // Allow full typing and pasting
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setScanInProgress(false);
    }
  };

  const handleDownload = () => {
    const textContent = results
      .map((result) => {
        return `Panel URL: ${baseUrl}\nMAC: ${result.mac}\nStatus: ${result.status}\nMessage: ${result.message || ""}\n${
          result.expiry ? `Expiry: ${result.expiry}\n` : ""
        }${result.channel_count ? `Channel Count: ${result.channel_count}\n` : ""}\n`;
      })
      .join("\n");

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

    const trimmedBaseUrl = baseUrl.trim(); // Validate after user finishes typing
    if (!trimmedBaseUrl) {
      setError("Please enter the IPTV panel URL.");
      return;
    }

    if (!trimmedBaseUrl.startsWith("http://") && !trimmedBaseUrl.startsWith("https://")) {
      setError("Please enter a valid IPTV panel address starting with http:// or https://.");
      return;
    }

    if (!file) {
      setError("Please upload a file containing MAC addresses.");
      return;
    }

    setLoading(true);
    setScanInProgress(true);
    abortControllerRef.current = new AbortController();

    try {
      const macList = await readFileLines(file);

      // Process MAC addresses one by one
      for (let i = 0; i < macList.length; i++) {
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        const macAddress = macList[i];
        const payload = { base_url: trimmedBaseUrl, mac_address: macAddress };

        const response = await fetch("https://iptvscanner.onrender.com/macscanner/scan_mac", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unknown error occurred");
        }

        const result = await response.json();
        if (result && result.mac && result.status) {
          setResults((prevResults) => [...prevResults, result]);

          if (result.status === "Success") {
            setSuccessCount((prevCount) => prevCount + 1);
          } else {
            setFailureCount((prevCount) => prevCount + 1);
          }
        } else {
          setFailureCount((prevCount) => prevCount + 1);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Scan stopped by user.");
      } else {
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setScanInProgress(false);
    }
  };

  const readFileLines = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        resolve(lines);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  };

  return (
    <div>
      <h1>IPTV MAC Scanner</h1>
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
              autoComplete="off"
              onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
            />
          </label>
        </div>
        <div>
          <label>
            Upload MAC List File:
            <input
              type="file"
              onChange={handleFileChange}
              accept=".txt"
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Scanning..." : "Start Scan"}
        </button>
      </form>

      <div>
        <h2>Scan Statistics:</h2>
        <div>
          <strong>Success:</strong> {successCount} | <strong>Failure:</strong> {failureCount}
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div>
          <h2>Scan Results:</h2>
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
