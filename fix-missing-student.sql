-- ============================================
-- FIND THE MISSING STUDENT
-- ============================================

-- Check: Are there still orphaned students?
SELECT 
    u.id as auth_user_id,
    u.email,
    'Still orphaned - not in accounts' as status
FROM auth.users u
LEFT JOIN accounts a ON u.id = a.auth_user_id
WHERE u.email LIKE '%@mrsomers.student'
  AND a.id IS NULL;

-- If the above shows 1 student, run this to add them:
INSERT INTO accounts (auth_user_id, full_name, email, account_type, created_at, updated_at)
SELECT 
    u.id as auth_user_id,
    SPLIT_PART(u.email, '@', 1) as full_name,
    u.email,
    'student' as account_type,
    u.created_at,
    NOW() as updated_at
FROM auth.users u
LEFT JOIN accounts a ON u.id = a.auth_user_id
WHERE u.email LIKE '%@mrsomers.student'
  AND a.id IS NULL;

-- Link missing student to teacher
INSERT INTO teacher_students (teacher_id, student_id, class_name, school_year)
SELECT 
    '67d2cb61-934a-4909-a2e3-3dd58e9bb38c'::uuid as teacher_id,
    a.id as student_id,
    '7th Grade Geography - Alaska' as class_name,
    '2024-2025' as school_year
FROM accounts a
WHERE a.account_type = 'student'
  AND a.email LIKE '%@mrsomers.student'
  AND NOT EXISTS (
    SELECT 1 FROM teacher_students ts 
    WHERE ts.student_id = a.id 
    AND ts.teacher_id = '67d2cb61-934a-4909-a2e3-3dd58e9bb38c'
  );

-- Initialize game progress for missing student
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

-- Final count - should now be 50 total!
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
    'Teacher-Student Links' as metric,
    COUNT(*) as count
FROM teacher_students
WHERE teacher_id = '67d2cb61-934a-4909-a2e3-3dd58e9bb38c';
