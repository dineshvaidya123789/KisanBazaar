import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Added useSearchParams
import { getWeather, clearWeatherCache } from '../services/weatherService';
import { cropDatabase, getCropAdvisory } from '../data/cropAdvisories';
import { detectWeatherAlerts, getAlertColor, getAlertPriority } from '../utils/weatherAlerts';
import mpDistricts from '../utils/mpDistricts';

const Weather = () => {
    const [searchParams] = useSearchParams();
    const cityParam = searchParams.get('city');

    const [selectedDistrict, setSelectedDistrict] = useState(cityParam || 'Indore');
    const [selectedCrop, setSelectedCrop] = useState('wheat');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // MP Districts - using centralized list
    const districts = mpDistricts;

    // Update selectedDistrict if URL changes
    useEffect(() => {
        if (cityParam) {
            setSelectedDistrict(cityParam);
        }
    }, [cityParam]);

    // Fetch weather data
    useEffect(() => {
        fetchWeatherData();
    }, [selectedDistrict]);

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getWeather(selectedDistrict, 3);
            setWeatherData(data);
            setLastUpdated(new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        clearWeatherCache();
        fetchWeatherData();
    };

    if (loading) {
        return (
            <div className="fade-in" style={{
                padding: '4rem 1rem',
                textAlign: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌤️</div>
                <h2>Loading weather data...</h2>
                <p style={{ color: '#666' }}>मौसम डेटा लोड हो रहा है...</p>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className="fade-in" style={{
                padding: '4rem 1rem',
                textAlign: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <h2>Unable to load weather data</h2>
                <button onClick={handleRefresh} className="btn-primary" style={{ marginTop: '1rem' }}>
                    🔄 Retry
                </button>
            </div>
        );
    }

    // Get alerts and crop advisories
    const alerts = detectWeatherAlerts(weatherData);
    const sortedAlerts = alerts.sort((a, b) => getAlertPriority(b.severity) - getAlertPriority(a.severity));
    const cropAdvisories = getCropAdvisory(selectedCrop, weatherData);
    const currentCrop = cropDatabase[selectedCrop];

    return (
        <div className="fade-in" style={{
            padding: '2rem 1rem',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: 'var(--font-family-base)',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Weather Forecast & Farm Advisory
            </h1>
            <p className="text-hindi" style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
                मौसम पूर्वानुमान और कृषि सलाह
            </p>

            {/* District & Crop Selector */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div>
                    <label htmlFor="district-select" style={{ fontSize: '1rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                        📍 Select District (ज़िला चुनें):
                    </label>
                    <select
                        id="district-select"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '2px solid var(--color-primary)',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {districts.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="crop-select" style={{ fontSize: '1rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                        🌾 Select Your Crop (फसल चुनें):
                    </label>
                    <select
                        id="crop-select"
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '2px solid var(--color-secondary)',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {Object.entries(cropDatabase).map(([key, crop]) => (
                            <option key={key} value={key}>
                                {crop.name} ({crop.nameHindi})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Last Updated & Refresh */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                color: '#666'
            }}>
                <span>
                    {weatherData.isFallback && <span style={{ color: '#FF9800' }}>⚠️ Using cached data | </span>}
                    Last updated: {lastUpdated}
                </span>
                <button
                    onClick={handleRefresh}
                    className="btn-outline"
                    style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Weather Alerts */}
            {sortedAlerts.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    {sortedAlerts.map((alert, index) => (
                        <div
                            key={index}
                            className="card fade-in"
                            style={{
                                backgroundColor: getAlertColor(alert.severity),
                                color: 'white',
                                marginBottom: '1rem',
                                padding: '1.5rem',
                                borderLeft: '5px solid rgba(255,255,255,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>{alert.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                                        {alert.title}
                                        {alert.titleHindi && <span className="text-hindi" style={{ display: 'block', fontSize: '1rem', opacity: 0.9 }}>{alert.titleHindi}</span>}
                                    </h3>
                                    <p style={{ margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>{alert.message}</p>
                                    {alert.messageHindi && (
                                        <p className="text-hindi" style={{ margin: '0 0 0.5rem 0', lineHeight: '1.5', opacity: 0.9 }}>{alert.messageHindi}</p>
                                    )}
                                    {alert.actions && (
                                        <div style={{ marginTop: '0.75rem' }}>
                                            <strong>Actions:</strong>
                                            <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
                                                {alert.actions.map((action, i) => (
                                                    <li key={i} style={{ marginBottom: '0.25rem' }}>{action}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Weather Card */}
            <div className="card fade-in" style={{
                background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
                color: 'white',
                marginBottom: '2rem',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                    {weatherData.location.name}, {weatherData.location.region}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '4rem', marginRight: '1rem' }}>
                        {weatherData.forecast[0]?.icon || '🌤️'}
                    </span>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{weatherData.current.temp}°C</div>
                        <div style={{ fontSize: '1.2rem' }}>{weatherData.current.condition}</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Feels like {weatherData.current.feelsLike}°C</div>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '1rem',
                    marginTop: '1.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '1rem',
                    borderRadius: '12px'
                }}>
                    <div style={{ padding: '0.5rem' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>💧 Humidity</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.current.humidity}%</span>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>💨 Wind</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.current.wind}</span>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>☔ Rain</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.current.rainProb}</span>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>👁️ Visibility</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.current.visibility} km</span>
                    </div>
                </div>
            </div>

            {/* Crop-Specific Advisories */}
            <div className="card fade-in" style={{
                borderLeft: '5px solid var(--color-secondary)',
                marginBottom: '2rem',
                backgroundColor: '#FFF8E1',
                padding: '1.5rem'
            }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#F57F17', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🌾 Advisories for {currentCrop.name} ({currentCrop.nameHindi})
                </h3>
                <div style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderRadius: '8px'
                }}>
                    <strong>Optimal Temperature:</strong> {currentCrop.optimalTemp.min}°C - {currentCrop.optimalTemp.max}°C |
                    <strong> Water Needs:</strong> {currentCrop.waterNeeds} |
                    <strong> Season:</strong> {currentCrop.season}
                </div>

                {cropAdvisories.map((advisory, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'start',
                            gap: '1rem',
                            marginBottom: '1rem',
                            padding: '1rem',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>{advisory.icon}</span>
                        <div>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', lineHeight: '1.5', color: '#333' }}>
                                {advisory.message}
                            </p>
                            {advisory.messageHindi && (
                                <p className="text-hindi" style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5', color: '#666' }}>
                                    {advisory.messageHindi}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3-Day Forecast */}
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#555' }}>
                3-Day Forecast (3 दिनों का पूर्वानुमान)
            </h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
            }}>
                {weatherData.forecast.map((day, index) => (
                    <div key={index} className="card" style={{
                        textAlign: 'center',
                        padding: '1.5rem 1rem',
                        backgroundColor: index === 0 ? '#E3F2FD' : 'white',
                        border: index === 0 ? '2px solid #2196F3' : '1px solid #ddd'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#333', fontSize: '1.1rem' }}>
                            {day.day}
                        </div>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{day.icon}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333', marginBottom: '0.25rem' }}>
                            {day.temp}°C
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                            {day.maxTemp}° / {day.minTemp}°
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{day.condition}</div>
                        {day.rainChance > 30 && (
                            <div style={{ fontSize: '0.8rem', color: '#2196F3', marginTop: '0.5rem' }}>
                                ☔ {day.rainChance}% rain
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Weather;
