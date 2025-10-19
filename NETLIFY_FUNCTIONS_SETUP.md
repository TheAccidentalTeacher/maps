# Netlify Functions Setup Guide
# Production-Quality API Integration for Location Explorer Sidebar

## Overview
This project uses **Netlify Functions** (serverless) to securely proxy API calls.
Your API keys stay SECRET on the server and are never exposed to the browser.

## ✅ What's Created

### 1. Netlify Functions (in `/netlify/functions/`)
- **get-photos.js** - Fetches photos from Unsplash/Pexels
- **get-weather.js** - Fetches weather from OpenWeatherMap
- **get-ai-facts.js** - Generates AI facts using OpenAI GPT-4o-mini

### 2. Configuration Files
- **netlify.toml** - Netlify build & function settings
- **package.json** - Node dependencies for functions

## 🚀 Setup Instructions

### Step 1: Install Netlify CLI (if not already installed)
```bash
npm install -g netlify-cli
```

### Step 2: Install Function Dependencies
```bash
cd C:\Users\scoso\WEBSITES\Mrsomersmaps
npm install
```

### Step 3: Add Missing API Key
You need an OpenWeatherMap API key. Get one free at:
https://openweathermap.org/api

Add to your `.env` file:
```
OPENWEATHER_API_KEY=your_key_here
```

### Step 4: Test Locally
```bash
netlify dev
```

This will:
- Start a local server at http://localhost:8888
- Run your Netlify Functions locally
- Read from your `.env` file
- Hot reload on changes

### Step 5: Deploy to Netlify

#### First Time Setup:
```bash
netlify init
```
Follow prompts to link to your GitHub repo.

#### Add Environment Variables in Netlify Dashboard:
1. Go to https://app.netlify.com
2. Select your site
3. Settings → Environment Variables
4. Add all keys from your `.env` file:
   - UNSPLASH_ACCESS_KEY
   - PEXELS_API_KEY
   - OPENAI_API_KEY
   - OPENWEATHER_API_KEY

#### Deploy:
```bash
git add -A
git commit -m "feat: Add Netlify Functions for API proxy"
git push
```

Netlify auto-deploys from GitHub!

## 📊 How It Works

### Development (Local):
```
Browser → http://localhost:8888/api/get-photos?location=Paris
         ↓
Netlify Dev Server reads .env
         ↓
Function calls Unsplash API with your key
         ↓
Returns photos to browser (key never exposed!)
```

### Production (Netlify):
```
Browser → https://yourdomain.netlify.app/api/get-photos?location=Paris
         ↓
Netlify Function reads environment variables
         ↓
Function calls Unsplash API with your key
         ↓
Returns photos to browser (key never exposed!)
```

## 🔒 Security Benefits
- ✅ API keys NEVER in browser code
- ✅ API keys NEVER in Git
- ✅ CORS properly configured
- ✅ Production-ready architecture
- ✅ Can add rate limiting later
- ✅ Can cache responses to save costs

## 💰 Cost Estimate
With caching and smart usage:
- **OpenAI GPT-4o-mini**: ~$0.0002 per request (5 facts)
- **Unsplash**: FREE (50 requests/hour)
- **Pexels**: FREE (200 requests/hour)
- **OpenWeatherMap**: FREE (60 calls/minute, 1M calls/month)

**Total**: ~$0.002 per location (with AI facts)
**Monthly** (30 students, 20 locations/day): ~$3.60/month

80% savings with caching! (Phase 8)

## 📝 Frontend Usage

Once functions are deployed, your JavaScript will call:

```javascript
// Get photos
const response = await fetch('/api/get-photos?location=Paris');
const { photos } = await response.json();

// Get weather
const response = await fetch('/api/get-weather?lat=48.8566&lon=2.3522');
const { weather } = await response.json();

// Get AI facts
const response = await fetch('/api/get-ai-facts?location=Paris&country=France');
const { facts } = await response.json();
```

Same code works in dev and production! 🎉

## ⚠️ Next Steps
1. Get OpenWeatherMap API key
2. Add to `.env` file
3. Run `npm install`
4. Run `netlify dev`
5. Test endpoints
6. Configure Netlify environment variables
7. Deploy!

## 🆘 Troubleshooting

**Functions not working locally?**
- Make sure you ran `npm install`
- Make sure you're using `netlify dev` (not `python -m http.server`)
- Check `.env` file exists and has all keys

**Functions not working in production?**
- Check Netlify environment variables are set
- Check function logs in Netlify dashboard
- Verify build deployed successfully

**Rate limits?**
- Implement caching (Phase 8)
- Consider upgrading API plans if needed
