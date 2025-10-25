-- ============================================
-- LINK 40 REAL ALASKA STUDENTS
-- ============================================
-- These students exist in auth.users with @mrsomers.student emails
-- This will link them to the accounts table
-- ============================================

-- Step 1: Verify the 40 orphaned students
SELECT 
    COUNT(*) as total_orphaned_students,
    'Students in auth.users needing accounts' as description
FROM auth.users u
LEFT JOIN accounts a ON u.id = a.auth_user_id
WHERE u.email LIKE '%@mrsomers.student'
  AND a.id IS NULL;

-- Step 2: Create accounts for all 40 real students
INSERT INTO accounts (auth_user_id, full_name, email, account_type, created_at, updated_at)
SELECT 
    u.id as auth_user_id,
    SPLIT_PART(u.email, '@', 1) as full_name, -- Use email prefix as name
    u.email,
    'student' as account_type,
    u.created_at,
    NOW() as updated_at
FROM auth.users u
LEFT JOIN accounts a ON u.id = a.auth_user_id
WHERE u.email LIKE '%@mrsomers.student'
  AND a.id IS NULL;

-- Step 3: Verify all 40 students now have accounts
SELECT 
    COUNT(*) as total_students_with_real_auth,
    'Real students now in accounts table' as description
FROM accounts
WHERE email LIKE '%@mrsomers.student';

-- Step 4: Link your teacher account to all 40 students
-- Using your teacher ID: 67d2cb61-934a-4909-a2e3-3dd58e9bb38c
INSERT INTO teacher_students (teacher_id, student_id, class_name, school_year)
SELECT 
    '67d2cb61-934a-4909-a2e3-3dd58e9bb38c'::uuid as teacher_id,
    a.id as student_id,
    '7th Grade Geography - Alaska' as class_name,
    '2024-2025' as school_year
FROM accounts a
WHERE a.account_type = 'student'
  AND a.email LIKE '%@mrsomers.student'
ON CONFLICT (teacher_id, student_id) DO NOTHING;

-- Step 5: Initialize game_progress for all 40 students
INSERT INTO game_progress (user_account_id, total_xp, locations_visited, countries_unlocked, achievements, current_streak_days, longest_streak_days, created_at, updated_at)
SELECT 
    a.id as user_account_id,
    0 as total_xp,
    '[]'::jsonb as locations_visited,
    '[]'::jsonb as countries_unlocked,
    '[]'::jsonb as achievements,
    0 as current_streak_days,
    0 as longest_streak_days,
    NOW() as created_at,
    NOW() as updated_at
FROM accounts a
LEFT JOIN game_progress gp ON a.id = gp.user_account_id
WHERE a.account_type = 'student'
  AND a.email LIKE '%@mrsomers.student'
  AND gp.id IS NULL;

-- Step 6: FINAL VERIFICATION - Show all students (GI Joe test + real 40)
SELECT 
    a.full_name,
    a.email,
    a.account_type,
    CASE WHEN a.auth_user_id IS NOT NULL THEN '✅ Real Auth' ELSE '❌ Test Only' END as has_auth,
    CASE WHEN gp.id IS NOT NULL THEN '✅' ELSE '❌' END as has_progress,
    COALESCE(gp.total_xp, 0) as xp,
    a.created_at as joined_date
FROM accounts a
LEFT JOIN game_progress gp ON a.id = gp.user_account_id
WHERE a.account_type = 'student'
ORDER BY 
    CASE WHEN a.email LIKE '%@mrsomers.student' THEN 0 ELSE 1 END, -- Real students first
    a.email;

-- Step 7: Summary counts
SELECT 
    'Total Students (All)' as metric,
    COUNT(*) as count
FROM accounts
WHERE account_type = 'student'
UNION ALL
SELECT 
    'Real Alaska Students' as metric,
    COUNT(*) as count
FROM accounts
WHERE account_type = 'student' AND email LIKE '%@mrsomers.student'
UNION ALL
SELECT 
    'GI Joe Test Students' as metric,
    COUNT(*) as count
FROM accounts
WHERE account_type = 'student' AND email LIKE '%@gijoe.test'
UNION ALL
SELECT 
    'Students with Progress Records' as metric,
    COUNT(*) as count
FROM accounts a
INNER JOIN game_progress gp ON a.id = gp.user_account_id
WHERE a.account_type = 'student'
UNION ALL
SELECT 
    'Teacher-Student Links' as metric,
    COUNT(*) as count
FROM teacher_students
WHERE teacher_id = '67d2cb61-934a-4909-a2e3-3dd58e9bb38c';

-- ============================================
-- SUCCESS! You should now see 50 total students:
-- - 40 real Alaska students (@mrsomers.student)
-- - 10 GI Joe test students (@gijoe.test)
-- All linked to your teacher account!
-- ============================================
