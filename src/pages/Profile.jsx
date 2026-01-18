import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

const Profile = () => {
    // Helper to convert Hindi/Marathi numerals to English
    const normalizeNumerals = (str) => {
        return str.replace(/[०-९]/g, d => "०१२३४५६७८९".indexOf(d));
    };

    const { t } = useLanguage();
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Notification State
    const [notificationStatus, setNotificationStatus] = useState(Notification.permission);
    const [fcmToken, setFcmToken] = useState(null);

    const handleEnableNotifications = async () => {
        if (!messaging) {
            alert("Messaging not supported on this device/browser.");
            return;
        }

        try {
            setNotificationStatus('loading');
            const permission = await Notification.requestPermission();
            setNotificationStatus(permission);

            if (permission === 'granted') {
                const token = await getToken(messaging);
                console.log("FCM Token:", token);
                setFcmToken(token);
                // TODO: Save token to Firestore user profile
            }
        } catch (error) {
            console.error("Error enabling notifications:", error);
            setNotificationStatus('error');
        }
    };

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
                <h2>{t('login_view_profile')}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>{t('login')}</button>
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
                            {t('verified_farmer_badge')}
                        </div>
                    )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: 0 }} />

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>{t('farm_details_title')}</h3>
                        {!isEditing && (
                            <button className="btn btn-outline" onClick={() => setIsEditing(true)}>{t('cnt_edit_profile')}</button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSave}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('label_profile_name')}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('label_profile_phone')}</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = normalizeNumerals(e.target.value);
                                            setFormData({ ...formData, phone: val });
                                        }}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('label_profile_village')}</label>
                                    <input
                                        type="text"
                                        value={formData.village}
                                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('label_profile_land')}</label>
                                    <input
                                        type="text"
                                        value={formData.landSize}
                                        onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('label_profile_crops')}</label>
                                    <input
                                        type="text"
                                        value={formData.crops}
                                        onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>{t('cancel')}</button>
                                <button type="submit" className="btn btn-primary">{t('save_changes')}</button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>{t('label_land_size')}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.landSize || t('not_set')}</div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>{t('label_major_crops')}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {user.crops && user.crops.length > 0 ? user.crops.join(', ') : t('not_set')}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>{t('label_member_since')}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Dec 2023</div>
                            </div>
                        </div>
                    )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: 0 }} />

                {/* Notifications Section */}
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>{t('notifications_title')}</h3>
                        {notificationStatus === 'granted' ? (
                            <span style={{ color: 'green', fontWeight: 'bold', fontSize: '0.9rem' }}>{t('status_active')}</span>
                        ) : (
                            <button
                                onClick={handleEnableNotifications}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                                disabled={notificationStatus === 'loading'}
                            >
                                {notificationStatus === 'loading' ? t('status_enabling') : t('btn_enable_notifications')}
                            </button>
                        )}
                    </div>

                    {/* FCM Token Display Removed for Production */}
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
                        {t('btn_logout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
