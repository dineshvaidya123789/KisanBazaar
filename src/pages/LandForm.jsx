import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LocationSelector from '../components/LocationSelector';
import SEO from '../components/SEO';
import VoiceOverlay from '../components/VoiceOverlay';
import { useSmartVoice } from '../hooks/useSmartVoice';
import { compressImage, isValidImageFile } from '../utils/imageCompression';

const LandForm = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    // Voice Hooks
    const smartVoice = useSmartVoice();
    const descVoice = useSmartVoice();

    // Form State
    const [formData, setFormData] = useState({
        type: 'Lease', // Lease or Share
        title: '',
        state: '',
        district: '',
        tehsil: '',
        area: '',
        areaUnit: 'Acres',
        soilType: '',
        waterSource: '',
        price: '',
        priceUnit: 'Yearly/Acre',
        contactName: '',
        phone: '',
        description: ''
    });

    const [images, setImages] = useState([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (loc) => {
        setFormData(prev => ({
            ...prev,
            state: loc.state,
            district: loc.district,
            tehsil: loc.tehsil
        }));
    };

    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const handleAutoDetectLocation = () => {
        if (!navigator.geolocation) {
            alert(t('geolocation_unsupported'));
            return;
        }

        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`,
                        { headers: { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'KisanBazaar-Web-App' } }
                    );

                    if (!response.ok) throw new Error('Network error');
                    const data = await response.json();

                    if (data && data.address) {
                        const addr = data.address;
                        const detectedState = addr.state || '';
                        const detectedDistrict = addr.city || addr.district || addr.county || '';
                        const detectedTehsil = addr.suburb || addr.town || addr.village || '';

                        // Dynamic import for matching
                        const { getCityToDistrict } = await import('../utils/locationMapping');
                        const { getStates, getDistricts, getTehsils } = await import('../data/locationData');

                        let matchedState = '', matchedDistrict = '', matchedTehsil = '';

                        // normalize district
                        const normDistrict = getCityToDistrict(detectedDistrict);
                        const states = getStates();
                        matchedState = states.find(s => s.toLowerCase() === detectedState.toLowerCase()) || '';

                        if (matchedState) {
                            const districts = getDistricts(matchedState);
                            matchedDistrict = districts.find(d => d.toLowerCase() === normDistrict.toLowerCase()) || '';

                            if (matchedDistrict) {
                                const tehsils = getTehsils(matchedState, matchedDistrict);
                                matchedTehsil = tehsils.find(t => t.toLowerCase() === detectedTehsil.toLowerCase()) || '';
                            }
                        }

                        setFormData(prev => ({
                            ...prev,
                            state: matchedState || detectedState,
                            district: matchedDistrict || detectedDistrict,
                            tehsil: matchedTehsil || detectedTehsil
                        }));

                        alert(t('location_detected') || 'Location Detected');
                    }
                } catch (e) {
                    console.error(e);
                    alert(t('location_detect_error'));
                } finally {
                    setIsDetectingLocation(false);
                }
            },
            (err) => {
                console.error(err);
                alert(t('location_permission_denied'));
                setIsDetectingLocation(false);
            }
        );
    };

    const handleSmartVoice = () => {
        smartVoice.startListening(({ transcript, parsed }) => {
            setFormData(prev => ({
                ...prev,
                description: (prev.description + " " + transcript).trim()
            }));
        });
    };

    const handleDescVoice = () => {
        descVoice.startListening(({ transcript }) => {
            setFormData(prev => ({
                ...prev,
                description: (prev.description + " " + transcript).trim()
            }));
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 3) {
            alert(t('max_images'));
            return;
        }

        setIsCompressing(true);
        const compressedImages = [];

        for (const file of files) {
            if (!isValidImageFile(file)) {
                alert(t('invalid_image'));
                continue;
            }

            try {
                const compressed = await compressImage(file, {
                    maxWidth: 1200,
                    maxHeight: 1200,
                    quality: 0.8
                });
                compressedImages.push(compressed);
            } catch (error) {
                console.error('Image compression error:', error);
            }
        }

        setImages(prev => [...prev, ...compressedImages].slice(0, 3));
        setIsCompressing(false);
        e.target.value = ''; // Reset input
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            // Load existing listings from localStorage
            const saved = localStorage.getItem('kisan_land_listings');
            let existingListings = [];

            if (saved) {
                try {
                    existingListings = JSON.parse(saved);
                } catch (e) {
                    console.error('Error parsing saved listings:', e);
                }
            }

            // Create new listing with unique ID
            const newListing = {
                id: Date.now(),
                title: formData.title,
                state: formData.state,
                district: formData.district,
                tehsil: formData.tehsil,
                area: parseFloat(formData.area),
                areaUnit: formData.areaUnit,
                soilType: formData.soilType,
                waterSource: formData.waterSource,
                price: parseFloat(formData.price),
                priceUnit: formData.priceUnit,
                type: formData.type,
                contactName: formData.contactName,
                phone: formData.phone,
                description: formData.description,
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
                image: images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                createdAt: new Date().toISOString()
            };

            // Add new listing to the beginning of the array
            const updatedListings = [newListing, ...existingListings];

            // Save to localStorage
            localStorage.setItem('kisan_land_listings', JSON.stringify(updatedListings));

            console.log("Land Listed:", newListing);
            setIsSubmitting(false);
            setShowSuccess(true);

            setTimeout(() => {
                navigate('/land');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="fade-in" style={{ background: '#f3f4f6', minHeight: '90vh', padding: '2rem 0' }}>
            <SEO title={t('land_form_title')} />

            {/* Voice Overlays */}
            <VoiceOverlay
                isOpen={smartVoice.showOverlay}
                transcript={smartVoice.transcript}
                isListening={smartVoice.isListening}
                onClose={smartVoice.stopListening}
            />
            <VoiceOverlay
                isOpen={descVoice.showOverlay}
                transcript={descVoice.transcript}
                isListening={descVoice.isListening}
                onClose={descVoice.stopListening}
            />

            <div className="container" style={{ maxWidth: '800px' }}>
                <Link to="/land" style={{ display: 'inline-block', marginBottom: '1rem', textDecoration: 'none', color: '#666' }}>
                    ← {t('back_to_home')}
                </Link>

                {/* Smart Voice Card */}
                <div className="card" style={{
                    marginBottom: '1.5rem', border: '2px solid #fbbf24', background: '#fffbeb',
                    display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '1rem'
                }} onClick={handleSmartVoice}>
                    <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🎙️</span>
                    <div>
                        <strong>{t('smart_voice_fill')}</strong>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{t('land_voice_fill_hint')}</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        {t('land_form_title')}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Type Toggle */}
                        <div style={{ display: 'flex', gap: '1rem', background: '#f9fafb', padding: '0.5rem', borderRadius: '8px' }}>
                            <button type="button"
                                onClick={() => setFormData({ ...formData, type: 'Lease' })}
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: formData.type === 'Lease' ? '#2e7d32' : 'transparent', color: formData.type === 'Lease' ? 'white' : '#666', fontWeight: 'bold', transition: 'all 0.2s' }}
                            >
                                📄 {t('lease')}
                            </button>
                            <button type="button"
                                onClick={() => setFormData({ ...formData, type: 'Share' })}
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: formData.type === 'Share' ? '#e65100' : 'transparent', color: formData.type === 'Share' ? 'white' : '#666', fontWeight: 'bold', transition: 'all 0.2s' }}
                            >
                                🤝 {t('share')}
                            </button>
                        </div>

                        {/* Title */}
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t('land_title')} *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. 5 Acres Black Soil Farm"
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>

                        {/* LocationSelector */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold', display: 'block' }}>{t('location')} *</label>
                                <button type="button" onClick={handleAutoDetectLocation} style={{ color: '#2e7d32', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {isDetectingLocation ? '⏳ Detecting...' : '📍 ' + (t('auto_detect') || 'Auto Detect')}
                                </button>
                            </div>
                            <LocationSelector
                                selectedState={formData.state}
                                selectedDistrict={formData.district}
                                selectedTehsil={formData.tehsil}
                                onLocationChange={handleLocationChange}
                            />
                        </div>

                        {/* Area & Price */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t('land_size')} *</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder={t('land_area_placeholder')} required style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                    <select name="areaUnit" value={formData.areaUnit} onChange={handleChange} style={{ width: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                                        <option>Acres</option>
                                        <option>Guntha</option>
                                        <option>Hectare</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t('rent_price')} *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder={t('land_rent_placeholder')} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                        </div>

                        {/* Details Chips */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t('soil_type')}</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {['Black', 'Red', 'Loamy'].map(type => (
                                        <span key={type}
                                            onClick={() => setFormData({ ...formData, soilType: type })}
                                            style={{
                                                padding: '5px 10px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '0.85rem', cursor: 'pointer',
                                                background: formData.soilType === type ? '#2e7d32' : 'white', color: formData.soilType === type ? 'white' : '#333'
                                            }}
                                        >
                                            {t(`soil_${type.toLowerCase()}`)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t('water_source')}</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {['Well', 'Canal', 'Borewell'].map(src => (
                                        <span key={src}
                                            onClick={() => setFormData({ ...formData, waterSource: src })}
                                            style={{
                                                padding: '5px 10px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '0.85rem', cursor: 'pointer',
                                                background: formData.waterSource === src ? '#0288d1' : 'white', color: formData.waterSource === src ? 'white' : '#333'
                                            }}
                                        >
                                            {t(`water_${src.toLowerCase()}`)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold' }}>Description</label>
                                <button type="button" onClick={handleDescVoice} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🎙️ Speak</button>
                            </div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder={t('land_desc_placeholder')}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            ></textarea>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                                {t('land_images')} <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'normal' }}>({t('max_images')})</span>
                            </label>

                            {/* Upload Button */}
                            <div style={{ marginBottom: '1rem' }}>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={images.length >= 3 || isCompressing}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="imageUpload"
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px 20px',
                                        background: images.length >= 3 ? '#ccc' : '#2e7d32',
                                        color: 'white',
                                        borderRadius: '6px',
                                        cursor: images.length >= 3 || isCompressing ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        opacity: images.length >= 3 || isCompressing ? 0.6 : 1
                                    }}
                                >
                                    📷 {isCompressing ? t('compressing_image') : t('upload_images')}
                                </label>
                            </div>

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                    {images.map((img, index) => (
                                        <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd' }}>
                                            <img
                                                src={img}
                                                alt={`Land ${index + 1}`}
                                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    background: 'rgba(255,0,0,0.8)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '28px',
                                                    height: '28px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold'
                                                }}
                                                title={t('remove_image')}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Contact */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t('contact_name')} *</label>
                                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t('phone_number')} *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '12px', fontSize: '1.1rem', marginTop: '1rem' }}>
                            {isSubmitting ? t('processing') : t('submit')}
                        </button>
                    </form>
                </div>
            </div>

            {/* Success Modal Overlay */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', animation: 'zoomIn 0.3s' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h2>{t('post_land_success')}</h2>
                        <p>Your listing is now live!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandForm;
