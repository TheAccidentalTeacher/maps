// Netlify Function: Generate AI Photo Caption
// Endpoint: POST /.netlify/functions/generate-photo-caption
// 
// Optional enhancement: Generates educational captions for photos
// using Claude AI. Falls back gracefully if unavailable.

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
    const { photoDescription, location, country } = JSON.parse(event.body);
    
    // Return simple fallback if no AI key
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    if (!claudeKey) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          caption: photoDescription || `A view of ${location || country || 'this location'}`,
          source: 'fallback'
        })
      };
    }

    // Generate educational caption using Claude
    const prompt = `You are helping write a brief, engaging caption for a photo about ${location || country}.

Photo description: ${photoDescription || 'No description'}

Write a single sentence (15-25 words) that:
- Is educational and interesting for middle school students
- Connects the photo to the location's culture, geography, or significance
- Uses clear, accessible language
- Avoids clichés

Just respond with the caption sentence, nothing else.`;

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    const caption = claudeData.content[0].text.trim();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ caption, source: 'ai-generated' })
    };

  } catch (error) {
    console.error('Error generating caption:', error);
    
    // Fallback to simple caption
    try {
      const { photoDescription, location, country } = JSON.parse(event.body);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          caption: photoDescription || `A view of ${location || country || 'this location'}`,
          source: 'error-fallback'
        })
      };
    } catch {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to generate caption' })
      };
    }
  }
};
