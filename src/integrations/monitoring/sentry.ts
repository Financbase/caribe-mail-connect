// Lightweight optional Sentry bootstrap. Call initSentry() early (e.g., in main.tsx) if DSN is present.
export async function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;
  try {
    const sentryModule = '@sentry/react';
    const tracingModule = '@sentry/tracing';
    // @vite-ignore avoids build-time resolution if the deps are not installed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const Sentry = await import(/* @vite-ignore */ sentryModule);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const Tracing = await import(/* @vite-ignore */ tracingModule);
    Sentry.init({
      dsn,
      integrations: [new Tracing.BrowserTracing()],
      tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      environment: import.meta.env.MODE,
    });
    // @ts-expect-error attach to window for ErrorBoundary optional capture
    window.Sentry = Sentry;
  } catch {}
}


