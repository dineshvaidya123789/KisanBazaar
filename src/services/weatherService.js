import { locationData } from '../data/locationData';

const API_KEY = 'zpka_3e36f919d14b482bab42a3647f93c313_8fbe4bad';
const BASE_URL = 'http://dataservice.accuweather.com';

const weatherCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getWeather = async (query, days = 5) => { // Days ignored, AW gives 1, 5, 10, 15
    const cacheKey = `aw-${query}`;
    const cached = weatherCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        // Step 1: Search for Location Key
        const locationKey = await getLocationKey(query);
        if (!locationKey) throw new Error('Location not found');

        // Step 2: Parallel Fetch (Current + Forecast)
        const [current, forecast] = await Promise.all([
            fetch(`${BASE_URL}/currentconditions/v1/${locationKey.Key}?apikey=${API_KEY}&details=true`),
            fetch(`${BASE_URL}/forecasts/v1/daily/5day/${locationKey.Key}?apikey=${API_KEY}&metric=true`)
        ]);

        if (!current.ok || !forecast.ok) throw new Error('Weather API Error');

        const currentData = await current.json();
        const forecastData = await forecast.json();

        const transformed = transformAccuWeatherData(currentData[0], forecastData, locationKey);

        weatherCache.set(cacheKey, { data: transformed, timestamp: Date.now() });
        return transformed;

    } catch (error) {
        console.error('Weather Fail:', error);
        return getFallbackWeather(query);
    }
};

export const clearWeatherCache = () => {
    weatherCache.clear();
    console.log('🗑️ Weather cache cleared');
};

export const getCacheStatus = () => {
    return {
        size: weatherCache.size,
        keys: Array.from(weatherCache.keys())
    };
};

const getLocationKey = async (query) => {
    // Sanitize: AccuWeather search works best with "City" or "City, State"
    // Remove "Tehsil" word if present? No, let's just pass the query.
    // Ensure URL encoding.
    const url = `${BASE_URL}/locations/v1/cities/search?apikey=${API_KEY}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data && data.length > 0 ? data[0] : null;
};

// ... Transformer and Icon Mapper ...
const transformAccuWeatherData = (current, forecast, location) => {
    return {
        current: {
            temp: Math.round(current.Temperature.Metric.Value),
            condition: current.WeatherText,
            humidity: current.RelativeHumidity,
            wind: `${Math.round(current.Wind?.Speed?.Metric?.Value || 0)} km/h`,
            feelsLike: Math.round(current.RealFeelTemperature?.Metric?.Value || current.Temperature.Metric.Value),
            uv: current.UVIndex,
            visibility: current.Visibility?.Metric?.Value,
            pressure: current.Pressure?.Metric?.Value,
            windDir: current.Wind?.Direction?.English,
            rainProb: current.PrecipitationSummary?.Precipitation?.Metric?.Value > 0 ? 'High' : 'Low',
            icon: getWeatherEmoji(current.WeatherIcon),
            lastUpdated: new Date(current.LocalObservationDateTime).toLocaleTimeString(),
        },
        forecast: forecast.DailyForecasts.map((day, index) => {
            const date = new Date(day.Date);
            const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            return {
                day: dayName,
                date: day.Date,
                temp: Math.round((day.Temperature.Maximum.Value + day.Temperature.Minimum.Value) / 2),
                maxTemp: Math.round(day.Temperature.Maximum.Value),
                minTemp: Math.round(day.Temperature.Minimum.Value),
                condition: day.Day.IconPhrase,
                icon: getWeatherEmoji(day.Day.Icon),
                rainChance: day.Day.PrecipitationProbability || 0,
                humidity: 50, // AccuWeather basic forecast doesn't always have humidity in this endpoint
                maxWind: Math.round(day.Day.Wind?.Speed?.Value || 0)
            };
        }),
        alerts: [],
        location: {
            name: location.LocalizedName,
            region: location.AdministrativeArea.LocalizedName,
            country: location.Country.LocalizedName
        }
    };
};

const getWeatherEmoji = (iconCode) => {
    if (iconCode >= 1 && iconCode <= 5) return '☀️'; // Sunny
    if (iconCode >= 6 && iconCode <= 8) return '☁️'; // Cloudy
    if (iconCode === 11) return '🌫️'; // Fog
    if ((iconCode >= 12 && iconCode <= 14) || iconCode === 18) return '🌧️'; // Rain
    if (iconCode >= 15 && iconCode <= 17) return '⛈️'; // T-Storms
    if (iconCode >= 19 && iconCode <= 21) return '❄️'; // Snow
    if (iconCode >= 22 && iconCode <= 29) return '❄️'; // Snow/Ice
    if (iconCode >= 33 && iconCode <= 36) return '🌙'; // Night Clear
    return '🌤️';
};

const getFallbackWeather = (city) => {
    // Sanitize input
    const searchName = city.split(',')[0].trim();
    console.log('⚠️ Using fallback weather data for', searchName);

    // Dynamic State Lookup
    let foundState = 'Unknown Region';

    // Search in locationData
    for (const [state, districts] of Object.entries(locationData)) {
        if (districts[searchName]) {
            foundState = state;
            break;
        }
        for (const districtData of Object.values(districts)) {
            if (districtData.tehsils && districtData.tehsils.includes(searchName)) {
                foundState = state;
                break;
            }
        }
        if (foundState !== 'Unknown Region') break;
    }

    if (foundState === 'Unknown Region') foundState = 'Madhya Pradesh';

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
            { day: 'Today', temp: 24, maxTemp: 28, minTemp: 18, icon: '⛅', condition: 'Partly Cloudy', rainChance: 10 },
            { day: 'Tomorrow', temp: 25, maxTemp: 29, minTemp: 19, icon: '☀️', condition: 'Sunny', rainChance: 0 },
            { day: 'Day 3', temp: 23, maxTemp: 27, minTemp: 17, icon: '☁️', condition: 'Cloudy', rainChance: 20 },
            { day: 'Day 4', temp: 24, maxTemp: 28, minTemp: 18, icon: '⛅', condition: 'Partly Cloudy', rainChance: 10 },
            { day: 'Day 5', temp: 25, maxTemp: 29, minTemp: 19, icon: '☀️', condition: 'Sunny', rainChance: 0 }
        ],
        alerts: [],
        location: { name: city, region: foundState, country: 'India' },
        isFallback: true
    };
};
