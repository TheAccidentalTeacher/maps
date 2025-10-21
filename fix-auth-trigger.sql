-- Fix: Properly attach trigger to auth.users table
-- This ensures the trigger fires when users sign up

-- First, let's verify the function exists (it should)
SELECT routine_name, routine_schema 
FROM information_schema.routines 
WHERE routine_name = 'create_account_on_signup';

-- Drop the trigger if it exists (might be on wrong table)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function with proper permissions
CREATE OR REPLACE FUNCTION public.create_account_on_signup()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.accounts (auth_user_id, email, full_name, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'teacher')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't block user creation
  RAISE WARNING 'Error creating account: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Now create the trigger on the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_account_on_signup();

-- Verify the trigger is now attached
SELECT 
  tgname as trigger_name,
  tgenabled as enabled,
  tgrelid::regclass as table_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check if there are any existing users we need to backfill
SELECT 
  u.id as auth_user_id,
  u.email,
  a.id as account_exists
FROM auth.users u
LEFT JOIN public.accounts a ON u.id = a.auth_user_id
WHERE a.id IS NULL;
