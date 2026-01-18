import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';

const BuyerRequestForm = ({ initialCommodity = '', onSuccess }) => {
    const { t } = useLanguage();
    const { addBuyerRequest } = useMarket();
    const { user } = useAuth();

    const [commodity, setCommodity] = useState(initialCommodity);
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [loading, setLoading] = useState(false);

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
                quantity,
                unit,
                expectedPrice,
                status: 'open', // open, fulfilled
                buyerName: user.name || 'Anonymous',
                buyerPhone: user.phone || '',
                location: user.location || user.city || ''
            });
            setCommodity('');
            setQuantity('');
            setExpectedPrice('');
            alert('Request posted successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Failed to post request. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card fade-in" style={{ border: '2px solid var(--color-secondary)', background: '#F0FDF4' }}>
            <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                📝 {t('post_buyer_request') || 'Post a Request'}
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#555' }}>
                {t('cant_find_item') || "Can't find what you need? Post a request and sellers will contact you."}
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                        {t('commodity') || 'Commodity'}
                    </label>
                    <input
                        type="text"
                        value={commodity}
                        onChange={(e) => setCommodity(e.target.value)}
                        placeholder="e.g. Onion, Wheat"
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="kg">Kg</option>
                            <option value="quintal">Quintal</option>
                            <option value="ton">Ton</option>
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
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Posting...' : (t('submit_request') || 'Post Request')}
                </button>
            </form>
        </div>
    );
};

export default BuyerRequestForm;
