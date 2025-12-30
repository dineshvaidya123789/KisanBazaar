import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        village: user?.village || '',
        landSize: user?.landSize || '',
        crops: user?.crops?.join(', ') || ''
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Convert crops string back to array
        const cropsArray = formData.crops.split(',').map(c => c.trim()).filter(c => c);

        updateProfile({
            ...formData,
            crops: cropsArray
        });
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Please Login to view your profile.</h2>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '800px' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Header Banner */}
                <div style={{ backgroundColor: 'var(--color-primary)', height: '120px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        bottom: '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '5px solid white',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'white'
                    }}>
                        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                    </div>
                </div>

                <div style={{ marginTop: '50px', padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ margin: '0 0 5px 0' }}>{user.name}</h2>
                    <p style={{ color: '#666', margin: 0 }}>📍 {user.village} | 📞 {user.phone}</p>
                    {user.isVerified && (
                        <div style={{ marginTop: '10px', display: 'inline-block', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            ✅ Verified Farmer (सत्यापित किसान)
                        </div>
                    )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: 0 }} />

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Farm Details (खेती की जानकारी)</h3>
                        {!isEditing && (
                            <button className="btn btn-outline" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSave}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name (नाम)</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone (फ़ोन)</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Village (गाँव)</label>
                                    <input
                                        type="text"
                                        value={formData.village}
                                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Land Size (ज़मीन)</label>
                                    <input
                                        type="text"
                                        value={formData.landSize}
                                        onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Crops (फसलें - comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.crops}
                                        onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Land Size</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.landSize || 'Not Set'}</div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Major Crops</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {user.crops && user.crops.length > 0 ? user.crops.join(', ') : 'Not Set'}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Member Since</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Dec 2023</div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ padding: '2rem', paddingTop: '0' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: '1px solid #ffcdd2',
                            color: '#c62828',
                            padding: '0.8rem 2rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            display: 'block',
                            width: '100%'
                        }}
                    >
                        Log Out (लॉग आउट करें)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
