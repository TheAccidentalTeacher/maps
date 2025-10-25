-- OPTION 1: Remove the foreign key constraint (RECOMMENDED for Ocean Explorer)
-- This allows Ocean Explorer to work independently of the accounts table

ALTER TABLE ocean_species_discoveries
DROP CONSTRAINT IF EXISTS ocean_species_discoveries_user_account_id_fkey;

-- Now Ocean Explorer will save discoveries for ANY authenticated user
-- (even if they don't have an account record in the accounts table)


-- OPTION 2: If you want to keep the constraint, we need to make sure
-- every student has a record in the accounts table
-- But that seems like overkill for this feature
