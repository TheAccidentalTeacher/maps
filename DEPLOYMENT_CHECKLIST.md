# 🚀 DEPLOYMENT CHECKLIST
**Pre-Deployment Verification for Netlify**

---

## ✅ SECURITY CHECK

### Environment Variables (.env files)
- ✅ `.env` is in `.gitignore` 
- ✅ `.env.local` is in `.gitignore`
- ✅ `.env.*.local` pattern is in `.gitignore`
- ✅ No `.env` files tracked by git (`git ls-files .env` returns nothing)
- ✅ `.env.example` exists for reference

### Hardcoded Credentials Check
- ⚠️ **SUPABASE_URL and SUPABASE_ANON_KEY are hardcoded in frontend**
  - **This is SAFE** ✅ - Supabase anon keys are designed to be public
  - Row-Level Security (RLS) policies protect the data
  - Service key (private) is only in `.env` and Netlify environment variables

---

## 🔑 NETLIFY ENVIRONMENT VARIABLES

**You MUST configure these in Netlify Dashboard:**
`Site Settings → Environment Variables`

### Required API Keys

#### Photos & Media
```
UNSPLASH_ACCESS_KEY=your_key_here
PEXELS_API_KEY=your_key_here
```

#### AI Services
```
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

#### Weather
```
OPENWEATHER_API_KEY=your_key_here
```

#### Supabase (Backend)
```
SUPABASE_URL=https://fuppbkhfqutzcromomkc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=your_service_key_here (PRIVATE - never commit!)
```

#### Optional (for additional features)
```
GIPHY_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
PIXABAY_API_KEY=your_key_here
```

---

## 📋 PRE-PUSH CHECKLIST

### 1. Code Review
- [ ] All new features tested locally
- [ ] No console errors in browser
- [ ] Ocean Explorer works (photos load, save to database)
- [ ] Main map navigation works
- [ ] All game modes accessible

### 2. File Check
- [ ] Run `git status` - verify no `.env` files
- [ ] Run `git ls-files .env` - should return empty
- [ ] Check `.gitignore` includes `.env*` patterns

### 3. Netlify Functions
- [ ] All functions in `netlify/functions/` directory
- [ ] Test all functions work locally with `netlify dev --offline`
- [ ] Functions tested:
  - [ ] `get-species-photos`
  - [ ] `get-species-ai-facts`
  - [ ] `get-photos`
  - [ ] `get-ai-facts`
  - [ ] `match-photos-to-facts`
  - [ ] `get-weather`

### 4. Database
- [ ] Supabase RLS policies enabled
- [ ] Test student account can log in
- [ ] Test student can save ocean discoveries
- [ ] Test teacher dashboard (if applicable)

---

## 🚀 DEPLOYMENT STEPS

### Option 1: Git Push (Recommended - Auto Deploy)
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Add Ocean Explorer game mode button and comprehensive documentation"

# Push to GitHub (triggers auto-deploy)
git push origin main
```

### Option 2: Netlify CLI Deploy
```bash
# Deploy to production
netlify deploy --prod

# Or deploy to preview first
netlify deploy
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Immediate Checks (within 5 minutes)
1. [ ] Visit your Netlify URL: `https://[your-site].netlify.app`
2. [ ] Check build log in Netlify Dashboard
3. [ ] Verify site loads without errors
4. [ ] Open browser console - check for 404s or errors

### Feature Testing (within 15 minutes)
1. [ ] **Login System**
   - [ ] Navigate to login page
   - [ ] Log in with test student account
   - [ ] Verify redirect to main map

2. [ ] **Main Map**
   - [ ] Click on a land location
   - [ ] Verify sidebar cards populate (photos, facts, weather)
   - [ ] Click on ocean location
   - [ ] Verify Ocean Explorer buttons appear

3. [ ] **Ocean Explorer Button**
   - [ ] Click "🌊 OCEAN" in top navigation
   - [ ] Verify ocean-explorer-v3.html loads
   - [ ] Check browser console for errors

4. [ ] **Ocean Explorer Game**
   - [ ] Click dive button 50 times
   - [ ] Verify species discovered at 1500ft
   - [ ] Check species card shows photo (not emoji)
   - [ ] Refresh page
   - [ ] Verify photo persists

5. [ ] **Database**
   - [ ] Check Supabase dashboard
   - [ ] Query: `SELECT * FROM ocean_species_discoveries WHERE user_account_id = 'test-user-id'`
   - [ ] Verify records exist with photos

6. [ ] **Netlify Functions**
   - [ ] Open Network tab in browser
   - [ ] Check `/.netlify/functions/get-species-photos` returns 200
   - [ ] Check `/.netlify/functions/get-species-ai-facts` returns 200
   - [ ] Verify no 404s or 500s

---

## 🐛 TROUBLESHOOTING

### Build Fails
- **Check build logs** in Netlify Dashboard
- **Verify** `netlify.toml` is correct
- **Check** for syntax errors in JavaScript

### Functions Return 404
- **Verify** functions are in `netlify/functions/` directory
- **Check** Netlify build log shows functions deployed
- **Verify** environment variables set in Netlify Dashboard

### Photos Don't Load
- **Check** `UNSPLASH_ACCESS_KEY` and `PEXELS_API_KEY` in Netlify env vars
- **Open** Network tab - look for API errors
- **Verify** functions return 200 status

### Database Errors
- **Check** Supabase environment variables are set
- **Verify** RLS policies are enabled
- **Test** database connection with SQL query in Supabase dashboard

### Ocean Explorer Photos Don't Save
- **Check** browser console for errors
- **Verify** user is logged in (check `supabase.auth.getUser()`)
- **Check** `ocean_species_discoveries` table has no foreign key constraint
- **Query** database directly to verify records

---

## 📊 MONITORING

### After 24 Hours
- [ ] Check Netlify Analytics - verify traffic
- [ ] Check Supabase logs - verify database activity
- [ ] Check error logs - address any issues
- [ ] Test with real student accounts

### Weekly
- [ ] Review API usage (Unsplash, Pexels, OpenAI)
- [ ] Check database size and growth
- [ ] Review Netlify function invocations
- [ ] Address any reported bugs

---

## 🔄 ROLLBACK PLAN

If deployment has critical issues:

### Quick Rollback (Netlify Dashboard)
1. Go to `Deploys` tab
2. Find last working deployment
3. Click `...` → `Publish deploy`
4. Site reverts in ~30 seconds

### Git Rollback
```bash
# Find last working commit
git log --oneline

# Revert to specific commit
git revert [commit-hash]
git push origin main

# Or hard reset (destructive)
git reset --hard [commit-hash]
git push --force origin main
```

---

## ✅ READY TO DEPLOY?

**Final Verification:**
- [ ] All environment variables documented above
- [ ] `.env` files not tracked by git
- [ ] All features tested locally
- [ ] Netlify environment variables configured
- [ ] Database backup created (if needed)
- [ ] Team notified of deployment

**If all checkboxes complete: DEPLOY! 🚀**

---

## 📞 SUPPORT

**Resources:**
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- GitHub Repo: https://github.com/TheAccidentalTeacher/maps

**Current Status:**
- Date: October 24, 2025
- Version: Ocean Explorer v3 + Navigation Button
- Last Deploy: [To be filled after deployment]
