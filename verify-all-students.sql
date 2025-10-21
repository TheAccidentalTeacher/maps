-- Verify all 39 students were created successfully
-- Run this in Supabase SQL Editor to see your students!

-- Show all student accounts
SELECT 
  a.id,
  a.email,
  a.full_name,
  a.account_type,
  a.created_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM accounts a
LEFT JOIN auth.users u ON a.auth_user_id = u.id
WHERE a.account_type = 'student'
ORDER BY a.full_name;

-- Count total students
SELECT 
  COUNT(*) as total_students,
  COUNT(CASE WHEN u.email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_students
FROM accounts a
LEFT JOIN auth.users u ON a.auth_user_id = u.id
WHERE a.account_type = 'student';
