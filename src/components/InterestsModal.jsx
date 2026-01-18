import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const InterestsModal = ({ onClose }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = [
        { id: 'Vegetables', label: t('filter_veg') || 'Vegetables', icon: '🍅' },
        { id: 'Fruits', label: t('filter_fruits') || 'Fruits', icon: '🥭' },
        { id: 'Grains', label: t('filter_grains') || 'Grains', icon: '🌾' },
        { id: 'Flowers', label: t('filter_flowers') || 'Flowers', icon: '🌻' },
        { id: 'Spices', label: t('filter_spices') || 'Spices', icon: '🌶️' }
    ];

    const toggleInterest = (id) => {
        if (selectedInterests.includes(id)) {
            setSelectedInterests(selectedInterests.filter(i => i !== id));
        } else {
            setSelectedInterests([...selectedInterests, id]);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Save to Firestore User Profile
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                interests: selectedInterests,
                onboardingCompleted: true
            });
            onClose();
        } catch (error) {
            console.error("Error saving interests:", error);
            // Fallback for demo if no DB or offline
            localStorage.setItem('user_interests', JSON.stringify(selectedInterests));
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div className="card fade-in-up" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    👋 {t('welcome') || 'Welcome!'}
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
                    {t('what_interested_in') || 'What are you interested in buying?'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2rem' }}>
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => toggleInterest(cat.id)}
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: `2px solid ${selectedInterests.includes(cat.id) ? 'var(--color-primary)' : '#eee'}`,
                                backgroundColor: selectedInterests.includes(cat.id) ? '#e8f5e9' : 'white',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem' }}>{cat.icon}</div>
                            <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{cat.label}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                    {loading ? 'Saving...' : (t('continue') || 'Continue')}
                </button>
            </div>
        </div>
    );
};

export default InterestsModal;
