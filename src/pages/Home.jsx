import React from 'react';

const Home = () => {
    return (
        <div className="fade-in">
            {/* Hero Section */}
            <section style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('/images/hero.png') center/cover no-repeat`,
                color: 'white',
                padding: 'var(--spacing-xl) 0',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '75vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{ color: 'var(--color-secondary)', fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
                            किसान बाज़ार में आपका स्वागत है
                        </h1>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                            Direct connection between Farmers & Buyers. No Middlemen.
                            <br />
                            (किसानों के लिए विश्वसनीय बाज़ार)
                        </p>

                        {/* Dual Action Buttons */}
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="/sell?type=Sell" className="btn" style={{
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                padding: '1.2rem 2.5rem',
                                fontSize: '1.2rem',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(46, 125, 50, 0.4)',
                                border: '2px solid #2e7d32'
                            }}>
                                🚜 I am a Farmer (फसल बेचें)
                            </a>
                            <a href="/sell?type=Buy" className="btn" style={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                padding: '1.2rem 2.5rem',
                                fontSize: '1.2rem',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                border: '2px solid white',
                                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
                            }}>
                                🛒 I am a Buyer (फसल खरीदें)
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Action Cards */}
            <section className="container quick-actions-section" style={{ position: 'relative', zIndex: 10 }}>
                <style>{`
                    .quick-actions-section {
                        margin-top: -3rem;
                    }
                    @media (max-width: 768px) {
                        .quick-actions-section {
                            margin-top: 1rem !important; /* Push down on mobile */
                        }
                    }
                `}</style>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    padding: '0 1rem'
                }}>
                    <QuickCard title="Sell Crop" subtitle="फसल बेचें" icon="📦" link="/sell?type=Sell" color="#e8f5e9" />
                    <QuickCard title="Find Buyers" subtitle="खरीदार खोजें" icon="🔍" link="/marketplace" color="#e3f2fd" />
                    <QuickCard title="Today's Rate" subtitle="मंडी भाव" icon="📈" link="/rates" color="#fff3e0" />
                    <QuickCard title="Weather" subtitle="मौसम" icon="🌦" link="/weather" color="#f3e5f5" />
                </div>
            </section>

            {/* Media & Knowledge Center */}
            <section className="container" style={{ padding: '2rem 1rem', marginBottom: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                    📢 Kisan Media & Knowledge Center
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Video / Media Card */}
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '200px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative' }}>
                            <img src="/images/video_thumb.jpg" alt="Kisan TV" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                                onError={(e) => { e.target.style.display = 'none' }} />
                            <div style={{ position: 'absolute', zIndex: 2, textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>▶️</div>
                                <span>Watch Latest Farming Tips</span>
                            </div>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <h3>📺 Kisan TV - Latest Updates</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                Learn modern farming techniques, government schemes, and market trends directly from experts.
                            </p>
                            <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Watch Now →</a>
                        </div>
                    </div>

                    {/* Blog / News Card */}
                    <div className="card" style={{ padding: '1rem' }}>
                        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📝 Latest from the Blog</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>28 Dec 2025</span>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Organic Farming: A Guide for Beginners</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                                Start your journey into chemical-free farming with these 5 simple steps. Improve soil health and reduce costs.
                            </p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>26 Dec 2025</span>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Winter Crop Protection Tips</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                                Protect your Wheat and Gram crops from frost and pest attacks this winter.
                            </p>
                        </div>
                        <a href="/news" className="btn-outline" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>Read More Articles</a>
                    </div>

                    {/* Community / Social Card */}
                    <div className="card" style={{ padding: '1rem', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9' }}>
                        <h3>🤝 Join Our Community</h3>
                        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
                            Connect with 50,000+ farmers. Share rates, advice, and grow together.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <button className="btn" style={{ backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                📱 Join WhatsApp Group
                            </button>
                            <button className="btn" style={{ backgroundColor: '#0088cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                ✈️ Join Telegram Channel
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const QuickCard = ({ title, subtitle, icon, link, color }) => (
    <a href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card" style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            borderBottom: `4px solid ${color === '#e8f5e9' ? '#2e7d32' : color === '#e3f2fd' ? '#1565c0' : color === '#fff3e0' ? '#ef6c00' : '#7b1fa2'}`
        }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{title}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{subtitle}</p>
        </div>
    </a>
);

export default Home;
