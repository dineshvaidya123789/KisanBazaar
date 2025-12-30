import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import getCommodityImage from '../utils/commodityImages';
import mpDistricts from '../utils/mpDistricts';

const Seller = () => {
    const { addListing, updateListing, checkListingEligibility } = useMarket();
    const navigate = useNavigate();

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

    // Form State
    const [formData, setFormData] = useState({
        type: 'Sell',
        commodity: '',
        quantity: '',
        unit: '', // No default - user must select
        targetPrice: '',
        priceUnit: '', // No default - user must select
        state: '', // No default - user must select
        district: '', // No default - user must select
        quality: '', // No default - user must select
        availableFrom: '',
        comments: '',
        // Attributes
        isOrganic: false,
        isGraded: false,
        isPacked: false,
        images: [] // Changed to array for multiple images (max 3)
    });

    // Lists
    const states = ["Madhya Pradesh", "Maharashtra", "Gujarat", "Punjab", "Haryana"];
    // Using centralized MP districts list
    const districts = mpDistricts;

    // Auth Handlers
    const handleGenerateOtp = () => {
        if (!firstName || !mobileNumber) {
            alert('Please enter Name and Mobile Number.');
            return;
        }
        if (!/^\d{10}$/.test(mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }
        setShowOtpInput(true);
        alert(`Hello ${firstName}! OTP sent to ${mobileNumber}: 1234`);
    };

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleVerifyOtp = () => {
        if (otp === '1234') {
            setIsAuthenticated(true);
            // Store user session
            localStorage.setItem('kisan_user_mobile', mobileNumber);
            localStorage.setItem('kisan_user_name', firstName);
        } else {
            alert('Invalid OTP. Please try "1234"');
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
                quantity: listing.quantity,
                unit: listing.unit,
                targetPrice: listing.targetPrice,
                priceUnit: listing.priceUnit,
                state: listing.state,
                district: listing.district,
                quality: listing.quality,
                availableFrom: listing.availableFrom || '',
                comments: listing.comments,
                isOrganic: listing.isOrganic || false,
                isGraded: listing.isGraded || false,
                isPacked: listing.isPacked || false,
                // Support both old 'image' and new 'images' formats
                images: listing.images || (listing.image ? [listing.image] : [])
            });
            // Clear edit data from localStorage
            localStorage.removeItem('edit_listing');
        }
    }, []);

    // Listing Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.state) {
            alert('Please select a State (कृपया राज्य चुनें)');
            return;
        }

        if (!formData.district) {
            alert('Please select a District (कृपया जिला चुनें)');
            return;
        }

        if (!formData.quality) {
            alert('Please select Quality (कृपया गुणवत्ता चुनें)');
            return;
        }

        if (!formData.unit) {
            alert('Please select Quantity Unit (कृपया मात्रा इकाई चुनें)');
            return;
        }

        if (!formData.priceUnit) {
            alert('Please select Price Unit (कृपया मूल्य इकाई चुनें)');
            return;
        }

        if (Number(formData.quantity) <= 0) {
            alert('Quantity must be greater than 0 (मात्रा 0 से अधिक होनी चाहिए)');
            return;
        }

        if (!formData.targetPrice || Number(formData.targetPrice) <= 0) {
            alert('Please enter a valid Price (कृपया उचित मूल्य दर्ज करें)');
            return;
        }

        setShowConfirmation(true);
    };

    const confirmSubmit = () => {
        const eligibility = checkListingEligibility(mobileNumber, formData.commodity, editMode ? editListingId : null);

        if (!eligibility.eligible) {
            alert(eligibility.message);
            setShowConfirmation(false);
            return;
        }

        setShowConfirmation(false);

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
                // REMOVED auto-assign default image logic as requested
                seller: `${firstName} ${lastName}`,
                contactMobile: mobileNumber,
                timestamp: new Date().toISOString()
            };
            addListing(finalListing);
            setShowSuccessModal(true);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '500px' }}>
                <h1 style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>Sign In to Post Requirement<br /><span style={{ fontSize: '1rem', color: '#666' }}>(आवश्यकता पोस्ट करने के लिए साइन इन करें)</span></h1>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Name (संपर्क नाम) *</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Mobile Number (मोबाइल नंबर) *</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ padding: '0.75rem', background: '#eee', borderRadius: '4px' }}>+91</span>
                            <input
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
                            Generate OTP (ओटीपी प्राप्त करें)
                        </button>
                    ) : (
                        <div className="fade-in">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Enter OTP (ओटीपी दर्ज करें) *</label>
                            <input
                                type="text"
                                placeholder="1234"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                            />
                            <button onClick={handleVerifyOtp} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                                Verify & Sign In (सत्यापित करें और साइन इन करें)
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
                <h2 style={{ marginBottom: 'var(--spacing-lg)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem', color: 'var(--color-primary)' }}>
                    {editMode ? 'Edit Your Requirement (अपनी आवश्यकता संपादित करें)' : 'Post Your Requirement (अपनी आवश्यकता पोस्ट करें)'}
                </h2>

                <div className="card" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <form onSubmit={handlePreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                        {/* Do you want to Buy / Sell */}
                        {/* Do you want to Buy / Sell */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>
                                Do you want to Buy / Sell (क्या आप खरीदना / बेचना चाहते हैं) <span style={{ color: 'red' }}>*</span>
                            </label>

                            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'type', value: 'Buy' } })}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        border: 'none',
                                        backgroundColor: formData.type === 'Buy' ? '#D32F2F' : '#f5f5f5',
                                        color: formData.type === 'Buy' ? 'white' : '#666',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    BUY (खरीदना)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'type', value: 'Sell' } })}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        border: 'none',
                                        backgroundColor: formData.type === 'Sell' ? '#2E7D32' : '#f5f5f5',
                                        color: formData.type === 'Sell' ? 'white' : '#666',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    SELL (बेचना)
                                </button>
                            </div>
                        </div>

                        {/* Commodity */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Commodity (कमोडिटी / फसल) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="commodity"
                                required
                                placeholder="Ex: Tomato, Potato, Onions"
                                value={formData.commodity}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Required Quantity (आवश्यक मात्रा) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    name="quantity"
                                    required
                                    placeholder="100"
                                    value={formData.quantity}
                                    onChange={(e) => {
                                        // Only allow numeric input
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        handleChange({ target: { name: 'quantity', value } });
                                    }}
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    style={{ minWidth: '160px', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.95rem' }}
                                >
                                    <option value="">Select Unit (इकाई चुनें)</option>
                                    <option value="Quintal">Quintal (क्विंटल)</option>
                                    <option value="Ton">Ton (टन)</option>
                                    <option value="Kg">Kg (किलो)</option>
                                </select>
                            </div>
                        </div>

                        {/* Price Expectation */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Target Price (लक्ष्य मूल्य) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    name="targetPrice"
                                    placeholder="Price Expectation"
                                    value={formData.targetPrice}
                                    onChange={(e) => {
                                        // Only allow numeric input
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        handleChange({ target: { name: 'targetPrice', value } });
                                    }}
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <select
                                    name="priceUnit"
                                    value={formData.priceUnit}
                                    onChange={handleChange}
                                    required
                                    style={{ minWidth: '160px', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.95rem' }}
                                >
                                    <option value="">Select Unit (इकाई चुनें)</option>
                                    <option value="Quintal">Quintal (क्विंटल)</option>
                                    <option value="Ton">Ton (टन)</option>
                                    <option value="Kg">Kg (किलो)</option>
                                </select>
                            </div>
                        </div>

                        {/* State */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                State (राज्य) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* District */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                District (जिला) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="">Select Your District</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Quality */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Quality (गुणवत्ता) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                name="quality"
                                value={formData.quality}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="">Select Quality (गुणवत्ता चुनें)</option>
                                <option value="Very Good">Very Good - Grade A (बहुत अच्छा - ग्रेड A)</option>
                                <option value="Good">Good - Grade B (अच्छा - ग्रेड B)</option>
                                <option value="Average">Average - Grade C (औसत - ग्रेड C)</option>
                            </select>

                            {/* Quality Guide */}
                            <div style={{
                                marginTop: '10px',
                                padding: '12px',
                                background: '#f9f9f9',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                border: '1px solid #e0e0e0'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2E7D32' }}>
                                    ℹ️ Quality Guide (गुणवत्ता मार्गदर्शिका):
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ padding: '6px', background: 'white', borderRadius: '4px', borderLeft: '3px solid #4CAF50' }}>
                                        <strong style={{ color: '#2E7D32' }}>A-Grade:</strong> Perfect looking – big, uniform size, bright color, no blemishes
                                        <br />
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>बड़े, एक समान, चमकीले रंग, बिना दाग</span>
                                    </div>
                                    <div style={{ padding: '6px', background: 'white', borderRadius: '4px', borderLeft: '3px solid #FFC107' }}>
                                        <strong style={{ color: '#F57C00' }}>B-Grade:</strong> Good & tasty, minor flaws – small spots, slight scratches
                                        <br />
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>अच्छा स्वाद, छोटे दाग, हल्की खरोंच</span>
                                    </div>
                                    <div style={{ padding: '6px', background: 'white', borderRadius: '4px', borderLeft: '3px solid #FF9800' }}>
                                        <strong style={{ color: '#E65100' }}>C-Grade:</strong> Edible & usable, more defects – irregular shape, smaller size
                                        <br />
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>खाने योग्य, अनियमित आकार, छोटा आकार</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available From (Only for Sellers) */}
                        {formData.type === 'Sell' && (
                            <div className="fade-in">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Available From (कब से उपलब्ध) <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    name="availableFrom"
                                    value={formData.availableFrom || ''}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                        )}

                        {/* Comments */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Comments (टिप्पणी) <span style={{ color: 'red' }}>*</span>
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

                        {/* Image Upload */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                Upload Photos (फोटो अपलोड करें) <span style={{ fontSize: '0.8rem', color: '#666' }}>(Max 3 images, max 1MB each)</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);

                                    // Ensure images array exists (migration/robustness)
                                    const currentImages = formData.images || [];

                                    // Validation: Max 3 images
                                    if (currentImages.length + files.length > 3) {
                                        alert('You can only upload up to 3 images (आप अधिकतम 3 चित्र अपलोड कर सकते हैं)');
                                        return;
                                    }

                                    files.forEach(file => {
                                        // Validation: Max 1MB
                                        if (file.size > 1024 * 1024) {
                                            alert(`File ${file.name} is too large. Max size is 1MB. (फ़ाइल ${file.name} बहुत बड़ी है। अधिकतम आकार 1MB है)`);
                                            return;
                                        }

                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData(prev => {
                                                const safeImages = prev.images || [];
                                                return {
                                                    ...prev,
                                                    images: [...safeImages, reader.result]
                                                };
                                            });
                                        };
                                        reader.readAsDataURL(file);
                                    });
                                }}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
                            />

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

                        {/* Attributes Toggles */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {[
                                { label: "Do You Want Organic Product? (क्या आप जैविक उत्पाद चाहते हैं?)", name: "isOrganic" },
                                { label: "Do You Want Product Graded? (क्या आप ग्रेडेड उत्पाद चाहते हैं?)", name: "isGraded" },
                                { label: "Do You Want Product Packed In Bags? (क्या आप बैग में पैक उत्पाद चाहते हैं?)", name: "isPacked" }
                            ].map((item) => (
                                <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name={item.name}
                                        checked={formData[item.name]}
                                        onChange={handleChange}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                                    />
                                    <span style={{ color: '#555', fontSize: '0.95rem' }}>{item.label}</span>
                                </label>
                            ))}
                        </div>

                        <div style={{ margin: '1rem 0', borderTop: '1px solid #eee' }}></div>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>Your Contact Info (आपकी संपर्क जानकारी)</p>

                        {/* Contact Name (Read Only) */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Contact Name (संपर्क नाम) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                disabled
                                value={firstName} // From Auth State
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #eee', background: '#f9f9f9' }}
                            />
                        </div>

                        {/* Contact Phone (Instead of Email) */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Phone Number (फ़ोन नंबर) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ padding: '0.8rem', background: '#eee', borderRadius: '4px' }}>+91</span>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    placeholder="9876543210"
                                    maxLength="10"
                                    value={mobileNumber} // Using same mobile number for now
                                    disabled
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #eee', background: '#f9f9f9' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '1.5rem' }}>
                                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                                <span style={{ color: 'var(--color-primary)', fontWeight: '500', fontSize: '0.9rem' }}>I agree with Terms And Conditions (शर्तों से सहमत हूँ)</span>
                            </label>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                {editMode ? '✏️ Update (अपडेट करें)' : '📤 Submit (जमा करें)'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            {/* Confirmation Modal */}
            {showConfirmation && (
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
                            Confirm Details (विवरण की पुष्टि करें)
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                            <strong style={{ color: '#666' }}>Type:</strong>
                            <span style={{ fontWeight: 'bold', color: formData.type === 'Buy' ? '#D32F2F' : '#2E7D32' }}>
                                {formData.type === 'Buy' ? 'WANT TO BUY' : 'WANT TO SELL'}
                            </span>

                            <strong style={{ color: '#666' }}>Commodity:</strong>
                            <span>{formData.commodity}</span>

                            <strong style={{ color: '#666' }}>Quantity:</strong>
                            <span>{formData.quantity} {formData.unit}</span>

                            <strong style={{ color: '#666' }}>Price:</strong>
                            <span>₹{formData.targetPrice} / {formData.priceUnit}</span>

                            <strong style={{ color: '#666' }}>Location:</strong>
                            <span>{formData.district}, {formData.state}</span>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginBottom: '1.5rem', background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                            Please verify the details above. False information may lead to account suspension.
                            <br />
                            (कृपया ऊपर दिए गए विवरण की जाँच करें। गलत जानकारी देने पर खाता निलंबित किया जा सकता है।)
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                            >
                                Edit (संशोधित करें)
                            </button>
                            <button
                                onClick={confirmSubmit}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                Confirm & Post (पुष्टि करें)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                type={formData.type}
            />
        </div>
    );
};

export default Seller;
