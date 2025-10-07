import React, { useEffect, useState } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      setDeferredPrompt(null);
    } else {
      setShowMessage(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          padding: '12px 24px',
          background: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
        }}
      >
        Install App
      </button>
      {showMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 70,
            right: 24,
            zIndex: 1001,
            background: '#fff',
            color: '#111',
            padding: '16px 24px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxWidth: 320,
          }}
        >
          <strong>Install not available:</strong>
          <div style={{ marginTop: 8 }}>
            You can install this app manually from your browser menu:<br />
            <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
              <li>On Chrome: <b>⋮</b> &gt; <b>Install App</b> or <b>Add to Home Screen</b></li>
              <li>On Safari: <b>Share</b> &gt; <b>Add to Home Screen</b></li>
            </ul>
          </div>
          <button
            style={{
              marginTop: 12,
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              cursor: 'pointer',
            }}
            onClick={() => setShowMessage(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
