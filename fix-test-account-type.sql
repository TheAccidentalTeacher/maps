-- ============================================
-- FIX TEST ACCOUNT - Change from 'teacher' to 'student'
-- ============================================
-- PROBLEM: test@mrsomers.student has account_type = 'teacher' (WRONG!)
-- SOLUTION: Change it to 'student' so it doesn't show teacher dashboard
-- ============================================

-- Step 1: Fix the account type
UPDATE accounts
SET account_type = 'student',
    full_name = 'Test Student',  -- Also fix the name
    updated_at = NOW()
WHERE email = 'test@mrsomers.student';

-- Step 2: Verify the fix
SELECT 
    id,
    auth_user_id,
    email,
    full_name,
    account_type,
    updated_at,
    CASE 
        WHEN account_type = 'student' THEN '✅ FIXED! Now set to student'
        ELSE '❌ Still wrong: ' || account_type
    END as status
FROM accounts
WHERE email = 'test@mrsomers.student';

-- Step 3: Create game_progress record if it doesn't exist
INSERT INTO game_progress (
    user_account_id, 
    total_xp, 
    locations_visited, 
    countries_unlocked, 
    achievements, 
    current_streak_days, 
    longest_streak_days, 
    created_at, 
    updated_at
)
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
WHERE a.email = 'test@mrsomers.student'
  AND NOT EXISTS (
      SELECT 1 FROM game_progress gp WHERE gp.user_account_id = a.id
  );

-- Step 4: Link test account to your teacher account (optional - for testing)
INSERT INTO teacher_students (teacher_id, student_id, class_name, school_year)
SELECT 
    '67d2cb61-934a-4909-a2e3-3dd58e9bb38c'::uuid as teacher_id,
    a.id as student_id,
    'Test Account' as class_name,
    '2024-2025' as school_year
FROM accounts a
WHERE a.email = 'test@mrsomers.student'
ON CONFLICT (teacher_id, student_id) DO NOTHING;

-- Step 5: Final verification
SELECT 
    a.email,
    a.full_name,
    a.account_type,
    CASE WHEN gp.id IS NOT NULL THEN '✅' ELSE '❌' END as has_progress,
    COALESCE(gp.total_xp, 0) as xp,
    CASE WHEN ts.student_id IS NOT NULL THEN '✅ Linked to teacher' ELSE '❌ Not linked' END as teacher_link,
    '✅ Test account is now a STUDENT account' as final_status
FROM accounts a
LEFT JOIN game_progress gp ON a.id = gp.user_account_id
LEFT JOIN teacher_students ts ON a.id = ts.student_id AND ts.teacher_id = '67d2cb61-934a-4909-a2e3-3dd58e9bb38c'
WHERE a.email = 'test@mrsomers.student';

-- ============================================
-- DONE! After running this:
-- 1. test@mrsomers.student will be account_type = 'student'
-- 2. Full name changed from "New User" to "Test Student"
-- 3. Will have game_progress record for XP tracking
-- 4. Will be linked to your teacher account (visible in dashboard)
-- 5. Will NOT see teacher dashboard when logged in
-- ============================================
