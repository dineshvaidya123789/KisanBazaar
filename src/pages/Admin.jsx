import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { Navigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Admin = () => {
    const { user, loading } = useAuth();
    const { listings, deleteListing } = useMarket();
    const [searchTerm, setSearchTerm] = useState('');

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
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', padding: '1rem', background: '#eff6ff', borderRadius: '8px' }}>
                        <h3 style={{ margin: 0, color: '#1e40af' }}>Total Listings</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{listings.length}</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0 }}>Moderation Queue</h3>
                    <input
                        type="text"
                        placeholder="Search by crop, name, mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '300px' }}
                    />
                </div>

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
                                        No listings found found matching search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
