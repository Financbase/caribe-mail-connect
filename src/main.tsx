import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSentry } from '@/integrations/monitoring/sentry'

// Web Vitals reporting (uses PerformanceObserver-based hook and web-vitals fallback)
async function reportWebVitals() {
	try {
		const { onCLS, onINP, onLCP, onTTFB, onFCP } = await import('web-vitals');
		const log = (metric: any) => {
			// Console log for now; can be posted to an analytics endpoint later
			console.debug('[WebVital]', metric.name, Math.round(metric.value), metric);
			// Example endpoint post (disabled by default)
			// navigator.sendBeacon?.('/analytics/vitals', JSON.stringify(metric));
		};
		onCLS(log);
		onINP(log);
		onLCP(log);
		onTTFB(log);
		onFCP(log);
	} catch {}
}

reportWebVitals();

// Initialize Sentry (no-op if DSN missing)
initSentry();

createRoot(document.getElementById("root")!).render(<App />);
