import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Admin = () => {
    const { user, loading } = useAuth();
    const { listings, deleteListing } = useMarket();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'alerts'
    const [alerts, setAlerts] = useState([]);
    const [selectedListings, setSelectedListings] = useState([]);

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

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedListings(filteredListings.map(l => l.id));
        } else {
            setSelectedListings([]);
        }
    };

    const handleSelectListing = (id, checked) => {
        if (checked) {
            setSelectedListings([...selectedListings, id]);
        } else {
            setSelectedListings(selectedListings.filter(listingId => listingId !== id));
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedListings.length} selected listings?`)) return;

        for (const id of selectedListings) {
            await deleteListing(id);
        }
        setSelectedListings([]);
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
                    <h3 style={{ margin: 0 }}>{activeTab === 'listings' ? 'Moderation Queue' : 'Active Alerts'}</h3>
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
                    <>
                        {/* Bulk Actions Toolbar */}
                        {selectedListings.length > 0 && (
                            <div style={{
                                padding: '1rem',
                                background: '#eff6ff',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <span style={{ fontWeight: 'bold', color: '#1e40af' }}>
                                    {selectedListings.length} selected
                                </span>
                                <button
                                    onClick={handleBulkDelete}
                                    style={{
                                        background: '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    🗑️ Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelectedListings([])}
                                    style={{
                                        background: 'white',
                                        color: '#64748b',
                                        border: '1px solid #cbd5e1',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.9rem' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', width: '50px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </th>
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
                                                <td style={{ padding: '1rem' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedListings.includes(item.id)}
                                                        onChange={(e) => handleSelectListing(item.id, e.target.checked)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </td>
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
                                            <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                                No listings found matching search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
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
                                            No active alerts yet. Users can set alerts from the Marketplace page.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
