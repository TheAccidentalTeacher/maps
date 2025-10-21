# Netlify Functions API Reference

**Version:** 2.0  
**Last Updated:** October 20, 2025  
**Purpose:** Complete documentation for all serverless functions

---

## 📋 OVERVIEW

This application uses **7 Netlify serverless functions** to proxy API requests and integrate AI services. All functions are located in `/netlify/functions/`.

### Why Serverless Functions?
- **Security:** API keys hidden from client-side code
- **CORS:** Bypass cross-origin restrictions
- **Rate Limiting:** Centralized request management
- **Cost Control:** Monitor and limit API usage

---

## 🔧 FUNCTION INVENTORY

| Function | Purpose | AI Service | Status |
|----------|---------|------------|--------|
| `get-weather.js` | Weather data | OpenWeatherMap API | ✅ Working |
| `get-photos.js` | Photo search | Unsplash/Pexels API | ✅ Working |
| `get-ai-facts.js` | Geography facts | OpenAI GPT-4o-mini | ✅ Working |
| `generate-photo-caption.js` | Photo descriptions | OpenAI GPT-4o-mini | ✅ Working |
| `generate-real-life-geography.js` | Real-world connections | OpenAI GPT-4o-mini | ✅ Working |
| `match-photos-to-facts.js` | Photo validation | OpenAI Vision API | ✅ Working |
| `match-photos-to-facts-v2.js` | Enhanced validation | OpenAI Vision API | ✅ Working |

---

## 📡 FUNCTION DETAILS

### 1. get-weather.js

**Purpose:** Fetch current weather data for a location

**Endpoint:** `/.netlify/functions/get-weather`

**Method:** `GET`

**Query Parameters:**
- `lat` (required) - Latitude (decimal degrees)
- `lon` (required) - Longitude (decimal degrees)

**Example Request:**
```javascript
const response = await fetch(`/.netlify/functions/get-weather?lat=61.2176&lon=-149.8997`);
const data = await response.json();
```

**Success Response (200):**
```json
{
  "temp": {
    "fahrenheit": 45,
    "celsius": 7
  },
  "wind": {
    "speed": 12,
    "direction": "NW",
    "degrees": 315
  },
  "visibility": 10,
  "conditions": "Clear sky",
  "icon": "01d"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch weather data",
  "details": "Error message"
}
```

**Environment Variables:**
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key

**Rate Limits:**
- Free tier: 60 calls/minute, 1,000,000 calls/month
- Current usage: ~100 calls/day

**Cost:** Free (within limits)

**Error Handling:**
- Returns 500 if API key missing
- Returns 500 if OpenWeatherMap API fails
- Logs detailed errors to Netlify function logs

---

### 2. get-photos.js

**Purpose:** Search for location photos from Unsplash and Pexels

**Endpoint:** `/.netlify/functions/get-photos`

**Method:** `GET`

**Query Parameters:**
- `query` (required) - Search query (e.g., "Alaska mountains")
- `count` (optional) - Number of photos (default: 3)

**Example Request:**
```javascript
const response = await fetch(`/.netlify/functions/get-photos?query=Alaska+mountains&count=5`);
const photos = await response.json();
```

**Success Response (200):**
```json
[
  {
    "url": "https://images.unsplash.com/photo-...",
    "thumbnail": "https://images.unsplash.com/photo-...?w=400",
    "photographer": "John Doe",
    "source": "Unsplash",
    "alt": "Alaska mountains landscape"
  },
  {
    "url": "https://images.pexels.com/photos/...",
    "thumbnail": "https://images.pexels.com/photos/...?w=400",
    "photographer": "Jane Smith",
    "source": "Pexels",
    "alt": "Snowy mountain peaks"
  }
]
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch photos",
  "details": "Error message"
}
```

**Environment Variables:**
- `UNSPLASH_ACCESS_KEY` - Unsplash API access key
- `PEXELS_API_KEY` - Pexels API key

**Rate Limits:**
- Unsplash: 50 requests/hour (free tier)
- Pexels: 200 requests/hour (free tier)

**Cost:** Free (within limits)

**Photo Sources:**
1. Tries Unsplash first (higher quality)
2. Falls back to Pexels if Unsplash fails
3. Returns combined results

---

### 3. get-ai-facts.js

**Purpose:** Generate geography facts using AI

**Endpoint:** `/.netlify/functions/get-ai-facts`

**Method:** `POST`

**Request Body:**
```json
{
  "location": "Anchorage, Alaska",
  "continent": "North America",
  "country": "United States"
}
```

**Example Request:**
```javascript
const response = await fetch('/.netlify/functions/get-ai-facts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'Anchorage, Alaska',
    continent: 'North America',
    country: 'United States'
  })
});
const facts = await response.json();
```

**Success Response (200):**
```json
{
  "facts": [
    "Anchorage is the largest city in Alaska with over 290,000 residents.",
    "The city sits at the base of the Chugach Mountains.",
    "Anchorage experiences over 18 hours of daylight in summer."
  ]
}
```

**AI Model:** OpenAI GPT-4o-mini

**Prompt Template:**
```
Generate 3 interesting, educational geography facts about [location].
Make them suitable for middle school students (ages 11-14).
Focus on: physical geography, climate, culture, or history.
Keep each fact to 1-2 sentences.
```

**Environment Variables:**
- `OPENAI_API_KEY` - OpenAI API key

**Rate Limits:**
- GPT-4o-mini: 10,000 requests/day
- Current usage: ~50 requests/day

**Cost:** ~$0.0003 per request (very low)

**Safety Filters:**
- Nuclear Safety System prevents inappropriate content
- All facts reviewed for age-appropriateness
- Geographic accuracy verified

---

### 4. generate-photo-caption.js

**Purpose:** Generate descriptive captions for photos using AI

**Endpoint:** `/.netlify/functions/generate-photo-caption`

**Method:** `POST`

**Request Body:**
```json
{
  "photoUrl": "https://images.unsplash.com/photo-...",
  "location": "Denali National Park"
}
```

**Example Request:**
```javascript
const response = await fetch('/.netlify/functions/generate-photo-caption', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    photoUrl: 'https://...',
    location: 'Denali National Park'
  })
});
const caption = await response.json();
```

**Success Response (200):**
```json
{
  "caption": "Majestic view of Denali (Mount McKinley), North America's tallest peak, rising above the Alaska Range."
}
```

**AI Model:** OpenAI GPT-4o-mini

**Prompt Template:**
```
Write a 1-sentence caption for this photo of [location].
Make it educational and engaging for middle school students.
Focus on geographic features visible in the image.
```

**Environment Variables:**
- `OPENAI_API_KEY` - OpenAI API key

**Cost:** ~$0.0003 per request

---

### 5. generate-real-life-geography.js

**Purpose:** Connect locations to real-world geography concepts

**Endpoint:** `/.netlify/functions/generate-real-life-geography`

**Method:** `POST`

**Request Body:**
```json
{
  "location": "Juneau, Alaska",
  "feature": "capital city",
  "context": "coastal rainforest"
}
```

**Success Response (200):**
```json
{
  "connection": "Juneau is unique as the only U.S. state capital inaccessible by road. The city's location in a temperate rainforest creates one of the wettest climates in North America, receiving over 60 inches of rain annually.",
  "concept": "Geographic isolation and climate zones"
}
```

**AI Model:** OpenAI GPT-4o-mini

**Purpose in App:**
- "Geography in Real Life" sidebar card
- Helps students understand how geography affects daily life
- Connects abstract concepts to concrete examples

**Environment Variables:**
- `OPENAI_API_KEY` - OpenAI API key

**Cost:** ~$0.0003 per request

---

### 6. match-photos-to-facts.js

**Purpose:** Validate if a photo matches a geography fact using Vision AI

**Endpoint:** `/.netlify/functions/match-photos-to-facts`

**Method:** `POST`

**Request Body:**
```json
{
  "photoUrl": "https://images.unsplash.com/photo-...",
  "fact": "This location has glaciers and mountains",
  "location": "Alaska"
}
```

**Success Response (200):**
```json
{
  "isMatch": true,
  "confidence": 0.92,
  "reasoning": "The photo shows snow-covered mountains and visible glaciers, which matches the fact about glaciers and mountains in Alaska."
}
```

**AI Model:** OpenAI GPT-4o with Vision

**Matching Algorithm:**
1. Analyzes photo using Vision API
2. Compares visual elements to fact description
3. Returns confidence score (0.0-1.0)
4. Provides reasoning for match/non-match

**Confidence Thresholds:**
- 0.8+ → Strong match ✅
- 0.6-0.8 → Moderate match ⚠️
- 0.6- → No match ❌

**Environment Variables:**
- `OPENAI_API_KEY` - OpenAI API key

**Rate Limits:**
- Vision API: More expensive than text
- Current usage: ~20 requests/day

**Cost:** ~$0.01 per request (higher due to Vision API)

**Safety:**
- Nuclear Safety System filters all photos
- Content moderation applied before AI analysis
- Inappropriate images rejected

---

### 7. match-photos-to-facts-v2.js

**Purpose:** Enhanced photo-fact matching with better accuracy

**Endpoint:** `/.netlify/functions/match-photos-to-facts-v2`

**Differences from v1:**
- More detailed prompt engineering
- Better handling of ambiguous cases
- Improved confidence scoring
- Additional context awareness

**Status:** Currently in testing, will replace v1 when validated

**All other specs same as `match-photos-to-facts.js`**

---

## 🔐 ENVIRONMENT VARIABLES

All functions require environment variables set in Netlify dashboard:

```bash
# Weather
OPENWEATHER_API_KEY=your_openweather_key

# Photos
UNSPLASH_ACCESS_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key

# AI Services
OPENAI_API_KEY=your_openai_key
```

**Setup Instructions:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add each key-value pair
3. Redeploy site for changes to take effect

---

## 📊 COST ANALYSIS

### Monthly API Costs (Estimated)

| Service | Free Tier | Current Usage | Estimated Cost |
|---------|-----------|---------------|----------------|
| OpenWeatherMap | 1M calls/month | 3,000 calls/month | $0 |
| Unsplash | 50/hour | 20/day | $0 |
| Pexels | 200/hour | 20/day | $0 |
| OpenAI GPT-4o-mini | $0.15/1M tokens | 50k tokens | $0.01 |
| OpenAI Vision | $5/1k images | 20 images | $0.10 |
| **Total** | - | - | **~$0.11/month** |

**Scaling Projections:**
- 100 students: ~$10/month
- 1,000 students: ~$100/month
- 10,000 students: ~$1,000/month

---

## 🐛 ERROR HANDLING

### Common Errors

**1. Missing API Key**
```json
{
  "error": "API key not configured",
  "function": "get-weather"
}
```
**Solution:** Set environment variable in Netlify

**2. Rate Limit Exceeded**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```
**Solution:** Wait or upgrade API tier

**3. API Service Down**
```json
{
  "error": "External API unavailable",
  "details": "Upstream service timeout"
}
```
**Solution:** Retry with exponential backoff

### Debugging Functions

**View Logs:**
1. Go to Netlify Dashboard → Functions
2. Click on function name
3. View "Function logs" tab

**Test Locally:**
```bash
netlify dev
```

**Test in Production:**
```bash
curl https://your-site.netlify.app/.netlify/functions/get-weather?lat=61&lon=-149
```

---

## 🔄 DEPLOYMENT

Functions deploy automatically when you push to `main` branch.

**Manual Deployment:**
```bash
git add netlify/functions/
git commit -m "Update functions"
git push origin main
```

**Netlify builds and deploys in ~2 minutes**

---

## 📝 ADDING NEW FUNCTIONS

1. Create new file in `/netlify/functions/`
2. Use this template:

```javascript
exports.handler = async (event, context) => {
  try {
    // Function logic here
    return {
      statusCode: 200,
      body: JSON.stringify({ data: 'response' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error message',
        details: error.message 
      })
    };
  }
};
```

3. Add environment variables to Netlify
4. Test locally with `netlify dev`
5. Deploy and test in production

---

## 🔗 RELATED DOCUMENTATION

- [NETLIFY_SETUP_CHECKLIST.md](./NETLIFY_SETUP_CHECKLIST.md) - Initial setup
- [NETLIFY_FUNCTIONS_FIX.md](./NETLIFY_FUNCTIONS_FIX.md) - Debugging guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment process

---

**Last Updated:** October 20, 2025  
**Maintained By:** TheAccidentalTeacher  
**Questions?** Check Netlify function logs first, then review error handling section above.
