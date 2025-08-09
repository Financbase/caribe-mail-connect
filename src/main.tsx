import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register PWA Service Worker with auto-update to avoid stale caches
if (typeof window !== 'undefined') {
  registerSW({ immediate: true })
}

createRoot(document.getElementById("root")!).render(<App />);
