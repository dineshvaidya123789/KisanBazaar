import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { landListings } from '../data/landData';
import LocationSelector from '../components/LocationSelector';
import SEO from '../components/SEO';
import BackToHomeButton from '../components/BackToHomeButton';

const Land = () => {
    const { t } = useLanguage();

    // Load listings from localStorage or fallback to static data
    const [allListings, setAllListings] = useState(() => {
        const saved = localStorage.getItem('kisan_land_listings');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing saved listings:', e);
            }
        }
        return landListings;
    });

    // Filters State
    const [filters, setFilters] = useState({
        state: '',
        district: '',
        tehsil: '',
        soilType: '',
        waterSource: ''
    });

    const [filteredLands, setFilteredLands] = useState(allListings);

    // Filter Logic
    useEffect(() => {
        let result = allListings;

        if (filters.state) {
            result = result.filter(l => l.state === filters.state);
        }
        if (filters.district) {
            result = result.filter(l => l.district === filters.district);
        }
        if (filters.tehsil) {
            result = result.filter(l => l.tehsil === filters.tehsil); // Assuming data has tehsil
        }
        if (filters.soilType) {
            result = result.filter(l => l.soilType === filters.soilType);
        }
        if (filters.waterSource) {
            result = result.filter(l => l.waterSource === filters.waterSource);
        }

        setFilteredLands(result);
    }, [filters, allListings]);

    const handleLocationChange = (loc) => {
        setFilters(prev => ({
            ...prev,
            state: loc.state,
            district: loc.district,
            tehsil: loc.tehsil
        }));
    };

    const toggleFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type] === value ? '' : value
        }));
    };

    return (
        <div className="fade-in">
            <SEO title={t('land_section')} description={t('land_hero_subtitle')} />

            {/* Top Navigation */}
            <div className="container" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <BackToHomeButton compact />
            </div>

            {/* Hero Section */}
            <section style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
                color: 'white',
                padding: '5rem 0',
                textAlign: 'center',
                marginBottom: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        fontWeight: '800',
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        letterSpacing: '1px'
                    }}>
                        {t('land_hero_title')}
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        opacity: 0.95,
                        maxWidth: '700px',
                        margin: '0 auto 2.5rem',
                        color: '#f0fdf4',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        lineHeight: '1.6'
                    }}>
                        {t('land_hero_subtitle')}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/add-land" className="btn btn-primary" style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1.2rem',
                            borderRadius: '50px',
                            boxShadow: '0 4px 15px rgba(46, 125, 50, 0.4)',
                            border: '2px solid rgba(255,255,255,0.2)'
                        }}>
                            ➕ {t('btn_list_land')}
                        </Link>
                    </div>
                </div>
            </section>

            <div className="container" style={{ paddingBottom: '4rem' }}>

                {/* Filters */}
                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🔍 {t('find_land')}</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('location')}</label>
                        <LocationSelector
                            selectedState={filters.state}
                            selectedDistrict={filters.district}
                            selectedTehsil={filters.tehsil}
                            onLocationChange={handleLocationChange}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('soil_type')}</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['Black', 'Red', 'Loamy', 'Sandy'].map(type => (
                                    <span
                                        key={type}
                                        onClick={() => toggleFilter('soilType', type)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            background: filters.soilType === type ? '#2e7d32' : '#f0f0f0',
                                            color: filters.soilType === type ? 'white' : '#333',
                                            border: '1px solid #ddd'
                                        }}
                                    >
                                        {t(`soil_${type.toLowerCase()}`)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('water_source')}</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['Well', 'Canal', 'Borewell', 'River'].map(src => (
                                    <span
                                        key={src}
                                        onClick={() => toggleFilter('waterSource', src)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            background: filters.waterSource === src ? '#0288d1' : '#f0f0f0',
                                            color: filters.waterSource === src ? 'white' : '#333',
                                            border: '1px solid #ddd'
                                        }}
                                    >
                                        {t(`water_${src.toLowerCase()}`)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {filteredLands.map(land => (
                        <div key={land.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#2e7d32', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {land.type === 'Lease' ? t('lease') : t('share')}
                            </div>
                            <img src={land.image || 'https://via.placeholder.com/400x200?text=Farm+Land'} alt={land.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />

                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{land.title}</h3>
                                <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    📍 {land.district}, {land.state}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{t('land_size')}</div>
                                        <div style={{ fontWeight: 'bold' }}>{land.area} {land.areaUnit}</div>
                                    </div>
                                    <div style={{ textAlign: 'center', borderLeft: '1px solid #ddd', paddingLeft: '1rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{t('irrigation')}</div>
                                        <div style={{ fontWeight: 'bold' }}>{t(`water_${land.waterSource.split(' ')[0].toLowerCase()}`) || land.waterSource}</div>
                                    </div>
                                    <div style={{ textAlign: 'center', borderLeft: '1px solid #ddd', paddingLeft: '1rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{t('rent_price')}</div>
                                        <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>₹{land.price}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{land.contactName}</div>
                                        <div style={{ color: '#666' }}>📞 {land.phone}</div>
                                    </div>
                                    <a href={`tel:${land.phone}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                        {t('call')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredLands.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        <h3>{t('no_results')}</h3>
                        <p>{t('try_changing_filters')}</p>
                    </div>
                )}

                <BackToHomeButton />
            </div>
        </div>
    );
};

export default Land;
