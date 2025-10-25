-- ============================================
-- DEBUG: Find out where the 40 students are
-- ============================================

-- Step 1: Check auth.users - should show 40 students
SELECT 
    COUNT(*) as total_in_auth_users,
    'Students in auth.users' as description
FROM auth.users
WHERE email LIKE '%@student.mrsomers.com';

-- Step 2: Show me the actual student emails in auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email LIKE '%@student.mrsomers.com'
ORDER BY email
LIMIT 50;

-- Step 3: Check what's already in accounts table with student type
SELECT 
    COUNT(*) as total_in_accounts,
    'Students in accounts table' as description
FROM accounts
WHERE account_type = 'student';

-- Step 4: Show me which students are in accounts
SELECT 
    id,
    auth_user_id,
    full_name,
    email,
    account_type
FROM accounts
WHERE account_type = 'student'
ORDER BY email;

-- Step 5: Find students in auth.users but NOT in accounts (the orphans)
SELECT 
    u.id as auth_user_id,
    u.email,
    u.created_at,
    'ORPHANED - needs account link' as status
FROM auth.users u
LEFT JOIN accounts a ON u.id = a.auth_user_id
WHERE u.email LIKE '%@student.mrsomers.com'
  AND a.id IS NULL
ORDER BY u.email;
