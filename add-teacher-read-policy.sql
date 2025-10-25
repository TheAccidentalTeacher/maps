-- ============================================
-- QUICK FIX: Allow Teachers to See All Students
-- ============================================

-- Check existing RLS policies on accounts table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'accounts';

-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "teachers_can_view_all_students" ON accounts;

-- Add a policy for teachers to see all student accounts
CREATE POLICY "teachers_can_view_all_students" ON accounts
    FOR SELECT 
    USING (
        -- Users can see their own account
        auth.uid() = auth_user_id
        OR
        -- Teachers can see all student accounts
        (
            EXISTS (
                SELECT 1 FROM accounts teacher_account
                WHERE teacher_account.auth_user_id = auth.uid()
                AND teacher_account.account_type = 'teacher'
            )
            AND account_type = 'student'
        )
    );

-- Verify the policy was created
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'accounts'
ORDER BY policyname;
