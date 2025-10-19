// Netlify Function: Match Photos to AI Facts using Vision AI
// Endpoint: POST /.netlify/functions/match-photos-to-facts
// 
// This function takes AI-generated facts and photos, then uses Claude's
// vision capabilities to intelligently match each fact with the most
// relevant photo, creating a rich visual learning experience.

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

    // Get photos for this location
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const pexelsKey = process.env.PEXELS_API_KEY;
    
    if (!unsplashKey && !pexelsKey) {
      // No photo APIs available - return facts without photos
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          matched: facts.map(fact => ({ fact, photo: null })),
          source: 'none'
        })
      };
    }

    // Fetch photos for this location
    let photos = [];
    const searchQuery = location || country;

    console.log('🔍 Searching for photos:', searchQuery);

    // Try Unsplash first
    if (unsplashKey) {
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`;
      
      console.log('📸 Calling Unsplash API...');
      const unsplashResponse = await fetch(unsplashUrl, {
        headers: { 'Authorization': `Client-ID ${unsplashKey}` }
      });

      if (unsplashResponse.ok) {
        const data = await unsplashResponse.json();
        console.log(`✅ Unsplash returned ${data.results.length} photos for "${searchQuery}"`);
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
        console.error('❌ Unsplash API error:', unsplashResponse.status);
      }
    }

    // Fallback to Pexels if needed
    if (photos.length === 0 && pexelsKey) {
      console.log('📸 Trying Pexels fallback...');
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`;
      
      const pexelsResponse = await fetch(pexelsUrl, {
        headers: { 'Authorization': pexelsKey }
      });

      if (pexelsResponse.ok) {
        const data = await pexelsResponse.json();
        console.log(`✅ Pexels returned ${data.photos?.length || 0} photos for "${searchQuery}"`);
        photos = data.photos.map(photo => ({
          id: photo.id,
          url: photo.src.large,
          thumbnail: photo.src.medium,
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          description: photo.alt || '',
          source: 'pexels'
        }));
      }
    }

    // MULTI-TIER FALLBACK STRATEGY
    // If no photos found for specific location, try broader searches
    if (photos.length === 0 && country && location !== country) {
      console.log(`⚠️ No photos for "${location}", trying country "${country}"...`);
      
      // Try country name
      if (unsplashKey) {
        const fallbackUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(country)}&per_page=10&orientation=landscape`;
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: { 'Authorization': `Client-ID ${unsplashKey}` }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          console.log(`✅ Country fallback returned ${data.results.length} photos`);
          photos = data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            photographer: photo.user.name,
            photographer_url: photo.user.links.html,
            description: photo.description || photo.alt_description || '',
            source: 'unsplash'
          }));
        }
      }
      
      // Still no photos? Try Pexels with country
      if (photos.length === 0 && pexelsKey) {
        console.log('📸 Trying Pexels with country...');
        const fallbackUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(country)}&per_page=10&orientation=landscape`;
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: { 'Authorization': pexelsKey }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          console.log(`✅ Pexels country fallback returned ${data.photos?.length || 0} photos`);
          photos = data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large,
            thumbnail: photo.src.medium,
            photographer: photo.photographer,
            photographer_url: photo.photographer_url,
            description: photo.alt || '',
            source: 'pexels'
          }));
        }
      }
    }

    if (photos.length === 0) {
      // No photos found even with fallbacks - return facts without photos
      console.log('❌ No photos found after all fallback attempts');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          matched: facts.map(fact => ({ fact, photo: null })),
          source: 'none'
        })
      };
    }

    console.log(`✅ Final photo count: ${photos.length} photos to match with ${facts.length} facts`);

    // Use Claude to intelligently match photos to facts
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    
    if (!claudeKey) {
      // No AI available - use simple keyword matching
      const matched = simpleMatchPhotosToFacts(facts, photos);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ matched, source: 'simple-match' })
      };
    }

    // AI-powered matching using Claude
    const matchingPrompt = createMatchingPrompt(facts, photos, location);
    
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
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: matchingPrompt
        }]
      })
    });

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    const responseText = claudeData.content[0].text;
    
    // Parse Claude's matching recommendations
    const matched = parseClaudeMatching(responseText, facts, photos);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ matched, source: 'ai-matched' })
    };

  } catch (error) {
    console.error('Error matching photos to facts:', error);
    
    // Return facts without photos on error
    try {
      const { facts } = JSON.parse(event.body);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          matched: facts.map(fact => ({ fact, photo: null })),
          source: 'error-fallback'
        })
      };
    } catch {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to match photos to facts' })
      };
    }
  }
};

/**
 * Create prompt for Claude to match photos to facts
 */
function createMatchingPrompt(facts, photos, location) {
  const photoDescriptions = photos.map((p, i) => 
    `Photo ${i + 1}: ${p.description || 'No description'} (ID: ${p.id})`
  ).join('\n');

  return `You are helping match photos to educational facts about ${location}.

FACTS:
${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

AVAILABLE PHOTOS:
${photoDescriptions}

Task: Match each fact to the most relevant photo. Consider:
- Visual relevance to the fact's topic
- Educational value for middle school students
- Clarity and recognizability

Respond ONLY with a JSON array of matches in this exact format:
[
  {"factIndex": 0, "photoIndex": 2},
  {"factIndex": 1, "photoIndex": 0},
  ...
]

Use each photo only once if possible. If no good match exists for a fact, use photoIndex: -1.`;
}

/**
 * Parse Claude's matching response
 */
function parseClaudeMatching(responseText, facts, photos) {
  try {
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const matches = JSON.parse(jsonMatch[0]);
    const usedPhotos = new Set();
    
    return facts.map((fact, factIndex) => {
      const match = matches.find(m => m.factIndex === factIndex);
      
      if (!match || match.photoIndex === -1 || match.photoIndex >= photos.length) {
        return { fact, photo: null };
      }

      const photoIndex = match.photoIndex;
      usedPhotos.add(photoIndex);
      
      return {
        fact,
        photo: photos[photoIndex]
      };
    });

  } catch (error) {
    console.error('Error parsing Claude matching:', error);
    // Fallback to simple matching
    return simpleMatchPhotosToFacts(facts, photos);
  }
}

/**
 * Simple keyword-based matching fallback
 */
function simpleMatchPhotosToFacts(facts, photos) {
  const matched = [];
  const usedPhotos = new Set();

  facts.forEach(fact => {
    let bestMatch = null;
    let bestScore = 0;

    photos.forEach((photo, photoIndex) => {
      if (usedPhotos.has(photoIndex)) return;

      const description = (photo.description || '').toLowerCase();
      const factLower = fact.toLowerCase();
      
      // Simple keyword matching
      const keywords = factLower.split(' ')
        .filter(word => word.length > 4); // Only significant words
      
      let score = 0;
      keywords.forEach(keyword => {
        if (description.includes(keyword)) {
          score += 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = photoIndex;
      }
    });

    if (bestMatch !== null && bestScore > 0) {
      usedPhotos.add(bestMatch);
      matched.push({ fact, photo: photos[bestMatch] });
    } else {
      // No good match - use next available photo or null
      const availableIndex = photos.findIndex((_, i) => !usedPhotos.has(i));
      if (availableIndex !== -1) {
        usedPhotos.add(availableIndex);
        matched.push({ fact, photo: photos[availableIndex] });
      } else {
        matched.push({ fact, photo: null });
      }
    }
  });

  return matched;
}
