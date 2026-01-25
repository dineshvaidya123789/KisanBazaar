import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Promo = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 5;
    const navigate = useNavigate();

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => {
                if (prev >= totalSlides - 1) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 4000); // 4 seconds per slide for reading time

        return () => clearInterval(interval);
    }, []);

    // Slide Content Data
    const slides = [
        {
            id: 0,
            bgColor: '#1E4A35', // Primary Green
            content: (
                <div className="slide-content animate-pop-in">
                    <img src="/icons/icon-512x512.png" alt="Logo" style={{ width: '150px', marginBottom: '2rem', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                    <h1 style={{ color: '#fff', fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Kisan Bazaar</h1>
                    <p style={{ color: '#D4A017', fontSize: '1.5rem', marginTop: '1rem' }}>किसानों का अपना बाज़ार</p>
                </div>
            )
        },
        {
            id: 1,
            bgColor: '#D32F2F', // Red for "Problem"
            content: (
                <div className="slide-content animate-slide-left">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😫</div>
                    <h2 style={{ color: '#fff', fontSize: '2rem', lineHeight: '1.4' }}>
                        क्या आप मंडियों के चक्कर<br />
                        और <span style={{ color: '#FFD700' }}>बिचौलियों</span> से<br />
                        परेशान हैं?
                    </h2>
                </div>
            )
        },
        {
            id: 2,
            bgColor: '#2E7D32', // Green for "Solution"
            content: (
                <div className="slide-content animate-zoom-in">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏠🚜</div>
                    <h2 style={{ color: '#fff', fontSize: '2rem', lineHeight: '1.4' }}>
                        अब अपनी फसल बेचें<br />
                        <span style={{ color: '#D4A017', fontSize: '2.5rem', fontWeight: '800' }}>घर बैठे</span><br />
                        सीधे खरीदार को!
                    </h2>
                </div>)
        },
        {
            id: 3,
            bgColor: '#1565C0', // Blue for "Features"
            content: (
                <div className="slide-content animate-fade-up">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="feature-icon">📈<br />मंडी भाव</div>
                        <div className="feature-icon">🌦️<br />मौसम</div>
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>
                        पाएं रोज़ाना मंडी भाव<br />
                        और सटीक मौसम जानकारी
                    </h2>
                </div>
            )
        },
        {
            id: 4,
            bgColor: '#1E4A35', // Back to Brand color
            content: (
                <div className="slide-content animate-pulse">
                    <img src="/icons/icon-512x512.png" alt="App" style={{ width: '100px', marginBottom: '1rem', borderRadius: '15px' }} />
                    <h2 style={{ color: '#fff', marginBottom: '2rem' }}>आज ही डाउनलोड करें!</h2>
                    <div style={{ background: '#fff', padding: '1rem 2rem', borderRadius: '50px', color: '#1E4A35', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        kisanbazzar.co.in
                    </div>
                    <div style={{ marginTop: '2rem', color: '#D4A017' }}>👇 Link in Bio</div>
                </div>
            )
        }
    ];

    return (
        <div className="promo-container">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundColor: slide.bgColor }}
                >
                    {slide.content}
                </div>
            ))}

            <style>{`
                .promo-container {
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    position: relative;
                    font-family: 'Poppins', sans-serif;
                }

                .slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    opacity: 0;
                    transform: scale(1.1);
                    transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
                    padding: 2rem;
                }

                .slide.active {
                    opacity: 1;
                    transform: scale(1);
                    z-index: 10;
                }

                .feature-icon {
                    background: rgba(255,255,255,0.2);
                    padding: 1.5rem;
                    border-radius: 20px;
                    color: white;
                    font-weight: bold;
                    font-size: 1.2rem;
                    backdrop-filter: blur(10px);
                }

                /* Animations */
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
                .slide.active .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

                @keyframes slideLeft {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .slide.active .animate-slide-left { animation: slideLeft 0.8s ease-out forwards; }

                @keyframes zoomIn {
                    from { transform: scale(1.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .slide.active .animate-zoom-in { animation: zoomIn 0.8s ease-out forwards; }

                @keyframes fadeUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .slide.active .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .slide.active .animate-pulse { animation: pulse 2s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default Promo;
