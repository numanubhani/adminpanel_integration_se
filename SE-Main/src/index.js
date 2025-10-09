// index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Service worker registration
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker with 'module' type for ES imports
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js', { type: 'module' })
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// Measure performance (optional)
reportWebVitals();

// index.js (continued)

let deferredPrompt;
const installButton = document.getElementById('install-button'); // Optional custom install button

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default prompt from showing
  e.preventDefault();
  deferredPrompt = e;

  // Optionally, show a custom install button
  if (installButton) {
    installButton.style.display = 'block';  // Show the install button
  }
});

// Handle the install button click
installButton?.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // Show the install prompt when the button is clicked
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      deferredPrompt = null; // Reset deferredPrompt
    });
  }
});
