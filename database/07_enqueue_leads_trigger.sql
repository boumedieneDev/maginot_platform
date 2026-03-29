-- Automatically enqueue a welcome/lead email whenever a new lead is created.
-- Run this in Supabase SQL Editor after creating email_queue.

CREATE OR REPLACE FUNCTION public.enqueue_lead_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    template_record public.email_templates%ROWTYPE;
    service_name_text text;
    rendered_subject text;
    rendered_html text;
BEGIN
    SELECT * INTO template_record
    FROM public.email_templates
    WHERE service_id = NEW.service_id
      AND status = 'Active'
    ORDER BY updated_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        SELECT * INTO template_record
        FROM public.email_templates
        WHERE is_global_default = true
          AND status = 'Active'
        ORDER BY updated_at DESC
        LIMIT 1;
    END IF;

    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    SELECT name INTO service_name_text
    FROM public.services
    WHERE id = NEW.service_id;

    rendered_subject := template_record.subject;
    rendered_html := template_record.html_body;

    rendered_subject := replace(rendered_subject, '{{form_name}}', coalesce(service_name_text, 'Notre service'));
    rendered_subject := replace(rendered_subject, '{{submission_date}}', to_char(now(), 'DD Mon YYYY'));
    rendered_subject := replace(rendered_subject, '{{submitter_name}}', coalesce(NEW.full_name, 'Client'));
    rendered_subject := replace(rendered_subject, '{{email}}', coalesce(NEW.email, ''));
    rendered_subject := replace(rendered_subject, '{{phone}}', coalesce(NEW.phone, ''));
    rendered_subject := replace(rendered_subject, '{{company_name}}', coalesce(NEW.company_name, ''));

    rendered_html := replace(rendered_html, '{{form_name}}', coalesce(service_name_text, 'Notre service'));
    rendered_html := replace(rendered_html, '{{submission_date}}', to_char(now(), 'DD Mon YYYY'));
    rendered_html := replace(rendered_html, '{{submitter_name}}', coalesce(NEW.full_name, 'Client'));
    rendered_html := replace(rendered_html, '{{email}}', coalesce(NEW.email, ''));
    rendered_html := replace(rendered_html, '{{phone}}', coalesce(NEW.phone, ''));
    rendered_html := replace(rendered_html, '{{company_name}}', coalesce(NEW.company_name, ''));

    INSERT INTO public.email_queue (
        queue_type,
        to_email,
        subject,
        html,
        from_name,
        from_email,
        status,
        attempts,
        payload
    ) VALUES (
        'trigger',
        NEW.email,
        rendered_subject,
        rendered_html,
        template_record.from_name,
        template_record.from_email,
        'pending',
        0,
        jsonb_build_object(
            'lead_id', NEW.id,
            'service_id', NEW.service_id,
            'template_id', template_record.id,
            'template_name', template_record.name
        )
    );

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enqueue_lead_email ON public.leads;

CREATE TRIGGER trg_enqueue_lead_email
AFTER INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.enqueue_lead_email();

