// Netlify Function: Get AI Facts About Ocean Species
// Endpoint: POST /.netlify/functions/get-species-ai-facts
// 
// PURPOSE: Generate educational, engaging facts about marine species using Claude/OpenAI
// GUARDRAILS: Kid-friendly content, educational focus, accurate information

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
    const { speciesName, speciesData } = JSON.parse(event.body);
    
    if (!speciesName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing speciesName' })
      };
    }

    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!claudeKey && !openaiKey) {
      console.log('❌ No AI APIs available');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ error: 'No AI service available', facts: null })
      };
    }

    // Build the AI prompt
    const baseInfo = speciesData ? `
Known info about ${speciesName}:
- Zone: ${speciesData.zone}
- Depth Range: ${speciesData.depth}
- Diet: ${speciesData.diet}
- Size: ${speciesData.size}
- Rarity: ${speciesData.rarity}
` : '';

    const prompt = `You are an ocean educator teaching kids (ages 8-14) about marine life.

${baseInfo}

Generate educational facts about the ${speciesName}. Make it engaging and kid-friendly!

Provide EXACTLY this JSON format (no markdown, no extra text):
{
  "fun_fact": "A super interesting fact that will blow their minds (1-2 sentences)",
  "habitat": "Where they live and what their environment is like (1-2 sentences)",
  "diet": "What they eat and how they hunt/gather food (1-2 sentences)",
  "conservation_status": "Are they endangered? What threats do they face? (1-2 sentences)",
  "interesting_behavior": "A cool behavior or adaptation that makes them unique (1-2 sentences)"
}

Keep each fact under 150 characters. Use simple language. Be accurate but exciting!`;

    let aiFacts = null;

    // TRY CLAUDE FIRST (preferred)
    if (claudeKey) {
      console.log(`🧠 Asking Claude about ${speciesName}...`);
      
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.content[0].text;
          console.log('✅ Claude response received');
          
          // Parse JSON from response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiFacts = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully parsed Claude facts');
          }
        } else {
          console.log('❌ Claude API error:', response.status);
        }
      } catch (error) {
        console.error('Claude error:', error.message);
      }
    }

    // FALLBACK TO OPENAI
    if (!aiFacts && openaiKey) {
      console.log(`🧠 Asking OpenAI about ${speciesName}...`);
      
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'system',
              content: 'You are an ocean educator. Always respond with valid JSON only, no markdown.'
            }, {
              role: 'user',
              content: prompt
            }],
            temperature: 0.7,
            max_tokens: 800
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0].message.content;
          console.log('✅ OpenAI response received');
          
          // Parse JSON from response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiFacts = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully parsed OpenAI facts');
          }
        } else {
          console.log('❌ OpenAI API error:', response.status);
        }
      } catch (error) {
        console.error('OpenAI error:', error.message);
      }
    }

    if (!aiFacts) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to generate AI facts',
          facts: null 
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        species: speciesName,
        facts: aiFacts,
        source: claudeKey && aiFacts ? 'claude' : 'openai'
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get species AI facts',
        details: error.message 
      })
    };
  }
};
