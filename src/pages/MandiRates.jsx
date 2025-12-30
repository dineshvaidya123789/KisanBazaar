import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mandiList, getRatesForMandi, getRateHistory, generateRates } from '../data/mandiRates';
import PriceTrendChart from '../components/PriceTrendChart';
import { getSearchSynonyms } from '../utils/searchMapping';

const MandiRates = () => {
    // Helper to get clean Mandi name without Hindi text for logic if needed, 
    // but here we use full string as ID for simplicity
    const [selectedMandi, setSelectedMandi] = useState(mandiList[0]); // Default to first (Indore)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [openAnalysisId, setOpenAnalysisId] = useState(null);
    const [searchParams] = useSearchParams();

    // Sync with URL Search Params & Smart Logic
    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            const lowerQuery = query.toLowerCase();

            // Check if query contains a mandi name
            const matchingMandi = mandiList.find(m => lowerQuery.includes(m.toLowerCase().split('(')[0].trim().toLowerCase()));

            if (matchingMandi) {
                setSelectedMandi(matchingMandi);
                // Remove mandi name from search term to filter crops by remainder
                const mandiName = matchingMandi.split('(')[0].trim().toLowerCase();
                let remaining = lowerQuery.replace(mandiName, '').replace('mandi', '');

                // Remove common stop words for clearer crop search
                const stopWords = ['rate', 'rates', 'price', 'bhav', 'in', 'at', 'of', 'ka', 'ke', 'ki'];
                stopWords.forEach(word => {
                    remaining = remaining.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
                });

                setSearchTerm(remaining.trim());
            } else {
                setSearchTerm(query);
            }
        }
    }, [searchParams]);

    // Helper to get today's data formatted (UI ONLY)
    const getTodayDate = () => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date().toLocaleDateString('en-GB', options);
    };

    const today = getTodayDate();

    // Fetch dynamic rates based on selection
    const currentRates = getRatesForMandi(selectedMandi);

    const categories = ['All', 'Fruits', 'Vegetables', 'Grains', 'Pulses', 'Others'];

    // Filter Logic
    const filteredRates = currentRates.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

        let matchesSearch = true;
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const searchSynonyms = getSearchSynonyms(searchLower);
            // If synonyms are empty or just the term itself, it might mean the logic inside getSearchSynonyms handled empty string poorly 
            // or the term is comprised of multiple words.
            // Simplified check: check if ANY synonym matches the item name

            // Also split searchTerm by spaces for multi-word robustness? 
            // For now, let's stick to the synonym array approach which is quite powerful for "kela" -> "banana"

            const itemNameLower = item.name.toLowerCase();
            const itemSynonyms = getSearchSynonyms(itemNameLower);

            // Cross check: 
            // 1. item name contains search term
            // 2. item name contains any synonym of search term
            // 3. search term contains item name

            matchesSearch = searchSynonyms.some(s => itemNameLower.includes(s)) ||
                itemSynonyms.some(s => searchLower.includes(s));

            // Fallback for very partial matches
            if (!matchesSearch) {
                matchesSearch = itemNameLower.includes(searchLower);
            }

            // Fallback for Misspellings & Partial Prefix
            // User Request: "based on -4 char intial char should work"
            // We now make this even broader: 
            // 1. If search term > 3 chars, check if item starts with first 3 chars
            // 2. OR if item starts with search term (already covered by includes, but explicit start is good)
            if (!matchesSearch && searchLower.length >= 3) {
                const prefix = searchLower.substring(0, 3);
                if (itemNameLower.includes(prefix)) {
                    matchesSearch = true;
                }
            }
        }

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-lg) 0' }}>
            <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
                आज के मंडी भाव (Today's Mandi Rates)
            </h1>
            <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)', color: '#666' }}>
                {today}
            </p>

            {/* Controls Section */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)', padding: '1rem' }}>

                {/* Mandi Selector */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '500', color: '#555' }}>Select Mandi (मंडी चुनें):</label>
                    <select
                        value={selectedMandi}
                        onChange={(e) => setSelectedMandi(e.target.value)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            fontSize: '1.1rem',
                            borderRadius: '25px',
                            border: '2px solid var(--color-primary)',
                            backgroundColor: 'white',
                            color: 'var(--color-primary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            outline: 'none',
                            minWidth: '250px',
                            textAlign: 'center'
                        }}
                    >
                        {mandiList.map((mandi) => (
                            <option key={mandi} value={mandi}>📍 {mandi}</option>
                        ))}
                    </select>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search Crop (फसल खोजें)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '25px',
                            border: '1px solid #ccc',
                            fontSize: '1rem',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                        }}
                    />
                </div>

                {/* Category Filters */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : '#f0f0f0',
                                color: selectedCategory === cat ? 'white' : '#333',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                                fontWeight: '500'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rates Table/Cards */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Crop (फसल)</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Unit (इकाई)</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Min (न्यूनतम)</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Max (अधिकतम)</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Avg (औसत)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRates.length > 0 ? (
                                filteredRates.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                                <div>
                                                    <div>{item.name}</div>
                                                    {/* Comparison Logic Inline */}
                                                    <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                                                        {(() => {
                                                            const yestDate = new Date();
                                                            yestDate.setDate(yestDate.getDate() - 1);
                                                            // We need to fetch yesterday's rate for this specific crop
                                                            // Since generateRates returns array, we find the matching crop
                                                            // NOTE: Ideally this should be memoized or fetched effectively, but for demo this is fine
                                                            // We rely on the deterministic nature of generateRates
                                                            const yesterdayRates = generateRates(selectedMandi, yestDate);
                                                            const yesterdayItem = yesterdayRates.find(r => r.name === item.name);

                                                            if (yesterdayItem) {
                                                                const diff = item.modal - yesterdayItem.modal;
                                                                const color = diff > 0 ? '#2e7d32' : (diff < 0 ? '#d32f2f' : '#666');
                                                                const arrow = diff > 0 ? '▲' : (diff < 0 ? '▼' : '-');
                                                                return (
                                                                    <span style={{ color, fontWeight: 'bold' }}>
                                                                        {arrow} ₹{Math.abs(diff)} vs Yesterday
                                                                    </span>
                                                                );
                                                            }
                                                            return <span style={{ color: '#999' }}>-</span>;
                                                        })()}
                                                    </div>

                                                    <div style={{ marginTop: '8px' }}>
                                                        <button
                                                            onClick={() => setOpenAnalysisId(openAnalysisId === index ? null : index)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                fontSize: '0.75rem',
                                                                color: 'var(--color-primary)',
                                                                cursor: 'pointer',
                                                                userSelect: 'none',
                                                                fontWeight: '600',
                                                                padding: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                        >
                                                            {openAnalysisId === index ? 'Hide Analysis 🔼' : 'View Analysis & Nearby 📊'}
                                                        </button>

                                                        {openAnalysisId === index && (
                                                            <div className="fade-in" style={{
                                                                marginTop: '10px',
                                                                backgroundColor: 'white',
                                                                padding: '15px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #ddd',
                                                                maxWidth: '500px',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                                position: 'relative',
                                                                zIndex: 10
                                                            }}>
                                                                {/* Nearby Mandis Section */}
                                                                <div style={{ marginBottom: '1rem' }}>
                                                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#555' }}>🏙️ Nearby Mandis (आसपास की मंडियां)</h4>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                        {(() => {
                                                                            // Pick 3 random nearby mandis (simulated)
                                                                            const otherMandis = mandiList.filter(m => m !== selectedMandi);
                                                                            // Deterministic "Nearby" based on crop name + mandi
                                                                            const seed = item.name.length + selectedMandi.length;
                                                                            const startIdx = seed % (otherMandis.length - 3);
                                                                            const nearby = otherMandis.slice(startIdx, startIdx + 3);

                                                                            return nearby.map(mandi => {
                                                                                const rates = generateRates(mandi, new Date());
                                                                                const match = rates.find(r => r.name === item.name);
                                                                                if (!match) return null;

                                                                                const diff = match.modal - item.modal;
                                                                                const isHigher = diff > 0;

                                                                                return (
                                                                                    <div key={mandi} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.9rem' }}>
                                                                                        <span>📍 {mandi.split('(')[0]}</span>
                                                                                        <span style={{ fontWeight: 'bold', color: isHigher ? '#2e7d32' : 'inherit' }}>
                                                                                            ₹{match.modal}
                                                                                            {diff !== 0 && (
                                                                                                <span style={{ fontSize: '0.8rem', marginLeft: '6px', color: isHigher ? '#2e7d32' : '#d32f2f' }}>
                                                                                                    ({diff > 0 ? '+' : ''}{diff})
                                                                                                </span>
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            });
                                                                        })()}
                                                                    </div>
                                                                </div>

                                                                <div style={{ height: '1px', backgroundColor: '#eee', margin: '1rem 0' }}></div>

                                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#555' }}>📈 Price History (पिछले 7 दिन)</h4>
                                                                <PriceTrendChart data={getRateHistory(selectedMandi, item.name)} cropName={item.name} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>{item.unit}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#d32f2f' }}>₹{item.min}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#388e3c' }}>₹{item.max}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.2rem' }}>₹{item.modal}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                        No crops found matched your search. <br /> (कोई फसल नहीं मिली)
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                * Prices are estimates based on local reports. (भाव स्थानीय रिपोर्टों पर आधारित अनुमान हैं)
            </p>
        </div>
    );
};

export default MandiRates;
