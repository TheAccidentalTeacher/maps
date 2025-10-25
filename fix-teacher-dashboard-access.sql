-- ============================================
-- FIX TEACHER DASHBOARD ACCESS
-- Allow teachers to see all students
-- ============================================

-- OPTION 1: Teachers can see ALL students (simplest for classroom use)
DROP POLICY IF EXISTS "teachers_see_all_students" ON accounts;
CREATE POLICY "teachers_see_all_students" ON accounts
    FOR SELECT USING (
        account_type = 'student' 
        OR auth.uid() = auth_user_id
    );

-- OPTION 2: Link your teacher account to the GI Joe students
-- First, get your teacher account ID
SELECT id, full_name, email, account_type 
FROM accounts 
WHERE account_type = 'teacher';

-- Then run this (replace YOUR_TEACHER_ID with the ID from above):
-- INSERT INTO teacher_students (teacher_id, student_id, class_name)
-- SELECT 
--     'YOUR_TEACHER_ID'::uuid,  -- Replace with your teacher ID
--     id,
--     'Test Class 2025'
-- FROM accounts 
-- WHERE account_type = 'student';
