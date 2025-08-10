import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register PWA Service Worker with auto-update and stale cache cleanup
if (typeof window !== 'undefined') {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Force activate the new SW immediately
      updateSW(true);
    },
    onOfflineReady() {
      // Offline ready
    },
  });

  // Periodically check for updates
  setInterval(() => updateSW(true), 60 * 60 * 1000);

  // Cleanup old caches from legacy service worker
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys
        .filter((key) => key.startsWith('prmcms-')) // legacy cache prefix
        .forEach((key) => caches.delete(key));
    });
  }

  // Ensure any existing registrations update on load
  navigator.serviceWorker?.getRegistrations?.().then((regs) => {
    regs.forEach((r) => r.update());
  });
}
createRoot(document.getElementById("root")!).render(<App />);
