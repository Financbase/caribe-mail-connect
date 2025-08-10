-- Create webhook_event_log table for replay protection and auditing
CREATE TABLE IF NOT EXISTS public.webhook_event_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  external_event_id TEXT,
  body_hash TEXT NOT NULL,
  signature TEXT,
  headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'received',
  error_message TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Uniqueness to prevent replay: hash-level, and per external_event_id when present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'webhook_event_log_unique_body'
  ) THEN
    ALTER TABLE public.webhook_event_log
    ADD CONSTRAINT webhook_event_log_unique_body UNIQUE (service, body_hash);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'webhook_event_log_unique_external'
  ) THEN
    ALTER TABLE public.webhook_event_log
    ADD CONSTRAINT webhook_event_log_unique_external UNIQUE (service, external_event_id);
  END IF;
END $$;

-- Helpful index for ordering by time
CREATE INDEX IF NOT EXISTS idx_webhook_event_log_received_at
ON public.webhook_event_log (received_at DESC);

-- Enable Row Level Security
ALTER TABLE public.webhook_event_log ENABLE ROW LEVEL SECURITY;

-- Policies: only admins/managers can view or manage via client; edge functions use service role and bypass RLS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'webhook_event_log' AND policyname = 'Admins or managers can view webhook logs'
  ) THEN
    CREATE POLICY "Admins or managers can view webhook logs"
    ON public.webhook_event_log
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'manager'::text));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'webhook_event_log' AND policyname = 'Admins or managers can insert webhook logs'
  ) THEN
    CREATE POLICY "Admins or managers can insert webhook logs"
    ON public.webhook_event_log
    FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'manager'::text));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'webhook_event_log' AND policyname = 'Admins or managers can update webhook logs'
  ) THEN
    CREATE POLICY "Admins or managers can update webhook logs"
    ON public.webhook_event_log
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'manager'::text))
    WITH CHECK (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'manager'::text));
  END IF;
END $$;