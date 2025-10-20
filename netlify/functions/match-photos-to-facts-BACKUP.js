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

    // Fetch photos for this location with AGGRESSIVE FALLBACK STRATEGY
    let photos = [];
    
    // TIER 1: Try specific location first
    let searchQuery = location || country;
    console.log('🔍 TIER 1: Searching for photos:', searchQuery);
    console.log('🔑 API Keys available:', {
      unsplash: !!unsplashKey,
      pexels: !!pexelsKey,
      replicate: !!process.env.REPLICATE_API_TOKEN,
      claude: !!process.env.ANTHROPIC_API_KEY
    });

    // Try Unsplash first
    if (unsplashKey) {
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`;
      
      console.log('📸 Calling Unsplash API...');
      const unsplashResponse = await fetch(unsplashUrl, {
        headers: { 'Authorization': `Client-ID ${unsplashKey}` }
      });

      if (unsplashResponse.ok) {
        const data = await unsplashResponse.json();
        console.log(`✅ Unsplash returned ${data.results?.length || 0} photos for "${searchQuery}"`);
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
        }
      } else {
        console.error('❌ Unsplash API error:', unsplashResponse.status);
      }
    }

    // TIER 2: Fallback to Pexels if Unsplash failed
    if (photos.length === 0 && pexelsKey) {
      console.log('� TIER 2: Trying Pexels for:', searchQuery);
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`;
      
      const pexelsResponse = await fetch(pexelsUrl, {
        headers: { 'Authorization': pexelsKey }
      });

      if (pexelsResponse.ok) {
        const data = await pexelsResponse.json();
        console.log(`✅ Pexels returned ${data.photos?.length || 0} photos for "${searchQuery}"`);
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
        }
      }
    }

    // TIER 3: Try just the COUNTRY name if specific location failed
    if (photos.length === 0 && country && location !== country) {
      console.log(`🔍 TIER 3: No photos for "${location}", trying country "${country}"...`);
      
      // Try Unsplash with country
      if (unsplashKey) {
        const fallbackUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(country)}&per_page=10&orientation=landscape`;
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: { 'Authorization': `Client-ID ${unsplashKey}` }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          console.log(`✅ Unsplash country fallback returned ${data.results?.length || 0} photos`);
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
          }
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
          }
        }
      }
    }

    // 🎨 NEW STRATEGY: ALWAYS GENERATE EDUCATIONAL AI INFOGRAPHICS!
    // Instead of generic stock photos, create custom educational visualizations
    console.log('🎨 Generating educational AI infographics for all facts...');
    console.log('📚 Applying 5 Themes of Geography + Gen Alpha design!');
    
    const replicateKey = process.env.REPLICATE_API_TOKEN;
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!replicateKey && !openaiKey) {
      console.log('❌ No AI image generation available (need Replicate or OpenAI key)');
      // Fall back to stock photos if available
      if (photos.length > 0) {
        return await matchWithStockPhotos(facts, photos, claudeKey, headers);
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          matched: facts.map(fact => ({ fact, photo: null })),
          source: 'none'
        })
      };
    }

    // Generate educational infographics for each fact
    const educationalInfographics = [];
    
    for (let i = 0; i < facts.length; i++) {
      const fact = facts[i];
      console.log(`🎨 Creating infographic ${i + 1}/${facts.length} for: "${fact.substring(0, 50)}..."`);
      
      try {
        // Step 1: Use Claude/GPT-4 to analyze fact and create infographic prompt
        let imagePrompt;
        
        if (claudeKey) {
          console.log('🧠 Using Claude to design educational infographic...');
          const promptCreationRequest = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': claudeKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-5-sonnet-latest',
              max_tokens: 400,
              temperature: 0.8,
              messages: [{
                role: 'user',
                content: `You are a Gen Alpha educational designer creating FIRE infographics for middle school students (ages 11-14).

📍 LOCATION: ${location}${country ? ', ' + country : ''}
📚 FACT TO VISUALIZE: "${fact}"

🎯 YOUR MISSION:
Create an image generation prompt for an educational infographic that:
1. Uses one of the 5 Themes of Geography (Location, Place, Human-Environment Interaction, Movement, Region)
2. Makes a real-world connection (compare to Minecraft, USA states, football fields, etc.)
3. Uses Gen Alpha aesthetic (bold colors, modern design, emoji-friendly, TikTok vibes)
4. Is 100% educational but ACTUALLY engaging (not boring textbook style)
5. Shows data visually (charts, comparisons, diagrams, maps)

🎨 STYLE REQUIREMENTS:
- Modern flat design or isometric illustration
- Bright, bold colors (not muted or pastel)
- Clear typography with big numbers/stats
- Visual comparisons that make facts memorable
- Age-appropriate (no childish cartoons, but not adult boring)
- Think: National Geographic meets TikTok infographics

💡 EXAMPLES OF GOOD PROMPTS:
- "Colorful infographic comparing Greenland's size to Texas using stacked silhouettes, bold numbers showing 836,331 sq miles, modern flat design, vibrant blue and green colors, educational poster style"
- "Isometric illustration showing Norway's coastline unfolded next to a map of Earth's circumference, bold typography, fun size comparison, bright colors, infographic style"
- "Modern diagram showing Arctic fox color change between seasons, split-screen summer/winter, bold labels, educational illustration, vibrant colors, clean design"

🚫 AVOID:
- Generic photographs
- Boring textbook diagrams
- Childish cartoon style
- Dark or muted colors
- Small text that's hard to read
- Too much detail (keep it simple!)

Respond with ONLY the image generation prompt (2-3 sentences max). Make it BUSSIN for Gen Alpha! 🔥`
              }]
            })
          });

          if (!promptCreationRequest.ok) {
            console.warn(`⚠️ Claude prompt creation failed for fact ${i + 1}`);
            continue;
          }

          const promptData = await promptCreationRequest.json();
          imagePrompt = promptData.content[0].text.trim();
          console.log(`✅ Claude designed infographic: "${imagePrompt.substring(0, 60)}..."`);
          
        } else if (openaiKey) {
          // Fallback to GPT-4 if Claude unavailable
          console.log('🧠 Using GPT-4 to design educational infographic...');
          const gptPromptRequest = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              max_tokens: 300,
              temperature: 0.8,
              messages: [{
                role: 'system',
                content: 'You are a Gen Alpha educational designer creating engaging infographics for middle school students.'
              }, {
                role: 'user',
                content: `Create an image generation prompt for this geography fact about ${location}: "${fact}"\n\nMake it: educational, visually striking, Gen Alpha friendly (bold colors, modern design), using 5 Themes of Geography, with real-world comparisons. Style: infographic, flat design, vibrant colors. Respond with ONLY the prompt (2-3 sentences).`
              }]
            })
          });
          
          if (!gptPromptRequest.ok) {
            console.warn(`⚠️ GPT-4 prompt creation failed for fact ${i + 1}`);
            continue;
          }
          
          const gptData = await gptPromptRequest.json();
          imagePrompt = gptData.choices[0].message.content.trim();
          console.log(`✅ GPT-4 designed infographic: "${imagePrompt.substring(0, 60)}..."`);
        } else {
          console.warn(`⚠️ No LLM available for prompt design for fact ${i + 1}`);
          continue;
        }

        // Step 2: Generate educational infographic using Replicate or DALL-E
        let imageUrl = null;
        
        if (replicateKey) {
          console.log('🎨 Using Replicate (Flux Schnell) to generate infographic...');
          const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${replicateKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              version: '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637', // Flux Schnell
              input: {
                prompt: imagePrompt,
                num_outputs: 1,
                aspect_ratio: '16:9',
                output_format: 'jpg',
                output_quality: 95
              }
            })
          });

          if (replicateResponse.ok) {
            const prediction = await replicateResponse.json();
            console.log(`⏳ Replicate prediction ID: ${prediction.id}`);

            // Poll for completion (max 30 seconds)
            for (let attempt = 0; attempt < 15; attempt++) {
              await new Promise(resolve => setTimeout(resolve, 2000));

              const statusResponse = await fetch(
                `https://api.replicate.com/v1/predictions/${prediction.id}`,
                { headers: { 'Authorization': `Token ${replicateKey}` } }
              );

              if (statusResponse.ok) {
                const status = await statusResponse.json();
                
                if (status.status === 'succeeded' && status.output && status.output[0]) {
                  imageUrl = status.output[0];
                  console.log(`✅ Replicate generated infographic ${i + 1}!`);
                  break;
                } else if (status.status === 'failed') {
                  console.warn(`❌ Replicate generation failed for fact ${i + 1}`);
                  break;
                }
              }
            }
          }
        }
        
        // Fallback to DALL-E if Replicate failed or unavailable
        if (!imageUrl && openaiKey) {
          console.log('🎨 Falling back to DALL-E 3...');
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
            const dalleData = await dalleResponse.json();
            imageUrl = dalleData.data[0].url;
            console.log(`✅ DALL-E generated infographic ${i + 1}!`);
          }
        }

        if (imageUrl) {
          educationalInfographics.push({
            fact,
            photo: {
              id: `educational-infographic-${i}`,
              url: imageUrl,
              thumbnail: imageUrl,
              photographer: '🎨 Educational AI Infographic',
              photographer_url: null,
              description: imagePrompt,
              source: 'educational-ai-infographic',
              aiGenerated: true,
              isEducationalInfographic: true
            }
          });
        } else {
          console.warn(`⚠️ No infographic generated for fact ${i + 1}`);
          educationalInfographics.push({ fact, photo: null });
        }

      } catch (error) {
        console.error(`❌ Error generating infographic for fact ${i + 1}:`, error.message);
        educationalInfographics.push({ fact, photo: null });
      }
    }

    const successCount = educationalInfographics.filter(p => p.photo).length;
    console.log(`🎨 Generated ${successCount}/${facts.length} educational infographics`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        matched: educationalInfographics,
        source: 'educational-ai-infographics'
      })
    };
  }

  // Helper function for stock photo matching (old behavior, only used if AI gen fails)
  async function matchWithStockPhotos(facts, photos, claudeKey, headers) {

    console.log(`✅ Stock photos available: ${photos.length} photos`);
    
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
    console.log('🤖 Starting Claude AI matching...');
    const matchingPrompt = createMatchingPrompt(facts, photos, location);
    console.log(`📝 Prompt length: ${matchingPrompt.length} characters`);
    
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: matchingPrompt
        }]
      })
    });

    console.log(`🤖 Claude response status: ${claudeResponse.status}`);    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error(`❌ Claude API error ${claudeResponse.status}:`, errorText);
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    const responseText = claudeData.content[0].text;
    console.log('🤖 Claude response received:', responseText.substring(0, 200) + '...');
    
    // Parse Claude's matching recommendations
    console.log('🔍 Parsing Claude matching...');
    let matched = parseClaudeMatching(responseText, facts, photos);
    console.log(`✅ Parsed ${matched.length} matches`);
    console.log(`🔍 First match:`, JSON.stringify(matched[0]));
    
    const nullCount = matched.filter(m => m.photo === null).length;
    console.log(`⚠️ ${nullCount} out of ${matched.length} facts have null photos`);
    
    // 🚨 CRITICAL: If Claude matching failed, fall back to keyword matching
    if (nullCount === matched.length) {
      console.warn('❌ Claude matching returned ALL NULLS! Falling back to keyword matching...');
      matched = simpleMatchPhotosToFacts(facts, photos);
      const keywordNullCount = matched.filter(m => m.photo === null).length;
      console.log(`🔄 Keyword matching: ${matched.length - keywordNullCount} matches, ${keywordNullCount} nulls`);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        matched, 
        source: nullCount === matched.length ? 'keyword-fallback' : 'ai-matched'
      })
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
