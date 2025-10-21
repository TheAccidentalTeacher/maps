-- Check if your account entry exists in the accounts table
SELECT 
  id,
  auth_user_id,
  email,
  full_name,
  account_type,
  created_at
FROM accounts
WHERE email = 'scosom@gmail.com';
