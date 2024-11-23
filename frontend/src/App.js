import React, { useState } from 'react';
import MacGenerator from './MacGenerator';
import MacScanner from './MacScanner';
import UserPassGenerator from './UserPassGenerator';
import XStreamGenerator from './XStreamScanner'; // Correct import
import XStreamToM3U from './XStreamToM3U'; // New import for XStreamToM3U
import MacToM3U from './MacToM3U'; // New import for MacToM3U

const App = () => {
  const [activeGenerator, setActiveGenerator] = useState('');

  const showGenerator = (generator) => {
    setActiveGenerator(generator);
  };

  const hideGenerator = () => {
    setActiveGenerator('');
  };


  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <h1>IPTV Tools By LootDailyOffers</h1>

      {/* Main page buttons */}
      {activeGenerator === '' && (
        <div>
          <button onClick={() => showGenerator('MacGenerator')}>MAC Generator</button>
          <button onClick={() => showGenerator('UserPassGenerator')}>Combo Generator</button>
          <button onClick={() => showGenerator('MacScanner')}>Mac Scanner</button>
          <button onClick={() => showGenerator('XStreamGenerator')}>XStream Scanner</button>
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
          <MacScanner/>
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

      {/* Footer Note */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#fff',
        position: 'bottom',
        bottom: '0',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Adds a background for visibility
      }}>
        <p>Developed by LootDailyOffers, this tool is intended for educational purposes only. We are not liable for any misuse or unintended consequences.</p>
      </footer>
    </div>
  );
};

export default App;
