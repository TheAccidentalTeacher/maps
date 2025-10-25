# 🎖️ GI Joe Test Students - Quick Setup

## How to Add Test Students in 2 Minutes

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com/project/fuppbkhfqutzcromomkc
2. Click **SQL Editor** in left sidebar
3. Click **New query**

### Step 2: Copy & Paste This SQL

```sql
-- Create 10 GI Joe Test Students
INSERT INTO accounts (auth_user_id, full_name, account_type, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'Duke Hauser', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Scarlett O''Hara', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Snake Eyes', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Roadblock Hinton', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Lady Jaye Burnett', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Flint Fairborne', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Gung-Ho Rocco', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Shipwreck Hector', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Bazooka David', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Quick Kick MacArthur', 'student', NOW(), NOW());
```

### Step 3: Run It
1. Click **Run** (or press Ctrl+Enter)
2. Should see: "Success. No rows returned"

### Step 4: Verify
```sql
SELECT full_name, account_type, created_at 
FROM accounts 
WHERE account_type = 'student'
ORDER BY created_at DESC
LIMIT 10;
```

You should see all 10 GI Joe characters!

### Step 5: Refresh Your Dashboard
1. Go back to `http://localhost:8888`
2. Refresh the page (F5)
3. See your 10 GI Joe students appear! 🎉

---

## The Characters:

1. **Duke Hauser** - The fearless leader
2. **Scarlett O'Hara** - Intelligence expert and counter-intelligence specialist
3. **Snake Eyes** - The silent ninja commando
4. **Roadblock Hinton** - Heavy machine gunner and chef
5. **Lady Jaye Burnett** - Covert operations specialist
6. **Flint Fairborne** - Warrant officer and tactical strategist
7. **Gung-Ho Rocco** - Marine and demolitions expert
8. **Shipwreck Hector** - Navy SEAL and sailor
9. **Bazooka David** - Anti-tank specialist
10. **Quick Kick MacArthur** - Martial arts expert

---

## Note:

These students will appear in your dashboard but **won't have login credentials** (they're just database entries). They're perfect for testing the dashboard UI!

If you want them to actually log in later, you'll need to:
1. Create auth users in Supabase Auth UI
2. Link them to these accounts using the `auth_user_id`

But for testing the dashboard? These work perfect! 🎖️
