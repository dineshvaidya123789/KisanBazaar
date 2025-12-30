import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CropAdvisory = () => {
    const [searchParams] = useSearchParams();
    const cropQuery = searchParams.get('crop');
    const topicQuery = searchParams.get('topic');

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentSeason, setCurrentSeason] = useState('');
    const [searchHighlight, setSearchHighlight] = useState(cropQuery || '');

    // Dynamic Season Detection
    useEffect(() => {
        const month = new Date().getMonth(); // 0-11
        let season = 'All';

        if (month >= 5 && month <= 9) {
            season = 'Kharif';
        } else if (month >= 3 && month <= 4) {
            season = 'Zaid';
        } else {
            season = 'Rabi'; // Winter (Oct-March)
        }

        setCurrentSeason(season);

        // If searching specific crop, show 'All' categories to ensure we find it
        if (cropQuery) {
            setSelectedCategory('All');
        } else {
            setSelectedCategory(season); // Auto-select current season otherwise
        }
    }, [cropQuery]);

    const crops = [
        // --- RABI (Winter) High Demand Crops ---
        {
            id: 101,
            name: "Green Peas (मटर)",
            category: "Rabi",
            scientificName: "Pisum sativum",
            sowing: "Oct - Nov",
            harvesting: "Dec - Feb (High Demand)",
            soil: "Well-drained Loamy Soil",
            water: "Frequent light irrigation. Sensitive to water logging.",
            diseases: "Powdery Mildew (Safed Fafund). Spray Sulphur dust.",
            tips: "Early sown 'Arkel' variety gets higher market price. Support tall varieties with sticks.",
            image: "https://images.unsplash.com/photo-1592323602568-15d2bb98246e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Trending"
        },
        {
            id: 1,
            name: "Wheat (गेहूं)",
            category: "Rabi",
            scientificName: "Triticum aestivum",
            sowing: "November - December",
            harvesting: "March - April",
            soil: "Loamy or Clay Loam (दोमट मिट्टी)",
            water: "4-6 Irrigations required at critical stages regarding CRI & Tillering.",
            diseases: "Rust (Yellow/Brown), Blight. Treatment: Propiconazole spray.",
            tips: "Use certified seeds like GW-322, Lok-1 in MP. Late sowing reduces yield by 30kg/day.",
            image: "https://images.unsplash.com/photo-1574943320219-55edeb705382?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Staple"
        },
        {
            id: 3,
            name: "Gram/Chickpea (चना)",
            category: "Rabi",
            scientificName: "Cicer arietinum",
            sowing: "October - November",
            harvesting: "February - March",
            soil: "Sandy Loam to Clay Loam",
            water: "Requires less water. 1-2 irrigations sufficient.",
            diseases: "Wilt (Ukhtha), Pod Borer (Illi). Integrated Pest Management is key.",
            tips: "Nipping (cutting top leaves) at 30 days increases branching and pods. Deep ploughing in summer.",
            image: "https://images.unsplash.com/photo-1515923984029-21b9134a413a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "High Value"
        },
        {
            id: 102,
            name: "Carrot (गाजर)",
            category: "Rabi",
            scientificName: "Daucus carota",
            sowing: "Aug - Nov",
            harvesting: "Nov - Feb",
            soil: "Deep, Loose Loamy Soil",
            water: "Maintain moisture. Irregular watering causes splitting.",
            diseases: "Leaf Blight, Forking (if soil is hard).",
            tips: "For red color development, temperature of 15-20°C is best. 'Pusa Rudhira' is a good red variety.",
            image: "https://images.unsplash.com/photo-1447175008436-812378a86185?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Seasonal"
        },

        // --- KHARIF (Monsoon) ---
        {
            id: 2,
            name: "Soybean (सोयाबीन)",
            category: "Kharif",
            scientificName: "Glycine max",
            sowing: "Mid June - Early July",
            harvesting: "September - October",
            soil: "Well-drained Black Cotton Soil",
            water: "Rainfed. Requires good drainage.",
            diseases: "Yellow Mosaic Virus, Root Rot.",
            tips: "Treat seeds with Rhizobium culture. Maintain plant population.",
            image: "https://images.unsplash.com/photo-1599583733072-000c01d90610?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "MP Main"
        },
        {
            id: 4,
            name: "Maize (मक्का)",
            category: "Kharif",
            scientificName: "Zea mays",
            sowing: "June - July",
            harvesting: "September - October",
            soil: "Fertile, Well-drained Loam",
            water: "Sensitive to water stress and excess moisture.",
            diseases: "Fall Army Worm is a major threat.",
            tips: "Apply Nitrogen in split doses. Control weeds in first 40 days.",
            image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Staple"
        }
    ];

    const filteredCrops = (selectedCategory === 'All'
        ? crops
        : crops.filter(crop => crop.category === selectedCategory)
    ).sort((a, b) => b.id - a.id);

    return (
        <div className="fade-in" style={{
            padding: '2rem 1rem',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'var(--font-family-base)',
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(to bottom, #fafaeb, #fff)'
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Smart Crop Advisory
                {currentSeason && <span style={{ fontSize: '0.6em', display: 'block', color: '#666', marginTop: '5px' }}>
                    Running Season: <span style={{ color: 'var(--color-secondary)' }}>{currentSeason}</span>
                </span>}
            </h1>
            <p className="text-hindi" style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
                (मौसम आधारित फसल सलाह)
            </p>

            {/* Category Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                {['All', 'Rabi', 'Kharif', 'Zaid'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                        style={{ minWidth: '100px', borderRadius: '20px' }}
                    >
                        {cat === 'Rabi' ? 'Rabi (Winter)' : cat === 'Kharif' ? 'Kharif (Monsoon)' : cat === 'Zaid' ? 'Zaid (Summer)' : 'All Crops'}
                    </button>
                ))}
            </div>

            {/* Dynamic Info Box */}
            <div style={{
                maxWidth: '600px',
                margin: '0 auto 2rem',
                padding: '1rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                borderLeft: '5px solid #2196f3',
                fontSize: '0.95rem',
                color: '#0d47a1'
            }}>
                <strong>📢 {currentSeason} Season Update:</strong> Currently, demand for
                {currentSeason === 'Rabi' ? ' Green Peas, Wheat, and Carrots ' : ' Soybean and Maize '}
                is high in MP Mandis. Plan accordingly!
            </div>

            {/* Crops Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {filteredCrops.map(crop => (
                    <div key={crop.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        {/* Status Badge */}
                        {crop.status && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: crop.status === 'Trending' ? '#ff4d4d' : '#4caf50',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                zIndex: 2,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>
                                {crop.status === 'Trending' ? '🔥 ' : '⭐ '}
                                {crop.status}
                            </div>
                        )}

                        <div style={{ position: 'relative', height: '200px' }}>
                            <img
                                src={crop.image}
                                alt={crop.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy"
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                padding: '1rem',
                                color: 'white'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{crop.name}</h3>
                                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{crop.scientificName}</span>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px' }}>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Sowing (बुवाई)</strong>
                                    {crop.sowing}
                                </div>
                                <div style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px' }}>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Harvesting (कटाई)</strong>
                                    {crop.harvesting}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ color: 'var(--color-secondary)' }}>💧 Water & Soil:</strong>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#444' }}>
                                    {crop.soil}. {crop.water}
                                </p>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ color: '#d32f2f' }}>🐛 Care & Diseases:</strong>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#444' }}>
                                    {crop.diseases}
                                </p>
                            </div>

                            <div style={{
                                marginTop: 'auto',
                                background: '#E8F5E9',
                                padding: '1rem',
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--color-primary)'
                            }}>
                                <strong style={{ display: 'block', color: 'var(--color-primary)', marginBottom: '0.2rem' }}>💡 Pro Tip:</strong>
                                <span style={{ fontSize: '0.9rem', color: '#2e7d32' }}>{crop.tips}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCrops.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No crops found for this season in our database currently.
                </div>
            )}
        </div>
    );
};

export default CropAdvisory;
