-- ============================================
-- FIND ALL REAL STUDENTS IN AUTH.USERS
-- ============================================
-- This will show EVERY user in auth.users
-- Let's see what email patterns your real students have

-- Step 1: Show ALL users in auth.users (not just teacher)
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    CASE 
        WHEN email LIKE '%@gmail.com' THEN 'Gmail'
        WHEN email LIKE '%@student.%' THEN 'Student Domain'
        WHEN email LIKE '%@gijoe.test' THEN 'Test Account'
        ELSE 'Other'
    END as email_type
FROM auth.users
ORDER BY created_at DESC
LIMIT 100;

-- Step 2: Count users by email pattern
SELECT 
    CASE 
        WHEN email LIKE '%@gmail.com' THEN 'Gmail'
        WHEN email LIKE '%@student.%' THEN 'Student Domain'
        WHEN email LIKE '%@gijoe.test' THEN 'Test Account'
        WHEN email LIKE '%teacher%' THEN 'Teacher'
        ELSE 'Other: ' || SPLIT_PART(email, '@', 2)
    END as email_domain,
    COUNT(*) as total_users
FROM auth.users
GROUP BY email_domain
ORDER BY total_users DESC;

-- Step 3: Show users that AREN'T teachers and AREN'T linked to accounts
SELECT 
    u.id as auth_user_id,
    u.email,
    u.created_at,
    'ORPHANED - Real student needs account' as status
FROM auth.users u
LEFT JOIN accounts a ON u.id = a.auth_user_id
WHERE a.id IS NULL  -- Not in accounts table
  AND u.email != 'scosom@gmail.com'  -- Not the teacher
ORDER BY u.email;
