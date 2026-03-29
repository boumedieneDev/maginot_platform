-- Update email_queue status check constraint and add cancelled status
ALTER TABLE public.email_queue 
DROP CONSTRAINT IF EXISTS email_queue_status_check;

ALTER TABLE public.email_queue 
ADD CONSTRAINT email_queue_status_check 
CHECK (status IN ('pending', 'sent', 'failed', 'cancelled'));

COMMENT ON COLUMN public.email_queue.status IS 'pending, sent, failed, or cancelled';
