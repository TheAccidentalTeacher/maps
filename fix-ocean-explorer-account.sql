-- Fix Ocean Explorer account issue
-- The user exists in Supabase auth but not in the accounts table

-- First, check if the user exists in accounts
SELECT id, email, account_type 
FROM accounts 
WHERE id = 'd17c2e16-7fd9-498f-b841-99d1b780d67e';

-- If not found, insert the account record
-- (Adjust email, full_name, and account_type as needed)
INSERT INTO accounts (id, email, full_name, account_type, created_at)
VALUES (
    'd17c2e16-7fd9-498f-b841-99d1b780d67e',
    'scosun@gmail.com',
    'Test Student',  -- CHANGE THIS to your actual name
    'student',  -- or 'teacher' depending on your role
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify the account now exists
SELECT id, email, account_type 
FROM accounts 
WHERE id = 'd17c2e16-7fd9-498f-b841-99d1b780d67e';
