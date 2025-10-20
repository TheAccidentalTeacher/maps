# 🚀 Netlify Production Deployment Checklist

## 📋 Pre-Deployment Verification

### ✅ Local Server Working
- [x] Server running on `localhost:8888`
- [x] AI-powered photo matching functional
- [x] Photos match facts correctly (no random dog/plant mismatches)
- [x] Geography in Real Life card generating
- [x] Location disambiguation working (Palmyra Maine vs Syria)

---

## 🔑 Step 1: Verify Environment Variables

Go to **Netlify Dashboard** → Your Site → **Site Configuration** → **Environment Variables**

Required variables:
```
ANTHROPIC_API_KEY=sk-ant-...           (Claude 3.5 Sonnet)
OPENAI_API_KEY=sk-...                  (GPT-4o fallback)
REPLICATE_API_TOKEN=r8_...             (Flux Schnell images)
UNSPLASH_ACCESS_KEY=...                (Primary photo source)
PEXELS_API_KEY=...                     (Secondary photo source)
OPENWEATHERMAP_API_KEY=...             (Weather data)
```

### How to Check:
1. Log into Netlify: https://app.netlify.com
2. Select your site: **mrsomersmaps** (or your site name)
3. Go to: **Site configuration** → **Environment variables**
4. Verify all 6 keys are present and not expired

**⚠️ CRITICAL:** These must be set in Netlify dashboard, NOT in code!

---

## 📦 Step 2: Deploy Updated Code

### Option A: Git Push (Recommended)
```powershell
# From your project directory
git add .
git commit -m "AI photo matching + location disambiguation + Geography in Real Life"
git push origin main
```

Netlify will automatically deploy when it detects the push.

### Option B: Manual Deploy
1. Drag & drop your entire project folder to Netlify
2. Wait for build to complete

---

## 🧪 Step 3: Test Production Environment

### Test Locations (Click each and verify):

**1. Greenville, South Carolina**
- ✅ Liberty Bridge fact → Bridge photo (NOT a dog)
- ✅ Eastern Box Turtle fact → Wildlife photo (NOT a potted plant)
- ✅ Photos match fact subjects

**2. Palmyra, Maine**
- ✅ Photos show small town Maine (NOT Syrian ruins)
- ✅ Location disambiguation working
- ✅ Search query includes "Palmyra Maine" in logs

**3. Alaska Location (for your students)**
- ✅ All 5 facts have photos
- ✅ Photos cycle correctly if fewer than 5 available
- ✅ Geography in Real Life card appears
- ✅ Card content is scrollable

---

## 🔍 Step 4: Check Netlify Function Logs

### Real-time Monitoring:
1. Netlify Dashboard → **Functions** tab
2. Click on function name: `match-photos-to-facts`
3. View **Recent invocations**
4. Look for errors or warnings

### What to Look For:
```
✅ Good: "Found 5 real photos, matching to facts with AI..."
✅ Good: "Claude matched photos to facts"
✅ Good: "Searching Unsplash for: Palmyra Maine"

❌ Bad: "No real photos found, generating AI infographics"
❌ Bad: "API key missing" or "401 Unauthorized"
❌ Bad: Error messages about undefined variables
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "API Key Missing" Errors
**Cause:** Environment variables not set in Netlify  
**Fix:** 
1. Go to Site Configuration → Environment variables
2. Add missing keys
3. Redeploy (trigger new build)

### Issue 2: Photos Still Random/Wrong
**Cause:** Old version of `match-photos-to-facts.js` deployed  
**Fix:**
1. Verify git push succeeded
2. Check Netlify deploy log for latest commit hash
3. Clear Netlify cache: Site configuration → Build & deploy → Clear cache and retry deploy

### Issue 3: Geography in Real Life Card Not Showing
**Cause:** `generate-real-life-geography.js` function missing  
**Fix:**
1. Verify file exists: `netlify/functions/generate-real-life-geography.js`
2. Check `netlify.toml` has `functions = "netlify/functions"`
3. Redeploy

### Issue 4: "Function Timeout" Errors
**Cause:** AI matching taking too long (>10 seconds)  
**Fix:**
1. Check if Claude API is responding (test in local first)
2. Reduce number of facts/photos being matched
3. Netlify free tier: 10 sec timeout; Pro: 26 sec

---

## 🎯 Production URLs

### Your Live Site:
- **Main App:** `https://your-site-name.netlify.app`
- **Health Check:** `https://your-site-name.netlify.app/.netlify/functions/health`

### API Endpoints:
- **Match Photos:** `/.netlify/functions/match-photos-to-facts`
- **Real Life Geography:** `/.netlify/functions/generate-real-life-geography`
- **Generate Facts:** `/.netlify/functions/generate-ai-facts`

---

## ✅ Final Verification Steps

1. **Open production site in incognito window** (fresh cache)
2. **Click 3 different locations**
3. **Verify for each:**
   - [ ] Photos load (not AI-generated infographics)
   - [ ] Photos match fact subjects
   - [ ] Geography in Real Life card appears
   - [ ] Content is scrollable
   - [ ] Location names disambiguate correctly

4. **Check browser console for errors**
   - Press `F12` → Console tab
   - Look for red error messages
   - All API calls should return `200 OK`

5. **Test with students** (if available)
   - Monitor for inappropriate content
   - Check if photos are educational
   - Verify Geography in Real Life examples are relatable

---

## 🚨 Rollback Plan (If Something Breaks)

### Emergency Rollback:
1. Netlify Dashboard → **Deploys** tab
2. Find last working deploy (before today)
3. Click **"..."** → **Publish deploy**
4. Site reverts to previous version instantly

### Restore Backup:
If you have backups like `index_backup_phase5.html`:
```powershell
Copy-Item index_backup_phase5.html index.html -Force
git commit -am "Rollback to stable version"
git push origin main
```

---

## 📊 Success Metrics

### You'll know it's working when:
- ✅ All AI facts have REAL photos (not infographics)
- ✅ Photos are contextually relevant to facts
- ✅ Students can learn from photo-fact pairings
- ✅ No location name confusion (Maine ≠ Syria)
- ✅ Safety filters blocking inappropriate content
- ✅ Geography in Real Life card provides relatable examples

---

## 🎓 Student Testing Protocol

### Week 1: Soft Launch
- Test with 2-3 students first
- Watch them use the app
- Note confusion points
- Check if photos are engaging

### Week 2: Full Rollout
- All 15 students can access
- Monitor Netlify function logs
- Collect feedback on Geography in Real Life card
- Adjust examples based on Alaska student interests

---

## 📞 Need Help?

### Check These First:
1. Netlify function logs (real-time errors)
2. Browser console (client-side errors)
3. Network tab (failed API calls)
4. Environment variables (missing keys)

### Debugging Commands:
```powershell
# Test Netlify function locally
netlify dev

# Check environment variables
netlify env:list

# View function logs
netlify functions:log match-photos-to-facts
```

---

## 🎉 You're Ready!

Once you complete this checklist:
1. Your production site will match local dev behavior
2. Students will get educational, relevant photos
3. AI matching ensures context-appropriate pairings
4. Safety filters protect middle schoolers
5. Geography in Real Life adds real-world connections

**Next Step:** Push to GitHub and let Netlify auto-deploy! 🚀
