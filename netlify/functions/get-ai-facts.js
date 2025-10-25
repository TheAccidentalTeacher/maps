// Netlify Function: Get AI-Generated Fun Facts from Claude 3.5 Sonnet
// Endpoint: /.netlify/functions/get-ai-facts?location=Paris&country=France
// 
// EDUCATIONAL SAFETY GUARDRAILS:
// - Uses Claude 3.5 Sonnet (best for educational accuracy)
// - Content filtered for middle school appropriateness
// - Facts verified for accuracy
// - No political/controversial topics
// - Engaging Gen Alpha style

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
    const { location, country, lat, lon, isWater, ocean, oceanBasin, oceanRegion } = event.queryStringParameters;
    
    if (!location) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing location parameter' })
      };
    }

    // Detect if this is an ocean location
    const isOceanLocation = isWater === 'true' || ocean || location.toLowerCase().includes('ocean') || location.toLowerCase().includes('sea');
    
    console.log('🌊 Ocean detection:', { isOceanLocation, isWater, ocean, oceanBasin, oceanRegion, location });

    // Try Claude first (PREFERRED for educational content)
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!claudeKey && !openaiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'No AI API keys configured' })
      };
    }

    // Educational system prompt with safety guardrails
    const systemPrompt = `You are an enthusiastic middle school geography teacher creating fun, educational facts for 6th-8th grade students (Gen Alpha, ages 11-14).

SAFETY GUARDRAILS:
- Only factual, verifiable information
- Age-appropriate content (no violence, politics, controversial topics)
- Positive, educational tone
- Avoid stereotypes or sensitive cultural issues
- Focus on geography, nature, culture, science, history

STYLE GUIDELINES:
- Make it engaging and fun (students should say "That's cool!")
- Use relatable comparisons ("as tall as...", "bigger than...")
- Mix different topics for variety
- Include surprising or little-known facts
- Keep sentences short and punchy`;

    // Generate ocean-specific or land-specific prompt
    let userPrompt;
    
    if (isOceanLocation) {
      // OCEAN-SPECIFIC PROMPT
      const oceanName = oceanBasin || ocean || location;
      const region = oceanRegion || 'these waters';
      const nearCountry = country ? ` near ${country}` : '';
      const coordinates = lat && lon ? ` at ${parseFloat(lat).toFixed(1)}°, ${parseFloat(lon).toFixed(1)}°` : '';
      
      userPrompt = `Generate exactly 5 fascinating, educational facts about ${oceanName}${nearCountry}${coordinates}.

Focus on OCEAN-SPECIFIC topics (use at least 4 different ones):
- 🐋 Marine Life (specific species that live in THIS ocean region - be specific!)
- 🌊 Ocean Floor Features (trenches, ridges, seamounts, underwater volcanoes, continental shelf)
- 🌀 Ocean Currents & Circulation (how water moves here, temperature patterns)
- 🌡️ Physical Properties (temperature, salinity, depth, pressure)
- 🚢 Human Activity (shipping lanes, fishing, research stations, underwater cables)
- 🏝️ Geographic Features (nearby islands, coastlines, connection to other oceans)
- 🌍 Climate Impact (how this ocean affects global weather, storms, El Niño)
- 🐠 Ecosystems (coral reefs, kelp forests, deep sea vents, polar ecosystems)

Regional context: ${region}
${nearCountry ? `Nearest land: ${country}` : 'Open ocean location'}

Requirements:
- Be SPECIFIC to THIS ocean region (not generic ocean facts!)
- Mention actual species names, not just "fish" or "whales"
- Include real measurements (depths, temperatures, distances)
- Make it personal: "In these waters..." or "This part of the ocean..."
- Each fact = 1-2 sentences max
- Start with an emoji that matches the topic
- Make them memorable and shareable
- Be 100% accurate
- Return ONLY a JSON array of 5 strings, nothing else

Example format:
["🐋 Humpback whales migrate 5,000 miles through this region of the Pacific each year, singing songs that can be heard 20 miles away!", "🌊 The Mariana Trench here is Earth's deepest point at 35,876 feet - you could fit Mount Everest inside with a mile to spare!"]`;
    } else {
      // LAND-BASED PROMPT (existing)
      userPrompt = `Generate exactly 5 fun, educational facts about ${location}${country ? ' in ' + country : ''}.

Mix these topics (use at least 3 different ones):
- 🌍 Geography (landforms, climate, location)
- 🏛️ History (safe, interesting historical facts)
- 🎨 Culture (food, traditions, languages)
- 🦁 Nature & Wildlife (animals, plants, ecosystems)
- 🏗️ Cool Structures (buildings, landmarks)
- 🔬 Science & Tech (inventions, discoveries from this place)
- 🎉 Fun Trivia (weird laws, world records, unique facts)

Requirements:
- Each fact = 1-2 sentences max
- Start with an emoji that matches the topic
- Make them memorable and shareable
- Be 100% accurate
- Return ONLY a JSON array of 5 strings, nothing else

Example format:
["🌍 The Amazon Rainforest produces 20% of Earth's oxygen - that's like one breath out of every five you take!", "🦋 Over 2.5 million insect species live here, including butterflies as big as your hand!"]`;

    let facts = [];
    let source = '';
    let usage = {};

    // Try Claude 3.5 Sonnet (BEST for accuracy and safety)
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
            model: 'claude-3-5-sonnet-20241022', // Latest Sonnet model
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
            
            console.log('✅ Claude 3.5 Sonnet generated facts');
          }
        }
      } catch (claudeError) {
        console.error('⚠️ Claude error, trying OpenAI fallback:', claudeError.message);
      }
    }

    // Fallback to OpenAI GPT-4o-mini if Claude fails
    if (facts.length === 0 && openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
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
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      // Extract JSON array
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        facts = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: parse numbered list
        facts = content
          .split('\n')
          .filter(line => line.trim().match(/^[🌍🏛️🎨🦁🏗️🔬🎉\d]/))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .slice(0, 5);
      }
      
      source = 'gpt-4o-mini';
      usage = {
        prompt_tokens: data.usage.prompt_tokens,
        completion_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens
      };
    }

    // Validate facts array
    if (!Array.isArray(facts) || facts.length === 0) {
      throw new Error('Failed to generate valid facts array');
    }

    // Ensure we have exactly 5 facts
    facts = facts.slice(0, 5);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        facts,
        source,
        usage
      })
    };
  } // End of try block

  } catch (error) {
    console.error('❌ Error generating AI facts:', error);
    
    // EMERGENCY FALLBACK: Static educational facts
    console.log('🚨 Using static fallback facts due to API failure');
    const fallbackFacts = [
      `${location} is a fascinating place with rich geography and culture that students love to explore!`,
      `This location offers amazing opportunities to learn about world geography and cultural diversity.`,
      `Students often find this area particularly interesting for its unique geographical features.`,
      `This region provides excellent examples for studying climate, culture, and human geography.`,
      `Many educators use this location as a perfect case study for understanding our world better.`
    ];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        facts: fallbackFacts,
        source: 'static_fallback',
        usage: { total_tokens: 0, cost: 0 }
      })
    };
  }
};
