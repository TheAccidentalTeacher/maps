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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenWeatherMap API key not configured' })
      };
    }

    // Get current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();

    // Format weather data
    const weather = {
      temp: Math.round(data.main.temp),
      temp_celsius: Math.round((data.main.temp - 32) * 5/9),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: Math.round(data.wind.speed),
      wind_direction: data.wind.deg,
      clouds: data.clouds.all,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      city: data.name
    };

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
