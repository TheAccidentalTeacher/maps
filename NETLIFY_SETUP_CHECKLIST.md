# Netlify Setup Checklist - Fix Missing Features

## 🔴 ISSUE 1: Weather Not Working

**Problem:** `ℹ️ Weather not available yet (needs deployment)`

**Solution:** Add `OPENWEATHER_API_KEY` to Netlify environment variables

### Steps:
1. Go to: https://app.netlify.com/
2. Click your site: `dashing-sable-201212`
3. **Site Settings** → **Environment variables**
4. Click **Add a variable**
5. Add:
   ```
   Key: OPENWEATHER_API_KEY
   Value: (copy from your .env file)
   ```
6. Click **Save**
7. **Trigger redeploy** (Site Overview → Trigger deploy → Deploy site)

---

## 🔴 ISSUE 2: AI Fallback Not Generating Images

**Problem:** Photos returning `null` despite AI generation code

**Diagnosis Needed:** Check Netlify Function logs

### Steps to Check Logs:
1. Go to: https://app.netlify.com/
2. Click your site: `dashing-sable-201212`
3. **Functions** tab
4. Click `match-photos-to-facts`
5. Look for recent executions (last 10 minutes)
6. Check for errors like:
   - `❌ Unsplash returned 0 photos for "Bayankhongor"`
   - `⚠️ No photos for "Bayankhongor", trying country "Mongolia"...`
   - `❌ No photos found after all fallback attempts`
   - `🎨 No real photos found - generating AI educational images...`

### Expected Flow (from logs):
```
1. 🔍 Searching for photos: Bayankhongor
2. 📸 Calling Unsplash API...
3. ✅ Unsplash returned 0 photos for "Bayankhongor"
4. ⚠️ No photos for "Bayankhongor", trying country "Mongolia"...
5. ✅ Country fallback returned 10 photos
   OR
6. 🎨 No real photos found - generating AI educational images...
```

### If AI Generation Should Trigger But Doesn't:

Check if these environment variables are in Netlify:
- ✅ `ANTHROPIC_API_KEY` (for Claude prompts)
- ✅ `REPLICATE_API_TOKEN` (for Flux image generation)

---

## 🔴 ISSUE 3: Photos Found But Not Matched

**Problem:** Console shows "✅ Matched 5 photos" but all photos are `null`

**Possible Causes:**
1. **Claude API quota exceeded** (unlikely with your key)
2. **Claude matching logic failing** (returning invalid JSON)
3. **Country photos not matching facts** (needs better fallback)

### Check This in Function Logs:
Look for:
- `✅ Final photo count: 10 photos to match with 5 facts`
- Then look for Claude errors or empty responses

### Quick Fix:
If Claude matching fails, the function should fall back to **simple keyword matching**. Check if you see:
```
⚠️ Claude matching failed, using simple fallback
```

---

## ✅ VERIFIED ENVIRONMENT VARIABLES

These are already in your `.env` and should be uploaded to Netlify:

### Already Uploaded ✅:
- `ANTHROPIC_API_KEY` (Claude AI)
- `UNSPLASH_ACCESS_KEY` (Photos)

### Need to Upload 🔴:
- `OPENWEATHER_API_KEY` (Weather - **ADD THIS!**)
- `PEXELS_API_KEY` (Photo fallback - **VERIFY THIS!**)
- `REPLICATE_API_TOKEN` (AI image generation - **VERIFY THIS!**)

### Steps to Verify:
1. **Site Settings** → **Environment variables**
2. Check if these exist:
   - `PEXELS_API_KEY`
   - `REPLICATE_API_TOKEN`
3. If missing, add them from your local `.env` file:
   ```
   PEXELS_API_KEY: (copy from .env)
   REPLICATE_API_TOKEN: (copy from .env)
   ```

---

## 🎯 QUICK DIAGNOSIS STEPS

1. **Add `OPENWEATHER_API_KEY`** → Fixes weather ✅
2. **Check Function Logs** → See why photos are null
3. **Verify all API keys uploaded** → Enable all fallbacks
4. **Trigger redeploy** → Apply changes
5. **Test with obscure location** (Bayankhongor, Mongolia) → Should trigger AI generation

---

## 📊 Expected Behavior After Fix

### For Famous Places (Paris, London):
1. Unsplash finds 10+ photos → ✅
2. Claude matches photos to facts → ✅
3. Each fact has relevant photo → ✅

### For Small Villages (Saint-Chartier):
1. Unsplash finds 0 photos → ⚠️
2. Country fallback finds France photos → ✅
3. Claude matches photos to facts → ✅

### For Obscure Places (Bayankhongor, Mongolia):
1. Unsplash finds 0 photos → ⚠️
2. Country fallback finds 0-2 photos → ⚠️
3. **AI generation triggers** → 🎨
4. Claude creates custom prompts → ✅
5. Replicate generates images → ✅
6. Each fact gets unique AI image → ✅

---

## 🔧 IF AI GENERATION STILL NOT WORKING

The issue might be that **country fallback is finding photos, but Claude is failing to match them**.

In that case, we need to:
1. Check Claude API response in function logs
2. Verify JSON parsing isn't failing
3. Add better error handling for malformed responses
4. Force AI generation if Claude matching fails

**Send me a screenshot of the Netlify Function logs and we'll fix it!**
