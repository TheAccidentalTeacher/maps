# 🚨 NETLIFY FUNCTIONS 404 FIX

**Problem:** Functions return 404 errors in production  
**Cause:** Functions not deploying properly to Netlify  
**Solution:** Follow these steps

---

## ✅ IMMEDIATE FIX (5 minutes)

### Step 1: Add Environment Variables to Netlify

1. Go to: https://app.netlify.com
2. Select your site: **dashing-sable-201212**
3. Click: **Site configuration** → **Environment variables**
4. Add these variables:

```
ANTHROPIC_API_KEY = your-claude-api-key-here

OPENWEATHER_API_KEY = your-openweather-key-here

UNSPLASH_ACCESS_KEY = your-unsplash-key-here

PEXELS_API_KEY = your-pexels-key-here
```

5. Click **Save**

---

### Step 2: Verify netlify.toml Configuration

Your `netlify.toml` looks correct, but let's verify:

```toml
[build]
  publish = "."
  functions = "netlify/functions"  # ✅ This tells Netlify where functions are

[functions]
  node_bundler = "esbuild"  # ✅ This bundles dependencies
  directory = "netlify/functions"
```

---

### Step 3: Check Functions Are Committed

Run in terminal:
```bash
git status
```

Make sure these files show as committed:
- ✅ netlify/functions/get-ai-facts.js
- ✅ netlify/functions/get-photos.js
- ✅ netlify/functions/get-weather.js
- ✅ package.json
- ✅ netlify.toml

If not committed:
```bash
git add netlify/ package.json netlify.toml
git commit -m "fix: Add Netlify functions for AI facts and photos"
git push origin main
```

---

### Step 4: Force Redeploy

**Option A: Trigger Deploy from Netlify Dashboard**
1. Go to: https://app.netlify.com/sites/dashing-sable-201212/deploys
2. Click: **Trigger deploy** → **Deploy site**
3. Wait 2-3 minutes
4. Check deploy log for function deployment

**Option B: Deploy from Terminal**
```bash
netlify deploy --prod
```

---

### Step 5: Verify Functions Deployed

After deploy completes, check:

**In Netlify Dashboard:**
1. Go to: **Functions** tab
2. You should see:
   - ✅ get-ai-facts
   - ✅ get-photos  
   - ✅ get-weather
3. Click each function → Check "Recent invocations"

**Test Functions Directly:**
Open these URLs in browser:
```
https://dashing-sable-201212.netlify.app/.netlify/functions/get-photos?location=Paris&query=eiffel+tower

https://dashing-sable-201212.netlify.app/.netlify/functions/get-ai-facts?location=Paris&country=France&lat=48.8566&lon=2.3522

https://dashing-sable-201212.netlify.app/.netlify/functions/get-weather?lat=48.8566&lon=2.3522
```

Expected: JSON response, not 404!

---

## 🔍 COMMON ISSUES & FIXES

### Issue 1: "Function not found" in Deploy Log

**Cause:** Functions folder not detected  
**Fix:** Check `netlify.toml` has correct path:
```toml
[functions]
  directory = "netlify/functions"
```

### Issue 2: "Module not found: node-fetch"

**Cause:** Dependencies not installed  
**Fix:** Make sure `package.json` is in root directory with:
```json
"dependencies": {
  "node-fetch": "^2.6.7"
}
```

### Issue 3: Functions Deploy but Return 500 Error

**Cause:** Missing environment variables  
**Fix:** Add API keys to Netlify (Step 1 above)

### Issue 4: CORS Errors

**Cause:** Missing CORS headers  
**Fix:** Functions already have CORS headers:
```javascript
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};
```

---

## 🎯 VERIFICATION CHECKLIST

After deploying, verify:

- [ ] Environment variables added to Netlify dashboard
- [ ] Functions show in Netlify dashboard "Functions" tab
- [ ] Function URLs return JSON (not 404)
- [ ] In production app:
  - [ ] Click location on map
  - [ ] Location Explorer sidebar opens
  - [ ] AI Facts card shows 5 facts (not error)
  - [ ] Photos card shows 4 photos (not error)
  - [ ] Weather card shows current weather (if API key added)

---

## 🚨 IF STILL NOT WORKING

### Debug Deploy Log

1. Go to: https://app.netlify.com/sites/dashing-sable-201212/deploys
2. Click latest deploy
3. Scroll down to deploy log
4. Look for section: "Packaging Functions"
5. Should see:
   ```
   ✔ get-ai-facts
   ✔ get-photos
   ✔ get-weather
   ```

If functions NOT listed:
- ❌ Functions folder not detected
- ❌ Check `netlify.toml` configuration
- ❌ Make sure files are committed to git

### Check Function Logs (Real-time)

1. In Netlify dashboard → Functions tab
2. Click a function (e.g., get-ai-facts)
3. Scroll down to "Function log"
4. Click location in app → Watch logs in real-time
5. Look for errors!

**Common errors:**
- `Module not found` → Dependencies not installed
- `undefined env variable` → API keys missing
- `fetch is not defined` → Using wrong node-fetch version

---

## 💡 QUICK TEST (Once Fixed)

1. Open: https://dashing-sable-201212.netlify.app
2. Click anywhere on map (e.g., Mongolia, Paris, Nigeria)
3. Location Explorer sidebar should show:
   - ✅ 5 AI-generated fun facts
   - ✅ 4 beautiful photos
   - ✅ Current weather (if API key configured)

If you see placeholders saying "Deploy needed" → Functions still not working!

---

## 📝 NEXT STEPS AFTER FIX

Once functions work:

1. **Test with students:**
   - Have 2-3 students click different locations
   - Verify facts/photos load consistently
   - Check load times (should be <3 seconds)

2. **Monitor costs:**
   - Anthropic Claude: ~$0.0002 per location
   - Unsplash/Pexels: FREE
   - OpenWeather: FREE (60 calls/min)
   - Monthly cost: ~$3-5 for 30 students

3. **Add more features:**
   - Gen Alpha slang toggle (already built!)
   - More photo sources
   - Video integration

---

**Status:** 📋 **READY TO FIX**  
**Time:** 5-10 minutes  
**Next:** Add environment variables → Redeploy → Test! 🚀
