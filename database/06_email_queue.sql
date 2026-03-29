-- Internal email queue to decouple lead capture from SMTP delivery.
-- Run this in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_type VARCHAR(50) NOT NULL DEFAULT 'trigger'
        CHECK (queue_type IN ('trigger', 'campaign', 'test')),
    to_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    html TEXT NOT NULL,
    from_name VARCHAR(255) NOT NULL DEFAULT 'Maginot Platform',
    from_email VARCHAR(255) NOT NULL DEFAULT 'contact@maginot.app',
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    open_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status_created_at
    ON public.email_queue (status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_email_queue_queue_type
    ON public.email_queue (queue_type);

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.email_queue;
CREATE POLICY "Enable read access for authenticated users"
    ON public.email_queue FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.email_queue;
CREATE POLICY "Enable all access for authenticated users"
    ON public.email_queue FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
