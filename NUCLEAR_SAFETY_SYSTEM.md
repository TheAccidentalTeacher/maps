# 🛡️ NUCLEAR SAFETY SYSTEM + PERPLEXITY VERIFICATION

## Overview

This is a **3-layer defense system** for generating 100% safe, accurate educational content for middle school students (ages 11-14):

1. **Layer 1: Nuclear Claude Prompts** - Ultra-strict AI instructions
2. **Layer 2: Post-Generation Filter** - Scans for forbidden keywords
3. **Layer 3: Perplexity Verification** - Fact-checks for accuracy (optional)

---

## 🎯 Goals

1. **ZERO inappropriate content** - No alcohol, drugs, politics, violence, adult content
2. **100% accurate information** - Verified facts using real-time web search
3. **Parent/teacher approved** - Content suitable for commercial educational product
4. **Cost-effective** - ~$0.012 per location (affordable for paid subscriptions)

---

## 🚫 Forbidden Content (Zero Tolerance)

### CATEGORY 1: Drugs & Substances
- ❌ Alcohol: beer, wine, liquor, brewery, brewpub, winery, distillery, pub, tavern, bar
- ❌ Marijuana: cannabis, weed, hemp, CBD, THC, dispensary, pot, ganja
- ❌ Tobacco: cigarettes, vaping, e-cigarettes, smoking
- ❌ Any recreational drugs or substances

### CATEGORY 2: Adult Content & Entertainment
- ❌ Strip clubs, adult entertainment, nightlife, red light district
- ❌ Prostitution, sex work, brothels
- ❌ Casinos, gambling, betting, lotteries
- ❌ Dating, relationships, romance (except historical context)

### CATEGORY 3: Violence & Conflict
- ❌ Weapons, guns, firearms, ammunition
- ❌ Wars, battles, military conflicts (unless purely historical dates/treaties)
- ❌ Terrorism, extremism, hate groups
- ❌ Crime, gangs, violence

### CATEGORY 4: Sensitive Topics
- ❌ Self-harm, suicide, depression
- ❌ Bullying, harassment
- ❌ Politics: Democrats, Republicans, elections, political parties
- ❌ Hot-button issues: abortion, LGBTQ+ controversies, immigration debates
- ❌ Religious conflicts

### CATEGORY 5: Inappropriate Language
- ❌ Profanity, curse words, slang
- ❌ Suggestive content or innuendo
- ❌ Stereotypes or prejudice

---

## ✅ Safe Topics (G-Rated Educational Content)

- 🌍 **Geography**: Mountains, rivers, climate, elevation, natural features
- 🦁 **Nature & Wildlife**: Animals, plants, ecosystems, conservation
- 🏛️ **History**: Non-violent historical facts, explorations, discoveries
- 🎨 **Culture**: Food, traditional clothing, festivals (family-friendly), languages, art
- 🔬 **Science & Tech**: Discoveries, inventions, technology, innovations
- 🏗️ **Architecture**: Buildings, landmarks, structures, engineering marvels
- 🎉 **Fun Trivia**: World records, unique features, comparisons
- 🎮 **Gaming**: Minecraft/Roblox/Fortnite comparisons (when relevant)

---

## 🏗️ System Architecture

### LAYER 1: Nuclear Claude Prompts

**Location**: `local-dev-server.js` lines 465-550

**What it does**:
- Provides ultra-strict instructions to Claude 3.5 Sonnet
- Lists 50+ forbidden keywords in 5 categories
- Includes location-specific overrides (Colorado → mountains NOT marijuana)
- Mandatory safety checklist before generating each fact
- Falls back to GPT-4o-mini if Claude unavailable

**Example Override**:
```
Colorado → Focus on Rocky Mountains, skiing, natural beauty, Mesa Verde
❌ NEVER mention: marijuana, cannabis, dispensaries, 420, weed
```

### LAYER 2: Post-Generation Filter

**Location**: `local-dev-server.js` lines 720-795

**What it does**:
- Scans each generated fact for 50+ forbidden keywords
- Rejects any fact containing inappropriate content
- Replaces rejected facts with safe fallbacks
- Logs rejected facts for monitoring

**Forbidden Keywords List** (50+ terms):
```javascript
const forbiddenKeywords = [
    'alcohol', 'beer', 'wine', 'brewery', 'marijuana', 'cannabis',
    'casino', 'gambling', 'gun', 'weapon', 'war', 'democrat',
    'republican', 'abortion', 'sex', 'drugs', ...
];
```

**Safe Fallback Facts**:
```javascript
["🌍 Located at X° North latitude!",
 "🏗️ Part of [country] with rich geographic features!",
 "🦁 Local ecosystem supports diverse wildlife!",
 "🎨 Cultural traditions developed over centuries!",
 "🔬 Geographic features provide research opportunities!"]
```

### LAYER 3: Perplexity Verification (Optional)

**Location**: `local-dev-server.js` lines 797-850

**What it does**:
- Uses Perplexity AI's real-time web search to verify facts
- Checks accuracy of generated content
- Provides citations from trusted sources
- Only runs when `ENABLE_PERPLEXITY_VERIFICATION=true`

**Cost**: ~$0.01 per location (adds to base $0.002 Claude cost)

**API Call**:
```javascript
POST https://api.perplexity.ai/chat/completions
{
  model: 'sonar',  // Cheaper model for verification
  messages: [
    {role: 'system', content: 'Fact-checker for educational content'},
    {role: 'user', content: 'Verify these 5 facts about [location]...'}
  ],
  temperature: 0.2  // Low temperature for factual accuracy
}
```

---

## 💰 Cost Analysis

### Base Cost (Nuclear Claude Only)
- **Claude 3.5 Sonnet**: ~$0.002 per location
- **Monthly for 30 students**: ~$1.20/month
- **Yearly**: ~$14.40/year
- **Post-generation filter**: FREE (runs locally)

### With Perplexity Verification (Optional)
- **Claude**: $0.002 per location
- **Perplexity Sonar**: $0.01 per location
- **Total**: ~$0.012 per location
- **Monthly for 30 students**: ~$7.20/month
- **Yearly**: ~$86.40/year

### Cost Comparison
| System | Per Location | Monthly (30 students) | Yearly |
|--------|-------------|----------------------|--------|
| Nuclear Claude Only | $0.002 | $1.20 | $14.40 |
| Nuclear + Perplexity | $0.012 | $7.20 | $86.40 |

**Recommendation**: Start with Nuclear Claude only (FREE-ish!), enable Perplexity verification later if needed.

---

## 🔧 Setup Instructions

### 1. API Keys Required

Add to `.env` file:

```bash
# Required: Claude for fact generation
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional: Perplexity for verification
PERPLEXITY_API_KEY=pplx-...

# Optional: Enable verification (default: disabled)
ENABLE_PERPLEXITY_VERIFICATION=false
```

### 2. Enable Perplexity Verification (Optional)

To enable fact-checking with Perplexity:

```bash
# In .env file
ENABLE_PERPLEXITY_VERIFICATION=true
```

**When to enable**:
- ✅ For high-stakes facts (medical, scientific claims)
- ✅ For controversial locations (to ensure balanced content)
- ✅ For commercial product launch (maximum accuracy)
- ❌ During development/testing (save money!)
- ❌ For common locations (Claude is already accurate)

### 3. Test the System

```bash
# Start the dev server
node local-dev-server.js

# Test health endpoint
http://localhost:8888/health

# Test facts generation (Colorado - known for marijuana)
http://localhost:8888/.netlify/functions/get-ai-facts?location=Colorado&country=USA
```

**Expected Response**:
```json
{
  "facts": [
    "🌍 Colorado has 58 mountain peaks above 14,000 feet - called 'fourteeners'!",
    "🏗️ Mesa Verde cliff dwellings are 700+ years old!",
    "🦁 Rocky Mountain bighorn sheep can climb slopes you'd need ropes for!",
    "⛷️ Colorado gets 300 days of sunshine per year - perfect for skiing!",
    "🎨 Denver is exactly 1 mile high (5,280 feet) above sea level!"
  ],
  "source": "claude-3.5-sonnet",
  "safety": {
    "rejected": 0,
    "filtered": false
  },
  "verification": null  // null if disabled
}
```

---

## 🧪 Testing Checklist

### Test Location-Specific Overrides

Test these known "problematic" locations to verify safety system:

```bash
# Colorado (marijuana)
http://localhost:8888/.netlify/functions/get-ai-facts?location=Colorado&country=USA
❌ Should NOT mention: marijuana, cannabis, dispensaries, 420

# Amsterdam (drugs + red light district)
http://localhost:8888/.netlify/functions/get-ai-facts?location=Amsterdam&country=Netherlands
❌ Should NOT mention: drugs, red light district, coffee shops (drug context)

# Las Vegas (gambling + nightlife)
http://localhost:8888/.netlify/functions/get-ai-facts?location=Las%20Vegas&country=USA
❌ Should NOT mention: casinos, gambling, nightlife, betting

# Jamaica (marijuana)
http://localhost:8888/.netlify/functions/get-ai-facts?location=Jamaica&country=Jamaica
❌ Should NOT mention: marijuana, ganja, cannabis

# New Orleans (alcohol + partying)
http://localhost:8888/.netlify/functions/get-ai-facts?location=New%20Orleans&country=USA
❌ Should NOT mention: Mardi Gras parties, alcohol, bars
```

### Test Post-Generation Filter

If Claude somehow generates inappropriate content, Layer 2 should catch it:

1. **Monitor console logs** for `🚫 REJECTED FACT` messages
2. **Check response** - rejected facts replaced with safe fallbacks
3. **Look for `safety.rejected` count** in API response

### Test Perplexity Verification

Enable verification and check accuracy:

```bash
# 1. Enable in .env
ENABLE_PERPLEXITY_VERIFICATION=true

# 2. Restart server
node local-dev-server.js

# 3. Generate facts
http://localhost:8888/.netlify/functions/get-ai-facts?location=Paris&country=France

# 4. Check response for verification data
{
  "verification": {
    "assessment": "Fact 1 is accurate. Fact 2 is mostly accurate...",
    "citations": ["https://...", "https://..."],
    "model": "sonar"
  }
}
```

---

## 📊 Monitoring & Logging

### Console Output Examples

**Successful Generation**:
```
🧠 Trying Claude 3.5 Sonnet...
✅ Claude 3.5 Sonnet generated 5 facts
🛡️ Running post-generation safety filter...
✅ All facts passed safety checks
ℹ️ Perplexity verification disabled
```

**Rejected Content**:
```
🧠 Trying Claude 3.5 Sonnet...
✅ Claude 3.5 Sonnet generated 5 facts
🛡️ Running post-generation safety filter...
🚫 REJECTED FACT: Contains forbidden keyword: "brewery"
   Content: "🍺 Colorado is home to the Great American Beer Festival..."
⚠️ 1 facts rejected. Need 1 replacements.
✅ Replaced with safe fallback facts
```

**With Verification**:
```
🧠 Trying Claude 3.5 Sonnet...
✅ Claude 3.5 Sonnet generated 5 facts
🛡️ Running post-generation safety filter...
✅ All facts passed safety checks
🔍 Verifying facts with Perplexity AI...
✅ Perplexity verification complete
📚 Citations: 4
```

---

## 🚀 Deployment

### Environment Variables (Netlify)

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
PERPLEXITY_API_KEY=pplx-...  # Optional
ENABLE_PERPLEXITY_VERIFICATION=false  # Start disabled
```

### Cost Optimization Tips

1. **Start with verification disabled** - Save money during testing
2. **Enable for specific locations** - Only verify controversial topics
3. **Monitor rejected fact rate** - If high, improve prompts instead
4. **Use caching** - Store verified facts in localStorage (already implemented!)
5. **Batch verification** - Verify multiple locations at once (future feature)

---

## 📈 Future Enhancements

### Game Integration (In Progress)
- [ ] 50% of facts connect to Minecraft/Roblox/Fortnite
- [ ] Fair use research for commercial product
- [ ] Game-specific comparison templates

### 5 Themes of Geography (Planned)
- [ ] Tag each fact with one of 5 themes
- [ ] Location, Place, Human-Environment Interaction, Movement, Region
- [ ] Display theme badges in UI

### Advanced Verification (Future)
- [ ] Selective verification (only controversial topics)
- [ ] Batch verification to reduce API calls
- [ ] Citation display in UI
- [ ] Fact accuracy scoring

---

## ⚠️ Known Issues

### Issue 1: Beer Festival Appearing (FIXED)
**Problem**: Colorado facts mentioned "Great American Beer Festival"  
**Solution**: Added post-generation filter that catches "beer", "festival", "brewery"

### Issue 2: Cost of Full Verification
**Problem**: Verifying every fact = 5x cost increase  
**Solution**: Make verification optional, default to disabled

### Issue 3: False Positives
**Problem**: Filter might reject "Winchester" (contains "wine")  
**Solution**: Use word boundary matching in future version

---

## 📝 Change Log

### 2025-01-XX - Nuclear Safety System v1.0
- ✅ Added nuclear-level Claude prompts (50+ forbidden keywords)
- ✅ Added post-generation safety filter
- ✅ Added Perplexity API integration for verification
- ✅ Added location-specific overrides (Colorado, Amsterdam, Vegas, etc.)
- ✅ Added safe fallback facts system
- ✅ Added comprehensive logging and monitoring
- ✅ Updated health check endpoint

### Previous Versions
- 2025-01-XX - ULTRA-STRICT safety guardrails (insufficient)
- 2025-01-XX - Basic AI fact generation

---

## 🤝 Contributing

If you find inappropriate content getting through:

1. **Document the issue** - Screenshot the fact + location
2. **Check console logs** - Was it rejected but replaced with fallback?
3. **Add keyword to filter** - Update `forbiddenKeywords` array
4. **Test the fix** - Regenerate facts for that location
5. **Submit a report** - Help improve the system!

---

## 📞 Support

Questions? Issues?

- Check console logs first (`🛡️`, `🚫`, `✅` emojis)
- Test health endpoint: `http://localhost:8888/health`
- Review this documentation
- Check cost analysis if verification seems expensive

---

## 🎓 Educational Philosophy

This system is built on the principle that **middle school students deserve**:

1. **Safe content** - No exposure to drugs, alcohol, violence, or politics
2. **Accurate information** - Verified facts they can trust
3. **Engaging learning** - Fun facts that make them say "That's cool!"
4. **Respectful treatment** - No stereotypes or inappropriate content

**Our promise**: Every fact generated by this system should be something a parent or teacher would be proud to share with their 11-14 year old student.

---

**Status**: 🟢 **ACTIVE & TESTED**  
**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Cost**: ~$0.002-$0.012 per location  
**Safety Rating**: ⭐⭐⭐⭐⭐ NUCLEAR-LEVEL
