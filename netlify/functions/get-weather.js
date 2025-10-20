// Netlify Function: Get Weather Data from OpenWeatherMap
// Endpoint: /.netlify/functions/get-weather?lat=48.8566&lon=2.3522

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
    const { lat, lon } = event.queryStringParameters;
    
    if (!lat || !lon) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing lat or lon parameter' })
      };
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.error('❌ OPENWEATHER_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenWeatherMap API key not configured' })
      };
    }
    
    console.log('✅ Weather API key found, fetching weather for:', lat, lon);

    // Get current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();

    // Format weather data to match frontend expectations
    const tempF = Math.round(data.main.temp);
    const tempC = Math.round((data.main.temp - 32) * 5/9);
    const visibilityMiles = Math.round(data.visibility * 0.000621371); // meters to miles
    
    // Get wind direction as compass direction
    const getWindDirection = (deg) => {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      return directions[Math.round(deg / 22.5) % 16];
    };
    
    const weather = {
      temp: {
        fahrenheit: tempF,
        celsius: tempC
      },
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind: {
        speed: Math.round(data.wind.speed),
        direction: getWindDirection(data.wind.deg),
        degrees: data.wind.deg
      },
      clouds: data.clouds.all,
      visibility: visibilityMiles,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      city: data.name
    };
    
    console.log('✅ Weather data formatted successfully:', weather.temp.fahrenheit + '°F');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ weather })
    };

  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch weather', message: error.message })
    };
  }
};
