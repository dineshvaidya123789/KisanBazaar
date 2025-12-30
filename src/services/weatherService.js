// Weather API Service using WeatherAPI.com
// Free tier: 1M calls/month, perfect for our needs!

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Cache to reduce API calls and improve performance
const weatherCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get current weather and forecast for a city
 * @param {string} city - City name (e.g., "Indore", "Bhopal")
 * @param {number} days - Number of forecast days (1-3 for free tier)
 * @returns {Promise<Object>} Weather data
 */
export const getWeather = async (city, days = 3) => {
    // Check cache first
    const cacheKey = `${city}-${days}`;
    const cached = weatherCache.get(cacheKey);

    // Check if API key is configured
    if (!API_KEY || API_KEY === 'demo_key' || API_KEY === 'your_api_key_here') {
        console.warn('⚠️ Weather API key not configured. Using fallback data.');
        return getFallbackWeather(city);
    }

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached weather data for', city);
        return cached.data;
    }

    try {
        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city},India&days=${days}&aqi=yes&alerts=yes`;

        console.log('🌤️ Fetching weather data for', city);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform API response to our format
        const transformedData = transformWeatherData(data);

        // Cache the result
        weatherCache.set(cacheKey, {
            data: transformedData,
            timestamp: Date.now()
        });

        return transformedData;
    } catch (error) {
        console.error('❌ Error fetching weather:', error);

        // Return fallback mock data if API fails
        return getFallbackWeather(city);
    }
};

/**
 * Transform WeatherAPI.com response to our app format
 */
const transformWeatherData = (apiData) => {
    const { current, forecast, alerts } = apiData;

    return {
        current: {
            temp: Math.round(current.temp_c),
            condition: current.condition.text,
            humidity: current.humidity,
            wind: `${Math.round(current.wind_kph)} km/h`,
            feelsLike: Math.round(current.feelslike_c),
            uv: current.uv,
            visibility: current.vis_km,
            pressure: current.pressure_mb,
            windDir: current.wind_dir,
            rainProb: forecast.forecastday[0]?.day?.daily_chance_of_rain + '%' || '0%',
            icon: current.condition.icon,
            lastUpdated: current.last_updated
        },
        forecast: forecast.forecastday.map((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 ? 'Today' :
                date.toLocaleDateString('en-US', { weekday: 'short' });

            return {
                day: dayName,
                date: day.date,
                temp: Math.round(day.day.avgtemp_c),
                maxTemp: Math.round(day.day.maxtemp_c),
                minTemp: Math.round(day.day.mintemp_c),
                condition: day.day.condition.text,
                icon: getWeatherEmoji(day.day.condition.text),
                rainChance: day.day.daily_chance_of_rain,
                humidity: day.day.avghumidity,
                maxWind: Math.round(day.day.maxwind_kph)
            };
        }),
        alerts: alerts?.alert || [],
        location: {
            name: apiData.location.name,
            region: apiData.location.region,
            country: apiData.location.country
        }
    };
};

/**
 * Get appropriate emoji for weather condition
 */
const getWeatherEmoji = (condition) => {
    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return '☀️';
    if (lowerCondition.includes('partly cloudy')) return '⛅';
    if (lowerCondition.includes('cloudy') || lowerCondition.includes('overcast')) return '☁️';
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return '🌧️';
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return '⛈️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️';
    if (lowerCondition.includes('wind')) return '💨';

    return '🌤️'; // Default
};

/**
 * Fallback mock weather data when API fails
 */
const getFallbackWeather = (city) => {
    console.log('⚠️ Using fallback weather data for', city);

    return {
        current: {
            temp: 24,
            condition: 'Partly Cloudy',
            humidity: 45,
            wind: '12 km/h',
            feelsLike: 25,
            uv: 5,
            visibility: 10,
            pressure: 1013,
            windDir: 'NW',
            rainProb: '10%',
            lastUpdated: new Date().toLocaleString()
        },
        forecast: [
            { day: 'Today', temp: 24, maxTemp: 28, minTemp: 18, icon: '⛅', condition: 'Partly Cloudy (आंशिक बादल)', rainChance: 10 },
            { day: 'Mon', temp: 25, maxTemp: 29, minTemp: 19, icon: '☀️', condition: 'Sunny (धूप)', rainChance: 0 },
            { day: 'Tue', temp: 23, maxTemp: 27, minTemp: 17, icon: '☁️', condition: 'Cloudy (बादल)', rainChance: 20 }
        ],
        alerts: [],
        location: { name: city, region: 'Madhya Pradesh', country: 'India' },
        isFallback: true
    };
};

/**
 * Clear weather cache (useful for refresh)
 */
export const clearWeatherCache = () => {
    weatherCache.clear();
    console.log('🗑️ Weather cache cleared');
};

/**
 * Get cache status for debugging
 */
export const getCacheStatus = () => {
    return {
        size: weatherCache.size,
        keys: Array.from(weatherCache.keys())
    };
};
