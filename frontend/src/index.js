import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Remove the context menu block
// document.addEventListener("contextmenu", (e) => {
//   e.preventDefault();
// });

// Remove the block on DevTools shortcuts
// document.addEventListener('keydown', (e) => {
//   if (
//     (e.key === 'F12') || // Block F12 key
//     (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
//     (e.ctrlKey && e.shiftKey && e.key === 'J') // Ctrl+Shift+J
//   ) {
//     e.preventDefault();
//     alert('DevTools are disabled!');
//   }
// });

// Remove the code that detects when DevTools is open
// let devtoolsOpen = false;
// const detectDevTools = () => {
//   const threshold = 160; // Height difference when DevTools is open
//   const widthThreshold = 100; // Width difference when DevTools is open

//   const devtoolsDetected =
//     window.outerWidth - window.innerWidth > widthThreshold ||
//     window.outerHeight - window.innerHeight > threshold;

//   if (devtoolsDetected && !devtoolsOpen) {
//     devtoolsOpen = true;
//     alert("Developer Tools is open! Closing the app.");
//     window.location.href = '/logout'; // Example action
//   } else if (!devtoolsDetected && devtoolsOpen) {
//     devtoolsOpen = false;
//   }
// };

// Periodically check if DevTools is open
// setInterval(detectDevTools, 1000);

// Enable console logs in production (or remove the block that disables them)
if (process.env.NODE_ENV === 'production') {
  // Comment out the following lines to keep console logs active in production
  // console.log = function () {}; 
  // console.debug = function () {}; 
  // console.warn = function () {}; 
  // console.error = function () {}; 
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
