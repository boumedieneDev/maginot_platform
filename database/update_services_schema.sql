-- Add image_url and additional_details columns to services table

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS additional_details JSONB;

-- Example of structure for additional_details:
-- [
--   { "title": "Offre de service", "content": "Détails de l'offre..." },
--   { "title": "Conditions", "content": "..." }
-- ]
