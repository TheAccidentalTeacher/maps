-- Verify that the trigger created the account entry automatically
-- This should show your teacher account!

SELECT 
  a.id as account_id,
  a.auth_user_id,
  a.email,
  a.full_name,
  a.account_type,
  a.created_at,
  a.updated_at
FROM accounts a
WHERE a.email = 'scosom@gmail.com';

-- Also verify the user exists in auth.users
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'scosom@gmail.com';
