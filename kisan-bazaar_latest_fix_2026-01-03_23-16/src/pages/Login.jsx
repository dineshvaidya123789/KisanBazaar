import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (phone.length !== 10) {
            setError("Please enter a valid 10-digit number.");
            return;
        }
        setIsLoading(true);
        // Simulate SMS API delay
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
            setError('');
            // In a real app, this would trigger the SMS
        }, 800);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(phone, otp);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--color-primary)' }}>Sign In / लॉग इन</h1>
                    <p style={{ color: '#666' }}>Access exclusive farmer features.</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone Number (मोबाइल नंबर)</label>
                            <div style={{ display: 'flex' }}>
                                <span style={{ padding: '0.8rem', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRight: 'none', borderRadius: '4px 0 0 4px', color: '#555' }}>+91</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Only numbers
                                    placeholder="Enter 10 digit number"
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
                            {isLoading ? 'Sending OTP...' : 'Get OTP (ओटीपी भेजें)'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#555' }}>
                            We sent an OTP to <strong>+91 {phone}</strong><br />
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setStep(1)}>Change Number</span>
                        </p>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Enter OTP (ओटीपी डालें)</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="e.g. 1234"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '5px' }}
                                required
                            />
                            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                                (Use mock OTP: 1234)
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
