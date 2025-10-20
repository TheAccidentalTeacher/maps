# 🔐 AUTHENTICATION SETUP - STEP-BY-STEP

**Goal:** Create your first teacher account and enable login  
**Time:** 30-40 minutes  
**What you'll have:** Working login system + your teacher account

---

## 🎯 PART 1: CREATE YOUR TEACHER ACCOUNT (10 minutes)

### Step 1: Go to Supabase Authentication

1. **Open Supabase dashboard:**
   - https://supabase.com/dashboard/project/fuppbkhfqutzcromomkc

2. **Click "Authentication"** (left sidebar, shield icon)

3. **Click "Users"** tab

4. **Click "Add user"** button (top right)

### Step 2: Create Your Account

Fill in the form:

**Email:** (your email - e.g., teacher@school.edu)  
**Password:** (create a secure password - write it down!)  
**Auto Confirm User:** ✅ **Check this box!**  
**User Metadata (optional):**
```json
{
  "full_name": "Mrs. Somers",
  "account_type": "teacher"
}
```

**Click "Create user"**

### Step 3: Verify Account Was Created

You should see:
- ✅ Your email in the users list
- ✅ Status: "Confirmed"
- ✅ A UUID (user ID)

**🎉 YOUR TEACHER ACCOUNT EXISTS!**

---

## 🎯 PART 2: VERIFY DATABASE TRIGGER WORKED (5 minutes)

The `create_account_on_signup()` trigger should have automatically created an entry in the `accounts` table!

### Check the accounts table:

1. **Go to Supabase → SQL Editor**

2. **New query:**
```sql
-- Check if your account was auto-created
SELECT 
  id,
  email,
  full_name,
  account_type,
  subscription_tier,
  created_at
FROM accounts
ORDER BY created_at DESC
LIMIT 5;
```

3. **Click "Run"**

**You should see:**
- ✅ Your email
- ✅ Your name ("Mrs. Somers")
- ✅ Account type: "teacher"
- ✅ Subscription tier: "free"

**If you see this → THE TRIGGER WORKED!** 🎉

---

## 🎯 PART 3: ADD LOGIN UI TO YOUR APP (15 minutes)

Now let's add a simple login form to your app!

### What I'll add to index.html:

1. **Login modal** (shows when not logged in)
2. **Profile selector** (shows after login)
3. **Logout button**
4. **Authentication state management**

**I'll handle this part - just sit back and watch!** 🚀

---

## 🎯 PART 4: TEST AUTHENTICATION (10 minutes)

After I add the UI, you'll test:

1. **Open your app** (http://localhost:8888)
2. **See login modal** (should appear automatically)
3. **Enter your email and password**
4. **Click "Login"**
5. **See profile selector** (ready to add students!)
6. **Click "Logout"**
7. **See login modal again** (working!)

---

## 🔒 SECURITY NOTES

### What's Protected:
- ✅ **Passwords** - Hashed by Supabase (bcrypt)
- ✅ **Sessions** - JWT tokens (secure)
- ✅ **API keys** - In `.env.local` (not in Git)
- ✅ **User data** - Row Level Security (database enforced)

### What's NOT Stored:
- ❌ Plain text passwords (NEVER!)
- ❌ Last names (FERPA compliant!)
- ❌ Birthdates (not needed!)
- ❌ Addresses (privacy!)

**This is production-grade security!** 🔐

---

## 📋 AUTHENTICATION CHECKLIST

```
□ Went to Supabase → Authentication → Users
□ Clicked "Add user"
□ Entered email and password
□ Checked "Auto Confirm User"
□ Added user metadata (full_name, account_type)
□ Clicked "Create user"
□ Verified user appears in list
□ Ran SQL to check accounts table
□ Saw account was auto-created
□ Ready for login UI!
```

---

## 🎯 NEXT ACTIONS FOR YOU:

1. **Create your teacher account in Supabase** (follow Part 1 above)
2. **Run the SQL to verify it worked** (follow Part 2 above)
3. **Tell me "Account created!"**
4. **I'll add the login UI to your app**
5. **You'll test login/logout**

---

## ❓ TROUBLESHOOTING

### Problem: User not appearing in list
**Solution:** Refresh the page, might take 2-3 seconds

### Problem: Accounts table is empty
**Solution:** 
- Check if the trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- If missing, re-run the SQL from `supabase-setup-complete.sql` (Step 9)

### Problem: Can't remember password
**Solution:** 
- Go to Authentication → Users
- Click the three dots next to your user
- Click "Reset password"

---

**GO CREATE YOUR ACCOUNT! I'll wait for you to say "Account created!" then I'll add the login UI!** 🚀
