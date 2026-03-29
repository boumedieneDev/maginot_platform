-- Add soft-delete functionality to leads table
-- Run this in your Supabase SQL Editor

-- 1. Add is_visible column
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- 2. Update existing policies if necessary (it will only affect newly accessed rows based on your app logic)
-- Usually, for Admins, we keep it visible to them in case they want a trash area.
-- For the public, if they could read, we would filter it. But public ONLY inserts.

-- 3. Verification
-- SELECT id, full_name, is_visible FROM leads LIMIT 5;
