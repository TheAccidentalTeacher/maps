# 🧪 CLOUD SYNC TESTING GUIDE

## ✅ **WHAT WE JUST IMPLEMENTED:**

1. **Auto-save to database** every 30 seconds
2. **Load from database** on login
3. **Save immediately** when XP is earned
4. **Merge conflicts** (highest XP wins)

---

## 📝 **HOW TO TEST:**

### **Test 1: Verify Cloud Sync is Running**
1. Refresh your browser (Ctrl+Shift+R)
2. Open browser console (F12)
3. Look for these messages:
   - `☁️ Initializing cloud sync...`
   - `✅ Cloud sync initialized with X XP`
   - `✅ Auto-save enabled (every 30s)`

### **Test 2: Earn Some XP**
1. Click anywhere on the map to explore a location
2. You should see: `✅ Progress saved to cloud: X XP`
3. Check console for confirmation

### **Test 3: Verify Database**
1. Go to Supabase: https://app.supabase.com/project/fuppbkhfqutzcromomkc
2. Go to "Table Editor" → `game_progress`
3. Find your student account
4. Check that `total_xp` matches what you see in the app

### **Test 4: Device Switching (ULTIMATE TEST)**
1. Earn 100 XP on one computer
2. Log out
3. Log in on a different browser (or incognito mode)
4. Your XP should load from the cloud! ✨

### **Test 5: Auto-Save**
1. Earn some XP
2. Wait 30 seconds
3. Check console for: `✅ Progress saved to cloud: X XP`
4. This should happen automatically every 30 seconds

---

## 🐛 **TROUBLESHOOTING:**

### **Problem: "❌ Error saving progress"**
**Cause:** RLS policy might be blocking the save

**Fix:** Run this in Supabase SQL Editor:
```sql
-- Allow users to update their own progress
CREATE POLICY "users_update_own_progress" ON game_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM accounts
            WHERE accounts.id = game_progress.user_account_id
            AND accounts.auth_user_id = auth.uid()
        )
    );

-- Allow users to insert their own progress
CREATE POLICY "users_insert_own_progress" ON game_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts
            WHERE accounts.id = game_progress.user_account_id
            AND accounts.auth_user_id = auth.uid()
        )
    );
```

### **Problem: "ℹ️ No saved progress found"**
**This is NORMAL** for first-time logins! The app will create a new record on first save.

### **Problem: XP not updating in database**
1. Check browser console for errors
2. Verify you're logged in
3. Check that RLS policies are enabled
4. Try manually calling: `saveGameProgress()` in console

---

## ✨ **SUCCESS CRITERIA:**

- ✅ Console shows "Cloud sync initialized"
- ✅ XP saves to database every 30 seconds
- ✅ Progress loads from database on login
- ✅ Teacher can see student XP in dashboard
- ✅ Students can switch devices without data loss

---

## 🎯 **NEXT STEPS AFTER TESTING:**

1. Test with a real student account
2. Have student earn XP and verify in database
3. View as that student in teacher dashboard
4. Confirm progress is visible
5. Deploy to production! 🚀
