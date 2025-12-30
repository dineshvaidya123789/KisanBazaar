import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';

const AdminDashboard = () => {
    const { listings } = useMarket();
    const [activeTab, setActiveTab] = useState('Feedback');
    const [feedbacks, setFeedbacks] = useState([]);
    const [partners, setPartners] = useState([]);
    const [helpRequests, setHelpRequests] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [displayLimit, setDisplayLimit] = useState(50);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            const feedbackData = JSON.parse(localStorage.getItem('kisan_feedback') || '[]');
            setFeedbacks(feedbackData.sort((a, b) => (b.id || 0) - (a.id || 0)));
            const partnerData = JSON.parse(localStorage.getItem('kisan_partners') || '[]');
            setPartners(partnerData.sort((a, b) => (b.id || 0) - (a.id || 0)));
            const helpData = JSON.parse(localStorage.getItem('kisan_help_requests') || '[]');
            setHelpRequests(helpData.sort((a, b) => (b.id || 0) - (a.id || 0)));
        }
    }, [isLoggedIn]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsLoggedIn(true);
        } else {
            alert('Invalid Password. Hint: admin123');
        }
    };

    const clearFeedback = () => {
        if (window.confirm('Clear all feedback?')) {
            localStorage.removeItem('kisan_feedback');
            setFeedbacks([]);
        }
    };

    const clearPartners = () => {
        if (window.confirm('Clear all partner requests?')) {
            localStorage.removeItem('kisan_partners');
            setPartners([]);
        }
    };

    const clearHelp = () => {
        if (window.confirm('Clear all help requests?')) {
            localStorage.removeItem('kisan_help_requests');
            setHelpRequests([]);
        }
    };

    const getLimitedData = (data) => {
        if (displayLimit === 'All') return data;
        return data.slice(0, parseInt(displayLimit));
    };

    if (!isLoggedIn) {
        return (
            <div className="container" style={{ padding: '4rem 0', maxWidth: '400px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Admin Access Only</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                            Login to Dashboard
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>Hint: admin123</p>
                    <Link to="/" style={{ display: 'block', marginTop: '1rem', color: 'var(--color-primary)' }}>Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-lg) 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Show:</label>
                    <select
                        value={displayLimit}
                        onChange={(e) => setDisplayLimit(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="All">All</option>
                    </select>
                    <button onClick={() => setIsLoggedIn(false)} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Logout</button>
                    <Link to="/" className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Exit</Link>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('Feedback')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'Feedback' ? '3px solid var(--color-primary)' : 'none',
                        color: activeTab === 'Feedback' ? 'var(--color-primary)' : '#666',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Suggestions [{feedbacks.length}]
                </button>
                <button
                    onClick={() => setActiveTab('Partners')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'Partners' ? '3px solid var(--color-primary)' : 'none',
                        color: activeTab === 'Partners' ? 'var(--color-primary)' : '#666',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Partners [{partners.length}]
                </button>
                <button
                    onClick={() => setActiveTab('Help')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'Help' ? '3px solid var(--color-primary)' : 'none',
                        color: activeTab === 'Help' ? 'var(--color-primary)' : '#666',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Help Requests [{helpRequests.length}]
                </button>
                <button
                    onClick={() => setActiveTab('Stats')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'Stats' ? '3px solid var(--color-primary)' : 'none',
                        color: activeTab === 'Stats' ? 'var(--color-primary)' : '#666',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Usage Stats (आंकड़े)
                </button>
            </div>

            {/* Content List */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' }}>
                {activeTab === 'Feedback' ? (
                    <div>
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Recent Suggestions</span>
                            {feedbacks.length > 0 && <button onClick={clearFeedback} style={{ color: '#dc2626', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>}
                        </div>
                        {feedbacks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No feedback yet.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {getLimitedData(feedbacks).map((item, idx) => (
                                    <div key={item.id} style={{
                                        padding: '12px 15px',
                                        borderBottom: idx === feedbacks.length - 1 ? 'none' : '1px solid #f1f5f9',
                                        transition: 'background 0.2s'
                                    }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.name} <span style={{ fontWeight: 'normal', fontSize: '0.8rem', color: '#64748b' }}>(📱 {item.mobile})</span></span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.timestamp}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>{item.suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : activeTab === 'Partners' ? (
                    <div>
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Recent Partner Requests</span>
                            {partners.length > 0 && <button onClick={clearPartners} style={{ color: '#dc2626', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>}
                        </div>
                        {partners.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No partnership requests yet.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {getLimitedData(partners).map((item, idx) => (
                                    <div key={item.id} style={{
                                        padding: '12px 15px',
                                        borderBottom: idx === partners.length - 1 ? 'none' : '1px solid #f1f5f9',
                                        transition: 'background 0.2s'
                                    }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                            <div style={{ minWidth: '200px' }}>
                                                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.name}</div>
                                                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.85rem' }}>{item.companyName}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {item.city} | 📅 {item.timestamp}</div>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#334155', textAlign: 'right', flex: '1', minWidth: '150px' }}>
                                                <div>📞 {item.phone}</div>
                                                <div>✉️ {item.email}</div>
                                                {item.webAddress && <div style={{ fontSize: '0.75rem' }}>🌐 <a href={item.webAddress} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9' }}>Website</a></div>}
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem' }}>
                                            <strong>Activities:</strong> {item.activities}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : activeTab === 'Stats' ? (
                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                    {[...new Set(listings.map(l => l.contactMobile).filter(Boolean))].length}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Unique Users</div>
                            </div>
                            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{listings.length}</div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Active Listings</div>
                            </div>
                            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                    {[...new Set(listings.map(l => (l.commodity || '').toLowerCase().trim()).filter(Boolean))].length}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Crops Listed</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Top Commodities</h4>
                                {(() => {
                                    const counts = {};
                                    listings.forEach(l => {
                                        const c = l.commodity || 'Unknown';
                                        counts[c] = (counts[c] || 0) + 1;
                                    });
                                    return Object.entries(counts)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 10)
                                        .map(([name, count]) => (
                                            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                                <span>{name}</span>
                                                <span style={{ fontWeight: 'bold' }}>{count}</span>
                                            </div>
                                        ));
                                })()}
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>User Engagement</h4>
                                {(() => {
                                    const userStats = {};
                                    listings.forEach(l => {
                                        if (!l.contactMobile) return;
                                        if (!userStats[l.contactMobile]) {
                                            userStats[l.contactMobile] = { name: l.seller || 'Anonymous', count: 0 };
                                        }
                                        userStats[l.contactMobile].count++;
                                    });
                                    return Object.entries(userStats)
                                        .sort((a, b) => b[1].count - a[1].count)
                                        .slice(0, 10)
                                        .map(([mobile, data]) => (
                                            <div key={mobile} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                                <span>{data.name} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({mobile})</span></span>
                                                <span style={{ fontWeight: 'bold' }}>{data.count} Posts</span>
                                            </div>
                                        ));
                                })()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Recent Help Requests</span>
                            {helpRequests.length > 0 && <button onClick={clearHelp} style={{ color: '#dc2626', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>}
                        </div>
                        {helpRequests.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No help requests yet.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {getLimitedData(helpRequests).map((item, idx) => (
                                    <div key={item.id} style={{
                                        padding: '12px 15px',
                                        borderBottom: idx === helpRequests.length - 1 ? 'none' : '1px solid #f1f5f9',
                                        transition: 'background 0.2s'
                                    }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                                                {item.name} <span style={{ fontWeight: 'normal', fontSize: '0.8rem', color: '#64748b' }}>(📱 {item.mobile})</span>
                                                <span style={{ marginLeft: '10px', backgroundColor: 'var(--color-primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{item.topic}</span>
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.timestamp}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>{item.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
