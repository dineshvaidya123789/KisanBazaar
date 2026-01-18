import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import LocationSelector from '../components/LocationSelector';
import { getMandiRates } from '../data/mandiRates';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';
import SEO from '../components/SEO';

const MandiRates = () => {
    const { t } = useLanguage();
    // ... (state declarations remain same)
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedMandi, setSelectedMandi] = useState('');
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchCrop, setSearchCrop] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false); // Added for suggestions
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [locationStatus, setLocationStatus] = useState(''); // 'detecting', 'error', 'success'

    const stateSelectRef = useRef(null); // Ref for state dropdown



    // ... (Effect and handlers remain same until render) ...

    useEffect(() => {
        // Auto-fetch logic restored for easier user experience
        if (selectedMandi) {
            setHasSearched(true);
            fetchRates(selectedMandi);
        } else if (selectedDistrict) {
            setHasSearched(true);
            fetchRates(selectedDistrict);
        }
    }, [selectedMandi, selectedDistrict]);

    // ... (logic) ...
    const handleSearch = () => {
        if (selectedMandi || selectedDistrict) {
            setHasSearched(true);
            fetchRates(selectedMandi || selectedDistrict);
        } else {
            alert(t('fill_state_district') || 'Please select location');
        }
    };

    const fetchRates = async (mandi) => {
        setLoading(true);
        try {
            const data = getMandiRates(mandi);
            const transformed = data.map((item, idx) => ({
                id: idx + 1,
                crop: item.name,
                min: item.min,
                max: item.max,
                avg: Math.round((item.min + item.max) / 2),
                unit: item.unit || 'Qtl',
                trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend
            }));
            setRates(transformed);
        } catch (e) {
            console.error('Failed to fetch mandi rates', e);
            setRates([]);
        } finally {
            setLoading(false);
        }
    };

    // ... (renderContent and handleAutoDetectLocation omitted for brevity, assuming they are unchanged in this block or managed carefully) ...

    // Render logic for main content area
    const renderContent = () => {
        if (loading) {
            return (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#666' }}>{t('loading_rates') || 'Loading...'}</p>
                </div>
            );
        }

        if (!hasSearched) {
            return (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', border: '2px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔎</div>
                    <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>{t('select_mandi_prompt')}</h3>
                    <p style={{ color: '#94a3b8' }}>{t('search_btn') ? t('select_mandi_prompt') : 'Select location and click Search'}</p>
                </div>
            );
        }

        if (rates.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', border: '2px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🍃</div>
                    <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>{t('no_results') || 'No rates found'}</h3>
                    <p style={{ color: '#94a3b8' }}>Try selecting a different mandi or district.</p>
                </div>
            );
        }

        const filteredRates = rates.filter(rate =>
            rate.crop.toLowerCase().includes(searchCrop.toLowerCase())
        );

        return (
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-secondary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>{selectedMandi || selectedDistrict} Market</h3>
                    <span style={{ fontSize: '0.9rem' }}>📅 {new Date().toLocaleDateString('en-IN')}</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#475569' }}>{t('crop')}</th>
                                <th style={{ padding: '1rem', textAlign: 'center', color: '#475569' }}>Unit</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: '#16a34a' }}>{t('min_price')} (₹)</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: '#dc2626' }}>{t('max_price')} (₹)</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: '#2563eb' }}>{t('avg_price')} (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRates.length > 0 ? (
                                filteredRates.map((rate, index) => (
                                    <tr key={rate.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{rate.crop}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>{rate.unit}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>{rate.min}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>{rate.max}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{rate.avg}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                        {t('no_results') || 'No crops found matching search'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const handleAutoDetectLocation = () => {
        if (!navigator.geolocation) {
            alert(t('geolocation_unsupported') || 'Geolocation is not supported by your browser');
            return;
        }

        setLocationStatus('detecting');
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

                        // Import comprehensive mapping dynamically
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
                            ) || '';

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

                        // Update state
                        if (matchedState) setSelectedState(matchedState);
                        if (matchedDistrict) setSelectedDistrict(matchedDistrict);
                        if (matchedTehsil) setSelectedMandi(matchedTehsil);
                        else if (matchedDistrict) setSelectedMandi(matchedDistrict); // Fallback to district as mandi

                        setLocationStatus('success');

                        // Show what was detected
                        const locationParts = [];
                        if (matchedTehsil) locationParts.push(matchedTehsil);
                        if (matchedDistrict) locationParts.push(matchedDistrict);
                        if (matchedState) locationParts.push(matchedState);

                        if (locationParts.length > 0) {
                            alert(`📍 Location detected: ${locationParts.join(', ')}\n\nRates will load automatically.`);
                        } else {
                            alert('📍 Location detected but could not match to our database. Please select manually.');
                        }
                    } else {
                        throw new Error('Address not found');
                    }
                } catch (error) {
                    setLocationStatus('error');
                    alert('Unable to connect to location service. Please select manually.');
                    console.error('Reverse Geocoding error:', error);
                } finally {
                    setLocationStatus('');
                }
            },
            (error) => {
                if (error.code === 1) {
                    setLocationStatus('permission_denied');
                    setTimeout(() => setLocationStatus(''), 3000);
                } else {
                    setLocationStatus('error');
                    let errorMsg = 'Unable to detect location. Please select manually.';
                    alert(errorMsg);
                    setLocationStatus('');
                }
                console.error('Geolocation error:', error);
            },
            { timeout: 15000, enableHighAccuracy: true }
        );
    };

    const filteredRates = rates.filter(rate =>
        rate.crop.toLowerCase().includes(searchCrop.toLowerCase())
    );

    // structured data for Google
    const schema = {
        "@context": "https://schema.org",
        "@type": "Table",
        "about": `Mandi Rates for ${selectedMandi || selectedDistrict || 'Madhya Pradesh'}`,
        "mainEntity": filteredRates.map(rate => ({
            "@type": "Product",
            "name": rate.crop,
            "offers": {
                "@type": "Ofter",
                "price": rate.avg,
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": `${selectedMandi || selectedDistrict} Mandi`
                }
            }
        }))
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0' }}>
            <SEO
                title={t('todays_rates') + (selectedMandi ? ` - ${selectedMandi}` : '')}
                description="Check daily mandi rates for all crops."
                schema={schema}
            />
            <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
                {t('todays_rates')}
            </h1>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    className="btn btn-outline"
                    onClick={() => setShowAnalysis(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    📊 {t('view_analysis') || 'View Analysis'}
                </button>
                {/* Nearby Mandi button removed (moved to input row) */}
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-lg)', padding: '1.5rem', backgroundColor: '#f0f9ff' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Location Selection & Search Button Row */}
                    {/* Location Selection & Search Button Row */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                        {/* Label Row & Auto Detect Button */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                            <label style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
                                {t('select_location')}:
                            </label>
                            <button
                                type="button"
                                onClick={handleAutoDetectLocation}
                                disabled={locationStatus === 'detecting'}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    backgroundColor: locationStatus === 'detecting' ? '#f1f5f9' :
                                        locationStatus === 'permission_denied' ? '#fee2e2' : '#dcfce7',
                                    color: locationStatus === 'detecting' ? '#94a3b8' :
                                        locationStatus === 'permission_denied' ? '#dc2626' : '#166534',
                                    border: locationStatus === 'permission_denied' ? '1px solid #fca5a5' : '1px solid #86efac',
                                    borderRadius: '6px',
                                    cursor: locationStatus === 'detecting' ? 'not-allowed' : 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {locationStatus === 'detecting' ? (
                                    <>⏳ Detecting...</>
                                ) : locationStatus === 'permission_denied' ? (
                                    <>🚫 Permission Denied</>
                                ) : (
                                    <>📍 {t('nearby_mandi') || 'Nearby Mandi'}</>
                                )}
                            </button>
                        </div>

                        {/* Dropdowns (Full Width) */}
                        <div style={{ width: '100%' }}>
                            <LocationSelector
                                stateRef={stateSelectRef} // Pass Ref
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedMandi}
                                onLocationChange={(loc) => {
                                    if (loc.state) setSelectedState(loc.state);
                                    if (loc.district) setSelectedDistrict(loc.district);
                                    setSelectedMandi(loc.tehsil || '');
                                }}
                                showTehsil={true}
                            />
                        </div>
                    </div>

                    {/* Crop Search Filter (Client Side) */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                            {t('search_crop')}:
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #cbd5e1',
                                backgroundColor: 'white',
                                overflow: 'hidden',
                                boxShadow: isSearchFocused ? '0 0 0 3px rgba(34, 197, 94, 0.1)' : 'none',
                                transition: 'box-shadow 0.2s'
                            }}>
                                <span style={{ paddingLeft: '12px', fontSize: '1.2rem', opacity: 0.6 }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder={t('search_placeholder') || 'Search crops...'}
                                    value={searchCrop}
                                    onChange={(e) => setSearchCrop(e.target.value)}
                                    onFocus={(e) => {
                                        // Smart Guard: Enforce Location Selection
                                        if (!selectedState && !selectedDistrict) {
                                            e.preventDefault();
                                            e.target.blur(); // Remove focus from search
                                            alert(t('select_location_first') || "Please select a State and District first to see rates.");

                                            // Focus the state dropdown
                                            if (stateSelectRef.current) {
                                                stateSelectRef.current.focus();
                                                // Optional: Highlight it briefly
                                                stateSelectRef.current.style.borderColor = 'red';
                                                setTimeout(() => stateSelectRef.current.style.borderColor = '#ccc', 1000);
                                            }
                                            return;
                                        }
                                        setIsSearchFocused(true);
                                    }}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 0.5rem',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        background: 'transparent'
                                    }}
                                />
                                {searchCrop && (
                                    <button
                                        onClick={() => setSearchCrop('')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0 12px',
                                            fontSize: '1.2rem',
                                            color: '#94a3b8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '100%',
                                            transition: 'color 0.2s'
                                        }}
                                        title="Clear"
                                        onMouseEnter={(e) => e.target.style.color = '#475569'}
                                        onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            {/* Suggestions Dropdown */}
                            {isSearchFocused && searchCrop && filteredRates.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0 0 8px 8px',
                                    marginTop: '4px',
                                    zIndex: 10,
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    maxHeight: '250px',
                                    overflowY: 'auto',
                                    animation: 'slideDown 0.2s ease-out'
                                }}>
                                    <style>{`
                                        @keyframes slideDown {
                                            from { opacity: 0; transform: translateY(-10px); }
                                            to { opacity: 1; transform: translateY(0); }
                                        }
                                    `}</style>
                                    {filteredRates.map((rate) => (
                                        <div
                                            key={rate.id}
                                            onClick={() => setSearchCrop(rate.crop)}
                                            style={{
                                                padding: '12px 16px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #f1f5f9',
                                                fontSize: '0.95rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        >
                                            <span style={{ fontWeight: '500', color: '#334155' }}>{rate.crop}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
                                                ₹{rate.avg}/{rate.unit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {renderContent()}

            {/* Analysis Modal */}
            {showAnalysis && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setShowAnalysis(false)}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
                        maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>📊 {t('market_analysis_title') || 'Market Analysis'} ({selectedMandi || selectedDistrict || 'General'})</h2>
                        <p style={{ color: '#666' }}>{t('price_trends_desc') || 'Price trends for top commodities.'}</p>

                        <div style={{ marginTop: '1rem' }}>
                            {rates.slice(0, 5).map(rate => (
                                <div key={rate.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{rate.crop}</strong>
                                        <span style={{
                                            color: rate.trend === 'up' ? 'green' : 'red',
                                            backgroundColor: rate.trend === 'up' ? '#e8f5e9' : '#ffebee',
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                        }}>
                                            {rate.trend === 'up' ? (t('trending_up') || 'Trending Up') : (t('trending_down') || 'Trending Down')}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
                                        {t('avg_price_fmt', { price: rate.avg, unit: rate.unit }).replace('{price}', rate.avg).replace('{unit}', rate.unit) || `Avg: ${rate.avg}`}
                                    </div>
                                </div>
                            ))}
                            {rates.length === 0 && <p>{t('analysis_no_data') || 'No data available.'}</p>}
                        </div>

                        <button
                            className="btn"
                            onClick={() => setShowAnalysis(false)}
                            style={{ width: '100%', marginTop: '1rem', backgroundColor: '#f1f5f9', color: '#333' }}
                        >
                            {t('close') || 'Close'}
                        </button>
                    </div>
                </div>
            )}

            <BackToHomeButton />
        </div>
    );
};

export default MandiRates;
