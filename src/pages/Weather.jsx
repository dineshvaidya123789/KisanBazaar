import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWeather, clearWeatherCache } from '../services/weatherService';
import { cropDatabase, getCropAdvisory } from '../data/cropAdvisories';
import { detectWeatherAlerts, getAlertColor, getAlertPriority } from '../utils/weatherAlerts';
import LocationSelector from '../components/LocationSelector';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const Weather = () => {
    const { t } = useLanguage();
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
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

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
    }, [location.district, location.tehsil]);

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Prioritize Tehsil if available for specific local weather
            const queryLocation = location.tehsil
                ? `${location.tehsil}, ${location.state}`
                : `${location.district}, ${location.state}`;
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

    // Auto-detect location using real Geolocation + Reverse Geocoding
    const handleAutoDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser (आपके ब्राउज़र में स्थान सेवा समर्थित नहीं है)');
            return;
        }

        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Using Nominatim (OpenStreetMap) for free reverse geocoding
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`,
                        {
                            headers: {
                                'Accept-Language': 'en-US,en;q=0.9',
                                'User-Agent': 'KisanBazaar-Mobile-App'
                            }
                        }
                    );

                    if (!response.ok) throw new Error('Network error');

                    const data = await response.json();

                    if (data && data.address) {
                        const addr = data.address;
                        // Extract State, District from Nominatim response
                        const detectedState = addr.state || '';
                        const detectedDistrict = addr.city || addr.district || addr.county || addr.state_district || '';
                        const detectedTehsil = addr.suburb || addr.town || addr.village || addr.neighbourhood || addr.city_district || '';

                        // Import comprehensive city-to-district mapping
                        const { getCityToDistrict } = await import('../utils/locationMapping');
                        const { getStates, getDistricts, getTehsils } = await import('../data/locationData');

                        let normalizedDistrict = getCityToDistrict(detectedDistrict);
                        const availableStates = getStates();

                        // Find matching state (case-insensitive)
                        let matchedState = availableStates.find(s =>
                            s.toLowerCase() === detectedState.toLowerCase()
                        ) || '';

                        // Find matching district if state is found
                        let matchedDistrict = '';
                        let matchedTehsil = '';

                        if (matchedState) {
                            const availableDistricts = getDistricts(matchedState);
                            matchedDistrict = availableDistricts.find(d =>
                                d.toLowerCase() === normalizedDistrict.toLowerCase()
                            );

                            if (!matchedDistrict) {
                                matchedDistrict = availableDistricts.find(d =>
                                    d.toLowerCase().includes(normalizedDistrict.toLowerCase()) ||
                                    normalizedDistrict.toLowerCase().includes(d.toLowerCase())
                                ) || '';
                            }

                            // Find matching tehsil if district is found
                            if (matchedDistrict) {
                                const availableTehsils = getTehsils(matchedState, matchedDistrict);
                                matchedTehsil = availableTehsils.find(t =>
                                    t.toLowerCase() === detectedTehsil.toLowerCase() ||
                                    t.toLowerCase().includes(detectedTehsil.toLowerCase()) ||
                                    detectedTehsil.toLowerCase().includes(t.toLowerCase())
                                ) || '';
                            }
                        }

                        // Update location with matched values
                        setLocation({
                            state: matchedState,
                            district: matchedDistrict,
                            tehsil: matchedTehsil
                        });

                        setIsDetectingLocation(false);

                        // Show what was detected
                        const locationParts = [];
                        if (matchedTehsil) locationParts.push(matchedTehsil);
                        if (matchedDistrict) locationParts.push(matchedDistrict);
                        if (matchedState) locationParts.push(matchedState);

                        if (locationParts.length > 0) {
                            alert(`📍 Location detected: ${locationParts.join(', ')}\n\nWeather data will load automatically.`);
                        } else {
                            alert('📍 Location detected but could not match to our database. Please select manually.\n\n(स्थान मिला लेकिन हमारे डेटाबेस से मेल नहीं खाया। कृपया मैन्युअल रूप से चुनें।)');
                        }
                    } else {
                        throw new Error('Address not found');
                    }
                } catch (error) {
                    setIsDetectingLocation(false);
                    alert('Unable to connect to location service. Please select manually (सर्वर से संपर्क नहीं हो पाया, कृपया स्वयं स्थान चुनें)');
                    console.error('Reverse Geocoding error:', error);
                }
            },
            (error) => {
                setIsDetectingLocation(false);
                let errorMsg = t('location_unavailable');
                if (error.code === 1) errorMsg = t('location_permission_denied');
                if (error.code === 3) errorMsg = t('location_timeout');

                alert(errorMsg);
                console.error('Geolocation error:', error);
            },
            { timeout: 15000, enableHighAccuracy: true }
        );
    };

    if (!weatherData && loading) {
        return (
            <div className="fade-in" style={{
                padding: '4rem 1rem',
                textAlign: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌤️</div>
                <h2>{t('loading_weather')}</h2>
                <p style={{ color: '#666' }}>{t('loading_weather')}</p>
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
                <h2>{t('weather_load_error')}</h2>
                <p style={{ color: '#666' }}>{error}</p>
                <button onClick={handleRefresh} className="btn-primary" style={{ marginTop: '1rem' }}>
                    🔄 {t('retry')}
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
                {t('weather_title')}
            </h1>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
                {t('weather_subtitle')}
            </p>

            {/* District & Crop Selector */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '1rem', fontWeight: 'bold', display: 'block', marginBottom: 0 }}>
                            📍 {t('select_location_label')}:
                        </label>
                        <button
                            type="button"
                            onClick={handleAutoDetectLocation}
                            disabled={isDetectingLocation}
                            style={{
                                padding: '6px 12px',
                                fontSize: '0.8rem',
                                backgroundColor: isDetectingLocation ? '#e5e7eb' : '#dcfce7',
                                color: isDetectingLocation ? '#6b7280' : '#166534',
                                border: '1px solid #86efac',
                                borderRadius: '20px',
                                cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isDetectingLocation ? `🔄 ${t('detecting')}` : `🎯 ${t('auto_detect')}`}
                        </button>
                    </div>
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
                        🌾 {t('select_crop_label')}:
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
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>{t('select_district_title')}</h2>
                    <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                        {t('select_district_msg')}
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
                                    {isOffline ? t('you_are_offline') : t('live_data_unavailable')}
                                </span>
                            )}
                            {(isOffline || weatherData.isFallback) && t('using_cached_data')}
                            {t('last_updated')}: {lastUpdated}
                        </span>
                        <button
                            onClick={handleRefresh}
                            className="btn-outline"
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
                        >
                            🔄 {t('refresh')}
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
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{t('feels_like')} {weatherData.current.feelsLike}°C</div>
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
                                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>💧 {t('humidity')}</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.current.humidity}%</span>
                            </div>
                            <div style={{ padding: '0.5rem' }}>
                                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>💨 {t('wind')}</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.current.wind}</span>
                            </div>
                            <div style={{ padding: '0.5rem' }}>
                                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>☔ {t('rain')}</span>
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
                            🌾 {t('advisories_for')} {currentCrop.name}
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

            <BackToHomeButton />
        </div>
    );
};

export default Weather;
