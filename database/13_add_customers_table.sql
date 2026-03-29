-- Create customers table and link leads to customers
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    wilaya VARCHAR(100),
    address TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Blocked')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add customer_id to leads table to link requests to a customer
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies for customers
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.customers;
CREATE POLICY "Enable all access for authenticated users"
    ON public.customers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_leads_customer_id ON public.leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
