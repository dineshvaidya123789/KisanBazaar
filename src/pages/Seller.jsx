import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarket } from '../context/MarketContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import getCommodityImage from '../utils/commodityImages';
import LocationSelector from '../components/LocationSelector';
import PriceAdvisor from '../components/PriceAdvisor';
import CommodityAutosuggest from '../components/CommodityAutosuggest';
import { searchCommodities, getRecommendedUnit } from '../data/commodities';

const Seller = () => {
    const { addListing, updateListing, checkListingEligibility } = useMarket();
    const navigate = useNavigate();
    const location = useLocation();
    const { language, t } = useLanguage();

    // Check for edit mode
    const [editMode, setEditMode] = useState(false);
    const [editListingId, setEditListingId] = useState(null);

    // Auth & User Details State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // UI Refs for Auto-focus standard
    const nameRef = React.useRef(null);
    const mobileRef = React.useRef(null);

    // Form State - Initialize from URL if possible to avoid flicker
    const [formData, setFormData] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const typeParam = params.get('type');
        return {
            type: (typeParam === 'Buy' || typeParam === 'Sell') ? typeParam : 'Sell',
            commodity: '',
            commodityId: '',
            quantity: '',
            unit: '',
            pricingMode: 'market', // 'market' or 'fixed'
            targetPrice: '',
            priceUnit: '',
            state: '',
            district: '',
            tehsil: '',
            quality: '',
            comments: '',
            isOrganic: false,
            isGraded: false,
            isPacked: false,
            images: []
        };
    });

    // UI State
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [showQualityInfo, setShowQualityInfo] = useState(false);

    // Lists
    // Removed manual states/districts lists as they are handled by LocationSelector

    // Auth Handlers
    const handleGenerateOtp = () => {
        if (!firstName) {
            nameRef.current?.focus();
            return;
        }
        if (!mobileNumber) {
            mobileRef.current?.focus();
            return;
        }
        if (!/^\d{10}$/.test(mobileNumber)) {
            // Invalid mobile format
            mobileRef.current?.focus();
            // Optional: Provide visual feedback? User asked for auto-focus specifically.
            return;
        }
        setShowOtpInput(true);
        // Toast or simple text is better than alert, but keeping alert for "OTP Sent" as it contains info is acceptable, 
        // OR we can just show the OTP input which implies it was sent. 
        // For now, I'll keep the "OTP Sent" alert as it provides the '1234' code for the demo.
        alert(`Hello ${firstName}! ${t('otp_sent')} ${mobileNumber}: 1234`);
    };

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleVerifyOtp = () => {
        if (otp === '1234') {
            setIsAuthenticated(true);
            // Store user session
            localStorage.setItem('kisan_user_mobile', mobileNumber);
            localStorage.setItem('kisan_user_name', firstName);
        } else {
            alert(t('invalid_otp'));
        }
    };

    // Load edit data and user session on mount
    useEffect(() => {
        // Check for existing user session (Session-based login)
        const savedMobile = localStorage.getItem('kisan_user_mobile');
        const savedName = localStorage.getItem('kisan_user_name');

        if (savedMobile && savedName) {
            setMobileNumber(savedMobile);
            setFirstName(savedName);
            setIsAuthenticated(true);
        }

        // Check for edit mode
        const editData = localStorage.getItem('edit_listing');
        if (editData) {
            const listing = JSON.parse(editData);
            setEditMode(true);
            setEditListingId(listing.id);
            setFormData({
                type: listing.type,
                commodity: listing.commodity,
                commodityId: listing.commodityId || listing.commodity, // Fallback for legacy data
                quantity: listing.quantity,
                unit: listing.unit,
                targetPrice: listing.targetPrice,
                priceUnit: listing.priceUnit,
                state: listing.state,
                district: listing.district,
                tehsil: listing.tehsil || '', // Handle legacy data
                quality: listing.quality,
                pricingMode: listing.pricingMode || (listing.targetPrice ? 'fixed' : 'market'),
                comments: listing.comments,
                isOrganic: listing.isOrganic || false,
                isGraded: listing.isGraded || false,
                isPacked: listing.isPacked || false,
                // Support both old 'image' and new 'images' formats
                images: listing.images || (listing.image ? [listing.image] : [])
            });
            // Clear edit data from localStorage
            localStorage.removeItem('edit_listing');
        } else {
            // New Listing: Check URL params for Type (Buy/Sell)
            const searchParams = new URLSearchParams(location.search);
            const typeParam = searchParams.get('type');
            if (typeParam && (typeParam === 'Buy' || typeParam === 'Sell')) {
                setFormData(prev => ({ ...prev, type: typeParam }));
            }
        }
    }, [location.search]);

    // Listing Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error if exists
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    // Handle switching between Buy/Sell modes with reset
    const handleTypeChange = (newType) => {
        if (editMode) return; // Prevent switching in edit mode
        if (formData.type === newType) return;

        setFormData(prev => ({
            ...prev,
            type: newType,
            // Reset relevant fields
            commodity: '',
            commodityId: '',
            quantity: '',
            unit: '', // Reset unit as it might change based on commodity
            targetPrice: '',
            priceUnit: '',
            quality: '', // Reset quality (only for Sell)
            description: '',
            isOrganic: false,
            isGraded: false,
            isPacked: false,
            pricingMode: 'market' // Reset to default pricing mode
        }));
    };

    const handleLocationChange = (loc) => {
        setFormData(prev => ({
            ...prev,
            state: loc.state,
            district: loc.district,
            tehsil: loc.tehsil
        }));
    };

    // Auto-detect location using browser geolocation API
    // Auto-detect location using real Geolocation + Reverse Geocoding
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
                    // Using Nominatim (OpenStreetMap) for free reverse geocoding
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`,
                        {
                            headers: {
                                'Accept-Language': 'en-US,en;q=0.9',
                                'User-Agent': 'KisanBazaar-Mobile-App' // Required by Nominatim policy
                            }
                        }
                    );

                    if (!response.ok) throw new Error('Network error');

                    const data = await response.json();

                    if (data && data.address) {
                        const addr = data.address;

                        // Extract State, District, and Tehsil equivalents from Nominatim response
                        // Nominatim uses different keys based on urban/rural areas
                        const detectedState = addr.state || '';
                        const detectedDistrict = addr.city || addr.district || addr.county || addr.state_district || '';
                        const detectedTehsil = addr.suburb || addr.town || addr.village || addr.neighbourhood || addr.city_district || '';

                        console.log('🔍 Nominatim API Response:', {
                            detectedState,
                            detectedDistrict,
                            detectedTehsil,
                            fullAddress: addr
                        });

                        // Import comprehensive city-to-district mapping
                        const { getCityToDistrict } = await import('../utils/locationMapping');
                        const { getStates, getDistricts, getTehsils } = await import('../data/locationData');
                        const availableStates = getStates();

                        // Step 1: Normalize district (city → district mapping)
                        let normalizedDistrict = getCityToDistrict(detectedDistrict);
                        if (normalizedDistrict !== detectedDistrict) {
                            console.log(`🔄 Mapped city "${detectedDistrict}" to district "${normalizedDistrict}"`);
                        }

                        // Step 2: Find matching state (case-insensitive)
                        let matchedState = availableStates.find(s =>
                            s.toLowerCase() === detectedState.toLowerCase()
                        ) || '';

                        console.log('🏛️ State Matching:', {
                            detectedState,
                            matchedState,
                            availableStates: availableStates.slice(0, 5) + '...'
                        });

                        // Step 3: Find matching district
                        let matchedDistrict = '';
                        let matchedTehsil = '';

                        if (matchedState) {
                            const availableDistricts = getDistricts(matchedState);
                            console.log('🏙️ Available Districts for', matchedState, ':', availableDistricts);

                            // Try exact match with normalized district first
                            matchedDistrict = availableDistricts.find(d =>
                                d.toLowerCase() === normalizedDistrict.toLowerCase()
                            );

                            // If no exact match, try partial matching
                            if (!matchedDistrict) {
                                matchedDistrict = availableDistricts.find(d =>
                                    d.toLowerCase().includes(normalizedDistrict.toLowerCase()) ||
                                    normalizedDistrict.toLowerCase().includes(d.toLowerCase())
                                ) || '';
                            }

                            console.log('🏙️ District Matching:', {
                                detectedDistrict,
                                matchedDistrict,
                                availableCount: availableDistricts.length
                            });

                            // Find matching tehsil if district is found
                            if (matchedDistrict) {
                                const availableTehsils = getTehsils(matchedState, matchedDistrict);
                                console.log('🏘️ Available Tehsils for', matchedDistrict, ':', availableTehsils);

                                matchedTehsil = availableTehsils.find(t =>
                                    t.toLowerCase() === detectedTehsil.toLowerCase() ||
                                    t.toLowerCase().includes(detectedTehsil.toLowerCase()) ||
                                    detectedTehsil.toLowerCase().includes(t.toLowerCase())
                                ) || '';

                                console.log('🏘️ Tehsil Matching:', {
                                    detectedTehsil,
                                    matchedTehsil,
                                    availableCount: availableTehsils.length
                                });
                            }
                        }

                        console.log('✅ Final Matched Values:', {
                            state: matchedState,
                            district: matchedDistrict,
                            tehsil: matchedTehsil
                        });

                        // Update form data with matched values
                        setFormData(prev => ({
                            ...prev,
                            state: matchedState,
                            district: matchedDistrict,
                            tehsil: matchedTehsil
                        }));

                        setIsDetectingLocation(false);

                        // Show what was detected
                        const locationParts = [];
                        if (matchedTehsil) locationParts.push(matchedTehsil);
                        if (matchedDistrict) locationParts.push(matchedDistrict);
                        if (matchedState) locationParts.push(matchedState);

                        if (locationParts.length > 0) {
                            alert(`📍 ${t('location_detected')}: ${locationParts.join(', ')}\n\n${t('manual_select')}`);
                        } else {
                            alert(`📍 ${t('location_detect_failed')}\n\n${t('manual_select')}`);
                        }
                    } else {
                        throw new Error('Address not found');
                    }
                } catch (error) {
                    setIsDetectingLocation(false);
                    // Handle offline or API failure gracefully
                    alert(t('manual_select'));
                    console.error('Reverse Geocoding error:', error);
                }
            },
            (error) => {
                setIsDetectingLocation(false);
                let errorMsg = t('location_detect_error');
                if (error.code === 1) errorMsg = t('location_permission_denied');
                if (error.code === 3) errorMsg = t('location_timeout');

                alert(errorMsg);
                console.error('Geolocation error:', error);
            },
            { timeout: 15000, enableHighAccuracy: true }
        );
    };

    // Helper: Compress Image using Canvas
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Max dimension 800px
                    const MAX_DIM = 800;
                    if (width > height) {
                        if (width > MAX_DIM) {
                            height *= MAX_DIM / width;
                            width = MAX_DIM;
                        }
                    } else {
                        if (height > MAX_DIM) {
                            width *= MAX_DIM / height;
                            height = MAX_DIM;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
            };
        });
    };

    // Handle commodity selection from autosuggest
    const handleCommoditySelect = (commodity) => {
        const recommendedUnit = getRecommendedUnit(commodity.id);
        setFormData(prev => ({
            ...prev,
            commodity: commodity.en,
            commodityId: commodity.id,
            unit: recommendedUnit,
            priceUnit: recommendedUnit
        }));
    };

    // Helper: Get Quantity Suggestions based on Commodity Category
    const getQuantitySuggestions = () => {
        // Suggestions based on Selected Unit
        if (formData.unit === 'Kg') {
            return [50, 100, 200, 500, 1000];
        } else if (formData.unit === 'Quintal') {
            return [10, 20, 50, 100];
        } else if (formData.unit === 'Ton') {
            return [1, 5, 10, 20];
        }

        // Fallback default
        return [10, 50, 100];
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();

        if (!formData.state) {
            document.getElementsByName('state')[0]?.focus();
            return;
        }

        if (!formData.commodityId) {
            // Robustness: Try to find ID if user manually typed valid name but didn't click dropdown
            if (formData.commodity) {
                const matches = searchCommodities(formData.commodity);
                const exactMatch = matches.find(c =>
                    c.en.toLowerCase() === formData.commodity.toLowerCase().trim() ||
                    c.hi === formData.commodity.trim() ||
                    c.mr === formData.commodity.trim()
                );

                if (exactMatch) {
                    // Self-healing: Found the ID for what they typed
                    formData.commodityId = exactMatch.id;
                    formData.commodity = exactMatch.en; // Normalize name
                    if (!formData.unit) {
                        const recUnit = getRecommendedUnit(exactMatch.id);
                        setFormData(prev => ({ ...prev, commodityId: exactMatch.id, commodity: exactMatch.en, unit: recUnit }));
                        // Local mutations for this run
                        formData.unit = recUnit;
                    } else {
                        setFormData(prev => ({ ...prev, commodityId: exactMatch.id, commodity: exactMatch.en }));
                    }
                } else {
                    // Value typed but no match found in DB
                    alert(t('invalid_commodity') || 'Please select a valid crop from the suggestions');
                    const inputs = document.querySelectorAll('input[placeholder*="Type: Tomato"]');
                    if (inputs.length > 0) inputs[0].focus();
                    return;
                }
            } else {
                // No commodity typed
                const inputs = document.querySelectorAll('input[placeholder*="Type: Tomato"]');
                if (inputs.length > 0) inputs[0].focus();
                return;
            }
        }


        if (!formData.district) {
            document.getElementsByName('district')[0]?.focus();
            return;
        }

        // Conditional Validation based on Type
        if (formData.type === 'Sell') {
            if (!formData.quality) {
                setFormErrors(prev => ({ ...prev, quality: true }));
                alert(t('quality_required') || 'Please select a quality grade');
                // Scroll to the quality section container
                const qualitySection = document.getElementById('quality-options-container');
                if (qualitySection) {
                    qualitySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            if (formData.pricingMode === 'fixed' && (!formData.targetPrice || Number(formData.targetPrice) <= 0)) {
                document.getElementsByName('targetPrice')[0]?.focus();
                return;
            }

            if (formData.pricingMode === 'fixed' && !formData.priceUnit) {
                document.getElementsByName('priceUnit')[0]?.focus();
                return;
            }
        }

        // Common Validation
        if (!formData.unit) {
            document.getElementsByName('unit')[0]?.focus();
            return;
        }

        if (Number(formData.quantity) <= 0) {
            document.getElementsByName('quantity')[0]?.focus();
            return;
        }

        // If 'market' price selected, show insight
        // Native confirm removed to prevent blocking UI. Custom modal below handles confirmation.

        setShowConfirmation(true);
    };

    const confirmSubmit = () => {

        console.log("Seller: confirmSubmit called");
        if (isSubmitting) {
            console.log("Seller: Already submitting, ignoring click");
            return;
        }
        setIsSubmitting(true);

        try {
            console.log("Seller: Checking eligibility for", mobileNumber, formData.commodity);
            const eligibility = checkListingEligibility(mobileNumber, formData.commodity, editMode ? editListingId : null);
            console.log("Seller: Eligibility result:", eligibility);

            if (!eligibility.eligible) {
                alert(eligibility.message);
                setShowConfirmation(false);
                setIsSubmitting(false);
                return;
            }

            setShowConfirmation(false);
            console.log("Seller: Proceeding with submission...");

            // Simulate a small delay for better UX (optional, but good for "feeling" the process)
            setTimeout(() => {
                try {
                    if (editMode) {
                        // Update existing listing
                        const updatedListing = {
                            ...formData,
                            seller: `${firstName} ${lastName}`,
                            contactMobile: mobileNumber,
                            timestamp: new Date().toISOString()
                        };
                        updateListing(editListingId, updatedListing);
                        setShowSuccessModal(true);
                    } else {
                        // Add new listing
                        const finalListing = {
                            ...formData,
                            seller: `${firstName} ${lastName}`,
                            contactMobile: mobileNumber,
                            timestamp: new Date().toISOString()
                        };
                        addListing(finalListing);
                        setShowSuccessModal(true);
                    }
                } catch (err) {
                    console.error("Seller: Error in setTimeout submission:", err);
                    alert(t('error_general'));
                } finally {
                    setIsSubmitting(false);
                }
            }, 500);
        } catch (error) {
            console.error("Seller: Error in confirmSubmit:", error);
            alert(t('error_general'));
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '500px' }}>
                <h1 style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                    {formData.type === 'Buy' ? t('i_want_buy') : t('list_product')}
                </h1>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('contact_name')} *</label>
                        <input
                            ref={nameRef}
                            type="text"
                            placeholder={t('placeholder_name')}
                            value={firstName}
                            onChange={(e) => {
                                // Only allow alphabets and spaces
                                if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                    setFirstName(e.target.value);
                                }
                            }}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('phone_number')} *</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ padding: '0.75rem', background: '#eee', borderRadius: '4px' }}>+91</span>
                            <input
                                ref={mobileRef}
                                type="tel"
                                placeholder="9876543210"
                                maxLength="10"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                    </div>

                    {!showOtpInput ? (
                        <button onClick={handleGenerateOtp} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                            {t('generate_otp')}
                        </button>
                    ) : (
                        <div className="fade-in">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('enter_otp')} *</label>
                            <input
                                type="text"
                                placeholder="1234"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                            />
                            <button onClick={handleVerifyOtp} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                                {t('verify_signin')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url('/images/seller_bg.png') center/cover no-repeat fixed`,
            minHeight: '90vh',
            padding: 'var(--spacing-xl) 0'
        }}>
            <div className="container fade-in" style={{ maxWidth: '800px' }}>
                <Link to="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    color: '#666',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                }}>
                    ← {t('back_to_home')}
                </Link>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-lg)',
                    borderBottom: '2px solid var(--color-primary)',
                    paddingBottom: '0.8rem'
                }}>
                    <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.5rem' }}>
                        {editMode
                            ? (formData.type === 'Buy' ? t('update') + ' ' + t('buy') : t('update') + ' ' + t('sell'))
                            : (formData.type === 'Buy' ? t('i_want_buy') : t('list_product'))
                        }
                    </h2>
                    <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        backgroundColor: formData.type === 'Buy' ? '#FFEBEE' : '#E8F5E9',
                        color: formData.type === 'Buy' ? '#D32F2F' : '#2E7D32',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        border: `1px solid ${formData.type === 'Buy' ? '#FFCDD2' : '#C8E6C9'}`
                    }}>
                        {formData.type === 'Buy' ? '🛒 ' + t('buyer').toUpperCase() : '🚜 ' + t('seller').toUpperCase()}
                    </span>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <form onSubmit={handlePreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Do you want to Buy / Sell */}
                        <div>
                            <label className="premium-label">
                                {t('buy_sell_prompt')} <span style={{ color: 'var(--color-error)' }}>*</span>
                            </label>

                            <div className="toggle-container" style={{ position: 'relative', opacity: editMode ? 0.8 : 1 }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: formData.type === 'Buy' ? 0 : '50%',
                                    width: '50%',
                                    height: '100%',
                                    background: formData.type === 'Buy' ? 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                    borderRadius: 'var(--radius-xl)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }} />
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('Buy')}
                                    disabled={editMode}
                                    className={`toggle-btn ${formData.type === 'Buy' ? 'active' : ''}`}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        cursor: editMode ? 'not-allowed' : 'pointer',
                                        color: (editMode && formData.type === 'Buy') ? 'white' : undefined
                                    }}
                                >
                                    {editMode && formData.type === 'Buy' && '🔒 '}
                                    🛒 {t('buy')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('Sell')}
                                    disabled={editMode}
                                    className={`toggle-btn ${formData.type === 'Sell' ? 'active' : ''}`}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        cursor: editMode ? 'not-allowed' : 'pointer',
                                        color: (editMode && formData.type === 'Sell') ? 'white' : undefined
                                    }}
                                >
                                    {editMode && formData.type === 'Sell' && '🔒 '}
                                    🚜 {t('sell')}
                                </button>
                            </div>
                            {editMode && (
                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px', textAlign: 'center', fontStyle: 'italic' }}>
                                    {t('listing_type_locked')}
                                </div>
                            )}
                        </div>

                        {/* Commodity with Auto-suggest */}
                        <div>
                            <label className="premium-label">
                                {t('commodity')} <span style={{ color: 'var(--color-error)' }}>*</span>
                            </label>
                            <CommodityAutosuggest
                                value={formData.commodity}
                                onChange={(e) => handleChange({ target: { name: 'commodity', value: e.target.value } })}
                                onSelect={handleCommoditySelect}
                            />
                            {formData.commodityId && (
                                <div style={{
                                    marginTop: '8px',
                                    fontSize: '0.85rem',
                                    color: 'var(--color-success)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    ✓ {t('recommended_unit')}: <strong>{formData.unit}</strong>
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('quantity')} *
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="quantity"
                                        required
                                        placeholder="e.g. 100"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^0-9]/g, '');
                                            // Remove leading zeros
                                            if (value.length > 1 && value.startsWith('0')) {
                                                value = value.replace(/^0+/, '');
                                            }
                                            handleChange({ target: { name: 'quantity', value } });
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            height: '100%'
                                        }}
                                        min="1"
                                    />
                                </div>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '140px',
                                        padding: '0.8rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        fontSize: '0.95rem',
                                        backgroundColor: '#f9fafb'
                                    }}
                                >
                                    <option value="">Unit (इकाई)</option>
                                    <option value="Quintal">Quintal</option>
                                    <option value="Ton">Ton</option>
                                    <option value="Kg">Kg</option>
                                </select>
                            </div>

                            {/* Quantity Suggestion Chips */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: '#666', marginRight: '4px' }}>
                                    {t('quick_pick')}:
                                </span>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
                                    {getQuantitySuggestions().map(qty => (
                                        <button
                                            key={qty}
                                            type="button"
                                            onClick={() => handleChange({ target: { name: 'quantity', value: qty.toString() } })}
                                            style={{
                                                padding: '4px 10px',
                                                borderRadius: '16px',
                                                border: '1px solid #e5e7eb',
                                                background: formData.quantity === qty.toString() ? '#e0f2fe' : 'white',
                                                color: formData.quantity === qty.toString() ? '#0284c7' : '#4b5563',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                fontWeight: '500',
                                                whiteSpace: 'nowrap',
                                                flex: '1 0 auto',
                                                maxWidth: 'fit-content'
                                            }}
                                        >
                                            +{qty}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Price - Flexible Options (Only for Sellers) */}
                        {formData.type === 'Sell' && (
                            <div className="slide-in">
                                <label className="premium-label">
                                    {t('price')} <span style={{ color: 'var(--color-error)' }}>*</span>
                                </label>

                                {/* Pricing Mode Selection */}
                                <div className="pricing-mode-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <div
                                        className={`pricing-option ${formData.pricingMode === 'fixed' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, pricingMode: 'fixed' })}
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            border: `2px solid ${formData.pricingMode === 'fixed' ? 'var(--color-primary)' : '#eee'}`,
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            backgroundColor: formData.pricingMode === 'fixed' ? '#f0fdf4' : 'white',
                                            transition: 'all 0.2s',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>🏷️</span>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{t('fixed_price')}</div>
                                    </div>

                                    <div
                                        className={`pricing-option ${formData.pricingMode === 'market' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, pricingMode: 'market' })}
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            border: `2px solid ${formData.pricingMode === 'market' ? 'var(--color-secondary)' : '#eee'}`,
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            backgroundColor: formData.pricingMode === 'market' ? '#fff7ed' : 'white',
                                            transition: 'all 0.2s',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>📈</span>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{t('best_market_price')}</div>
                                    </div>
                                </div>

                                {/* Price Input (Only for Fixed Price) */}
                                {formData.pricingMode === 'fixed' && (
                                    <div className="fade-in" style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="targetPrice"
                                                placeholder="Enter price"
                                                value={formData.targetPrice}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    handleChange({ target: { name: 'targetPrice', value } });
                                                }}
                                                className="premium-input"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    minHeight: '48px' // Ensure clickable area
                                                }}
                                                required
                                            />
                                        </div>
                                        <select
                                            name="priceUnit"
                                            value={formData.priceUnit}
                                            onChange={handleChange}
                                            className="premium-select"
                                            style={{
                                                width: '140px',
                                                minHeight: '48px'
                                            }}
                                            required
                                        >
                                            <option value="">Unit</option>
                                            <option value="Quintal">Quintal</option>
                                            <option value="Ton">Ton</option>
                                            <option value="Kg">Kg</option>
                                        </select>
                                    </div>
                                )}

                                {/* Price Advisor - Show for Market Price Mode */}
                                {formData.type === 'Sell' && formData.pricingMode === 'market' && (
                                    <div className="fade-in">
                                        <PriceAdvisor
                                            commodity={formData.commodity}
                                            district={formData.district}
                                            enteredPrice={null}
                                            priceUnit={formData.priceUnit}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Location with Auto-detect */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label className="premium-label" style={{ marginBottom: 0 }}>
                                    📍 {t('location')} <span style={{ color: 'var(--color-error)' }}>*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAutoDetectLocation}
                                    disabled={isDetectingLocation}
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '0.8rem',
                                        backgroundColor: isDetectingLocation ? '#e5e7eb' : '#dcfce7',
                                        color: isDetectingLocation ? '#6b7280' : '#166534',
                                        border: '1px solid #86efac',
                                        borderRadius: '20px',
                                        cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {isDetectingLocation ? '🔄 Detecting...' : '🎯 Auto-detect'}
                                </button>
                            </div>
                            <LocationSelector
                                selectedState={formData.state}
                                selectedDistrict={formData.district}
                                selectedTehsil={formData.tehsil}
                                onLocationChange={handleLocationChange}
                                showTehsil={true}
                                vertical={false}
                            />
                        </div>

                        {/* Quality - Simplified Star Rating (Only for Sellers) */}
                        {formData.type === 'Sell' && (
                            <div className="slide-in">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <label className="premium-label" style={{ marginBottom: 0 }} id="quality-section">
                                        {t('quality')} <span style={{ color: 'var(--color-error)' }}>*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowQualityInfo(!showQualityInfo)}
                                        style={{
                                            background: '#e0f2fe',
                                            border: '1px solid #7dd3fc',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            color: '#0369a1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Click for quality guide"
                                    >
                                        ℹ️
                                    </button>
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '12px',
                                        padding: formErrors.quality ? '10px' : '0',
                                        border: formErrors.quality ? '2px solid #ef4444' : 'none',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: formErrors.quality ? '#fef2f2' : 'transparent',
                                        transition: 'all 0.3s'
                                    }}
                                    id="quality-options-container"
                                >
                                    {[
                                        { value: 'Premium', label: 'Premium', labelHi: 'उत्तम', stars: '⭐⭐⭐', color: '#4ade80' },
                                        { value: 'Good', label: 'Good', labelHi: 'अच्छा', stars: '⭐⭐', color: '#fbbf24' },
                                        { value: 'Average', label: 'Average', labelHi: 'सामान्य', stars: '⭐', color: '#fb923c' }
                                    ].map(grade => (
                                        <label
                                            key={grade.value}
                                            style={{
                                                padding: '16px 12px',
                                                border: `2px solid ${formData.quality === grade.value ? 'var(--color-primary)' : '#e5e7eb'}`,
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                backgroundColor: formData.quality === grade.value ? '#f0f9ff' : 'white',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="quality"
                                                value={grade.value}
                                                checked={formData.quality === grade.value}
                                                onChange={handleChange}
                                                required // Functional backup
                                                style={{ display: 'none' }}
                                            />
                                            <div style={{ fontSize: '1.5rem' }}>{grade.stars}</div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                                {grade.label}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                                {grade.labelHi}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {formErrors.quality && (
                                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 'bold' }}>
                                        {t('quality_required') || 'Please select a quality grade'}
                                    </div>
                                )}

                                {/* Quality Info - Collapsible */}
                                {showQualityInfo && (
                                    <div className="fade-in" style={{
                                        marginTop: '12px',
                                        padding: '12px',
                                        background: '#f9fafb',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '0.85rem',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--color-primary)' }}>
                                            Quality Guide:
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div>⭐⭐⭐ <strong>Premium:</strong> Perfect size, uniform, bright color, no defects</div>
                                            <div>⭐⭐ <strong>Good:</strong> Good quality, minor flaws, small spots</div>
                                            <div>⭐ <strong>Average:</strong> Usable, irregular shape, smaller size</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Comments */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('comments')}
                            </label>
                            <textarea
                                name="comments"
                                rows="3"
                                placeholder="I want to buy good quality commodity."
                                value={formData.comments}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        {/* Image Upload - Only for Sellers */}
                        {formData.type === 'Sell' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                    {t('upload_photos')} <span style={{ fontSize: '0.8rem', color: '#666' }}>{t('photo_constraints')}</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files);
                                        const currentImages = formData.images || [];

                                        if (currentImages.length + files.length > 3) {
                                            alert(t('max_images_error'));
                                            return;
                                        }

                                        for (const file of files) {
                                            // Show "Compressing..." feedback if possible, or just process
                                            const compressedDataUrl = await compressImage(file);
                                            setFormData(prev => ({
                                                ...prev,
                                                images: [...(prev.images || []), compressedDataUrl]
                                            }));
                                        }
                                    }}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
                                />

                                <div style={{
                                    marginTop: '8px',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-primary)',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#E8F5E9',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #C8E6C9'
                                }}>
                                    💡 <span>{t('photo_speed_tip')}</span>
                                </div>

                                {formData.images && formData.images.length > 0 && (
                                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                                        {formData.images.map((img, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = [...formData.images];
                                                        newImages.splice(index, 1);
                                                        setFormData(prev => ({ ...prev, images: newImages }));
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-5px',
                                                        right: '-5px',
                                                        background: '#ff4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Advanced Options Toggle - Only for Sellers */}
                        {formData.type === 'Sell' && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--color-primary)',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        padding: '0',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>{showAdvancedOptions ? '➖' : '➕'}</span>
                                    {showAdvancedOptions ? `${t('hide_advanced')}` : `${t('show_advanced')}`}
                                </button>

                                {showAdvancedOptions && (
                                    <div className="slide-in" style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        marginTop: '1.2rem',
                                        padding: '1.2rem',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {[
                                            { label: t('is_organic'), name: "isOrganic", icon: "🍃" },
                                            { label: t('is_graded'), name: "isGraded", icon: "📐" },
                                            { label: t('is_packed'), name: "isPacked", icon: "💰" }
                                        ].map((item) => (
                                            <label key={item.name} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                cursor: 'pointer',
                                                padding: '4px 0'
                                            }}>
                                                <div style={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        name={item.name}
                                                        checked={formData[item.name]}
                                                        onChange={handleChange}
                                                        style={{
                                                            width: '22px',
                                                            height: '22px',
                                                            accentColor: 'var(--color-primary)',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ color: '#334155', fontSize: '1rem', fontWeight: '500' }}>
                                                    <span style={{ marginRight: '8px' }}>{item.icon}</span>
                                                    {item.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ margin: '1rem 0', borderTop: '1px solid #eee' }}></div>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>{t('contact_info')}</p>

                        {/* Contact Name (Read Only) */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('contact_name')} <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={firstName} // From Auth State
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    localStorage.setItem('kisan_user_name', e.target.value);
                                }}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #eee', background: '#fff' }}
                            />
                        </div>

                        {/* Contact Phone (Instead of Email) */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('phone_number')} <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ padding: '0.8rem', background: '#eee', borderRadius: '4px' }}>+91</span>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    placeholder="9876543210"
                                    maxLength="10"
                                    value={mobileNumber} // Using same mobile number for now
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setMobileNumber(val);
                                        localStorage.setItem('kisan_user_mobile', val);
                                    }}
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #eee', background: '#fff' }}
                                />
                            </div>
                        </div>

                        {/* Info for Buyers */}
                        {formData.type === 'Buy' && (
                            <div style={{
                                backgroundColor: '#E3F2FD',
                                color: '#0D47A1',
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: '1px solid #BBDEFB',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                                <span>
                                    <strong>{t('buyer_note_title')}:</strong><br />
                                    {t('buyer_note_desc')}
                                </span>
                            </div>
                        )}

                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '1.5rem' }}>
                            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                            <span style={{ color: 'var(--color-primary)', fontWeight: '500', fontSize: '0.9rem' }}>{t('agree_terms')}</span>
                        </label>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            {editMode && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm(t('confirm_cancel'))) {
                                            navigate('/my-products');
                                        }
                                    }}
                                    className="btn"
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        backgroundColor: '#f1f5f9',
                                        color: '#475569',
                                        border: '1px solid #cbd5e1'
                                    }}
                                >
                                    ❌ {t('cancel')}
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>
                                {editMode ? `✏️ ${t('update') || 'Update'}` : `📤 ${t('next')}`}
                            </button>
                            <Link to="/" style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                color: '#555',
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                padding: '1rem',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                border: '1px solid #ccc'
                            }}>
                                🏠 {t('back_to_home')}
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
            {/* Confirmation Modal */}
            {
                showConfirmation && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        zIndex: 2000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem'
                    }}>
                        <div className="card fade-in" style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                                {t('confirm_details_title')}
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                <strong style={{ color: '#666' }}>{t('type_label')}:</strong>
                                <span style={{ fontWeight: 'bold', color: formData.type === 'Buy' ? '#D32F2F' : '#2E7D32' }}>
                                    {formData.type === 'Buy' ? t('want_to_buy') : t('want_to_sell')}
                                </span>

                                <strong style={{ color: '#666' }}>{t('commodity')}:</strong>
                                <span>{formData.commodity}</span>

                                <strong style={{ color: '#666' }}>{t('quantity')}:</strong>
                                <span>{formData.quantity} {formData.unit}</span>

                                <strong style={{ color: '#666' }}>{t('price')}:</strong>
                                <span>₹{formData.targetPrice} / {formData.priceUnit}</span>

                                <strong style={{ color: '#666' }}>{t('location')}:</strong>
                                <span>{formData.district}, {formData.state}</span>
                            </div>

                            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginBottom: '1.5rem', background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                                {t('verify_warning')}
                            </p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                >
                                    {t('verify_edit')}
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    className="btn btn-primary"
                                    style={{ flex: 1, opacity: isSubmitting ? 0.7 : 1 }}
                                    disabled={isSubmitting}
                                >
                                    {t('confirm_post')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <SuccessModal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                type={formData.type}
            />
        </div >
    );
};

export default Seller;
