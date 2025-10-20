// Netlify Function: Generate Geography in Real Life Applications
// Endpoint: POST /.netlify/functions/generate-real-life-geography
//
// Uses AI to create practical, student-safe applications of the 5 Themes of Geography
// with special focus on middle school student life (ages 11-14)
//
// 🛡️ SAFETY FEATURES:
// - Content filtering for age-appropriateness
// - No personal information requests
// - No location tracking or home addresses
// - Educational focus only
// - Positive, inclusive language
// - No controversial topics

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

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
    const { location, country, facts } = JSON.parse(event.body);
    
    if (!location) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Location required' })
      };
    }

    console.log(`🌍 Generating real-life geography for ${location}...`);

    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!claudeKey && !openaiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'No AI provider available' })
      };
    }

    // Create the prompt with STRICT SAFETY GUIDELINES
    const prompt = createSafePrompt(location, country, facts);
    
    // Try Claude first (preferred for safety)
    let themes = null;
    if (claudeKey) {
      themes = await generateWithClaude(prompt, claudeKey);
    }
    
    // Fallback to GPT-4
    if (!themes && openaiKey) {
      themes = await generateWithGPT4(prompt, openaiKey);
    }

    if (!themes) {
      throw new Error('Failed to generate content');
    }

    // 🛡️ SAFETY CHECK: Filter content before sending to students
    const safeThemes = applySafetyFilter(themes);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        themes: safeThemes,
        location,
        generated: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate geography content' })
    };
  }
};

/**
 * Create prompt with strict safety guidelines
 */
function createSafePrompt(location, country, facts) {
  const factsContext = facts && facts.length > 0 
    ? `\n\nFACTS ABOUT ${location.toUpperCase()}:\n${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}`
    : '';

  return `You are an educational AI creating safe, engaging geography content for middle school students (ages 11-14).

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
}

/**
 * Generate with Claude (preferred for safety)
 */
async function generateWithClaude(prompt, apiKey) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.content[0].text.trim();
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ Claude generated', parsed.themes?.length || 0, 'themes');
      return parsed.themes;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Claude error:', error.message);
    return null;
  }
}

/**
 * Generate with GPT-4 (fallback)
 */
async function generateWithGPT4(prompt, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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

    if (!response.ok) {
      console.error('GPT-4 API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const parsed = JSON.parse(content);
    console.log('✅ GPT-4 generated', parsed.themes?.length || 0, 'themes');
    return parsed.themes;
  } catch (error) {
    console.error('❌ GPT-4 error:', error.message);
    return null;
  }
}

/**
 * 🛡️ SAFETY FILTER: Check content before showing to students
 */
function applySafetyFilter(themes) {
  if (!themes || !Array.isArray(themes)) {
    return [];
  }

  // Blocked words/phrases (case-insensitive)
  const blockedPatterns = [
    /\b(address|phone\s*number|real\s*name|where\s*you\s*live|your\s*home)\b/i,
    /\b(share\s*your\s*location|tell\s*me\s*where|post\s*your)\b/i,
    /\b(politics|political|religion|religious|war|violence|terrorist)\b/i,
    /\b(hate|racist|sexist|discriminat)\b/i,
    /\b(drug|alcohol|weapon|gun)\b/i,
    /\b(suicide|self[- ]harm|kill)\b/i,
    /\b(sexy|sexual|porn|nude)\b/i,
    /\b(password|credit\s*card|social\s*security)\b/i
  ];

  return themes.filter(theme => {
    if (!theme || !theme.explanation || !theme.studentApplication) {
      return false;
    }

    const combinedText = `${theme.explanation} ${theme.studentApplication}`.toLowerCase();
    
    // Check for blocked patterns
    for (const pattern of blockedPatterns) {
      if (pattern.test(combinedText)) {
        console.warn(`⚠️ SAFETY FILTER: Blocked theme "${theme.name}" - matched pattern: ${pattern}`);
        return false;
      }
    }

    // Must be educational and appropriate length
    if (theme.explanation.length < 50 || theme.explanation.length > 500) {
      console.warn(`⚠️ SAFETY FILTER: Blocked theme "${theme.name}" - invalid length`);
      return false;
    }

    return true;
  }).slice(0, 3); // Max 3 themes
}
