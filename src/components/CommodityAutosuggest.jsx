import { useState, useEffect, useRef } from 'react';
import { searchCommodities } from '../data/commodities';

const CommodityAutosuggest = ({ value, onChange, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(e);

        if (inputValue.length >= 1) {
            const results = searchCommodities(inputValue);
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
            setHighlightedIndex(-1);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (commodity) => {
        onSelect(commodity);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSuggestionClick(suggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Type: Tomato, टमाटर, टोमॅटो..."
                className="premium-input"
                required
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="fade-in" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '2px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                    maxHeight: '280px',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000
                }}>
                    {suggestions.map((commodity, index) => (
                        <div
                            key={commodity.id}
                            onClick={() => handleSuggestionClick(commodity)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                backgroundColor: highlightedIndex === index ? '#f0f9ff' : 'white',
                                borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                                transition: 'background-color 0.15s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{commodity.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>
                                    {commodity.en}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    {commodity.hi} • {commodity.mr}
                                </div>
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                fontWeight: '600'
                            }}>
                                {commodity.category}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommodityAutosuggest;
