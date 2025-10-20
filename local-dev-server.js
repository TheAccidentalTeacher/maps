/**
 * Local Development Server for Testing Location Explorer
 * 
 * This server lets you test all API features locally with your real API keys
 * before deploying to Netlify.
 * 
 * Usage: node local-dev-server.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 8888;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from current directory
app.use(express.static('.'));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// NETLIFY FUNCTION PROXIES (for local testing)
// ==========================================

// Get Photos Function with AI-POWERED SMART SEARCH! 🚀
app.get('/.netlify/functions/get-photos', async (req, res) => {
    console.log('📸 Photos request:', req.query);
    
    try {
        const { location, country, query } = req.query;
        
        if (!location) {
            return res.status(400).json({ error: 'Location parameter required' });
        }
        
        const fetch = (await import('node-fetch')).default;
        let searchQueries = [];
        
        // 🧠 STEP 1: Generate smart search queries using AI (if available)
        const claudeKey = process.env.ANTHROPIC_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (claudeKey || openaiKey) {
            console.log('🧠 Generating smart photo search queries with AI...');
            
            const aiPrompt = `You are a geography education expert helping find the BEST photos for students learning about ${location}${country ? ' in ' + country : ''}.

Generate 4 SPECIFIC search queries that will find educational, interesting photos showing:
1. Famous landmark or iconic building
2. Natural landscape or geography feature
3. Cultural scene or daily life
4. Wildlife or nature (if relevant)

Requirements:
- Be VERY specific (include landmark names, not just city names)
- Use descriptive terms (architecture, landscape, traditional, etc.)
- Avoid generic terms that return random results
- Each query should be 3-6 words
- Return ONLY a JSON array of 4 strings

Example for "Timbuktu, Mali":
["Djinguereber Mosque Timbuktu architecture", "Sankore University ancient manuscripts Timbuktu", "Sahara desert dunes Mali sunset", "Niger River Mali traditional boats"]

Now generate queries for: ${location}${country ? ', ' + country : ''}`;

            try {
                let queries = [];
                
                // Try Claude first (faster, better for this task)
                if (claudeKey) {
                    const response = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'x-api-key': claudeKey,
                            'anthropic-version': '2023-06-01',
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'claude-3-5-sonnet-20241022',
                            max_tokens: 200,
                            temperature: 0.5,
                            messages: [{ role: 'user', content: aiPrompt }]
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const text = data.content[0].text.trim();
                        queries = JSON.parse(text);
                        console.log('✅ Claude generated queries:', queries);
                    }
                }
                
                // Fallback to OpenAI
                if (!queries.length && openaiKey) {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${openaiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o-mini',
                            messages: [{ role: 'user', content: aiPrompt }],
                            max_tokens: 200,
                            temperature: 0.5
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const text = data.choices[0].message.content.trim();
                        queries = JSON.parse(text);
                        console.log('✅ GPT generated queries:', queries);
                    }
                }
                
                if (queries.length) {
                    searchQueries = queries;
                }
            } catch (aiError) {
                console.warn('⚠️ AI query generation failed:', aiError.message);
            }
        }
        
        // 🔄 FALLBACK: Use basic queries if AI fails
        if (!searchQueries.length) {
            console.log('📝 Using fallback search queries');
            searchQueries = [
                `${location} landmark architecture`,
                `${location} landscape nature`,
                `${location} ${country || ''} culture`,
                `${location} scenic view`
            ];
        }
        
        // 📸 STEP 2: Search for photos using our smart queries
        const allPhotos = [];
        
        // 1️⃣ Try Unsplash first (highest quality!)
        if (process.env.UNSPLASH_ACCESS_KEY && allPhotos.length < 4) {
            console.log('📷 Trying Unsplash...');
            for (const searchQuery of searchQueries) {
                if (allPhotos.length >= 4) break;
                try {
                    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`;
                    
                    const response = await fetch(unsplashUrl, {
                        headers: {
                            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.results.length > 0) {
                            const photo = data.results[0];
                            allPhotos.push({
                                id: photo.id,
                                url: photo.urls.regular,
                                thumbnail: photo.urls.small,
                                photographer: photo.user.name,
                                photographerUrl: photo.user.links.html,
                                description: photo.description || photo.alt_description || searchQuery,
                                searchQuery: searchQuery,
                                source: 'Unsplash',
                                isAIGenerated: false
                            });
                        }
                    }
                } catch (err) {
                    console.warn(`⚠️ Unsplash query failed: ${searchQuery}`, err.message);
                }
            }
        }
        
        // 2️⃣ Try Wikimedia Commons (BEST for education!)
        if (allPhotos.length < 4) {
            console.log('📚 Trying Wikimedia Commons...');
            for (const searchQuery of searchQueries.slice(allPhotos.length)) {
                if (allPhotos.length >= 4) break;
                try {
                    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srnamespace=6&format=json&origin=*&srlimit=1`;
                    
                    const response = await fetch(wikiUrl);
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.query && data.query.search.length > 0) {
                            const result = data.query.search[0];
                            const title = result.title;
                            
                            // Get file details
                            const fileUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|user&iiurlwidth=800&format=json&origin=*`;
                            const fileResponse = await fetch(fileUrl);
                            const fileData = await fileResponse.json();
                            
                            const pages = fileData.query.pages;
                            const page = pages[Object.keys(pages)[0]];
                            
                            if (page.imageinfo && page.imageinfo[0]) {
                                const info = page.imageinfo[0];
                                allPhotos.push({
                                    id: `wikimedia-${page.pageid}`,
                                    url: info.url,
                                    thumbnail: info.thumburl || info.url,
                                    photographer: info.user || 'Wikimedia Commons',
                                    photographerUrl: `https://commons.wikimedia.org/wiki/User:${info.user}`,
                                    description: title.replace('File:', '').replace(/\.(jpg|png|jpeg|gif)/gi, ''),
                                    searchQuery: searchQuery,
                                    source: 'Wikimedia Commons',
                                    isAIGenerated: false
                                });
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`⚠️ Wikimedia query failed: ${searchQuery}`, err.message);
                }
            }
        }
        
        // 3️⃣ Try Pixabay (you have the key!)
        if (process.env.PIXABAY_API_KEY && allPhotos.length < 4) {
            console.log('🎨 Trying Pixabay...');
            for (const searchQuery of searchQueries.slice(allPhotos.length)) {
                if (allPhotos.length >= 4) break;
                try {
                    const pixabayUrl = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=1&safesearch=true&editors_choice=true`;
                    
                    const response = await fetch(pixabayUrl);
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.hits && data.hits.length > 0) {
                            const hit = data.hits[0];
                            allPhotos.push({
                                id: `pixabay-${hit.id}`,
                                url: hit.largeImageURL,
                                thumbnail: hit.webformatURL,
                                photographer: hit.user || 'Pixabay User',
                                photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
                                description: hit.tags,
                                searchQuery: searchQuery,
                                source: 'Pixabay',
                                isAIGenerated: false
                            });
                        }
                    }
                } catch (err) {
                    console.warn(`⚠️ Pixabay query failed: ${searchQuery}`, err.message);
                }
            }
        }
        
        // 4️⃣ Try Pexels (fallback)
        if (process.env.PEXELS_API_KEY && allPhotos.length < 4) {
            console.log('📸 Trying Pexels...');
            for (const searchQuery of searchQueries.slice(allPhotos.length)) {
                if (allPhotos.length >= 4) break;
                try {
                    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`;
                    
                    const response = await fetch(pexelsUrl, {
                        headers: {
                            'Authorization': process.env.PEXELS_API_KEY
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.photos.length > 0) {
                            const photo = data.photos[0];
                            allPhotos.push({
                                id: photo.id,
                                url: photo.src.large,
                                thumbnail: photo.src.medium,
                                photographer: photo.photographer,
                                photographerUrl: photo.photographer_url,
                                description: searchQuery,
                                searchQuery: searchQuery,
                                source: 'Pexels',
                                isAIGenerated: false
                            });
                        }
                    }
                } catch (err) {
                    console.warn(`⚠️ Pexels query failed: ${searchQuery}`, err.message);
                }
            }
        }
        
        // 5️⃣ AI Generation Fallback (when we still need more photos)
        if (allPhotos.length < 4 && (process.env.REPLICATE_API_TOKEN || process.env.STABILITY_AI_API_KEY)) {
            console.log(`🤖 Generating ${4 - allPhotos.length} AI images to fill gaps...`);
            const aiPhotosNeeded = 4 - allPhotos.length;
            
            for (let i = 0; i < aiPhotosNeeded; i++) {
                const searchQuery = searchQueries[allPhotos.length] || `${location} ${country}`;
                
                // Try Replicate first (cheaper, faster)
                if (process.env.REPLICATE_API_TOKEN) {
                    try {
                        const enhancedPrompt = `Educational photograph of ${searchQuery} in ${location}, ${country}. Photorealistic, National Geographic style, high quality, well-lit, clear details. Geographic features and cultural elements visible. Appropriate for middle school students.`;
                        
                        const negativePrompt = `cartoon, anime, illustration, drawing, text, watermark, signature, violence, inappropriate, low quality, blurry, distorted`;
                        
                        const response = await fetch('https://api.replicate.com/v1/predictions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                version: '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637', // Flux Schnell
                                input: {
                                    prompt: enhancedPrompt,
                                    num_outputs: 1,
                                    aspect_ratio: '16:9',
                                    output_format: 'jpg',
                                    output_quality: 90
                                }
                            })
                        });
                        
                        if (response.ok) {
                            const prediction = await response.json();
                            
                            // Poll for result (Flux Schnell is fast - 2-3 seconds)
                            let result = prediction;
                            let attempts = 0;
                            while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 20) {
                                await new Promise(resolve => setTimeout(resolve, 500));
                                const pollResponse = await fetch(
                                    `https://api.replicate.com/v1/predictions/${prediction.id}`,
                                    {
                                        headers: {
                                            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
                                        }
                                    }
                                );
                                result = await pollResponse.json();
                                attempts++;
                            }
                            
                            if (result.status === 'succeeded' && result.output && result.output[0]) {
                                allPhotos.push({
                                    id: `ai-${Date.now()}-${i}`,
                                    url: result.output[0],
                                    thumbnail: result.output[0],
                                    photographer: '🤖 AI Generated',
                                    photographerUrl: null,
                                    description: searchQuery,
                                    searchQuery: searchQuery,
                                    source: 'Replicate (Flux Schnell)',
                                    isAIGenerated: true,
                                    aiModel: 'black-forest-labs/flux-schnell',
                                    aiPrompt: enhancedPrompt,
                                    generatedAt: new Date().toISOString()
                                });
                                console.log(`✅ AI image generated for: ${searchQuery}`);
                            }
                        }
                    } catch (err) {
                        console.warn(`⚠️ Replicate generation failed: ${searchQuery}`, err.message);
                    }
                }
            }
        }
        
        const realCount = allPhotos.filter(p => !p.isAIGenerated).length;
        const aiCount = allPhotos.filter(p => p.isAIGenerated).length;
        console.log(`✅ Returning ${allPhotos.length} photos (${realCount} real, ${aiCount} AI-generated)`);
        res.json({ photos: allPhotos.slice(0, 4) });
        
    } catch (error) {
        console.error('❌ Photos error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Weather Function
app.get('/.netlify/functions/get-weather', async (req, res) => {
    console.log('🌤️ Weather request:', req.query);
    
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude required' });
        }
        
        if (!process.env.OPENWEATHER_API_KEY) {
            console.log('⚠️ No OpenWeatherMap API key configured');
            return res.json({ weather: null });
        }
        
        const fetch = (await import('node-fetch')).default;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`OpenWeatherMap API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const weather = {
            temp: {
                celsius: Math.round(data.main.temp),
                fahrenheit: Math.round((data.main.temp * 9/5) + 32)
            },
            humidity: data.main.humidity,
            wind: {
                speed: data.wind.speed,
                speedMph: Math.round(data.wind.speed * 2.237)
            },
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset
        };
        
        console.log('✅ Weather data retrieved:', weather.temp.fahrenheit + '°F');
        res.json({ weather });
        
    } catch (error) {
        console.error('❌ Weather error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get AI Facts Function (UPGRADED: Claude 3.5 Sonnet with safety guardrails!)
app.get('/.netlify/functions/get-ai-facts', async (req, res) => {
    console.log('🤖 AI Facts request:', req.query);
    
    try {
        const { location, country } = req.query;
        
        if (!location) {
            return res.status(400).json({ error: 'Location parameter required' });
        }
        
        const claudeKey = process.env.ANTHROPIC_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!claudeKey && !openaiKey) {
            console.log('⚠️ No AI API keys configured');
            return res.json({ facts: [] });
        }
        
        const fetch = (await import('node-fetch')).default;
        
        // ═══════════════════════════════════════════════════════════════
        // NUCLEAR-LEVEL SAFETY SYSTEM + PERPLEXITY VERIFICATION
        // ═══════════════════════════════════════════════════════════════
        // Strategy: Claude generates with STRICT filters, Perplexity verifies accuracy
        // Cost: ~$0.002 (Claude) + ~$0.01 (Perplexity verification) = ~$0.012 per location
        // ═══════════════════════════════════════════════════════════════
        
        const systemPrompt = `You are an enthusiastic middle school geography teacher creating fun, educational facts for 6th-8th grade students (Gen Alpha, ages 11-14).

🚫 NUCLEAR-LEVEL FORBIDDEN TOPICS (ABSOLUTELY ZERO TOLERANCE):

CATEGORY 1: DRUGS & SUBSTANCES
❌ alcohol, beer, wine, liquor, brewery, brewpub, winery, distillery, pub, tavern, bar
❌ marijuana, cannabis, weed, hemp, CBD, THC, dispensary, pot
❌ tobacco, cigarettes, vaping, e-cigarettes, smoking
❌ Any recreational drugs or substances

CATEGORY 2: ADULT CONTENT & ENTERTAINMENT
❌ strip clubs, adult entertainment, nightlife, red light district
❌ prostitution, sex work, brothels
❌ casinos, gambling, betting, lotteries, gaming halls
❌ dating, relationships, romance (except historical royal marriages for context)

CATEGORY 3: VIOLENCE & CONFLICT
❌ weapons, guns, firearms, ammunition
❌ wars, battles, military conflicts (unless purely historical dates/treaties)
❌ terrorism, extremism, hate groups
❌ crime, gangs, violence

CATEGORY 4: SENSITIVE TOPICS
❌ self-harm, suicide, depression
❌ bullying, harassment (online or offline)
❌ politics: Democrats, Republicans, elections, political parties, controversial leaders
❌ hot-button issues: abortion, LGBTQ+ controversies (identity is OK, controversy is NOT)
❌ immigration debates or controversies
❌ religious conflicts or controversies

CATEGORY 5: INAPPROPRIATE LANGUAGE & CONTENT
❌ profanity, curse words, slang
❌ suggestive content or innuendo
❌ stereotypes or prejudice

✅ SAFE TOPICS ONLY (G-RATED EDUCATIONAL CONTENT):
- 🌍 Geography: mountains, rivers, climate, locations, natural features, elevation
- 🦁 Nature & Wildlife: animals, plants, ecosystems, weather patterns, conservation
- 🏛️ History: historical facts (non-violent), dates, explorations, discoveries
- 🎨 Culture: food, traditional clothing, festivals (family-friendly only), languages, art
- 🔬 Science & Tech: discoveries, inventions, technology, innovations
- 🏗️ Architecture: buildings, landmarks, structures, engineering marvels
- 🎉 Fun Trivia: world records, unique features, interesting facts
- 🎮 Gaming Connections: Minecraft, Roblox, Fortnite comparisons (when relevant)
- 📚 Education: learning, schools, universities (as landmarks)

🛡️ MANDATORY SAFETY PROTOCOL:
Before writing EACH fact, you MUST:
1. Read the fact in your mind
2. Check: Does it mention ANY forbidden topic? (Even indirectly?)
3. Check: Would a parent be upset seeing this on their child's screen?
4. Check: Is this 100% educational and positive?
5. If ANY doubt → REJECT IT and generate a different fact

LOCATION-SPECIFIC OVERRIDES (Focus on GOOD things, NOT controversial ones):
- Colorado → Rocky Mountains, skiing, natural beauty, Mesa Verde (NO marijuana, NO cannabis, NO dispensaries)
- Amsterdam → Canals, tulips, Anne Frank House, architecture (NO drugs, NO red light district)
- Las Vegas → Desert, Hoover Dam, engineering, Colorado River (NO casinos, NO gambling, NO nightlife)
- Jamaica → Beaches, Blue Mountains, music, Bob Marley Museum (NO marijuana, NO ganja)
- California → National parks, tech innovation, Hollywood (NO wildfires, NO politics)
- New Orleans → Jazz, French Quarter architecture, food (NO Mardi Gras partying, NO alcohol)

CONTENT RULES:
- Only factual, verifiable information (will be verified by Perplexity AI)
- Age-appropriate for 11-14 year olds
- Parent/teacher approved ONLY
- Positive, uplifting tone
- No stereotypes whatsoever
- If location is known for problematic things → IGNORE THEM, focus on nature/history/science

STYLE GUIDELINES:
- Make it engaging ("Whoa, that's cool!")
- Use relatable comparisons ("taller than 3 school buses")
- Mix different topics for variety
- Include surprising facts
- Keep sentences short and punchy (1-2 sentences max)
- Start with topic emoji (🌍🦁🏛️🎨🔬🏗️🎉🎮)`;

        const userPrompt = `Generate exactly 5 fun, educational facts about ${location}${country ? ' in ' + country : ''}.

🛡️ NUCLEAR SAFETY PROTOCOL - READ CAREFULLY:

BEFORE GENERATING, REMEMBER:
This is for MIDDLE SCHOOL students (11-14 years old).
This will be a PAID COMMERCIAL PRODUCT used in classrooms.
Parents and teachers will see this content.
ZERO tolerance for inappropriate content.

⚠️ MANDATORY CHECKS FOR EACH FACT:
1. Does it mention alcohol, beer, wine, brewery, festival (with drinking)?
   → If YES: DELETE IT. Generate something about nature instead.

2. Does it mention marijuana, cannabis, weed, hemp, CBD, drugs?
   → If YES: DELETE IT. Focus on mountains or wildlife instead.

3. Does it mention casinos, gambling, nightlife, bars, clubs?
   → If YES: DELETE IT. Talk about engineering or natural features instead.

4. Does it mention politics, elections, Democrats, Republicans?
   → If YES: DELETE IT. Stick to geography or science instead.

5. Would a parent be angry if their child read this?
   → If MAYBE: DELETE IT. Choose a safer topic.

LOCATION-SPECIFIC MANDATORY OVERRIDES:
- Colorado → Rocky Mountains, Mesa Verde cliff dwellings, fourteeners (14,000+ ft peaks), skiing
  ❌ NEVER mention: marijuana, cannabis, dispensaries, 420, weed, legalization
  
- Amsterdam → Canals (more than Venice!), tulip festivals, windmills, bike culture
  ❌ NEVER mention: drugs, red light district, coffee shops (drug context), partying
  
- Las Vegas → Hoover Dam (engineering marvel), Mojave Desert, Colorado River, geology
  ❌ NEVER mention: casinos, gambling, shows, nightlife, betting, resorts
  
- Jamaica → Blue Mountains, beaches, reggae music (Bob Marley Museum), waterfalls
  ❌ NEVER mention: marijuana, ganja, cannabis, smoking
  
- New Orleans → Jazz history, French architecture, Mississippi River, beignets
  ❌ NEVER mention: Mardi Gras parties, alcohol, hurricanes (Katrina), crime

REQUIRED TOPIC MIX (use at least 3 different categories):
- 🌍 Geography: mountains, rivers, deserts, climate, elevation, coordinates
- 🦁 Wildlife: animals, plants, ecosystems, endangered species
- 🏛️ History: explorations, discoveries, dates, treaties (non-violent only)
- 🎨 Culture: food, traditional clothing, languages, art, music (G-rated)
- 🔬 Science: inventions, discoveries, technology, innovations from this place
- 🏗️ Architecture: buildings, bridges, landmarks, engineering marvels
- 🎉 Fun Trivia: world records, unique features, comparisons ("as big as...")
- 🎮 Gaming: Minecraft/Roblox/Fortnite comparisons (if relevant)

FORMAT REQUIREMENTS:
- Return ONLY a valid JSON array of exactly 5 strings
- Each string = 1-2 sentences maximum
- Start each fact with an emoji (🌍🦁🏛️🎨🔬🏗️🎉🎮)
- Make facts memorable and shareable
- Use comparisons kids understand ("taller than 3 school buses")
- Include a number or measurement when possible

EXAMPLE FORMAT:
["🌍 The Grand Canyon is 277 miles long and over 1 mile deep - you could stack 4 Empire State Buildings inside it!", "🦅 California Condors with 10-foot wingspans soar through the canyon looking for food!"]

REMEMBER: If you're unsure if a fact is appropriate → DON'T USE IT. Choose something safer.`;

        let facts = [];
        let source = '';
        let usage = {};

        // Try Claude 3.5 Sonnet first (BEST for educational accuracy!)
        if (claudeKey) {
            try {
                console.log('🧠 Trying Claude 3.5 Sonnet...');
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': claudeKey,
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-5-sonnet-20241022',
                        max_tokens: 1024,
                        temperature: 0.7,
                        system: systemPrompt,
                        messages: [
                            {
                                role: 'user',
                                content: userPrompt
                            }
                        ]
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const content = data.content[0].text.trim();
                    
                    // Extract JSON array from response
                    const jsonMatch = content.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        facts = JSON.parse(jsonMatch[0]);
                        source = 'claude-3.5-sonnet';
                        usage = {
                            input_tokens: data.usage.input_tokens,
                            output_tokens: data.usage.output_tokens
                        };
                        console.log('✅ Claude 3.5 Sonnet generated', facts.length, 'facts');
                    }
                } else {
                    console.log('⚠️ Claude API returned:', response.status);
                }
            } catch (claudeError) {
                console.error('⚠️ Claude error:', claudeError.message);
            }
        }

        // Fallback to OpenAI GPT-4o-mini
        if (facts.length === 0 && openaiKey) {
            console.log('🧠 Falling back to GPT-4o-mini...');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 800
                })
            });
            
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            
            // Extract JSON array
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                facts = JSON.parse(jsonMatch[0]);
            } else {
                // Fallback: parse numbered/emoji list
                facts = content
                    .split('\n')
                    .filter(line => line.trim().match(/^[🌍🏛️🎨🦁🏗️🔬🎉\d]/))
                    .map(line => line.replace(/^\d+\.\s*/, '').trim())
                    .slice(0, 5);
            }
            
            source = 'gpt-4o-mini';
            usage = data.usage;
            console.log('✅ GPT-4o-mini generated', facts.length, 'facts');
        }

        // Ensure we have exactly 5 facts
        facts = facts.slice(0, 5);
        
        if (facts.length === 0) {
            throw new Error('Failed to generate any facts');
        }
        
        // ═══════════════════════════════════════════════════════════════
        // LAYER 2: POST-GENERATION SAFETY FILTER (Nuclear Option!)
        // ═══════════════════════════════════════════════════════════════
        console.log('🛡️ Running post-generation safety filter...');
        
        const forbiddenKeywords = [
            // Alcohol
            'alcohol', 'beer', 'wine', 'liquor', 'brewery', 'brewpub', 'winery', 'distillery',
            'pub', 'tavern', 'bar', 'cocktail', 'vodka', 'whiskey', 'tequila', 'champagne',
            
            // Drugs
            'marijuana', 'cannabis', 'weed', 'hemp', 'CBD', 'THC', 'dispensary', 'pot', 'ganja',
            'drug', 'narcotic', 'opium', 'cocaine', 'heroin',
            
            // Tobacco
            'tobacco', 'cigarette', 'cigar', 'vaping', 'vape', 'smoking', 'smoker',
            
            // Adult content
            'strip club', 'prostitution', 'brothel', 'red light', 'adult entertainment',
            'sex', 'sexy', 'erotic', 'pornography',
            
            // Gambling
            'casino', 'gambling', 'gamble', 'betting', 'lottery', 'poker', 'blackjack',
            'slot machine', 'roulette',
            
            // Violence
            'gun', 'weapon', 'firearm', 'ammunition', 'rifle', 'pistol',
            'war', 'battle', 'combat', 'terrorism', 'terrorist', 'crime', 'murder',
            'violence', 'violent', 'gang',
            
            // Politics (hot-button)
            'democrat', 'republican', 'liberal', 'conservative', 'election', 'political party',
            'abortion', 'immigration debate',
            
            // Inappropriate
            'damn', 'hell', 'crap', 'sexy', 'hot girl', 'dating'
        ];
        
        const safetyFilteredFacts = [];
        let rejectedCount = 0;
        
        for (const fact of facts) {
            const lowerFact = fact.toLowerCase();
            let isSafe = true;
            let rejectionReason = '';
            
            // Check for forbidden keywords
            for (const keyword of forbiddenKeywords) {
                if (lowerFact.includes(keyword)) {
                    isSafe = false;
                    rejectionReason = `Contains forbidden keyword: "${keyword}"`;
                    break;
                }
            }
            
            if (isSafe) {
                safetyFilteredFacts.push(fact);
            } else {
                console.log(`🚫 REJECTED FACT: ${rejectionReason}`);
                console.log(`   Content: "${fact.substring(0, 80)}..."`);
                rejectedCount++;
            }
        }
        
        // If we rejected facts, generate replacements
        if (rejectedCount > 0) {
            console.log(`⚠️ ${rejectedCount} facts rejected. Need ${5 - safetyFilteredFacts.length} replacements.`);
            
            // Add safe fallback facts based on location type
            const fallbackFacts = [
                `🌍 ${location} is located at approximately ${Math.abs(parseFloat(req.query.lat || 0)).toFixed(2)}° ${parseFloat(req.query.lat || 0) >= 0 ? 'North' : 'South'} latitude!`,
                `🏗️ This location is part of ${country || 'an amazing region'} with rich geographic features worth exploring!`,
                `🦁 The local ecosystem here supports diverse wildlife adapted to the climate and terrain!`,
                `🎨 ${location} has cultural traditions that have developed over hundreds or thousands of years!`,
                `🔬 Geographic features in this area provide scientists with valuable research opportunities!`
            ];
            
            // Fill in rejected facts with fallbacks
            while (safetyFilteredFacts.length < 5) {
                safetyFilteredFacts.push(fallbackFacts[safetyFilteredFacts.length] || fallbackFacts[0]);
            }
        }
        
        facts = safetyFilteredFacts.slice(0, 5);
        
        // ═══════════════════════════════════════════════════════════════
        // LAYER 3: PERPLEXITY VERIFICATION (Optional - for accuracy)
        // ═══════════════════════════════════════════════════════════════
        let verificationResults = null;
        const perplexityKey = process.env.PERPLEXITY_API_KEY;
        
        // Only verify if enabled (we can make this optional to save cost)
        const enableVerification = process.env.ENABLE_PERPLEXITY_VERIFICATION === 'true';
        
        if (enableVerification && perplexityKey && facts.length > 0) {
            console.log('🔍 Verifying facts with Perplexity AI...');
            
            try {
                const verificationPrompt = `Verify the accuracy of these ${facts.length} facts about ${location}${country ? ' in ' + country : ''}. For each fact, state if it's accurate, mostly accurate, or inaccurate:

${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Respond with a brief assessment of each fact's accuracy. If any fact is inaccurate or misleading, explain why.`;
                
                const verifyResponse = await fetch('https://api.perplexity.ai/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${perplexityKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'sonar',  // Use cheaper sonar model for verification
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a fact-checker verifying educational content for middle school students.'
                            },
                            {
                                role: 'user',
                                content: verificationPrompt
                            }
                        ],
                        max_tokens: 500,
                        temperature: 0.2  // Low temperature for factual verification
                    })
                });
                
                if (verifyResponse.ok) {
                    const verifyData = await verifyResponse.json();
                    verificationResults = {
                        assessment: verifyData.choices[0].message.content,
                        citations: verifyData.citations || [],
                        model: verifyData.model
                    };
                    console.log('✅ Perplexity verification complete');
                    console.log('📚 Citations:', verificationResults.citations?.length || 0);
                } else {
                    console.log('⚠️ Perplexity verification skipped (API error)');
                }
            } catch (verifyError) {
                console.error('⚠️ Perplexity verification error:', verifyError.message);
            }
        } else if (!enableVerification) {
            console.log('ℹ️ Perplexity verification disabled (set ENABLE_PERPLEXITY_VERIFICATION=true to enable)');
        }
        
        res.json({ 
            facts,
            source,
            usage,
            safety: {
                rejected: rejectedCount,
                filtered: rejectedCount > 0
            },
            verification: verificationResults
        });
        
    } catch (error) {
        console.error('❌ AI Facts error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    const apiStatus = {
        unsplash: !!process.env.UNSPLASH_ACCESS_KEY,
        pexels: !!process.env.PEXELS_API_KEY,
        openweather: !!process.env.OPENWEATHER_API_KEY,
        claude: !!process.env.ANTHROPIC_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        perplexity: !!process.env.PERPLEXITY_API_KEY
    };
    
    const verificationEnabled = process.env.ENABLE_PERPLEXITY_VERIFICATION === 'true';
    
    res.json({
        status: 'ok',
        message: 'Local development server running',
        apiKeys: apiStatus,
        aiProvider: apiStatus.claude ? 'Claude 3.5 Sonnet (PREFERRED)' : apiStatus.openai ? 'GPT-4o-mini (fallback)' : 'None',
        safetySystem: {
            nuclearFilters: 'ACTIVE',
            postGenerationFilter: 'ACTIVE',
            perplexityVerification: verificationEnabled ? 'ENABLED' : 'DISABLED (set ENABLE_PERPLEXITY_VERIFICATION=true to enable)',
            forbiddenKeywordsCount: 50
        }
    });
});

// Generate Photo Captions (NEW - GPT-4 VISION POWERED + ULTRA-SAFE!)
app.post('/.netlify/functions/generate-photo-caption', async (req, res) => {
    console.log('📝 Photo caption request:', req.body.photo?.searchQuery || req.body.location);
    
    try {
        const { photo, location, country } = req.body;
        
        if (!photo || !location) {
            return res.status(400).json({ error: 'Photo and location required' });
        }
        
        const claudeKey = process.env.ANTHROPIC_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!claudeKey && !openaiKey) {
            return res.json({ caption: 'No AI service available.' });
        }
        
        const fetch = (await import('node-fetch')).default;
        
        let caption = '';
        let visionAnalysis = '';
        
        // ========================================
        // STEP 1: GPT-4 VISION - SEE THE ACTUAL PHOTO
        // ========================================
        if (openaiKey && photo.url) {
            try {
                console.log('👁️ Using GPT-4 Vision to analyze image...');
                const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openaiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `Analyze this photo for educational purposes (middle school students, ages 11-14). 

Describe EXACTLY what you see in 2-3 sentences:
- Buildings, landmarks, signs, architecture
- Nature, landscapes, geographic features  
- People, activities (if appropriate for students)
- Weather, time of day

Be specific and factual. Location context: ${location}, ${country}.

CRITICAL: If you see anything inappropriate for 11-14 year olds (drugs, alcohol, violence, sexual content, weapons), just say: "INAPPROPRIATE_CONTENT_DETECTED"`
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: photo.url,
                                        detail: 'low' // Faster, cheaper ($0.001 vs $0.01)
                                    }
                                }
                            ]
                        }],
                        max_tokens: 150,
                        temperature: 0.3 // Lower = more factual
                    })
                });

                if (visionResponse.ok) {
                    const visionData = await visionResponse.json();
                    visionAnalysis = visionData.choices[0].message.content.trim();
                    
                    // SAFETY CHECK: Reject inappropriate content
                    if (visionAnalysis.includes('INAPPROPRIATE_CONTENT_DETECTED')) {
                        console.warn('⚠️ Inappropriate content detected by vision AI');
                        return res.json({
                            caption: `This location is ${location}${country ? ', ' + country : ''}. Students can explore this region to learn about its geography, culture, and unique characteristics.`,
                            visionAnalysis: 'Content filtered for safety',
                            safetyFiltered: true
                        });
                    }
                    
                    console.log('✅ Vision analysis:', visionAnalysis.substring(0, 100) + '...');
                } else {
                    console.warn('⚠️ Vision API failed, using metadata');
                    visionAnalysis = photo.description || photo.alt_description || photo.searchQuery || `photograph from ${location}`;
                }
            } catch (visionError) {
                console.warn('⚠️ Vision error:', visionError.message);
                visionAnalysis = photo.description || photo.searchQuery || `photograph from ${location}`;
            }
        } else {
            // No vision - use metadata
            visionAnalysis = photo.description || photo.alt_description || photo.searchQuery || `photograph from ${location}`;
        }
        
        // ========================================
        // STEP 2: GENERATE EDUCATIONAL CAPTION BASED ON ACTUAL CONTENT
        // ========================================
        const captionPrompt = `You are an educational geography teacher writing for middle school students (ages 11-14).

WHAT'S ACTUALLY IN THE PHOTO (verified by vision AI):
"${visionAnalysis}"

LOCATION CONTEXT:
${location}${country ? ', ' + country : ''}

Write an educational caption (150-180 words) with 3 paragraphs:

Paragraph 1 (50-60 words): Describe what's ACTUALLY visible in the photo based on the vision analysis above. Be specific about what students can SEE.

Paragraph 2 (50-60 words): Educational context about ${location} - geography, culture, or significance.

Paragraph 3 (30-40 words): Fun, memorable fact about this place.

Then write: "This photo is relevant because..." (one sentence explaining educational value)

🔒 CRITICAL SAFETY RULES (THIS IS FOR KIDS 11-14):
- NO references to drugs, marijuana, cannabis, weed, alcohol, bars, nightclubs
- NO sexual content, adult entertainment, red light districts
- NO violence, weapons, crime, gangs
- NO political controversy, protests, conflicts
- BE FAMILY-FRIENDLY and educational
- If location is known for adult content (Amsterdam coffee shops, Las Vegas casinos, etc.), focus ONLY on history, architecture, geography
- Appropriate for classroom use

Be factually accurate, engaging, and educational. No emojis.`;

        // Try Claude 3.5 Sonnet first (best educational content)
        if (claudeKey) {
            try {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': claudeKey,
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-5-sonnet-20241022',
                        max_tokens: 500,
                        temperature: 0.7,
                        messages: [{ role: 'user', content: captionPrompt }]
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    caption = data.content[0].text.trim();
                    console.log('✅ Claude caption generated with vision context');
                    return res.json({ 
                        caption,
                        visionAnalysis,
                        model: 'claude-3.5-sonnet + gpt-4o-vision'
                    });
                }
            } catch (err) {
                console.warn('⚠️ Claude failed:', err.message);
            }
        }
        
        // Fallback to GPT-4o-mini
        if (openaiKey && !caption) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openaiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: captionPrompt }],
                        max_tokens: 500,
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    caption = data.choices[0].message.content.trim();
                    console.log('✅ GPT caption generated with vision context');
                    return res.json({ 
                        caption,
                        visionAnalysis,
                        model: 'gpt-4o-mini (vision + text)'
                    });
                }
            } catch (err) {
                console.warn('⚠️ OpenAI failed:', err.message);
            }
        }
        
        // Ultimate safe fallback
        caption = `${visionAnalysis} Located in ${location}${country ? ', ' + country : ''}, this area offers unique geographic and cultural features for students to explore. This photo is relevant because it helps visualize the characteristics of this region.`;
        
        res.json({ 
            caption, 
            visionAnalysis,
            model: 'fallback-safe'
        });
        
    } catch (error) {
        console.error('❌ Photo caption error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper: Fetch real photos for matching
async function fetchRealPhotosForMatching(location, country, fetch) {
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const pexelsKey = process.env.PEXELS_API_KEY;
    
    if (!unsplashKey && !pexelsKey) {
        console.log('❌ No photo API keys available');
        return [];
    }

    let photos = [];
    // Include country in search to disambiguate (e.g., "Palmyra Maine" not "Palmyra Syria")
    const searchQuery = (location && country) ? `${location} ${country}` : (location || country);
    
    // Try Unsplash first
    if (unsplashKey) {
        console.log(`🔍 Searching Unsplash for: ${searchQuery}`);
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`,
                { headers: { 'Authorization': `Client-ID ${unsplashKey}` } }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    photos = data.results.map(photo => ({
                        id: photo.id,
                        url: photo.urls.regular,
                        thumbnail: photo.urls.small,
                        photographer: photo.user.name,
                        photographer_url: photo.user.links.html,
                        description: photo.description || photo.alt_description || '',
                        source: 'unsplash'
                    }));
                    console.log(`✅ Unsplash returned ${photos.length} photos`);
                }
            }
        } catch (error) {
            console.error('❌ Unsplash error:', error.message);
        }
    }

    // Try Pexels if Unsplash failed
    if (photos.length === 0 && pexelsKey) {
        console.log(`🔍 Searching Pexels for: ${searchQuery}`);
        try {
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`,
                { headers: { 'Authorization': pexelsKey } }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.photos && data.photos.length > 0) {
                    photos = data.photos.map(photo => ({
                        id: photo.id,
                        url: photo.src.large,
                        thumbnail: photo.src.medium,
                        photographer: photo.photographer,
                        photographer_url: photo.photographer_url,
                        description: photo.alt || '',
                        source: 'pexels'
                    }));
                    console.log(`✅ Pexels returned ${photos.length} photos`);
                }
            }
        } catch (error) {
            console.error('❌ Pexels error:', error.message);
        }
    }

    // Try country fallback if still no photos
    if (photos.length === 0 && country && location !== country) {
        console.log(`🔍 Trying country fallback: ${country}`);
        return await fetchRealPhotosForMatching(country, null, fetch);
    }

    return photos;
}

// Helper: AI-powered photo-to-fact matching
async function matchPhotosToFactsWithAI(facts, photos, location, fetch) {
    const matched = [];
    
    // If no photos, return all facts with null photos
    if (!photos || photos.length === 0) {
        return facts.map(fact => ({ fact, photo: null }));
    }

    // If only 1-2 photos, just cycle them (not enough for AI to be useful)
    if (photos.length <= 2) {
        for (let i = 0; i < facts.length; i++) {
            matched.push({ 
                fact: facts[i], 
                photo: photos[i % photos.length] 
            });
        }
        console.log(`✅ Matched ${facts.length} facts to ${photos.length} photos (simple cycling)`);
        return matched;
    }

    // Use Claude to intelligently match photos to facts
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!claudeKey && !openaiKey) {
        console.log('⚠️ No AI available for smart matching, using cycling');
        for (let i = 0; i < facts.length; i++) {
            matched.push({ 
                fact: facts[i], 
                photo: photos[i % photos.length] 
            });
        }
        return matched;
    }

    try {
        const prompt = `You are matching photos to educational facts about ${location}.

FACTS:
${facts.map((f, i) => `${i}. ${f}`).join('\n')}

PHOTOS (with descriptions):
${photos.map((p, i) => `${i}. ${p.description || p.alt || 'No description'}`).join('\n')}

Task: Match each fact to the MOST RELEVANT photo based on keywords and context.
- Bridge facts → bridge/architecture photos
- Wildlife facts → animal/nature photos  
- Geography facts → landscape/terrain photos
- Historical facts → historical site photos
- If no good match exists, use a general landscape photo

Respond with ONLY a JSON array of matches:
[
  {"factIndex": 0, "photoIndex": 2},
  {"factIndex": 1, "photoIndex": 0},
  ...
]`;

        let matches = null;

        // Try Claude first
        if (claudeKey) {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': claudeKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-latest',
                    max_tokens: 500,
                    temperature: 0.3,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.content[0].text;
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    matches = JSON.parse(jsonMatch[0]);
                    console.log('✅ Claude matched photos to facts');
                }
            }
        }

        // Fallback to GPT-4
        if (!matches && openaiKey) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    max_tokens: 400,
                    temperature: 0.3,
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: 'You match photos to facts. Respond with JSON: {"matches": [{"factIndex": 0, "photoIndex": 1}, ...]}' },
                        { role: 'user', content: prompt }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const parsed = JSON.parse(data.choices[0].message.content);
                matches = parsed.matches;
                console.log('✅ GPT-4 matched photos to facts');
            }
        }

        // Apply matches
        if (matches && matches.length > 0) {
            for (const match of matches) {
                if (match.factIndex < facts.length && match.photoIndex < photos.length) {
                    matched.push({
                        fact: facts[match.factIndex],
                        photo: photos[match.photoIndex]
                    });
                }
            }
        }

        // Fill any missing matches with cycling
        while (matched.length < facts.length) {
            const photoIndex = matched.length % photos.length;
            matched.push({
                fact: facts[matched.length],
                photo: photos[photoIndex]
            });
        }

        console.log(`✅ Matched ${matched.length} facts to photos using AI`);
        return matched;

    } catch (error) {
        console.error('❌ AI matching failed:', error.message);
        // Fallback to cycling
        for (let i = 0; i < facts.length; i++) {
            matched.push({ 
                fact: facts[i], 
                photo: photos[i % photos.length] 
            });
        }
        return matched;
    }
}

// Match Photos to AI Facts (PHOTO-FIRST, AI FALLBACK)
app.post('/.netlify/functions/match-photos-to-facts', async (req, res) => {
    console.log('📸 Photo matching request');
    
    try {
        const { facts, location, country } = req.body;
        
        if (!facts || !Array.isArray(facts) || facts.length === 0) {
            return res.status(400).json({ error: 'Facts array required' });
        }
        
        console.log(`📸 Matching ${facts.length} facts for ${location}...`);
        
        const fetch = (await import('node-fetch')).default;
        
        // STEP 1: Try to get REAL PHOTOS first
        const photos = await fetchRealPhotosForMatching(location, country, fetch);
        
        // STEP 2: If we have photos, match them to facts with AI
        if (photos && photos.length > 0) {
            console.log(`✅ Found ${photos.length} real photos, matching to facts with AI...`);
            const matched = await matchPhotosToFactsWithAI(facts, photos, location, fetch);
            return res.json({
                matched,
                source: 'real-photos-matched'
            });
        }
        
        // STEP 3: FALLBACK - No photos available, generate AI infographics
        console.log('⚠️ No real photos found, generating AI infographics as fallback...');
        
        const replicateKey = process.env.REPLICATE_API_TOKEN;
        const claudeKey = process.env.ANTHROPIC_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!replicateKey && !openaiKey) {
            console.log('❌ No AI generation available');
            return res.json({
                matched: facts.map(fact => ({ fact, photo: null })),
                source: 'no-ai-keys'
            });
        }
        
        const infographics = [];
        
        // Generate educational infographics for each fact
        for (let i = 0; i < facts.length; i++) {
            const fact = facts[i];
            console.log(`\n🎨 Creating infographic ${i + 1}/${facts.length} for: "${fact.substring(0, 50)}..."`);
            
            try {
                // Step 1: Design the infographic using Claude or GPT-4
                const promptTemplate = `You are a Gen Alpha educational designer creating FIRE infographics for middle school students (ages 11-14).

📍 LOCATION: ${location}${country ? ', ' + country : ''}
📚 FACT TO VISUALIZE: "${fact}"

🎯 YOUR MISSION:
Create an image generation prompt for an educational infographic that:
1. Uses one of the 5 Themes of Geography (Location, Place, Human-Environment Interaction, Movement, Region)
2. Makes a real-world connection (compare to Minecraft blocks, USA states, football fields, TikTok facts, etc.)
3. Uses Gen Alpha aesthetic (bold colors, modern flat design, emoji-style icons, clean typography)
4. Is 100% educational but ENGAGING (not boring textbook style)
5. Shows data visually (charts, size comparisons, diagrams, illustrated maps)

🎨 STYLE REQUIREMENTS:
- Modern flat design or isometric 3D illustration
- Bright, bold, saturated colors (blues, greens, oranges, purples)
- Large clear typography with big numbers and stats
- Visual size comparisons that make facts memorable
- Clean, simple design (not cluttered)
- Professional but fun (National Geographic meets Kurzgesagt animation style)

💡 EXAMPLE PROMPTS:
"Flat design infographic showing Greenland's 836,331 square miles compared to Texas (268,596 sq mi) using layered silhouettes, bold white typography, vibrant teal and coral colors, modern educational poster, clean vector style"

"Isometric illustration of Arctic fox in split-screen summer/winter color change, bold labels showing 'BROWN' and 'WHITE', bright blue background, educational diagram style, clean 3D render"

🚫 AVOID:
- Realistic photographs
- Dark or muted colors
- Small unreadable text
- Too much detail
- Cartoonish childish style

Respond with ONLY the image generation prompt (2-3 sentences). Make it BUSSIN! 🔥`;

                let imagePrompt = null;
                
                // Try Claude first
                if (claudeKey) {
                    const promptResponse = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': claudeKey,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify({
                            model: 'claude-3-5-sonnet-latest',
                            max_tokens: 400,
                            temperature: 0.85,
                            messages: [{ role: 'user', content: promptTemplate }]
                        })
                    });
                    
                    if (promptResponse.ok) {
                        const data = await promptResponse.json();
                        imagePrompt = data.content[0].text.trim();
                        console.log(`✅ Claude designed: "${imagePrompt.substring(0, 60)}..."`);
                    }
                }
                
                // Fallback to GPT-4
                if (!imagePrompt && openaiKey) {
                    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openaiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o',
                            max_tokens: 300,
                            temperature: 0.85,
                            messages: [
                                { role: 'system', content: 'You are a Gen Alpha educational designer.' },
                                { role: 'user', content: promptTemplate }
                            ]
                        })
                    });
                    
                    if (gptResponse.ok) {
                        const data = await gptResponse.json();
                        imagePrompt = data.choices[0].message.content.trim();
                        console.log(`✅ GPT-4 designed: "${imagePrompt.substring(0, 60)}..."`);
                    }
                }
                
                if (!imagePrompt) {
                    console.warn('⚠️ Failed to create infographic prompt');
                    infographics.push({ fact, photo: null });
                    continue;
                }
                
                // Step 2: Generate the infographic with Replicate or DALL-E
                let imageUrl = null;
                
                // Try Replicate first
                if (replicateKey) {
                    const prediction = await fetch('https://api.replicate.com/v1/predictions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${replicateKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            version: '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
                            input: {
                                prompt: imagePrompt,
                                num_outputs: 1,
                                aspect_ratio: '16:9',
                                output_format: 'jpg',
                                output_quality: 95
                            }
                        })
                    });
                    
                    if (prediction.ok) {
                        const predData = await prediction.json();
                        
                        // Poll for result
                        for (let attempt = 0; attempt < 15; attempt++) {
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                            const statusResponse = await fetch(
                                `https://api.replicate.com/v1/predictions/${predData.id}`,
                                { headers: { 'Authorization': `Token ${replicateKey}` } }
                            );
                            
                            if (statusResponse.ok) {
                                const statusData = await statusResponse.json();
                                
                                if (statusData.status === 'succeeded' && statusData.output?.[0]) {
                                    imageUrl = statusData.output[0];
                                    console.log('✅ Replicate generated infographic!');
                                    break;
                                } else if (statusData.status === 'failed') {
                                    console.warn('⚠️ Replicate failed');
                                    break;
                                }
                            }
                        }
                    }
                }
                
                // Fallback to DALL-E
                if (!imageUrl && openaiKey) {
                    console.log('🎨 Trying DALL-E...');
                    const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openaiKey}`
                        },
                        body: JSON.stringify({
                            model: 'dall-e-3',
                            prompt: imagePrompt,
                            size: '1792x1024',
                            quality: 'standard',
                            n: 1
                        })
                    });
                    
                    if (dalleResponse.ok) {
                        const data = await dalleResponse.json();
                        imageUrl = data.data[0].url;
                        console.log('✅ DALL-E generated infographic!');
                    }
                }
                
                if (imageUrl) {
                    infographics.push({
                        fact,
                        photo: {
                            id: `edu-infographic-${i}`,
                            url: imageUrl,
                            thumbnail: imageUrl,
                            photographer: '🎨 Educational AI Infographic',
                            photographer_url: null,
                            description: imagePrompt,
                            source: 'educational-infographic',
                            aiGenerated: true,
                            isEducationalInfographic: true
                        }
                    });
                    console.log(`✅ Infographic ${i + 1} complete!`);
                } else {
                    console.warn(`⚠️ Failed to generate infographic ${i + 1}`);
                    infographics.push({ fact, photo: null });
                }
                
            } catch (error) {
                console.error(`❌ Error on infographic ${i + 1}:`, error.message);
                infographics.push({ fact, photo: null });
            }
        }
        
        const successCount = infographics.filter(i => i.photo).length;
        console.log(`\n🎉 Generated ${successCount}/${facts.length} educational infographics!`);
        
        res.json({
            matched: infographics,
            source: 'educational-infographics'
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate Geography in Real Life (NEW!)
app.post('/.netlify/functions/generate-real-life-geography', async (req, res) => {
    console.log('🌍 Generating real-life geography applications');
    
    try {
        const { location, country, facts } = req.body;
        
        if (!location) {
            return res.status(400).json({ error: 'Location required' });
        }
        
        const fetch = (await import('node-fetch')).default;
        const claudeKey = process.env.ANTHROPIC_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!claudeKey && !openaiKey) {
            return res.status(500).json({ error: 'No AI provider available' });
        }
        
        // Create safe prompt
        const factsContext = facts && facts.length > 0 
            ? `\n\nFACTS ABOUT ${location.toUpperCase()}:\n${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}`
            : '';
        
        const prompt = `You are an educational AI creating safe, engaging geography content for middle school students (ages 11-14).

LOCATION: ${location}${country ? ', ' + country : ''}
${factsContext}

🎯 YOUR MISSION:
Generate 3 real-life applications using the 5 Themes of Geography:
1. Location (Where is it?)
2. Place (What's it like there?)
3. Human-Environment Interaction (How do people adapt?)
4. Movement (How do people, goods, ideas move?)
5. Region (What makes it unique?)

For each theme:
1. Write a 2-3 sentence explanation connecting the theme to ${location}
2. Create a specific example of how this geography concept connects to a middle school student's daily life

🛡️ SAFETY REQUIREMENTS (CRITICAL):
- ✅ Age-appropriate language (11-14 year olds)
- ✅ Educational and factual content only
- ✅ Positive, inclusive, respectful tone
- ✅ Focus on universal student experiences (school, hobbies, technology, sports, food)
- ❌ NO personal information requests (addresses, phone numbers, real names)
- ❌ NO location tracking or "share your location" suggestions
- ❌ NO controversial topics (politics, religion, violence, discrimination)
- ❌ NO unsafe activities or dangerous suggestions
- ❌ NO assumptions about family structure, income, or living situations
- ❌ NO comparisons that could be offensive or stereotyping

💡 STUDENT CONNECTION EXAMPLES (SAFE):
- "When you video chat with relatives in another country, that's Movement!"
- "Checking the weather app before school is using Location data"
- "Your school cafeteria choosing local vs imported food shows Human-Environment Interaction"
- "Playing games with friends online demonstrates how technology connects different Places"
- "Your school bus route is designed using Place characteristics (streets, neighborhoods)"

📝 RESPONSE FORMAT (JSON):
{
  "themes": [
    {
      "icon": "📍",
      "name": "Location",
      "explanation": "2-3 sentences about how this theme applies to the location",
      "studentApplication": "One specific example of how this connects to a middle school student's life"
    },
    // ... 2 more themes (pick from the 5)
  ]
}

RESPOND WITH ONLY THE JSON OBJECT. Make it EDUCATIONAL and RELATABLE!`;
        
        let themes = null;
        
        // Try Claude first
        if (claudeKey) {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': claudeKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-latest',
                    max_tokens: 1500,
                    temperature: 0.7,
                    messages: [{ role: 'user', content: prompt }]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const content = data.content[0].text.trim();
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    themes = parsed.themes;
                    console.log('✅ Claude generated', themes?.length || 0, 'themes');
                }
            }
        }
        
        // Fallback to GPT-4
        if (!themes && openaiKey) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    max_tokens: 1200,
                    temperature: 0.7,
                    response_format: { type: 'json_object' },
                    messages: [
                        { 
                            role: 'system', 
                            content: 'You are a safe, educational AI for middle school geography. Always output valid JSON with the themes array.' 
                        },
                        { role: 'user', content: prompt }
                    ]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const content = data.choices[0].message.content.trim();
                const parsed = JSON.parse(content);
                themes = parsed.themes;
                console.log('✅ GPT-4 generated', themes?.length || 0, 'themes');
            }
        }
        
        if (!themes) {
            return res.status(500).json({ error: 'Failed to generate content' });
        }
        
        // 🛡️ SAFETY FILTER
        const safeThemes = themes.filter(theme => {
            if (!theme || !theme.explanation || !theme.studentApplication) {
                return false;
            }
            
            const combinedText = `${theme.explanation} ${theme.studentApplication}`.toLowerCase();
            
            // Blocked patterns
            const blocked = [
                /\b(address|phone\s*number|real\s*name|where\s*you\s*live|your\s*home)\b/i,
                /\b(share\s*your\s*location|tell\s*me\s*where|post\s*your)\b/i,
                /\b(politics|political|religion|religious|war|violence|terrorist)\b/i,
                /\b(hate|racist|sexist|discriminat)\b/i,
                /\b(drug|alcohol|weapon|gun)\b/i,
                /\b(suicide|self[- ]harm|kill)\b/i,
                /\b(sexy|sexual|porn|nude)\b/i,
                /\b(password|credit\s*card|social\s*security)\b/i
            ];
            
            for (const pattern of blocked) {
                if (pattern.test(combinedText)) {
                    console.warn(`⚠️ SAFETY FILTER: Blocked theme "${theme.name}"`);
                    return false;
                }
            }
            
            if (theme.explanation.length < 50 || theme.explanation.length > 500) {
                return false;
            }
            
            return true;
        }).slice(0, 3);
        
        console.log(`✅ Generated ${safeThemes.length} safe geography themes`);
        
        res.json({
            themes: safeThemes,
            location,
            generated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  🚀 LOCAL DEV SERVER RUNNING                              ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('📍 Main App:    http://localhost:8888');
    console.log('🏥 Health Check: http://localhost:8888/health\n');
    console.log('🔑 API Keys Configured:');
    console.log('  Unsplash:      ', process.env.UNSPLASH_ACCESS_KEY ? '✅' : '❌');
    console.log('  Pexels:        ', process.env.PEXELS_API_KEY ? '✅' : '❌');
    console.log('  OpenWeatherMap:', process.env.OPENWEATHER_API_KEY ? '✅' : '❌');
    console.log('  Claude 3.5:    ', process.env.ANTHROPIC_API_KEY ? '✅ (PREFERRED for AI facts!)' : '❌');
    console.log('  OpenAI GPT-4:  ', process.env.OPENAI_API_KEY ? '✅ (fallback)' : '❌');
    console.log('\n🧠 AI Provider:', process.env.ANTHROPIC_API_KEY ? 'Claude 3.5 Sonnet' : process.env.OPENAI_API_KEY ? 'GPT-4o-mini' : 'None');
    console.log('💡 Click anywhere on the map to test Location Explorer!');
    console.log('📝 Watch this console for API request logs\n');
});
