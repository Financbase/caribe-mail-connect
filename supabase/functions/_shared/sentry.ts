import * as Sentry from "https://deno.land/x/sentry@8.3.0/mod.ts";

// 2025-08-13: Initialize Sentry for edge function error tracking
const dsn = Deno.env.get("SENTRY_DSN") || "";
if (dsn) {
  Sentry.init({ dsn, tracesSampleRate: 1.0 });
}

export { Sentry };
