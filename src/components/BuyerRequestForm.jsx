import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import CommodityAutosuggest from './CommodityAutosuggest';
import { parseVoiceInput } from '../utils/voiceParser';
import { getRecommendedUnit } from '../data/commodities';
import { useSmartVoice } from '../hooks/useSmartVoice';
import VoiceOverlay from './VoiceOverlay';

const BuyerRequestForm = ({ initialCommodity = '', onSuccess }) => {
    const { t, language } = useLanguage();
    const { addBuyerRequest } = useMarket();
    const { user } = useAuth(); // Assuming user context has location

    const [commodity, setCommodity] = useState(initialCommodity);
    const [commodityId, setCommodityId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('Quintal');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [loading, setLoading] = useState(false);

    // Smart Voice Hook
    const { isListening, transcript, showOverlay, startListening, stopListening } = useSmartVoice();

    // Check for pre-filled data passed via props or parent logic if needed
    // (Seller page handles the navigation state, this component just receives props if used inside it, 
    // but here it seems standalone or used in sidebar. If used in Seller page, Seller page handles state.)

    const handleVoiceInput = () => {
        startListening(({ transcript, parsed }) => {
            if (parsed) {
                if (parsed.commodity) {
                    setCommodity(parsed.commodity.en); // Autosuggest expects string or object? 
                    // CommodityAutosuggest usually takes string value for input, 
                    // and onSelect handles the object.
                    // We might need to look up ID if possible, but for now name is good.
                    if (parsed.commodity.id) setCommodityId(parsed.commodity.id);

                    const recUnit = getRecommendedUnit(parsed.commodity.id || parsed.commodity.en);
                    if (recUnit) setUnit(recUnit);
                }
                if (parsed.quantity) setQuantity(parsed.quantity);
                if (parsed.unit) setUnit(parsed.unit);
                if (parsed.price) setExpectedPrice(parsed.price);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert(t('login_required') || 'Please login first');
            return;
        }

        setLoading(true);
        try {
            await addBuyerRequest({
                commodity,
                commodityId,
                quantity,
                unit,
                expectedPrice,
                status: 'open',
                buyerName: user.name || 'Anonymous',
                buyerPhone: user.phone || '',
                location: user.location || user.city || ''
            });
            setCommodity('');
            setQuantity('');
            setExpectedPrice('');
            setCommodityId('');
            alert('Request posted successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Failed to post request. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card fade-in" style={{ border: '2px solid var(--color-secondary)', background: '#F0FDF4', position: 'relative' }}>

            <VoiceOverlay
                isOpen={showOverlay}
                isListening={isListening}
                transcript={transcript}
                onClose={stopListening}
            />

            <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📝 {t('post_buyer_request') || 'Post a Request'}</span>

                {/* Voice Button */}
                <button
                    type="button"
                    onClick={handleVoiceInput}
                    style={{
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    🎙️ {t('speak') || 'Speak'}
                </button>
            </h3>

            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#555' }}>
                {t('cant_find_item') || "Can't find what you need? Post a request and sellers will contact you."}
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                        {t('commodity') || 'Commodity'}
                    </label>
                    <CommodityAutosuggest
                        value={commodity}
                        onChange={(e) => setCommodity(e.target.value)}
                        onSelect={(item) => {
                            setCommodity(item.name);
                            setCommodityId(item.id);
                            const rec = getRecommendedUnit(item.id);
                            if (rec) setUnit(rec);
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                            {t('quantity') || 'Quantity'}
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="e.g. 50"
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ width: '80px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                            {t('unit') || 'Unit'}
                        </label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            style={{ width: '100%', padding: '10px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="Quintal">Quintal</option>
                            <option value="Ton">Ton</option>
                            <option value="Kg">Kg</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                    style={{
                        width: '100%',
                        background: 'var(--color-secondary)',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '10px'
                    }}
                >
                    {loading ? 'Posting...' : (t('submit_request') || 'Post Request')}
                </button>
            </form>
        </div>
    );
};

export default BuyerRequestForm;
