import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

import SEO from '../components/SEO';

const Login = () => {
    // ... hooks ...
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [city, setCity] = useState(''); // New state for city/samiti
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [confirmResult, setConfirmResult] = useState(null); // Store Firebase confirmation result

    // Initialize Recaptcha ONCE on mount
    useEffect(() => {
        try {
            setupRecaptcha();
        } catch (e) {
            console.warn("Recaptcha Init Warning:", e);
        }

        return () => {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                } catch (error) {
                    console.warn("Recaptcha Cleanup Warning:", error);
                }
                window.recaptchaVerifier = null;
            }
        };
    }, []); // Run once on mount

    const { login, verifyOtp, setupRecaptcha, createUser } = useAuth();
    const { t } = useLanguage();

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const normalizeNumerals = (input) => {
        const devanagari = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        return input.split('').map(char => {
            const index = devanagari.indexOf(char);
            return index > -1 ? index : char;
        }).join('');
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (phone.length < 10) {
            setError(t('error_invalid_phone') || "Please enter a valid 10-digit number.");
            return;
        }
        setIsLoading(true);
        try {
            // Use existing verifier or create if missing
            let appVerifier = window.recaptchaVerifier;
            if (!appVerifier) {
                appVerifier = setupRecaptcha();
            }

            const confirmation = await login(phone, appVerifier);
            setConfirmResult(confirmation);
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(`Error: ${err.code || err.message || "Failed to send OTP"}`);
            // Don't clear verifier here, keep it for retry. 
            // Just reset if needed (invisible recaptcha resets auto usually)
            if (window.recaptchaVerifier && window.recaptchaVerifier.reset) {
                // usage of reset is vague for invisible, but harmless
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await verifyOtp(confirmResult, otp);

            // Create or update user profile in Firestore
            await createUser(user.uid, {
                phone: phone,
                city: city, // Capture city/samiti entered during login
                role: 'Farmer' // Default role, can be updated later
            });

            // Login successful, AuthContext listener will update state
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError("Invalid OTP. Please check via SMS.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <SEO
                title={t('login_title')}
                description="Secure login for farmers and buyers."
            />
            <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--color-primary)' }}>{t('login_title')}</h1>
                    <p style={{ color: '#666' }}>{t('login_subtitle')}</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {/* Invisible Recaptcha Container */}
                <div id="recaptcha-container"></div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('label_city')}</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder={t('placeholder_city')}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('label_phone')}</label>
                            <div style={{ display: 'flex' }}>
                                <span style={{ padding: '0.8rem', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRight: 'none', borderRadius: '4px 0 0 4px', color: '#555' }}>+91</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = normalizeNumerals(e.target.value);
                                        setPhone(val.replace(/\D/g, ''));
                                    }}
                                    placeholder={t('placeholder_phone')}
                                    maxLength="10"
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '0 4px 4px 0', border: '1px solid #ccc', fontSize: '1rem' }}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? t('btn_sending') : t('btn_get_otp')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#555' }}>
                            {t('otp_sent_to')} <strong>+91 {phone}</strong><br />
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setStep(1)}>{t('change_number')}</span>
                        </p>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('label_enter_otp')}</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const val = normalizeNumerals(e.target.value);
                                    setOtp(val);
                                }}
                                placeholder={t('placeholder_otp')}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '5px' }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? t('btn_verifying') : t('btn_verify_login')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
