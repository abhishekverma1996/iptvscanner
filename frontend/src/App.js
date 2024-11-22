import React, { useState } from 'react';
import MacGenerator from './MacGenerator';
import MacScanner from './MacScanner';
import UserPassGenerator from './UserPassGenerator';
import XStreamGenerator from './XStreamScanner'; // Correct import
import XStreamToM3U from './XStreamToM3U'; // New import for XStreamToM3U
import MacToM3U from './MacToM3U'; // New import for MacToM3U

const App = () => {
  const [activeGenerator, setActiveGenerator] = useState('');
  const [baseUrl, setBaseUrl] = useState(''); // State for the base URL

  const showGenerator = (generator) => {
    setActiveGenerator(generator);
  };

  const hideGenerator = () => {
    setActiveGenerator('');
  };

  const handleBaseUrlChange = (e) => {
    setBaseUrl(e.target.value); // Update base URL when user types
  };

  return (
    <div className="App">
      <h1>IPTV Tools By LootDailyOffers</h1>

      {/* Main page buttons */}
      {activeGenerator === '' && (
        <div>
          <button onClick={() => showGenerator('MacGenerator')}>MAC Address Generator</button>
          <button onClick={() => showGenerator('UserPassGenerator')}>User/Pass Combo Generator</button>
          <button onClick={() => showGenerator('MacScanner')}>Mac Scanner</button>
          <button onClick={() => showGenerator('XStreamGenerator')}>XStream Code Scanner</button>
          <button onClick={() => showGenerator('XStreamToM3U')}>XStream to M3U</button>
          <button onClick={() => showGenerator('MacToM3U')}>MAC to M3U</button> {/* New button */}
        </div>
      )}

      {/* Conditional Rendering of Generators */}
      {activeGenerator === 'MacGenerator' && (
        <div>
          <MacGenerator />
          <button onClick={hideGenerator}>Back</button>
        </div>
      )}

      {activeGenerator === 'UserPassGenerator' && (
        <div>
          <UserPassGenerator />
          <button onClick={hideGenerator}>Back</button>
        </div>
      )}

      {activeGenerator === 'XStreamGenerator' && (
        <div>
          <XStreamGenerator />
          <button onClick={hideGenerator}>Back</button>
        </div>
      )}

      {activeGenerator === 'MacScanner' && (
        <div>
          <div>
            <h2>Mac Scanner</h2>
            <input
              type="text"
              value={baseUrl}
              onChange={handleBaseUrlChange}
              placeholder="Enter IPTV Base URL"
            />
          </div>
          <MacScanner baseUrl={baseUrl} />
          <button onClick={hideGenerator}>Back</button>
        </div>
      )}

      {activeGenerator === 'XStreamToM3U' && (
        <div>
          <XStreamToM3U />
          <button onClick={hideGenerator}>Back</button>
        </div>
      )}

      {activeGenerator === 'MacToM3U' && ( /* New generator rendering */
        <div>
          <MacToM3U />
          <button onClick={hideGenerator}>Back</button>
        </div>
      )}
    </div>
  );
};

export default App;
