# AI Integration Plan for Geographic Detective Academy

**Status:** 📋 Planning Phase - Games must be completed first  
**Created:** October 15, 2025  
**Last Updated:** October 15, 2025

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [API Inventory](#api-inventory)
3. [Environment Management](#environment-management)
4. [Cost Optimization Strategy](#cost-optimization-strategy)
5. [Safety Rails & Content Filtering](#safety-rails--content-filtering)
6. [Testing Strategy](#testing-strategy)
7. [Game Readiness Checklist](#game-readiness-checklist)
8. [Implementation Phases](#implementation-phases)
9. [Architecture Decisions](#architecture-decisions)
10. [Future Considerations](#future-considerations)

---

## Executive Summary

### Current State
- ✅ 14 API keys acquired and organized
- ✅ Secure environment management configured
- ✅ Coordinate Finder feature complete and deployed
- ⏳ Other game modes need completion before AI integration
- 📋 Educational priorities TBD (will emerge from game usage patterns)

### Next Steps
1. **Complete all game modes first** (Mystery Challenge, Scavenger Hunt, Guess Mode, etc.)
2. Establish comprehensive testing framework
3. Implement strict safety rails for all AI interactions
4. Use mini/micro models to minimize costs
5. Monitor and iterate based on classroom usage

### Key Principles
- **Safety First:** Extreme content filtering for middle school students
- **Cost Conscious:** Use smallest effective models (mini/micro tier)
- **Education Focused:** AI enhances learning, doesn't replace teaching
- **Test Thoroughly:** Robust testing before classroom deployment

---

## API Inventory

### AI & Machine Learning APIs (4)

#### OpenAI API
- **Purpose:** Natural language processing, text generation, embeddings
- **Models Available:**
  - `gpt-4o-mini` - **PRIMARY CHOICE** for most tasks (cost-effective, fast)
  - `gpt-4o` - Reserve for complex reasoning only
  - `text-embedding-3-small` - For semantic search/similarity
  - `gpt-3.5-turbo` - Fallback option
- **Use Cases:**
  - Location descriptions
  - Educational hints
  - Natural language coordinate parsing
  - Content generation for scavenger hunts
- **Cost Considerations:**
  - Mini models: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
  - Classroom of 30 students: Estimate $5-10/day with caching
- **Rate Limits:** 10,000 RPM (Tier 2), adequate for classroom

#### Anthropic API (Claude)
- **Purpose:** Alternative LLM with strong reasoning, longer context
- **Models Available:**
  - `claude-3-5-haiku-20241022` - **PRIMARY CHOICE** (fastest, cheapest)
  - `claude-3-5-sonnet-20241022` - Reserve for complex tasks
  - `claude-3-opus-20240229` - High-end reasoning (rarely needed)
- **Use Cases:**
  - Complex educational content generation
  - Multi-step reasoning for advanced challenges
  - Backup when OpenAI unavailable
- **Cost Considerations:**
  - Haiku: ~$0.80 per 1M input tokens, ~$4.00 per 1M output tokens
  - More expensive than GPT mini, use selectively
- **Rate Limits:** 50 requests/minute (standard tier)

#### Stability AI API
- **Purpose:** Image generation (Stable Diffusion models)
- **Models Available:**
  - `stable-diffusion-xl-1024-v1-0` - High quality 1024x1024
  - `stable-diffusion-v1-6` - Faster, lower cost
  - `stable-diffusion-3-5-large` - Latest model
- **Use Cases:**
  - Generate location-based imagery for challenges
  - Create custom map markers/icons
  - Educational visual content
- **Cost Considerations:**
  - ~$0.004 per image (SDXL)
  - Very affordable for occasional use
- **Rate Limits:** TBD based on plan tier

#### Replicate API
- **Purpose:** Host and run various AI models
- **Models Available:**
  - Access to 1000+ community models
  - Custom model hosting
  - Specialized geographic/mapping models
- **Use Cases:**
  - Specialized tasks not covered by main APIs
  - Experimental features
  - Custom fine-tuned models
- **Cost Considerations:**
  - Pay-per-second billing
  - Varies by model
  - Generally cost-effective for specialized tasks
- **Rate Limits:** Varies by model

### Media & Content APIs (10)

#### Giphy API
- **Purpose:** GIF search and animation
- **Use Cases:**
  - Celebration animations
  - Fun Mode enhancements
  - Engaging visual feedback
- **Rate Limits:** 42 requests/hour (free tier), upgrade available

#### News API
- **Purpose:** Current events and news articles
- **Use Cases:**
  - Real-time news tied to locations
  - Current events scavenger hunts
  - Educational context for regions
- **Rate Limits:** 100 requests/day (free tier), upgrade available

#### OpenClipart
- **Purpose:** Free clipart and vector graphics
- **Use Cases:**
  - Educational icons
  - Map decorations
  - Printable materials
- **Rate Limits:** No official limits (free service)

#### Pexels API
- **Purpose:** Free stock photos (high quality)
- **Use Cases:**
  - Location imagery
  - Guess Mode challenges
  - Background images
- **Rate Limits:** 200 requests/hour (free tier)

#### Pixabay API
- **Purpose:** Free images and videos
- **Use Cases:**
  - Location imagery
  - Educational content
  - Challenge backgrounds
- **Rate Limits:** 100 requests/minute (5000/hour)

#### Reddit API
- **Purpose:** Social media content and discussions
- **Use Cases:**
  - Location-based community insights
  - Real experiences from travelers
  - Cultural context (with heavy filtering)
- **Rate Limits:** 60 requests/minute
- **⚠️ SAFETY NOTE:** Requires extreme filtering for school environment

#### SerpAPI
- **Purpose:** Search engine results (Google, Bing, etc.)
- **Use Cases:**
  - Location information gathering
  - Educational content discovery
  - Fact verification
- **Rate Limits:** 100 searches/month (free tier), upgrade available

#### Unsplash API
- **Purpose:** High-quality professional photos
- **Use Cases:**
  - Location imagery
  - Guess Mode challenges
  - Inspiration for scavenger hunts
- **Rate Limits:** 50 requests/hour (demo tier), 5000/hour (production)

#### YouTube API
- **Purpose:** Video content discovery
- **Use Cases:**
  - Educational videos about locations
  - Virtual tours
  - Geography documentaries
- **Rate Limits:** 10,000 units/day (quota system)

---

## Environment Management

### Local Development (.env file)
**Location:** `C:\Users\scoso\WEBSITES\Mrsomersmaps\.env`  
**Status:** ✅ Created (local only, not in git)

```env
# All 14 API keys stored here
# Used for testing on localhost:8000
# Protected by .gitignore
```

**Security:**
- ✅ `.gitignore` prevents git commits
- ✅ `.env.example` provides template for team members
- ✅ Keys never exposed in browser JavaScript

### Production (Netlify Environment Variables)
**Location:** Netlify Dashboard → Site Settings → Environment Variables  
**Status:** ⏳ To be configured when ready for AI deployment

**Configuration Steps:**
1. Log into Netlify dashboard
2. Navigate to: Site settings → Environment variables
3. Add each key as a separate variable:
   - `GIPHY_API_KEY`
   - `NEWS_API_KEY`
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - (all 14 keys)
4. Save and trigger new deployment

**Security:**
- ✅ Keys stored server-side only
- ✅ Not accessible from client JavaScript
- ✅ Requires backend proxy for API calls

### Key Differences: Testing vs Production

| Aspect | Local Development | Production (Netlify) |
|--------|------------------|---------------------|
| **Key Storage** | `.env` file | Netlify Environment Variables |
| **Access Method** | Direct file read (backend) | Netlify Functions/Edge Functions |
| **Security** | Protected by .gitignore | Encrypted server-side storage |
| **Rate Limits** | Shared across all testing | Production limits |
| **Caching** | Optional (testing only) | **REQUIRED** to reduce costs |
| **Error Handling** | Verbose (see all errors) | User-friendly (hide API details) |
| **Content Filtering** | Relaxed (teacher testing) | **STRICT** (student safety) |
| **Cost Tracking** | Not critical | **MONITOR CLOSELY** |

---

## Cost Optimization Strategy

### Primary Cost-Saving Measures

#### 1. Use Mini/Micro Models
**Target Models:**
- OpenAI: `gpt-4o-mini` (primary)
- Anthropic: `claude-3-5-haiku-20241022` (backup)

**Cost Comparison (per 1M tokens):**
```
GPT-4o:           $2.50 input / $10.00 output  (❌ TOO EXPENSIVE)
GPT-4o-mini:      $0.15 input / $0.60 output   (✅ PRIMARY CHOICE)
Claude 3.5 Haiku: $0.80 input / $4.00 output   (✅ BACKUP)
```

**Estimated Classroom Cost:**
- 30 students
- 20 AI requests per student per day
- Average 100 tokens input, 200 tokens output
- **Daily Cost:** ~$5-8 with mini models vs ~$100+ with full models

#### 2. Aggressive Response Caching
**Strategy:**
- Cache AI responses in browser localStorage
- Cache by location + game mode + difficulty
- TTL: 7 days for static content, 1 day for dynamic

**Example:**
```javascript
// Cache key: "ai_hint_mystery_[lat]_[lon]_stage1"
// Reuse across all students at same location
// 30 students = 1 API call instead of 30
```

**Estimated Savings:** 60-80% reduction in API calls

#### 3. Smart Request Batching
**Strategy:**
- Batch multiple requests into single API call
- Generate multiple hints at once
- Pre-generate content during off-peak hours

**Example:**
```javascript
// Instead of 5 separate calls:
generateHint(stage1)
generateHint(stage2)
generateHint(stage3)
generateHint(stage4)
generateHint(stage5)

// Make 1 batched call:
generateAllHints([stage1, stage2, stage3, stage4, stage5])
```

**Estimated Savings:** 40-60% reduction in API overhead

#### 4. Fallback to Static Content
**Strategy:**
- Pre-written educational content as fallback
- AI enhances but doesn't replace
- Graceful degradation if API unavailable or budget exceeded

**Example:**
```javascript
try {
  return await getAIHint(location);
} catch (error) {
  return getStaticHint(location); // Pre-written backup
}
```

#### 5. Rate Limiting Per Student
**Strategy:**
- Max 20 AI requests per student per day
- Show "AI hints used: 15/20" counter
- Encourage strategic use

**Educational Benefit:** Students learn to think critically before asking for AI help

### Monthly Budget Estimate

**Conservative Scenario:**
- 30 students × 20 school days
- 15 AI requests per student per day
- 50% cache hit rate
- Mini models only

**Calculation:**
```
30 students × 20 days × 15 requests × 0.5 (cache) = 4,500 API calls/month
Average: 100 input tokens + 200 output tokens per call
Input:  4,500 × 100 / 1M = 0.45M tokens  × $0.15 = $0.07
Output: 4,500 × 200 / 1M = 0.90M tokens  × $0.60 = $0.54
Total: ~$0.61/month
```

**Aggressive Scenario (no caching):**
```
30 × 20 × 15 = 9,000 API calls/month
Input:  0.90M tokens × $0.15 = $0.14
Output: 1.80M tokens × $0.60 = $1.08
Total: ~$1.22/month
```

**Worst Case (heavy usage, full models accidentally):**
```
Using GPT-4o instead of mini: ~$20-30/month
```

**Conclusion:** With proper optimization, AI costs should be under $2/month for entire classroom.

---

## Safety Rails & Content Filtering

### Critical Requirements for Middle School Environment

#### 1. System Prompt Guardrails
**Every AI request MUST include:**
```javascript
const SYSTEM_PROMPT = `You are an educational assistant for middle school geography students (ages 11-14).

STRICT RULES:
- Educational content ONLY
- Age-appropriate language (middle school level)
- No political opinions or controversial topics
- No current events unless historically significant
- No violence, weapons, or conflict
- No romantic or adult content
- No religious discussions
- No financial advice
- No medical information
- Positive and encouraging tone
- Focus on geography, culture, and education

If a request violates these rules, respond: "Let's keep our focus on geography! Ask me something about locations, cultures, or maps."`;
```

#### 2. Input Sanitization
**Before sending to AI:**
```javascript
function sanitizeInput(userInput) {
  // Remove URLs
  userInput = userInput.replace(/https?:\/\/[^\s]+/g, '');
  
  // Remove profanity (use library like 'bad-words')
  userInput = profanityFilter.clean(userInput);
  
  // Length limit (prevent prompt injection)
  if (userInput.length > 500) {
    userInput = userInput.substring(0, 500);
  }
  
  // Block suspicious patterns
  const blockedPatterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /jailbreak/i,
    /roleplay/i
  ];
  
  for (const pattern of blockedPatterns) {
    if (pattern.test(userInput)) {
      throw new Error('Invalid input detected');
    }
  }
  
  return userInput;
}
```

#### 3. Output Filtering
**After receiving AI response:**
```javascript
function validateAIResponse(response) {
  // Check for inappropriate content
  const inappropriatePatterns = [
    /\b(kill|weapon|war|fight|hate)\b/i,
    // Add comprehensive list
  ];
  
  // Block URLs in responses
  if (/https?:\/\//i.test(response)) {
    return "I can only provide educational information without external links.";
  }
  
  // Sentiment analysis (reject negative sentiment)
  if (getSentiment(response) < -0.5) {
    return "Let me try to give you a more positive learning experience!";
  }
  
  return response;
}
```

#### 4. Reddit API Special Handling
**⚠️ EXTREME CAUTION REQUIRED:**
```javascript
function filterRedditContent(post) {
  // NSFW check
  if (post.over_18 === true) return null;
  
  // Subreddit whitelist ONLY
  const approvedSubreddits = [
    'geography',
    'mapporn',
    'earthporn',
    'educationalgifs',
    'todayilearned'
  ];
  
  if (!approvedSubreddits.includes(post.subreddit.toLowerCase())) {
    return null;
  }
  
  // Content moderation score
  if (post.score < 100) return null; // Only highly upvoted
  
  // Remove all comments (too risky)
  // Only use titles and curated posts
  
  return {
    title: profanityFilter.clean(post.title),
    score: post.score,
    subreddit: post.subreddit
  };
}
```

#### 5. Teacher Override & Monitoring
**Dashboard Features:**
- View all AI interactions in real-time
- Flag inappropriate responses for review
- Disable AI for specific students if needed
- Export conversation logs for parent/admin review

**Implementation:**
```javascript
// Log every AI interaction
function logAIInteraction(studentId, input, output, gameMode) {
  const log = {
    timestamp: new Date().toISOString(),
    studentId: anonymizeId(studentId),
    gameMode: gameMode,
    input: input,
    output: output,
    flagged: false
  };
  
  // Send to teacher dashboard
  saveToDatabase(log);
  
  // Auto-flag if contains sensitive keywords
  if (containsSensitiveContent(output)) {
    log.flagged = true;
    alertTeacher(log);
  }
}
```

#### 6. Emergency Cutoff
**Budget/Safety Circuit Breaker:**
```javascript
const AI_CONFIG = {
  maxCostPerDay: 5.00, // dollars
  maxRequestsPerStudent: 20,
  maxRequestsPerClass: 600,
  emergencyDisable: false
};

async function makeAIRequest(request) {
  // Check emergency disable
  if (AI_CONFIG.emergencyDisable) {
    return getFallbackContent(request);
  }
  
  // Check daily budget
  const todaySpend = await getTodaySpend();
  if (todaySpend >= AI_CONFIG.maxCostPerDay) {
    console.warn('Daily budget exceeded, using fallback');
    return getFallbackContent(request);
  }
  
  // Check rate limits
  // ... proceed with request
}
```

---

## Testing Strategy

### Three-Tier Testing Approach

#### Tier 1: Unit Testing (Individual AI Functions)
**Goal:** Test each AI integration in isolation

**Test Cases:**
```javascript
describe('AI Hint Generation', () => {
  test('generates appropriate hint for Stage 1', async () => {
    const hint = await generateHint({ lat: 64.8, lon: -147.7, stage: 1 });
    expect(hint).toContain('Alaska');
    expect(hint.length).toBeLessThan(200);
    expect(hint).not.toMatch(/inappropriate|content|/i);
  });
  
  test('respects mini model usage', async () => {
    const spy = jest.spyOn(openai, 'createCompletion');
    await generateHint({ lat: 0, lon: 0, stage: 1 });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-4o-mini' })
    );
  });
  
  test('handles API errors gracefully', async () => {
    mockAPIError();
    const hint = await generateHint({ lat: 0, lon: 0, stage: 1 });
    expect(hint).toContain('Try thinking about'); // Fallback content
  });
});
```

#### Tier 2: Integration Testing (Game Mode Scenarios)
**Goal:** Test AI within actual game flows

**Test Scenarios:**
```javascript
describe('Mystery Challenge with AI', () => {
  test('provides progressive hints throughout game', async () => {
    const game = new MysteryChallenge({ aiEnabled: true });
    await game.start();
    
    // Test each stage
    for (let stage = 1; stage <= 5; stage++) {
      const hint = await game.requestHint(stage);
      expect(hint).toBeTruthy();
      expect(hint.appropriateness).toBe('safe');
      expect(hint.costInCents).toBeLessThan(0.5);
    }
  });
  
  test('caching works across game sessions', async () => {
    const location = { lat: 64.8, lon: -147.7 };
    
    // First request
    const hint1 = await generateHint(location);
    expect(cacheStats.misses).toBe(1);
    
    // Second request (should hit cache)
    const hint2 = await generateHint(location);
    expect(cacheStats.hits).toBe(1);
    expect(hint2).toBe(hint1);
  });
});
```

#### Tier 3: Classroom Simulation Testing
**Goal:** Simulate real classroom usage at scale

**Simulation:**
```javascript
describe('Classroom Simulation (30 students)', () => {
  test('handles concurrent AI requests', async () => {
    const students = Array(30).fill().map((_, i) => `student-${i}`);
    const startTime = Date.now();
    
    // All students request hints simultaneously
    const promises = students.map(studentId => 
      makeAIRequest({ studentId, type: 'hint', location: randomLocation() })
    );
    
    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    // Assertions
    expect(results.length).toBe(30);
    expect(results.every(r => r.success)).toBe(true);
    expect(duration).toBeLessThan(5000); // Complete within 5 seconds
    expect(totalCost(results)).toBeLessThan(0.50); // Under 50 cents
  });
  
  test('respects per-student rate limits', async () => {
    const studentId = 'test-student';
    
    // Make 20 requests (at limit)
    for (let i = 0; i < 20; i++) {
      const result = await makeAIRequest({ studentId, type: 'hint' });
      expect(result.success).toBe(true);
    }
    
    // 21st request should be blocked
    const result = await makeAIRequest({ studentId, type: 'hint' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('rate limit');
  });
});
```

### Manual Testing Checklist

#### Pre-Deployment Testing (Teacher's Checklist)
- [ ] Test all game modes with AI enabled
- [ ] Verify inappropriate content is blocked
- [ ] Check caching is working (duplicate requests return instantly)
- [ ] Confirm fallback content works when API unavailable
- [ ] Test with slow internet connection
- [ ] Verify rate limits are enforced
- [ ] Check cost tracking is accurate
- [ ] Test teacher dashboard monitoring
- [ ] Verify emergency cutoff works
- [ ] Test with various Alaska locations
- [ ] Test edge cases (North Pole, International Date Line, etc.)

#### Student Testing (Before Full Class Rollout)
- [ ] 3-5 volunteer students test for 1 week
- [ ] Monitor all AI interactions
- [ ] Collect student feedback
- [ ] Check for any inappropriate responses
- [ ] Verify educational value
- [ ] Measure engagement vs non-AI mode
- [ ] Track costs during test period
- [ ] Identify any bugs or issues
- [ ] Adjust hints based on difficulty feedback

---

## Game Readiness Checklist

### Current Status: Games Need Completion First

Before AI integration, ensure all game modes are feature-complete and tested:

#### ✅ Coordinate Finder
- [x] UI skeleton with draggable panel
- [x] Coordinate validation (Decimal/Cardinal formats)
- [x] Progressive reveal system (60s journey)
- [x] Fun Mode toggle
- [x] Gen Alpha celebration messages
- [x] Smart skip system
- [x] Deployed to production
- [x] Comprehensive documentation

#### ⏳ Mystery Challenge
**Status:** Needs completion before AI

**Required Features:**
- [ ] Core game loop functional
- [ ] 5-round progression system
- [ ] Target coordinate display
- [ ] Mouse-over coordinate tracking
- [ ] Distance calculation and feedback
- [ ] Scoring system
- [ ] Round completion detection
- [ ] Home distance tracking
- [ ] Timer system
- [ ] High score persistence

**AI Enhancement Points (future):**
- AI-generated progressive hints (Stage 1: hemisphere, Stage 2: continent, etc.)
- Difficulty adjustment based on performance
- Educational facts about target location
- Personalized encouragement messages

#### ⏳ Scavenger Hunt
**Status:** Needs completion before AI

**Required Features:**
- [ ] Challenge list interface
- [ ] Location verification system
- [ ] Photo upload capability (optional)
- [ ] Progress tracking
- [ ] Completion rewards
- [ ] Difficulty levels
- [ ] Category organization
- [ ] Shareable results

**AI Enhancement Points (future):**
- AI-generated custom challenges
- Location-specific clues
- Educational descriptions for each location
- Adaptive difficulty
- Custom scavenger hunts by theme

#### ⏳ Guess Mode
**Status:** Needs completion before AI

**Required Features:**
- [ ] Random location selection
- [ ] Image display (from Pexels/Unsplash)
- [ ] Click-to-guess interface
- [ ] Distance scoring
- [ ] Multiple rounds
- [ ] Difficulty progression
- [ ] Timer (optional)
- [ ] Leaderboard

**AI Enhancement Points (future):**
- AI image analysis for relevant photos
- Generated location descriptions
- Hint system based on distance
- Educational facts reveal
- Custom difficulty tuning

#### ⏳ Free Explore Mode
**Status:** Needs completion before AI

**Required Features:**
- [ ] Clean map interface
- [ ] Location search
- [ ] Place markers
- [ ] Basic location info
- [ ] Measurement tools
- [ ] Layer toggles
- [ ] Bookmark system

**AI Enhancement Points (future):**
- AI-generated location descriptions
- Interesting facts on click
- Related locations suggestions
- Educational content layers
- Natural language search ("show me cities near glaciers")

### Priority Order for Game Completion
1. **Mystery Challenge** - Core educational game, most important
2. **Guess Mode** - High engagement, visual learning
3. **Scavenger Hunt** - Long-term engagement, real-world connection
4. **Free Explore** - Foundation for other features

**Recommendation:** Complete games in priority order, then return to this AI integration plan.

---

## Implementation Phases

### Phase 0: Game Completion (CURRENT PHASE)
**Timeline:** TBD  
**Status:** 🔄 In Progress

**Goals:**
- Complete Mystery Challenge
- Complete Guess Mode
- Complete Scavenger Hunt
- Complete Free Explore mode
- Comprehensive testing of all base features
- Documentation for each game mode

**Dependencies:**
- None (prerequisites for AI integration)

---

### Phase 1: Foundation & Testing Framework
**Timeline:** 1-2 weeks after games complete  
**Status:** ⏳ Waiting for Phase 0

**Goals:**
- Set up backend proxy (Netlify Functions)
- Implement caching system
- Create testing framework
- Establish safety rails
- Configure Netlify environment variables

**Tasks:**
- [ ] Create `/netlify/functions/ai-proxy.js` endpoint
- [ ] Implement localStorage caching with TTL
- [ ] Set up Jest testing environment
- [ ] Create system prompt templates
- [ ] Add input/output sanitization
- [ ] Configure environment variables in Netlify
- [ ] Test API connectivity

**Success Criteria:**
- ✅ Backend can securely call AI APIs
- ✅ Caching reduces requests by 60%+
- ✅ All safety tests pass
- ✅ Cost tracking functional

---

### Phase 2: Single Game AI Integration (Mystery Challenge)
**Timeline:** 1 week  
**Status:** ⏳ Waiting for Phase 1

**Goals:**
- Integrate AI hints into Mystery Challenge
- Test with mini models only
- Validate safety rails
- Measure cost impact

**Tasks:**
- [ ] Add "Get AI Hint" button to Mystery Challenge
- [ ] Implement progressive hint generation (5 stages)
- [ ] Add hint usage counter (20/day limit)
- [ ] Implement caching by location
- [ ] Add fallback static hints
- [ ] Teacher monitoring dashboard

**Success Criteria:**
- ✅ Hints are educational and appropriate
- ✅ Cost under $0.50/day for 30 students
- ✅ Cache hit rate > 50%
- ✅ No inappropriate content in 1-week test

---

### Phase 3: Student Testing & Iteration
**Timeline:** 2 weeks  
**Status:** ⏳ Waiting for Phase 2

**Goals:**
- 3-5 volunteer students test AI features
- Collect feedback and usage data
- Iterate based on results
- Validate educational value

**Tasks:**
- [ ] Recruit volunteer student testers
- [ ] Monitor all AI interactions
- [ ] Collect student feedback survey
- [ ] Analyze hint effectiveness
- [ ] Adjust difficulty based on data
- [ ] Refine prompts for better educational content
- [ ] Review cost data

**Success Criteria:**
- ✅ Students find hints helpful (feedback survey)
- ✅ No inappropriate content flagged
- ✅ Cost projections accurate
- ✅ Teacher approval to proceed

---

### Phase 4: Expand to All Games
**Timeline:** 2-3 weeks  
**Status:** ⏳ Waiting for Phase 3

**Goals:**
- Add AI features to remaining games
- Maintain consistent safety/cost standards
- Comprehensive testing

**Tasks:**
- [ ] Scavenger Hunt: AI-generated custom challenges
- [ ] Guess Mode: AI location descriptions
- [ ] Free Explore: AI facts on demand
- [ ] Coordinate Finder: Natural language parsing
- [ ] Unified caching across all games
- [ ] Teacher dashboard for all AI interactions

**Success Criteria:**
- ✅ All games have AI features
- ✅ Cost remains under budget
- ✅ Consistent safety standards
- ✅ Student engagement increases

---

### Phase 5: Full Classroom Rollout
**Timeline:** Ongoing  
**Status:** ⏳ Waiting for Phase 4

**Goals:**
- Deploy to entire classroom
- Monitor and optimize
- Collect long-term data
- Iterate based on usage

**Tasks:**
- [ ] Full class launch
- [ ] Daily monitoring for first 2 weeks
- [ ] Weekly cost reviews
- [ ] Monthly feature iterations
- [ ] Student satisfaction surveys
- [ ] Educational outcome measurement

**Success Criteria:**
- ✅ All students successfully using AI features
- ✅ No safety incidents
- ✅ Cost sustainable long-term
- ✅ Measurable learning improvements

---

## Architecture Decisions

### Backend Proxy Pattern (Netlify Functions)

**Why Needed:**
- API keys cannot be exposed in client-side JavaScript
- Need centralized rate limiting and caching
- Cost tracking and monitoring
- Safety filtering at server level

**Architecture:**
```
Student Browser
    ↓
    │ HTTPS request with location data
    ↓
Netlify Function (/api/ai-hint)
    ↓
    ├─→ Check cache (return if hit)
    ├─→ Validate input (sanitize)
    ├─→ Check rate limits
    ├─→ Check daily budget
    ↓
OpenAI/Anthropic API (with system prompt)
    ↓
Netlify Function
    ├─→ Filter output
    ├─→ Log interaction
    ├─→ Cache response
    ├─→ Update cost tracking
    ↓
Student Browser (receives safe, filtered response)
```

**Example Netlify Function:**
```javascript
// /netlify/functions/ai-hint.js
const OpenAI = require('openai');
const { validateInput, filterOutput, checkCache, saveCache } = require('./utils');

exports.handler = async (event, context) => {
  try {
    // Parse request
    const { location, stage, gameMode, studentId } = JSON.parse(event.body);
    
    // Check cache first
    const cacheKey = `hint_${location.lat}_${location.lon}_${stage}`;
    const cached = await checkCache(cacheKey);
    if (cached) {
      return {
        statusCode: 200,
        body: JSON.stringify({ hint: cached, cached: true })
      };
    }
    
    // Validate input
    validateInput({ location, stage, gameMode });
    
    // Check rate limits
    const allowed = await checkRateLimit(studentId);
    if (!allowed) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'Daily hint limit reached' })
      };
    }
    
    // Make AI request
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // ALWAYS use mini
      messages: [
        { role: 'system', content: SAFETY_SYSTEM_PROMPT },
        { role: 'user', content: `Generate a Stage ${stage} hint for location ${location.lat}, ${location.lon}` }
      ],
      max_tokens: 150,
      temperature: 0.7
    });
    
    const hint = completion.choices[0].message.content;
    
    // Filter output
    const safeHint = filterOutput(hint);
    
    // Cache for future
    await saveCache(cacheKey, safeHint, 7 * 24 * 60 * 60); // 7 days
    
    // Log interaction
    await logInteraction({ studentId, location, stage, hint: safeHint });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ hint: safeHint, cached: false })
    };
    
  } catch (error) {
    console.error('AI Hint Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ hint: getFallbackHint(stage) })
    };
  }
};
```

### Caching Strategy

**Three-Level Cache:**

1. **Browser Cache (localStorage)** - 7 days
   - Fastest, no network request
   - Per-device only
   - Good for repeated personal use

2. **Server Cache (Netlify/Redis)** - 30 days
   - Shared across all students
   - Reduces API costs significantly
   - Invalidate on demand

3. **Static Fallbacks** - Permanent
   - Pre-written educational content
   - Zero cost
   - Always available

**Cache Key Pattern:**
```javascript
const cacheKey = `ai_${gameMode}_${roundToDecimal(lat, 1)}_${roundToDecimal(lon, 1)}_${stage}_${difficulty}`;
// Example: "ai_mystery_64.8_-147.7_stage1_medium"
```

**Cache Invalidation:**
- Automatic after TTL expires
- Manual via teacher dashboard
- Version-based (increment version to bust all caches)

---

## Future Considerations

### Educational Priorities (TBD)

**Questions to Answer After Game Completion:**
- Which game modes do students prefer?
- Where do students struggle most? (AI can help here)
- What types of hints are most effective?
- How does AI impact learning outcomes?
- What's the balance between AI help and independent thinking?

**Data Collection:**
- Track which hints students request most
- Measure success rates with/without AI hints
- Survey student preferences
- Compare test scores to AI usage
- Teacher observations

### Advanced AI Features (Future Phases)

#### Natural Language Coordinate Search
**Example:** "Show me cities near Mount Denali"
- Parse natural language with GPT
- Convert to coordinate searches
- Educational and intuitive

#### Adaptive Difficulty
**Example:** AI adjusts challenge difficulty based on performance
- Too easy? AI suggests harder locations
- Struggling? AI provides more hints
- Personalized learning paths

#### AI-Generated Custom Scavenger Hunts
**Example:** "Create a scavenger hunt about Alaska's wildlife"
- Teacher inputs theme
- AI generates 10 custom challenges
- Includes educational facts
- Can be saved and shared

#### Image Analysis (Guess Mode)
**Example:** Use Stability AI or Replicate for image understanding
- Analyze student's clicked location
- Provide educational feedback
- "You clicked in the desert biome, but this photo shows tundra"

#### Collaborative Learning
**Example:** AI moderates student discussions
- Students share their location findings
- AI facilitates learning conversations
- Keeps discussions on-topic and appropriate

### Media API Integration Ideas

**Pexels/Unsplash + AI:**
- Fetch location photo → AI generates educational caption
- "This is Denali National Park. Did you know..."

**YouTube + AI:**
- Find educational videos about location
- AI creates summary/study guide
- Link to teacher-approved content

**News API + AI:**
- Current events related to locations
- AI filters for age-appropriateness
- Connects geography to real world

**Giphy + AI:**
- AI determines appropriate celebration GIF
- Tied to location culture
- Enhanced Fun Mode

### Monitoring & Analytics

**Teacher Dashboard (Future):**
- Real-time AI usage tracking
- Cost breakdown by game mode
- Student engagement metrics
- Hint effectiveness analysis
- Safety incident reports
- Export data for parent/admin review

**Student Progress Tracking:**
- AI hint usage patterns
- Success rates by location type
- Time spent per game mode
- Learning trajectory
- Personalized recommendations

---

## Appendix: Quick Reference

### API Key Locations

| Environment | Storage Location | Access Method |
|------------|------------------|---------------|
| **Local Dev** | `.env` file (not in git) | Node.js `process.env` |
| **Production** | Netlify Environment Variables | Netlify Functions |

### Model Selection Guide

| Use Case | Primary Model | Backup Model | Cost/1M tokens |
|----------|--------------|--------------|----------------|
| **Hints** | GPT-4o-mini | Claude Haiku | $0.15-0.80 input |
| **Descriptions** | GPT-4o-mini | Claude Haiku | $0.15-0.80 input |
| **Complex reasoning** | Claude Haiku | GPT-4o-mini | $0.80 input |
| **Image generation** | Stable Diffusion v1.6 | SDXL | $0.004/image |

### Rate Limits Summary

| API | Free Tier | Paid Tier | Classroom Adequate? |
|-----|-----------|-----------|---------------------|
| OpenAI | 200 RPM | 10,000 RPM | ✅ Yes (paid) |
| Anthropic | 50 RPM | 1,000 RPM | ✅ Yes |
| Giphy | 42/hour | Unlimited | ⚠️ Upgrade needed |
| Pexels | 200/hour | 20,000/hour | ✅ Yes |
| Unsplash | 50/hour | 5,000/hour | ⚠️ May need upgrade |

### Cost Estimates

| Scenario | Daily Cost | Monthly Cost |
|----------|-----------|--------------|
| **Conservative** (high caching) | $0.20 | $4.00 |
| **Typical** (50% cache hit) | $0.50 | $10.00 |
| **Heavy** (low caching) | $1.00 | $20.00 |
| **Worst Case** (wrong models) | $5.00+ | $100.00+ |

### Key Contacts & Resources

- **OpenAI Platform:** https://platform.openai.com/
- **Anthropic Console:** https://console.anthropic.com/
- **Netlify Dashboard:** https://app.netlify.com/
- **Repository:** https://github.com/TheAccidentalTeacher/maps
- **Production Site:** [Your Netlify URL]

---

## Document Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-15 | 1.0 | Initial AI integration planning document created |

---

## Next Steps Summary

1. ✅ **API keys acquired and secured**
2. ✅ **Environment management configured**
3. ✅ **Safety requirements defined**
4. ✅ **Cost optimization strategy planned**
5. ⏳ **Complete remaining game modes** (Mystery Challenge, Scavenger Hunt, Guess Mode, Free Explore)
6. ⏳ **Return to this document when games are ready**
7. ⏳ **Begin Phase 1: Foundation & Testing Framework**
8. ⏳ **Test AI with mini models in controlled environment**
9. ⏳ **Iterate based on student feedback**
10. ⏳ **Full classroom rollout**

**Status:** Ready to continue game development. AI integration plan documented and waiting for game completion.

---

*This document is a living plan and will be updated as we learn from implementation and classroom usage.*
