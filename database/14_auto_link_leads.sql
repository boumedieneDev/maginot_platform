-- Trigger to automatically link new leads to existing customers by email
CREATE OR REPLACE FUNCTION public.link_lead_to_customer()
RETURNS TRIGGER AS $$
DECLARE
    found_customer_id UUID;
BEGIN
    -- Look for a customer with the same email
    SELECT id INTO found_customer_id FROM public.customers WHERE email = NEW.email LIMIT 1;
    
    -- If found, link it
    IF found_customer_id IS NOT NULL THEN
        NEW.customer_id := found_customer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_link_lead_to_customer ON public.leads;
CREATE TRIGGER tr_link_lead_to_customer
BEFORE INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.link_lead_to_customer();

-- Also run a one-time update to link existing leads to existing customers
UPDATE public.leads l
SET customer_id = c.id
FROM public.customers c
WHERE l.email = c.email AND l.customer_id IS NULL;
