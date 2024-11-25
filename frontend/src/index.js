import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Remove context menu listener to enable right-click
// document.addEventListener("contextmenu", (e) => {
//   e.preventDefault();
// });

// Remove keydown listener to allow DevTools keyboard shortcuts
// document.addEventListener('keydown', (e) => {
//   if (
//     e.key === 'F12' || // F12 key
//     (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
//     (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
//     (e.ctrlKey && e.key === 'U') // Ctrl+U
//   ) {
//     e.preventDefault();
//   }
// });

// Remove DevTools detection and page reload logic
// const detectDevTools = () => {
//   const threshold = 160; // Height difference for DevTools detection
//   const widthThreshold = 100; // Width difference for DevTools detection

//   const devToolsDetected =
//     window.outerWidth - window.innerWidth > widthThreshold ||
//     window.outerHeight - window.innerHeight > threshold;

//   if (devToolsDetected) {
//     window.location.reload(); // Reload the page silently
//   }
// };

// Periodically check for DevTools (remove this part to stop the periodic check)
// setInterval(detectDevTools, 1000);

// Disable console logs in production
if (process.env.NODE_ENV === 'production') {
  console.log = function () {};
  console.debug = function () {};
  console.warn = function () {};
  console.error = function () {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure performance (optional)
reportWebVitals();
