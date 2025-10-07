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

// Register the service worker for offline capabilities
serviceWorkerRegistration.register();

// Handle the install prompt
let deferredPrompt;
const installButton = document.getElementById('install-button'); // Optional custom install button

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default prompt from showing
  e.preventDefault();
  deferredPrompt = e;

  // Optionally, show a custom install button
  if (installButton) {
    installButton.style.display = 'block';  // Show the install button
  } else {
    // Automatically show the prompt
    deferredPrompt.prompt();
  }
});

// Handle the install button click
installButton.addEventListener('click', () => {
  if (deferredPrompt) {
    // Show the install prompt when the button is clicked
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      deferredPrompt = null;  // Reset deferredPrompt
    });
  }
});

// Measure performance (optional)
reportWebVitals();
