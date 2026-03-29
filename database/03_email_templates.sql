-- Create email_templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    html_body TEXT NOT NULL,
    from_name VARCHAR(255) NOT NULL DEFAULT 'Maginot Platform',
    from_email VARCHAR(255) NOT NULL DEFAULT 'contact@maginot.app',
    status VARCHAR(50) NOT NULL DEFAULT 'Inactive' CHECK (status IN ('Active', 'Inactive')),
    is_global_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraint to ensure only one active global default template
CREATE UNIQUE INDEX IF NOT EXISTS only_one_active_global_template 
ON public.email_templates (is_global_default) 
WHERE is_global_default = true AND status = 'Active';

-- Constraint to ensure only one active template per service
CREATE UNIQUE INDEX IF NOT EXISTS only_one_active_template_per_service 
ON public.email_templates (service_id) 
WHERE status = 'Active' AND service_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies (drop first to avoid duplicate errors)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.email_templates;
CREATE POLICY "Enable read access for all users" ON public.email_templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.email_templates;
CREATE POLICY "Enable all access for authenticated users" ON public.email_templates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
