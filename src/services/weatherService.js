import { locationData } from '../data/locationData';

// Weather comes from Open-Meteo (https://open-meteo.com): free for non-commercial use, no API key, data licence CC BY 4.0
// (the Weather page shows the required credit). Switch to their paid plan before charging subscriptions.
// Replaced the old AccuWeather calls on 2026-11-19: their key was not valid (every call answered 403), so only the
// fixed fallback text below was ever shown.
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const weatherCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getWeather = async (query, days = 5) => { // days is ignored: the forecast is always 5 days
    const cacheKey = `om-${query}`;
    const cached = weatherCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        // Step 1: find the place ("Tehsil, State" or "District, State")
        const place = await findPlace(query);
        if (!place) throw new Error('Location not found');

        // Step 2: current weather + 5 day forecast in one call
        const params = new URLSearchParams({
            latitude: String(place.latitude),
            longitude: String(place.longitude),
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,relative_humidity_2m_mean',
            timezone: 'auto',
            forecast_days: '5'
        });
        const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
        if (!res.ok) throw new Error('Weather API Error');
        const data = await res.json();
        if (!data.current || !data.daily) throw new Error('Weather API returned no data');

        const transformed = transformOpenMeteoData(data, place);
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

// "Satara, Maharashtra" -> the first Indian match whose state name fits, else the first Indian match.
const findPlace = async (query) => {
    const [rawName, rawState] = String(query || '').split(',').map(s => s.trim());
    if (!rawName) return null;
    const params = new URLSearchParams({ name: rawName, count: '10', language: 'en', format: 'json', countryCode: 'IN' });
    const res = await fetch(`${GEOCODE_URL}?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];
    if (results.length === 0) return null;
    const state = (rawState || '').toLowerCase();
    return (state && results.find(r => String(r.admin1 || '').toLowerCase() === state)) || results[0];
};

// WMO weather codes -> short text and emoji
const describeCode = (code) => {
    if (code === 0) return { text: 'Clear sky', icon: '☀️' };
    if (code === 1) return { text: 'Mainly clear', icon: '🌤️' };
    if (code === 2) return { text: 'Partly cloudy', icon: '⛅' };
    if (code === 3) return { text: 'Overcast', icon: '☁️' };
    if (code === 45 || code === 48) return { text: 'Fog', icon: '🌫️' };
    if (code >= 51 && code <= 57) return { text: 'Drizzle', icon: '🌦️' };
    if (code >= 61 && code <= 67) return { text: 'Rain', icon: '🌧️' };
    if (code >= 71 && code <= 77) return { text: 'Snow', icon: '❄️' };
    if (code >= 80 && code <= 82) return { text: 'Rain showers', icon: '🌧️' };
    if (code === 85 || code === 86) return { text: 'Snow showers', icon: '❄️' };
    if (code === 95) return { text: 'Thunderstorm', icon: '⛈️' };
    if (code === 96 || code === 99) return { text: 'Thunderstorm with hail', icon: '⛈️' };
    return { text: 'Partly cloudy', icon: '🌤️' };
};

const compass = (deg) => {
    if (typeof deg !== 'number') return undefined;
    return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];
};

const transformOpenMeteoData = (data, place) => {
    const c = data.current;
    const d = data.daily;
    const now = describeCode(c.weather_code);
    const todayRain = (d.precipitation_probability_max && d.precipitation_probability_max[0]) || 0;
    return {
        current: {
            temp: Math.round(c.temperature_2m),
            condition: now.text,
            humidity: Math.round(c.relative_humidity_2m),
            wind: `${Math.round(c.wind_speed_10m || 0)} km/h`,
            feelsLike: Math.round(c.apparent_temperature),
            uv: d.uv_index_max ? Math.round(d.uv_index_max[0]) : undefined,
            visibility: undefined, // not part of this free call
            pressure: Math.round(c.surface_pressure),
            windDir: compass(c.wind_direction_10m),
            rainProb: `${Math.round(todayRain)}%`,
            icon: now.icon,
            lastUpdated: new Date(c.time).toLocaleTimeString(),
        },
        forecast: d.time.map((dateStr, i) => {
            const date = new Date(dateStr);
            const max = d.temperature_2m_max[i];
            const min = d.temperature_2m_min[i];
            const desc = describeCode(d.weather_code[i]);
            return {
                day: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: dateStr,
                temp: Math.round((max + min) / 2),
                maxTemp: Math.round(max),
                minTemp: Math.round(min),
                condition: desc.text,
                icon: desc.icon,
                rainChance: Math.round(d.precipitation_probability_max[i] || 0),
                humidity: d.relative_humidity_2m_mean ? Math.round(d.relative_humidity_2m_mean[i]) : undefined,
                maxWind: Math.round(d.wind_speed_10m_max[i] || 0)
            };
        }),
        alerts: [],
        location: {
            name: place.name,
            region: place.admin1 || '',
            country: place.country || 'India'
        },
        source: 'Open-Meteo'
    };
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
