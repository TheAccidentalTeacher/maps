-- Find the existing account with your email
SELECT id, email, full_name, account_type, created_at
FROM accounts
WHERE email = 'scosun@gmail.com';

-- This will show you the account ID that exists

-- OPTION 1: Update the existing account to match your auth ID
UPDATE accounts
SET id = 'd17c2e16-7fd9-498f-b841-99d1b780d67e'
WHERE email = 'scosun@gmail.com';

-- OPTION 2: Or just check what the current ID is and we'll use that instead
SELECT id FROM accounts WHERE email = 'scosun@gmail.com';
