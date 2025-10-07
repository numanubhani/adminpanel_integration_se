// PWA Test Script
// Run this in browser console to test PWA functionality

console.log('🔍 Testing PWA Setup...');

// Test 1: Check if service worker is supported
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker is supported');
} else {
  console.log('❌ Service Worker is NOT supported');
}

// Test 2: Check if manifest is loaded
const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) {
  console.log('✅ Manifest link found:', manifestLink.href);
} else {
  console.log('❌ Manifest link NOT found');
}

// Test 3: Check if app is installable
if (window.deferredPrompt) {
  console.log('✅ App is installable');
} else {
  console.log('ℹ️ App installability will be determined on first visit');
}

// Test 4: Check if running in standalone mode
if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ App is running in standalone mode');
} else {
  console.log('ℹ️ App is running in browser mode');
}

// Test 5: Check service worker registration
navigator.serviceWorker.getRegistrations().then(registrations => {
  if (registrations.length > 0) {
    console.log('✅ Service Worker is registered');
    registrations.forEach((registration, index) => {
      console.log(`  SW ${index + 1}:`, registration.scope);
    });
  } else {
    console.log('❌ No Service Worker registrations found');
  }
});

// Test 6: Check caches
caches.keys().then(cacheNames => {
  if (cacheNames.length > 0) {
    console.log('✅ Caches found:', cacheNames);
  } else {
    console.log('ℹ️ No caches found yet');
  }
});

console.log('🎯 PWA Test Complete! Check the results above.');
