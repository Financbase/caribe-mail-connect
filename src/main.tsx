import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './expose-react.ts'

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Render the App component directly (App.tsx now handles routing internally)
createRoot(document.getElementById("root")!).render(
  <App />
);
