-- ============================================
-- CHECK TEST@MRSOMERS.STUDENT ACCOUNT
-- ============================================
-- Let's see what account_type is set for this account
-- ============================================

-- Step 1: Check if test@mrsomers.student exists in auth.users
SELECT 
    id,
    email,
    created_at,
    'Found in auth.users' as status
FROM auth.users
WHERE email = 'test@mrsomers.student';

-- Step 2: Check if it exists in accounts table and what account_type it has
SELECT 
    a.id,
    a.auth_user_id,
    a.email,
    a.full_name,
    a.account_type,  -- ⚠️ THIS IS THE PROBLEM - should be 'student' not 'teacher'
    a.created_at,
    CASE 
        WHEN a.account_type = 'teacher' THEN '❌ WRONG! Should be student'
        WHEN a.account_type = 'student' THEN '✅ Correct'
        ELSE '❓ Unknown type: ' || a.account_type
    END as status
FROM accounts a
WHERE a.email = 'test@mrsomers.student';

-- Step 3: Check if test account has game_progress
SELECT 
    gp.id,
    gp.user_account_id,
    gp.total_xp,
    a.email,
    a.account_type,
    'Has progress record' as status
FROM game_progress gp
INNER JOIN accounts a ON gp.user_account_id = a.id
WHERE a.email = 'test@mrsomers.student';

-- Step 4: Check if test account is linked to your teacher account
SELECT 
    ts.teacher_id,
    ts.student_id,
    t.email as teacher_email,
    s.email as student_email,
    ts.class_name,
    ts.school_year,
    CASE 
        WHEN ts.teacher_id = '67d2cb61-934a-4909-a2e3-3dd58e9bb38c' THEN '✅ Linked to your teacher account'
        ELSE '❓ Linked to different teacher'
    END as status
FROM teacher_students ts
INNER JOIN accounts t ON ts.teacher_id = t.id
INNER JOIN accounts s ON ts.student_id = s.id
WHERE s.email = 'test@mrsomers.student';

-- ============================================
-- FIX: If account_type is 'teacher', change it to 'student'
-- ============================================

-- Step 5: FIX THE ACCOUNT TYPE (uncomment to run)
-- UPDATE accounts
-- SET account_type = 'student',
--     updated_at = NOW()
-- WHERE email = 'test@mrsomers.student'
--   AND account_type != 'student';

-- Step 6: VERIFY THE FIX
-- SELECT 
--     email,
--     account_type,
--     updated_at,
--     '✅ Account type corrected to student' as status
-- FROM accounts
-- WHERE email = 'test@mrsomers.student';

-- ============================================
-- SUMMARY: Expected Results
-- ============================================
-- The test@mrsomers.student account should have:
-- ✅ account_type = 'student' (NOT 'teacher')
-- ✅ No teacher_students link (it's a student, not a teacher)
-- ✅ game_progress record for tracking XP
-- ✅ NO access to teacher dashboard
-- ============================================
