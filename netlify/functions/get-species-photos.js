// Netlify Function: Get Kid-Safe Species Photos
// Endpoint: POST /.netlify/functions/get-species-photos
// 
// PURPOSE: Fetch educational, kid-safe photos of marine species
// GUARDRAILS: 
// - Strict content filtering (safe search ON)
// - Educational context queries
// - Fallback to curated safe image services

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
    const { speciesName } = JSON.parse(event.body);
    
    if (!speciesName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing speciesName' })
      };
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const pexelsKey = process.env.PEXELS_API_KEY;
    
    if (!unsplashKey && !pexelsKey) {
      console.log('❌ No photo APIs available');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ photo: null, source: 'none' })
      };
    }

    // Add educational context to queries for better filtering
    const educationalQuery = `${speciesName} ocean marine life educational`;
    let photo = null;

    // ========================================
    // TIER 1: Unsplash (naturally curated, high quality)
    // ========================================
    if (unsplashKey) {
      console.log(`🔍 TIER 1: Unsplash search for "${educationalQuery}"`);
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(educationalQuery)}&per_page=5&orientation=landscape&content_filter=high`;
      
      try {
        const response = await fetch(url, {
          headers: { 'Authorization': `Client-ID ${unsplashKey}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            // Pick the first result (most relevant)
            const result = data.results[0];
            console.log(`✅ TIER 1 SUCCESS: Found photo for ${speciesName}`);
            photo = {
              id: result.id,
              url: result.urls.regular,
              thumbnail: result.urls.small,
              photographer: result.user.name,
              photographer_url: result.user.links.html,
              description: result.description || result.alt_description || '',
              source: 'unsplash'
            };
          } else {
            console.log('❌ TIER 1: No results');
          }
        }
      } catch (error) {
        console.error('Unsplash error:', error.message);
      }
    }

    // ========================================
    // TIER 2: Pexels (also curated, safe content)
    // ========================================
    if (!photo && pexelsKey) {
      console.log(`🔍 TIER 2: Pexels search for "${speciesName}"`);
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(speciesName + ' ocean')}&per_page=5&orientation=landscape`;
      
      try {
        const response = await fetch(url, {
          headers: { 'Authorization': pexelsKey }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
            const result = data.photos[0];
            console.log(`✅ TIER 2 SUCCESS: Found photo for ${speciesName}`);
            photo = {
              id: result.id,
              url: result.src.large,
              thumbnail: result.src.medium,
              photographer: result.photographer,
              photographer_url: result.photographer_url,
              description: `${speciesName} photograph`,
              source: 'pexels'
            };
          } else {
            console.log('❌ TIER 2: No results');
          }
        }
      } catch (error) {
        console.error('Pexels error:', error.message);
      }
    }

    // ========================================
    // TIER 3: Simplified species name (remove "Deep Sea", etc.)
    // ========================================
    if (!photo && unsplashKey) {
      const simplifiedName = speciesName.replace(/Deep Sea |Giant |Colossal |Great White /gi, '').trim();
      if (simplifiedName !== speciesName) {
        console.log(`🔍 TIER 3: Trying simplified name "${simplifiedName}"`);
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(simplifiedName + ' ocean')}&per_page=3&orientation=landscape&content_filter=high`;
        
        try {
          const response = await fetch(url, {
            headers: { 'Authorization': `Client-ID ${unsplashKey}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              console.log(`✅ TIER 3 SUCCESS: Found photo for ${simplifiedName}`);
              photo = {
                id: result.id,
                url: result.urls.regular,
                thumbnail: result.urls.small,
                photographer: result.user.name,
                photographer_url: result.user.links.html,
                description: result.description || result.alt_description || '',
                source: 'unsplash'
              };
            }
          }
        } catch (error) {
          console.error('Tier 3 error:', error.message);
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        species: speciesName,
        photo: photo,
        cached: false 
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch species photo',
        details: error.message 
      })
    };
  }
};
