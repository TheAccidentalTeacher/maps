// Netlify Function: Get Photos from Unsplash or Pexels
// Endpoint: /.netlify/functions/get-photos?location=Paris&query=eiffel+tower

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

  try {
    const { location, query } = event.queryStringParameters;
    
    if (!location && !query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing location or query parameter' })
      };
    }

    const searchQuery = query || location;
    
    // Try Unsplash first (better quality)
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    
    if (unsplashKey) {
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`;
      
      const unsplashResponse = await fetch(unsplashUrl, {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      });

      if (unsplashResponse.ok) {
        const data = await unsplashResponse.json();
        
        if (data.results && data.results.length > 0) {
          const photos = data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            photographer: photo.user.name,
            photographer_url: photo.user.links.html,
            description: photo.description || photo.alt_description,
            source: 'unsplash'
          }));

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ photos, source: 'unsplash' })
          };
        }
      }
    }

    // Fallback to Pexels
    const pexelsKey = process.env.PEXELS_API_KEY;
    
    if (pexelsKey) {
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`;
      
      const pexelsResponse = await fetch(pexelsUrl, {
        headers: {
          'Authorization': pexelsKey
        }
      });

      if (pexelsResponse.ok) {
        const data = await pexelsResponse.json();
        
        if (data.photos && data.photos.length > 0) {
          const photos = data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large,
            thumbnail: photo.src.medium,
            photographer: photo.photographer,
            photographer_url: photo.photographer_url,
            description: photo.alt,
            source: 'pexels'
          }));

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ photos, source: 'pexels' })
          };
        }
      }
    }

    // No photos found
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ photos: [], source: 'none' })
    };

  } catch (error) {
    console.error('Error fetching photos:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch photos', message: error.message })
    };
  }
};
