# Phase 3 Implementation Checklist
## Location Explorer Sidebar - Photos, Weather & AI Facts

### ✅ Setup Complete
- [x] Create netlify/functions directory
- [x] Create get-photos.js function (Unsplash/Pexels)
- [x] Create get-weather.js function (OpenWeatherMap)
- [x] Create get-ai-facts.js function (OpenAI GPT-4o-mini)
- [x] Create netlify.toml configuration
- [x] Create package.json with dependencies
- [x] Add OPENWEATHER_API_KEY placeholder to .env

### 🔄 In Progress - Your Action Required

#### 1. Get OpenWeatherMap API Key (5 minutes)
- [ ] Go to https://openweathermap.org/api
- [ ] Click "Get API Key" → Sign up (FREE)
- [ ] Copy your API key
- [ ] Open `.env` file
- [ ] Replace `your_openweathermap_api_key_here` with your actual key
- [ ] Save `.env` file

**Note:** Free tier includes:
- 60 calls per minute
- 1,000,000 calls per month
- More than enough for classroom use!

#### 2. Install Dependencies (2 minutes)
```powershell
cd C:\Users\scoso\WEBSITES\Mrsomersmaps
npm install
```

This installs:
- `node-fetch@^2.6.7` - Required for API calls in functions
- `netlify-cli@^17.0.0` - Local development server

#### 3. Test Netlify Functions Locally (5 minutes)
```powershell
npm run dev
```

Then in browser, test these URLs:
- http://localhost:8888/api/get-photos?location=Paris&query=eiffel+tower
- http://localhost:8888/api/get-weather?lat=48.8566&lon=2.3522
- http://localhost:8888/api/get-ai-facts?location=Paris&country=France

You should see JSON responses! ✨

### ⏳ Next - Frontend Integration (I'll help with this!)

#### 4. Add JavaScript Function Callers
Add these functions to `index.html` (in global scope):

```javascript
// Fetch photos from Netlify Function
async function fetchLocationPhotos(location, query) {
  try {
    const params = new URLSearchParams({ location, query });
    const response = await fetch(`/api/get-photos?${params}`);
    if (!response.ok) throw new Error('Failed to fetch photos');
    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Photo fetch error:', error);
    return [];
  }
}

// Fetch weather from Netlify Function
async function fetchLocationWeather(lat, lon) {
  try {
    const params = new URLSearchParams({ lat, lon });
    const response = await fetch(`/api/get-weather?${params}`);
    if (!response.ok) throw new Error('Failed to fetch weather');
    const data = await response.json();
    return data.weather || null;
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

// Fetch AI facts from Netlify Function
async function fetchLocationFacts(location, country) {
  try {
    const params = new URLSearchParams({ location, country });
    const response = await fetch(`/api/get-ai-facts?${params}`);
    if (!response.ok) throw new Error('Failed to fetch facts');
    const data = await response.json();
    return data.facts || [];
  } catch (error) {
    console.error('Facts fetch error:', error);
    return [];
  }
}
```

#### 5. Update populateLocationData() Function
Add these calls after existing code:

```javascript
// In populateLocationData(lat, lng) - after populateNearbyPlaces()

// Card 4: AI Facts
const facts = await fetchLocationFacts(
  geocodeData.display_name, 
  countryData.name
);
populateAIFacts(facts);

// Card 5: Photos
const photoQuery = geocodeData.city || geocodeData.country || 'landscape';
const photos = await fetchLocationPhotos(
  geocodeData.display_name, 
  photoQuery
);
populatePhotos(photos);

// Card 6: Weather
const weather = await fetchLocationWeather(lat, lng);
populateWeather(weather);
```

#### 6. Implement Card Population Functions
Create these new functions:

```javascript
function populateAIFacts(facts) {
  const card = document.getElementById('card-ai-facts');
  const content = card.querySelector('.card-content');
  
  if (!facts || facts.length === 0) {
    content.innerHTML = '<p class="no-data">🤔 No facts available</p>';
    return;
  }
  
  const html = `
    <ul class="fact-list">
      ${facts.map(fact => `<li class="fact-item">✨ ${fact}</li>`).join('')}
    </ul>
  `;
  content.innerHTML = html;
}

function populatePhotos(photos) {
  const card = document.getElementById('card-photo');
  const content = card.querySelector('.card-content');
  
  if (!photos || photos.length === 0) {
    content.innerHTML = '<p class="no-data">📷 No photos available</p>';
    return;
  }
  
  const html = `
    <div class="photo-grid">
      ${photos.slice(0, 4).map(photo => `
        <div class="photo-item">
          <img src="${photo.thumbnail}" alt="${photo.description || 'Location photo'}" />
          <div class="photo-credit">
            📸 ${photo.photographer}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  content.innerHTML = html;
}

function populateWeather(weather) {
  const card = document.getElementById('card-weather');
  const content = card.querySelector('.card-content');
  
  if (!weather) {
    content.innerHTML = '<p class="no-data">☁️ Weather unavailable</p>';
    return;
  }
  
  const html = `
    <div class="weather-display">
      <div class="weather-main">
        <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" 
             alt="${weather.description}" 
             class="weather-icon" />
        <div class="weather-temp">
          ${Math.round(weather.temp.fahrenheit)}°F
          <span class="temp-secondary">(${Math.round(weather.temp.celsius)}°C)</span>
        </div>
        <div class="weather-desc">${weather.description}</div>
      </div>
      <div class="weather-details">
        <div class="weather-detail">💨 Wind: ${weather.wind.speed} mph ${weather.wind.direction}</div>
        <div class="weather-detail">💧 Humidity: ${weather.humidity}%</div>
        <div class="weather-detail">👁️ Visibility: ${weather.visibility} mi</div>
      </div>
    </div>
  `;
  content.innerHTML = html;
}
```

#### 7. Add CSS Styling
Add to existing `.location-sidebar` styles:

```css
/* AI Facts styling */
.fact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.fact-item {
  padding: 10px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  line-height: 1.5;
}

/* Photo grid styling */
.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.photo-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.photo-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.photo-credit {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
  background: rgba(0, 0, 0, 0.7);
  font-size: 10px;
  color: white;
}

/* Weather display styling */
.weather-display {
  text-align: center;
}

.weather-main {
  margin-bottom: 15px;
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.weather-temp {
  font-size: 32px;
  font-weight: bold;
  margin: 10px 0;
}

.temp-secondary {
  font-size: 18px;
  color: #888;
  margin-left: 10px;
}

.weather-desc {
  text-transform: capitalize;
  font-size: 16px;
  margin-bottom: 15px;
}

.weather-details {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
}

.weather-detail {
  padding: 5px 0;
  font-size: 14px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
}
```

### 📋 Status Tracking

**Working Now (4/8 cards):**
- ✅ Card 1: Location Header
- ✅ Card 2: Quick Facts
- ✅ Card 3: Comparison to Home
- ✅ Card 7: Nearby Places

**After Phase 3 (7/8 cards):**
- ✅ Card 4: AI Facts (GPT-4o-mini)
- ✅ Card 5: Photos (Unsplash/Pexels)
- ✅ Card 6: Weather (OpenWeatherMap)

**Future Phase 4:**
- ⏳ Card 8: Challenges

### 🚀 Deployment Steps (After Local Testing)

1. **Link to Netlify:**
   ```powershell
   netlify init
   ```

2. **Add Environment Variables in Netlify Dashboard:**
   - Go to https://app.netlify.com
   - Select your site
   - Settings → Environment Variables
   - Add all keys from `.env`:
     * UNSPLASH_ACCESS_KEY
     * PEXELS_API_KEY
     * OPENAI_API_KEY
     * OPENWEATHER_API_KEY

3. **Deploy:**
   ```powershell
   git add -A
   git commit -m "feat: Add Netlify Functions for Location Explorer (Phase 3)"
   git push
   ```

   Netlify auto-deploys! 🎉

### 💰 Cost Tracking

**Per Location (first visit):**
- Weather API: FREE (1M calls/month)
- Photos API: FREE (Unsplash 50 req/hr, Pexels 200 req/hr)
- AI Facts: ~$0.0002 (GPT-4o-mini, 5 facts)

**Total:** ~$0.002 per location

**With Caching (Phase 8):**
- 80% savings on repeat visits
- Monthly cost for 30-student classroom: ~$3.60

**No surprises, fully predictable!** ✅

### ⚠️ Important Notes

1. **Don't commit .env to Git!**
   - Already in .gitignore ✅
   - Keep API keys SECRET

2. **Test locally BEFORE deploying**
   - Run `npm run dev`
   - Test all 3 endpoints
   - Check for errors in console

3. **Production uses Netlify environment variables**
   - Dev reads from `.env`
   - Production reads from Netlify dashboard

4. **Free tiers are generous**
   - OpenWeatherMap: 1M calls/month
   - Unsplash: 50 requests/hour (1,200/day)
   - Pexels: 200 requests/hour (4,800/day)
   - Should handle 30+ students easily!

### 🆘 Need Help?

If you run into issues:
1. Check NETLIFY_FUNCTIONS_SETUP.md for troubleshooting
2. Run `netlify dev` to test locally
3. Check browser console for errors
4. Verify .env has all keys set

**I'm here to help implement the frontend code! Just let me know when you're ready.** 🚀
