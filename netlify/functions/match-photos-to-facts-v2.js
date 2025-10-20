// Netlify Function: Match Photos to AI Facts with AGGRESSIVE FALLBACKS
// Endpoint: POST /.netlify/functions/match-photos-to-facts
// 
// 5-TIER FALLBACK SYSTEM:
// 1. Unsplash with specific location (e.g., "Krasnoyarsk Krai")
// 2. Pexels with specific location
// 3. Unsplash with country name (e.g., "Russia")
// 4. Pexels with country name
// 5. Unsplash with generic query (e.g., "Russia landscapes")

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { facts, location, country } = JSON.parse(event.body);
    
    if (!facts || !Array.isArray(facts) || facts.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing or invalid facts array' })
      };
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const pexelsKey = process.env.PEXELS_API_KEY;
    
    if (!unsplashKey && !pexelsKey) {
      console.log('❌ No photo APIs available');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          matched: facts.map(fact => ({ fact, photo: null })),
          source: 'none'
        })
      };
    }

    let photos = [];
    
    // ========================================
    // TIER 1: Try specific location with Unsplash
    // ========================================
    if (unsplashKey && location) {
      console.log(`🔍 TIER 1: Unsplash search for "${location}"`);
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&per_page=10&orientation=landscape`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Client-ID ${unsplashKey}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          console.log(`✅ TIER 1 SUCCESS: Found ${data.results.length} photos`);
          photos = data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            photographer: photo.user.name,
            photographer_url: photo.user.links.html,
            description: photo.description || photo.alt_description || '',
            source: 'unsplash'
          }));
        } else {
          console.log('❌ TIER 1 FAILED: No photos found');
        }
      }
    }

    // ========================================
    // TIER 2: Try specific location with Pexels
    // ========================================
    if (photos.length === 0 && pexelsKey && location) {
      console.log(`🔍 TIER 2: Pexels search for "${location}"`);
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(location)}&per_page=10&orientation=landscape`;
      const response = await fetch(url, {
        headers: { 'Authorization': pexelsKey }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          console.log(`✅ TIER 2 SUCCESS: Found ${data.photos.length} photos`);
          photos = data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large,
            thumbnail: photo.src.medium,
            photographer: photo.photographer,
            photographer_url: photo.photographer_url,
            description: photo.alt || '',
            source: 'pexels'
          }));
        } else {
          console.log('❌ TIER 2 FAILED: No photos found');
        }
      }
    }

    // ========================================
    // TIER 3: Try country name with Unsplash
    // ========================================
    if (photos.length === 0 && unsplashKey && country) {
      console.log(`🔍 TIER 3: Unsplash search for "${country}"`);
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(country)}&per_page=10&orientation=landscape`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Client-ID ${unsplashKey}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          console.log(`✅ TIER 3 SUCCESS: Found ${data.results.length} photos`);
          photos = data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            photographer: photo.user.name,
            photographer_url: photo.user.links.html,
            description: photo.description || photo.alt_description || '',
            source: 'unsplash'
          }));
        } else {
          console.log('❌ TIER 3 FAILED: No photos found');
        }
      }
    }

    // ========================================
    // TIER 4: Try country name with Pexels
    // ========================================
    if (photos.length === 0 && pexelsKey && country) {
      console.log(`🔍 TIER 4: Pexels search for "${country}"`);
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(country)}&per_page=10&orientation=landscape`;
      const response = await fetch(url, {
        headers: { 'Authorization': pexelsKey }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          console.log(`✅ TIER 4 SUCCESS: Found ${data.photos.length} photos`);
          photos = data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large,
            thumbnail: photo.src.medium,
            photographer: photo.photographer,
            photographer_url: photo.photographer_url,
            description: photo.alt || '',
            source: 'pexels'
          }));
        } else {
          console.log('❌ TIER 4 FAILED: No photos found');
        }
      }
    }

    // ========================================
    // TIER 5: Try generic query with Unsplash
    // ========================================
    if (photos.length === 0 && unsplashKey && country) {
      const genericQuery = `${country} landscapes`;
      console.log(`🔍 TIER 5: Unsplash search for "${genericQuery}"`);
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(genericQuery)}&per_page=10&orientation=landscape`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Client-ID ${unsplashKey}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          console.log(`✅ TIER 5 SUCCESS: Found ${data.results.length} photos`);
          photos = data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            photographer: photo.user.name,
            photographer_url: photo.user.links.html,
            description: photo.description || photo.alt_description || '',
            source: 'unsplash'
          }));
        } else {
          console.log('❌ TIER 5 FAILED: No photos found');
        }
      }
    }

    // ========================================
    // ULTIMATE FALLBACK: Return facts without photos
    // ========================================
    if (photos.length === 0) {
      console.log('❌ ALL TIERS FAILED: Returning facts without photos');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          matched: facts.map(fact => ({ fact, photo: null })),
          source: 'none'
        })
      };
    }

    // ========================================
    // SUCCESS: Match photos to facts
    // ========================================
    console.log(`✅ Found ${photos.length} photos, now matching to ${facts.length} facts...`);

    // Use Claude AI for intelligent matching
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    let matched = [];

    if (claudeKey && photos.length >= facts.length) {
      try {
        // Build matching prompt for Claude
        const prompt = `You are a geography education assistant. Match these AI-generated facts to the most relevant photos.

FACTS:
${facts.map((fact, i) => `${i}. ${fact}`).join('\n')}

PHOTOS:
${photos.map((photo, i) => `${i}. ${photo.description || 'No description'}`).join('\n')}

Return ONLY a JSON array of matches like: [{"factIndex": 0, "photoIndex": 2}, ...]
Each fact should be matched to its most relevant photo based on content.`;

        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        });

        if (claudeResponse.ok) {
          const claudeData = await claudeResponse.json();
          const responseText = claudeData.content[0].text;
          
          // Parse Claude's JSON response
          const jsonMatch = responseText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const matches = JSON.parse(jsonMatch[0]);
            matched = matches.map(m => ({
              fact: facts[m.factIndex],
              photo: photos[m.photoIndex]
            }));
            console.log('✅ Claude AI matched photos successfully');
          }
        }
      } catch (error) {
        console.error('❌ Claude matching failed:', error);
      }
    }

    // Fallback: Simple 1:1 matching
    if (matched.length === 0) {
      console.log('⚠️ Using simple 1:1 matching (no AI)');
      matched = facts.map((fact, i) => ({
        fact,
        photo: photos[i % photos.length] // Cycle through photos if fewer than facts
      }));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        matched,
        source: photos[0]?.source || 'unknown',
        totalPhotos: photos.length
      })
    };

  } catch (error) {
    console.error('❌ Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
