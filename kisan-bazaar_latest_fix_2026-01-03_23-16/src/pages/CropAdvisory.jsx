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

        // If searching specific crop, show 'All' categories AND prioritize the match
        // Default to 'All' category for clean start
        setSelectedCategory('All');
    }, [cropQuery]);

    const crops = [
        // --- NEW ADDITIONS (Zaid/Vegetables/Fruits) ---
        {
            id: 201,
            name: "Lemon (Nimbu - नींबू)",
            category: "Perennial", // or Zaid/All Year
            scientificName: "Citrus limon",
            sowing: "July-Aug or Feb-March",
            harvesting: "Year-round (Peak: June-Aug)",
            soil: "Well-drained Sandy Loam",
            water: "Regular irrigation. Basin method is best.",
            diseases: "Citrus Canker, Leaf Miner. Spray Copper Oxychloride.",
            tips: "Pruning dry branches is essential. Apply Zinc and Boron for better fruit quality.",
            image: "https://images.unsplash.com/photo-1595855709923-a550992e22dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "High Demand"
        },
        {
            id: 202,
            name: "Tomato (टमाटर)",
            category: "Rabi", // Can be Rabi/Kharif/Zaid depending on variety, putting Rabi/Zaid
            scientificName: "Solanum lycopersicum",
            sowing: "Aug-Sept or Dec-Jan",
            harvesting: "60-70 days after planting",
            soil: "Well-drained Sandy Loam",
            water: "Crucial at flowering & fruiting. Avoid overhead watering.",
            diseases: "Leaf Curl Virus, Blight. Use Trap crops.",
            tips: "Staking (Sahara) increases yield by 40%. Mulching prevents soil borne diseases.",
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Daily Need"
        },
        {
            id: 203,
            name: "Onion (प्याज़)",
            category: "Rabi",
            scientificName: "Allium cepa",
            sowing: "Oct-Nov (Nursery)",
            harvesting: "April-May",
            soil: "Friable, non-crusting Loam",
            water: "Shallow rooted - needs light frequent irrigation.",
            diseases: "Purple Blotch, Thrips. Spray Mancozeb.",
            tips: "Stop irrigation 15 days before harvest to increase shelf life. Cure bulbs in shade.",
            image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa829?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Volatile"
        },
        {
            id: 204,
            name: "Potato (आलू)",
            category: "Rabi",
            scientificName: "Solanum tuberosum",
            sowing: "Oct - Nov",
            harvesting: "Feb - March",
            soil: "Sandy Loam, rich in organic matter",
            water: "Pre-sowing + 5-6 irrigations. Critical at tuber formation.",
            diseases: "Late Blight (Jhuls). Spray Metalaxyl.",
            tips: "Earthing up (Mitti chadhana) is crucial at 25-30 days. Use Kufri varieties for MP.",
            image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Staple"
        },
        {
            id: 205,
            name: "Garlic (लहसुन)",
            category: "Rabi",
            scientificName: "Allium sativum",
            sowing: "Sept - Oct",
            harvesting: "Feb - March",
            soil: "Well-drained Loam",
            water: "Every 10-15 days. Moisture stress affects bulb size.",
            diseases: "Downy Mildew, Thrips.",
            tips: "Clove size determines bulb size. Plant bigger cloves. Ooty-1, Bhima Omkar are good.",
            image: "https://images.unsplash.com/photo-1615477083098-b807c4b4f3b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 206,
            name: "Okra/Lady Finger (भिंडी)",
            category: "Kharif", // Also Zaid
            scientificName: "Abelmoschus esculentus",
            sowing: "Feb-March (Summer) or June-July (Rainy)",
            harvesting: "45-60 days after sowing",
            soil: "Sandy Loam to Clay Loam",
            water: "Summer: Every 4-5 days. Rainy: Ensure drainage.",
            diseases: "Yellow Vein Mosaic Virus (Whitefly vector).",
            tips: "Pick pods every alternate day. Use Arka Anamika variety for virus resistance.",
            image: "https://images.unsplash.com/photo-1425543103986-226d3d8fa136?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Daily Need"
        },

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
        : crops.filter(crop => crop.category === selectedCategory || (selectedCategory === 'Perennial' && crop.category === 'Perennial'))
    ).filter(crop => {
        if (!cropQuery) return true;
        // Strict Search Filter if query exists
        const query = cropQuery.toLowerCase();
        return crop.name.toLowerCase().includes(query) ||
            crop.scientificName?.toLowerCase().includes(query) ||
            crop.category.toLowerCase().includes(query);
    }).sort((a, b) => b.id - a.id);

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
                                <div style={{
                                    background: topicQuery === 'sowing' ? '#fff9c4' : '#f5f5f5',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: topicQuery === 'sowing' ? '1px solid #fbc02d' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Sowing (बुवाई)</strong>
                                    {crop.sowing}
                                </div>
                                <div style={{
                                    background: topicQuery === 'harvesting' ? '#fff9c4' : '#f5f5f5',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: topicQuery === 'harvesting' ? '1px solid #fbc02d' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Harvesting (कटाई)</strong>
                                    {crop.harvesting}
                                </div>
                            </div>

                            <div style={{
                                marginBottom: '1rem',
                                backgroundColor: topicQuery === 'water' ? '#e3f2fd' : 'transparent',
                                borderRadius: '4px'
                            }}>
                                <strong style={{ color: 'var(--color-secondary)' }}>💧 Water & Soil:</strong>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#444' }}>
                                    {crop.soil}. {crop.water}
                                </p>
                            </div>

                            <div style={{
                                marginBottom: '1rem',
                                background: topicQuery === 'care' ? '#ffebee' : 'transparent',
                                border: topicQuery === 'care' ? '1px solid #ffcdd2' : 'none',
                                padding: topicQuery === 'care' ? '5px' : '0',
                                borderRadius: '4px',
                                transition: 'all 0.3s ease'
                            }}>
                                <strong style={{ color: '#d32f2f' }}>🐛 Care & Diseases:</strong>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#444' }}>
                                    {crop.diseases}
                                </p>
                            </div>

                            <div style={{
                                marginTop: 'auto',
                                background: topicQuery === 'tips' || topicQuery === 'general' ? '#FFF9C4' : '#E8F5E9',
                                padding: '1rem',
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--color-primary)',
                                transition: 'all 0.3s ease'
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
                    No crops found for this season.
                </div>
            )}
        </div>
    );
};

export default CropAdvisory;
