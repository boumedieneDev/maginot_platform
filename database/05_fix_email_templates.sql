-- Normalize existing email template sender addresses to the production mailbox.
-- This does NOT store SMTP secrets. Use Supabase Secrets or the CLI for SMTP_HOST/SMTP_USER/SMTP_PASSWORD.

UPDATE public.email_templates
SET from_email = 'contact@maginot.app',
    updated_at = NOW()
WHERE from_email IS DISTINCT FROM 'contact@maginot.app';

-- Optional checks:
-- 1) List templates and their sender addresses
-- SELECT id, name, status, is_global_default, service_id, from_email
-- FROM public.email_templates
-- ORDER BY created_at DESC;

-- 2) Verify exactly one active global default exists
-- SELECT COUNT(*) AS active_global_defaults
-- FROM public.email_templates
-- WHERE is_global_default = true AND status = 'Active';

