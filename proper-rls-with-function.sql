-- ============================================
-- PROPER RLS SOLUTION: Use a function to avoid recursion
-- This is the RIGHT way to do it
-- ============================================

-- Step 1: Create a function that checks if the current user is a teacher
-- Functions can bypass RLS, so no recursion!
-- Must be in public schema since we don't have permission to create in auth schema
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.accounts
    WHERE auth_user_id = auth.uid()
    AND account_type = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop the broken recursive policy
DROP POLICY IF EXISTS "teachers_can_view_all_students" ON accounts;

-- Step 3: Create proper policies using the function
-- Policy 1: Users can always see their own account
CREATE POLICY "users_view_own_account" ON accounts
    FOR SELECT 
    USING (auth.uid() = auth_user_id);

-- Policy 2: Teachers can see all accounts (using the function)
CREATE POLICY "teachers_view_all_accounts" ON accounts
    FOR SELECT 
    USING (public.is_teacher());

-- Policy 3: Allow account creation during signup
CREATE POLICY "allow_account_creation" ON accounts
    FOR INSERT 
    WITH CHECK (auth.uid() = auth_user_id);

-- Policy 4: Users can update their own account
CREATE POLICY "users_update_own_account" ON accounts
    FOR UPDATE 
    USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

-- Step 4: Verify everything is set up correctly
SELECT 
    policyname, 
    cmd as command,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has conditions'
        ELSE 'No conditions'
    END as has_conditions
FROM pg_policies 
WHERE tablename = 'accounts'
ORDER BY policyname;

-- Step 5: Test that it works
SELECT 
    'Testing: Current user is teacher?' as test,
    public.is_teacher() as result;

-- Step 6: Verify students exist
SELECT COUNT(*) as student_count 
FROM accounts 
WHERE account_type = 'student';
