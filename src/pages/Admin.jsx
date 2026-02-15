import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { fetchLiveLeads } from '../services/leadService';

const Admin = () => {
    const { user, loading } = useAuth();
    const { listings, deleteListing, addListing } = useMarket();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'alerts', 'users', or 'leads'
    const [alerts, setAlerts] = useState([]);
    const [users, setUsers] = useState([]);
    const [webLeads, setWebLeads] = useState([]);
    const [buyerNeeds, setBuyerNeeds] = useState([]);
    const [farmerSellers, setFarmerSellers] = useState([]);
    const [marketNews, setMarketNews] = useState([]);
    const [leadCategory, setLeadCategory] = useState('requirements'); // 'requirements', 'farmers', 'news'
    const [isFetchingLeads, setIsFetchingLeads] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [convertingLead, setConvertingLead] = useState(null);
    const [conversionForm, setConversionForm] = useState({
        commodity: '',
        type: 'Buy',
        price: '',
        quantity: '',
        unit: 'quintal'
    });

    // Fetch alerts from Firestore
    useEffect(() => {
        const q = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alertsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAlerts(alertsData);
        });
        return () => unsubscribe();
    }, []);

    // Fetch users from Firestore
    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, []);

    const loadWebLeads = async () => {
        setIsFetchingLeads(true);
        try {
            const [reqs, farmers, news] = await Promise.all([
                fetchLiveLeads('requirements'),
                fetchLiveLeads('farmers'),
                fetchLiveLeads('news')
            ]);
            setBuyerNeeds(reqs);
            setFarmerSellers(farmers);
            setMarketNews(news);

            // Set initial view to results of the active sub-tab category
            setWebLeads(leadCategory === 'requirements' ? reqs :
                leadCategory === 'farmers' ? farmers : news);
        } catch (err) {
            console.error("Load leads failed:", err);
        }
        setIsFetchingLeads(false);
    };

    useEffect(() => {
        if (activeTab === 'leads' && (buyerNeeds.length === 0)) {
            loadWebLeads();
        }
    }, [activeTab]);

    useEffect(() => {
        setWebLeads(leadCategory === 'requirements' ? buyerNeeds :
            leadCategory === 'farmers' ? farmerSellers : marketNews);
    }, [leadCategory, buyerNeeds, farmerSellers, marketNews]);

    const startConversion = (lead) => {
        // Simple extraction logic
        const commonCrops = ['maize', 'onion', 'soybean', 'wheat', 'rice', 'tomato', 'potato', 'chilli', 'cotton'];
        const text = (lead.author + ' ' + lead.question).toLowerCase();
        const foundCrop = commonCrops.find(crop => text.includes(crop));

        setConvertingLead(lead);
        setConversionForm({
            commodity: foundCrop ? foundCrop.charAt(0).toUpperCase() + foundCrop.slice(1) : '',
            type: lead.type === 'farmers' ? 'Sell' : 'Buy',
            price: '',
            quantity: '',
            unit: 'quintal'
        });
    };

    const handlePublishConversion = async (e) => {
        e.preventDefault();
        setIsPublishing(true);
        try {
            const newListing = {
                commodity: conversionForm.commodity,
                type: conversionForm.type,
                targetPrice: conversionForm.price,
                priceUnit: conversionForm.unit,
                quantity: conversionForm.quantity,
                description: `Sourced from Web Lead: ${convertingLead.question}`,
                seller: conversionForm.type === 'Sell' ? 'Admin Verified Farmer' : 'Admin Verification',
                contactMobile: user.phone,
                location: 'Verified Web Lead',
                isExternal: false,
                source: 'Kisan Bazaar Admin'
            };

            await addListing(newListing);
            alert(`Successfully posted as ${conversionForm.type} Requirement!`);
            setConvertingLead(null);
        } catch (err) {
            console.error('Conversion failed:', err);
            alert('Failed to publish conversion.');
        }
        setIsPublishing(false);
    };


    if (loading) return <div>Loading...</div>;

    // Hard Security Check
    if (!user || user.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    const simpleListings = listings.map(l => ({
        id: l.id,
        type: l.type,
        title: l.commodity || l.title,
        user: l.seller || l.contactName,
        mobile: l.contactMobile,
        date: new Date(l.timestamp || Date.now()).toLocaleDateString(),
        price: l.targetPrice ? `${l.targetPrice}/${l.priceUnit}` : 'Market',
        location: `${l.district || ''}, ${l.state || ''}`
    }));

    const filteredListings = simpleListings.filter(l =>
        l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.mobile?.includes(searchTerm) ||
        l.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete listing for "${title}"?`)) {
            await deleteListing(id);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <SEO title="Admin Dashboard" description="Admin management area" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: '#1e293b' }}>🛡️ Admin Dashboard</h1>
                <div style={{ padding: '0.5rem 1rem', background: '#e2e8f0', borderRadius: '8px', fontWeight: 'bold' }}>
                    Admin: {user.phone}
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
                    <button
                        onClick={() => setActiveTab('listings')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'listings' ? '3px solid #3b82f6' : '3px solid transparent',
                            color: activeTab === 'listings' ? '#3b82f6' : '#64748b',
                            fontWeight: activeTab === 'listings' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        📋 Listings ({listings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'alerts' ? '3px solid #3b82f6' : '3px solid transparent',
                            color: activeTab === 'alerts' ? '#3b82f6' : '#64748b',
                            fontWeight: activeTab === 'alerts' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        🔔 Alerts ({alerts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'users' ? '3px solid #3b82f6' : '3px solid transparent',
                            color: activeTab === 'users' ? '#3b82f6' : '#64748b',
                            fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        👥 Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'leads' ? '3px solid #3b82f6' : '3px solid transparent',
                            color: activeTab === 'leads' ? '#3b82f6' : '#64748b',
                            fontWeight: activeTab === 'leads' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        🌐 Web Leads ({webLeads.length})
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', padding: '1rem', background: '#eff6ff', borderRadius: '8px' }}>
                        <h3 style={{ margin: 0, color: '#1e40af' }}>Total Listings</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{listings.length}</p>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px', padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
                        <h3 style={{ margin: 0, color: '#92400e' }}>Active Alerts</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{alerts.length}</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0 }}>
                        {activeTab === 'listings' ? 'Moderation Queue' :
                            activeTab === 'leads' ? 'External Market Requirements' :
                                activeTab === 'users' ? 'Registered Users' : 'Active Alerts'}
                    </h3>
                    {activeTab === 'leads' && (
                        <button
                            onClick={loadWebLeads}
                            disabled={isFetchingLeads}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            {isFetchingLeads ? 'Fetching...' : '🔄 Refresh Leads'}
                        </button>
                    )}
                    {activeTab === 'listings' && (
                        <input
                            type="text"
                            placeholder="Search by crop, name, mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '300px' }}
                        />
                    )}
                </div>

                {activeTab === 'listings' ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.9rem' }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Type</th>
                                    <th style={{ padding: '1rem' }}>Commodity</th>
                                    <th style={{ padding: '1rem' }}>User (Mobile)</th>
                                    <th style={{ padding: '1rem' }}>Location</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredListings.length > 0 ? (
                                    filteredListings.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '1rem' }}>{item.date}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                    background: item.type === 'Buy' ? '#fee2e2' : '#dcfce7',
                                                    color: item.type === 'Buy' ? '#dc2626' : '#166534'
                                                }}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>{item.title}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div>{item.user}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.mobile}</div>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569' }}>{item.location}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.title)}
                                                    style={{
                                                        background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5',
                                                        padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                            No listings found matching search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'alerts' ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.9rem' }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Date Created</th>
                                    <th style={{ padding: '1rem' }}>Commodity</th>
                                    <th style={{ padding: '1rem' }}>User (Mobile)</th>
                                    <th style={{ padding: '1rem' }}>Max Price</th>
                                    <th style={{ padding: '1rem' }}>Location Filter</th>
                                    <th style={{ padding: '1rem' }}>Channel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.length > 0 ? (
                                    alerts.map(alert => (
                                        <tr key={alert.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '1rem' }}>
                                                {new Date(alert.timestamp).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>
                                                🔔 {alert.commodity}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.9rem', color: '#666' }}>{alert.userId}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {alert.maxPrice ? `₹${alert.maxPrice}` : 'Any'}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                                                {alert.district || alert.tehsil ? `${alert.tehsil || ''}, ${alert.district || ''}` : 'All Locations'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                    background: '#e0f2fe', color: '#0369a1'
                                                }}>
                                                    {alert.channel || 'app'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                            No active alerts yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : null}

                {activeTab === 'users' && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.9rem' }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Join Date</th>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Phone</th>
                                    <th style={{ padding: '1rem' }}>Location</th>
                                    <th style={{ padding: '1rem' }}>Listings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map(u => (
                                        <tr key={u.uid} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '1rem' }}>
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>
                                                {u.name || 'N/A'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {u.phone}
                                            </td>
                                            <td style={{ padding: '1rem', color: '#475569' }}>
                                                {u.city || 'N/A'}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                {listings.filter(l => l.userId === u.uid).length}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                            No users registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div style={{ padding: '1rem' }}>
                        {/* Sub-Navigation for Leads */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                            <button
                                onClick={() => setLeadCategory('requirements')}
                                style={{
                                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                                    background: leadCategory === 'requirements' ? '#3b82f6' : 'white',
                                    color: leadCategory === 'requirements' ? 'white' : '#64748b',
                                    border: '1px solid #cbd5e1', fontSize: '0.9rem'
                                }}
                            >
                                🛒 Buyer Needs ({buyerNeeds.length})
                            </button>
                            <button
                                onClick={() => setLeadCategory('farmers')}
                                style={{
                                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                                    background: leadCategory === 'farmers' ? '#10b981' : 'white',
                                    color: leadCategory === 'farmers' ? 'white' : '#64748b',
                                    border: '1px solid #cbd5e1', fontSize: '0.9rem'
                                }}
                            >
                                👨‍🌾 Farmer Sellers ({farmerSellers.length})
                            </button>
                            <button
                                onClick={() => setLeadCategory('news')}
                                style={{
                                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                                    background: leadCategory === 'news' ? '#f59e0b' : 'white',
                                    color: leadCategory === 'news' ? 'white' : '#64748b',
                                    border: '1px solid #cbd5e1', fontSize: '0.9rem'
                                }}
                            >
                                📰 Market News ({marketNews.length})
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.9rem' }}>
                                    <tr>
                                        <th style={{ padding: '1rem' }}>Source</th>
                                        <th style={{ padding: '1rem' }}>Title / Farmer</th>
                                        <th style={{ padding: '1rem' }}>Latest Update / Post</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {webLeads.length > 0 ? (
                                        webLeads.map(lead => (
                                            <tr key={lead.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                        background: lead.source === 'Facebook' ? '#e7f3ff' : '#fff3e0',
                                                        color: lead.source === 'Facebook' ? '#1877f2' : '#e65100',
                                                        border: '1px solid #e2e8f0'
                                                    }}>
                                                        {lead.source}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', fontWeight: '500' }}>{lead.author}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                                                    {lead.question}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <a
                                                            href={lead.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                textDecoration: 'none', background: '#f8fafc', color: '#475569',
                                                                padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem',
                                                                border: '1px solid #e2e8f0', fontWeight: '600'
                                                            }}
                                                        >
                                                            🔗 Link
                                                        </a>
                                                        {lead.type !== 'news' && (
                                                            <button
                                                                onClick={() => startConversion(lead)}
                                                                style={{
                                                                    background: lead.type === 'farmers' ? '#10b981' : '#3b82f6',
                                                                    color: 'white', padding: '6px 12px', borderRadius: '6px',
                                                                    fontSize: '0.8rem', fontWeight: '600', border: 'none', cursor: 'pointer'
                                                                }}
                                                            >
                                                                {lead.type === 'farmers' ? '👨‍🌾 Post Sell' : '➕ Post Buy'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                                {isFetchingLeads ? 'Loading latest updates...' : 'No data found. Try refreshing.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Conversion Modal */}
            {convertingLead && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', padding: '1.5rem', background: 'white' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Convert to {conversionForm.type === 'Sell' ? 'Farmer Selling' : 'Buyer Requirement'}</h2>
                        <form onSubmit={handlePublishConversion}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Listing Type</label>
                                <select
                                    value={conversionForm.type}
                                    onChange={(e) => setConversionForm({ ...conversionForm, type: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                >
                                    <option value="Buy">Buyer Looking to Buy</option>
                                    <option value="Sell">Farmer Looking to Sell</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Commodity / Crop</label>
                                <input
                                    type="text"
                                    value={conversionForm.commodity}
                                    onChange={(e) => setConversionForm({ ...conversionForm, commodity: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target Price</label>
                                    <input
                                        type="number"
                                        value={conversionForm.price}
                                        onChange={(e) => setConversionForm({ ...conversionForm, price: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                        placeholder="e.g. 2100"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Unit</label>
                                    <select
                                        value={conversionForm.unit}
                                        onChange={(e) => setConversionForm({ ...conversionForm, unit: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                    >
                                        <option value="quintal">Quintal</option>
                                        <option value="kg">Kg</option>
                                        <option value="ton">Ton</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Quantity Required</label>
                                <input
                                    type="text"
                                    value={conversionForm.quantity}
                                    onChange={(e) => setConversionForm({ ...conversionForm, quantity: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                    placeholder="e.g. 5-10 tons"
                                />
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                This will be published as a "Buy" requirement. The original web lead description will be preserved.
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setConvertingLead(null)}
                                    disabled={isPublishing}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: isPublishing ? 'not-allowed' : 'pointer', opacity: isPublishing ? 0.5 : 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    style={{
                                        flex: 2, padding: '0.75rem', borderRadius: '6px', border: 'none',
                                        background: isPublishing ? '#94a3b8' : '#10b981',
                                        color: 'white', fontWeight: 'bold', cursor: isPublishing ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isPublishing ? '🚀 Publishing...' : '✅ Publish Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
