-- Create table for webhook replay protection and audit
CREATE TABLE IF NOT EXISTS public.webhook_event_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  external_event_id TEXT,
  body_hash TEXT NOT NULL,
  signature TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  headers JSONB,
  status TEXT NOT NULL DEFAULT 'processed',
  error_message TEXT
);

-- Uniqueness to prevent replay: prefer external_event_id when available, fallback to body_hash
CREATE UNIQUE INDEX IF NOT EXISTS uniq_webhook_event_by_service_and_event_id
  ON public.webhook_event_log (service, external_event_id)
  WHERE external_event_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_webhook_event_by_service_and_body_hash
  ON public.webhook_event_log (service, body_hash);

CREATE INDEX IF NOT EXISTS idx_webhook_event_received_at
  ON public.webhook_event_log (received_at);

-- Enable RLS and restrict access
ALTER TABLE public.webhook_event_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read webhook logs
DROP POLICY IF EXISTS "Admins can view webhook logs" ON public.webhook_event_log;
CREATE POLICY "Admins can view webhook logs"
  ON public.webhook_event_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- No client inserts/updates/deletes (edge functions use service role and bypass RLS)
DROP POLICY IF EXISTS "No client inserts into webhook logs" ON public.webhook_event_log;
CREATE POLICY "No client inserts into webhook logs"
  ON public.webhook_event_log
  FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS "No client updates to webhook logs" ON public.webhook_event_log;
CREATE POLICY "No client updates to webhook logs"
  ON public.webhook_event_log
  FOR UPDATE
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "No client deletes from webhook logs" ON public.webhook_event_log;
CREATE POLICY "No client deletes from webhook logs"
  ON public.webhook_event_log
  FOR DELETE
  USING (false);
