import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWeather, clearWeatherCache } from '../services/weatherService';
import { cropDatabase, getCropAdvisory } from '../data/cropAdvisories';
import { detectWeatherAlerts, getAlertColor, getAlertPriority } from '../utils/weatherAlerts';
import LocationSelector from '../components/LocationSelector';

const Weather = () => {
    const [searchParams] = useSearchParams();
    const cityParam = searchParams.get('city');

    // Use hierarchical state
    const [location, setLocation] = useState({
        state: '',
        district: cityParam || '',
        tehsil: ''
    });

    const [selectedCrop, setSelectedCrop] = useState('wheat');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Update selectedDistrict if URL changes
    useEffect(() => {
        if (cityParam) {
            setLocation(prev => ({ ...prev, district: cityParam }));
        }
    }, [cityParam]);

    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Fetch weather data
    useEffect(() => {
        if (location.district) {
            fetchWeatherData();
        } else {
            setWeatherData(null);
        }
    }, [location.district]);

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Include tehsil in query if available for better precision
            const queryLocation = location.tehsil ? `${location.tehsil}, ${location.district}` : location.district;
            const data = await getWeather(queryLocation, 3);
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

    if (!weatherData && loading) {
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

    if (!weatherData && error && location.district) {
        return (
            <div className="fade-in" style={{
                padding: '4rem 1rem',
                textAlign: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <h2>Unable to load weather data</h2>
                <p style={{ color: '#666' }}>{error}</p>
                <button onClick={handleRefresh} className="btn-primary" style={{ marginTop: '1rem' }}>
                    🔄 Retry
                </button>
            </div>
        );
    }

    // Get alerts and crop advisories
    const alerts = weatherData ? detectWeatherAlerts(weatherData) : [];
    const sortedAlerts = alerts.sort((a, b) => getAlertPriority(b.severity) - getAlertPriority(a.severity));
    const cropAdvisories = weatherData ? getCropAdvisory(selectedCrop, weatherData) : [];
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
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div>
                    <label style={{ fontSize: '1rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                        📍 Select Search Location (स्थान चुनें):
                    </label>
                    <LocationSelector
                        selectedState={location.state}
                        selectedDistrict={location.district}
                        selectedTehsil={location.tehsil}
                        onLocationChange={setLocation}
                        showTehsil={true}
                    />
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
                            border: '1px solid #cbd5e1',
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

            {/* Main Content Area */}
            {!location.district ? (
                <div className="card fade-in" style={{
                    padding: '3rem 1rem',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    border: '1px dashed #cbd5e1'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Select Your District</h2>
                    <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                        Please select your district from the dropdown above to view live weather, alerts, and farming advisories.
                        <br />(लाइव मौसम और कृषि सलाह के लिए अपना जिला चुनें)
                    </p>
                </div>
            ) : weatherData ? (
                <>
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
                            {(isOffline || weatherData.isFallback) && (
                                <span style={{ color: '#FF9800', fontWeight: 'bold' }}>
                                    {isOffline ? '⚠️ YOU ARE OFFLINE' : '⚠️ LIVE DATA UNAVAILABLE'}
                                </span>
                            )}
                            {(isOffline || weatherData.isFallback) && ' | Using cached/demo data | '}
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
                            🌾 Advisories for {currentCrop.name}
                        </h3>
                        {cropAdvisories.map((advisory, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'start',
                                gap: '1rem',
                                marginBottom: '1rem',
                                padding: '1rem',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                <span style={{ fontSize: '2rem' }}>{advisory.icon}</span>
                                <div>
                                    <p style={{ margin: '0 0 0.5rem 0', lineHeight: '1.5', color: '#333' }}>
                                        {advisory.message}
                                    </p>
                                    <p className="text-hindi" style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                                        {advisory.messageHindi}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 3-Day Forecast */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem'
                    }}>
                        {weatherData.forecast.map((day, index) => (
                            <div key={index} className="card" style={{
                                textAlign: 'center',
                                padding: '1.5rem 1rem',
                                border: index === 0 ? '2px solid #2196F3' : '1px solid #ddd'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{day.day}</div>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{day.icon}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{day.temp}°C</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{day.condition}</div>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Weather;
