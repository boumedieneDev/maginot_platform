-- Quick test to verify RLS policies and data
-- Run these queries in Supabase SQL Editor to troubleshoot

-- 1. Check if leads exist in the database
SELECT COUNT(*) as total_leads FROM leads;

-- 2. View all leads (as admin)
SELECT * FROM leads ORDER BY created_at DESC;

-- 3. Check RLS policies on leads table
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'leads';

-- 4. Check if RLS is enabled
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename = 'leads';

-- 5. Test inserting a sample lead (should work for anyone)
INSERT INTO leads (
    full_name, 
    email, 
    phone, 
    wilaya, 
    status
) VALUES (
    'Test Client',
    'test@example.com',
    '+213 555 123 456',
    '16 - Alger',
    'Nouveau'
);

-- 6. Verify the insert worked
SELECT * FROM leads ORDER BY created_at DESC LIMIT 1;
