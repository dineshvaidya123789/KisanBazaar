import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { useLivestockConfig } from '../livestock/useLivestockConfig';
import { makeT } from '../livestock/texts';
import { unreadCount, telUrl, whatsappChatUrl, replyText } from '../livestock/logic';
import { subscribeSellerEnquiries, setEnquiryStatus } from '../livestock/livestockService';

const btn = { padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', textDecoration: 'none', color: 'inherit', fontSize: '0.95rem' };

// The seller's enquiry inbox. Nothing is pushed to the seller: they see new enquiries when they open this page or My animals.
const LivestockInbox = () => {
    const { user, loading } = useAuth();
    const { language } = useLanguage();
    const tx = useMemo(() => makeT(language), [language]);
    const { config, loaded } = useLivestockConfig();
    const [items, setItems] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => (user ? subscribeSellerEnquiries(user.uid, setItems) : undefined), [user && user.uid]);

    if (loading || !loaded) return <div style={{ padding: 20, textAlign: 'center' }}>...</div>;
    if (!user) return <div style={{ padding: 30, textAlign: 'center' }}><p>{tx('login_needed')}</p><Link to="/login" state={{ from: { pathname: '/livestock/inbox' } }}>Login</Link></div>;
    if (!config.enabled && user.role !== 'Admin') return <div style={{ padding: 30, textAlign: 'center' }}><h2>{tx('soon')}</h2></div>;

    const toggle = async (q) => {
        setError('');
        try { await setEnquiryStatus(q.id, q.status === 'read' ? 'new' : 'read'); }
        catch (e) { console.error(e); setError(tx('err_generic') + (e && e.code ? ` (${e.code})` : '')); }
    };
    const unread = unreadCount(items);

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', paddingBottom: 110 }}>
            <SEO title={tx('inbox_title')} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>{tx('inbox_title')}{unread > 0 ? ` (${unread})` : ''}</h2>
                <Link to="/livestock/my">{tx('my_title')}</Link>
            </div>
            {error && <div role="alert" style={{ color: '#b91c1c', margin: '0.6rem 0' }}>{error}</div>}
            {items && items.length === 0 && <p style={{ marginTop: 24 }}>{tx('inbox_empty')}</p>}
            {(items || []).map((q) => {
                const wa = whatsappChatUrl(q.buyerPhone, replyText(q));
                return (
                    <div key={q.id} style={{ border: q.status === 'read' ? '1px solid #e5e7eb' : '2px solid #16a34a', borderRadius: 12, padding: '0.9rem', marginTop: 14, background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                            <b>{q.buyerName}</b>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                {q.status !== 'read' && <span style={{ background: '#dcfce7', borderRadius: 10, padding: '1px 8px', marginRight: 8 }}>{tx('enq_new')}</span>}
                                {new Date(q.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ color: '#475569', fontSize: '0.9rem', marginTop: 4 }}>{tx('enq_about')}: <Link to={`/livestock/${q.listingId}`}>{q.listingTitle}</Link></div>
                        <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{q.message}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                            {telUrl(q.buyerPhone) && <a href={telUrl(q.buyerPhone)} style={btn}>{tx('enq_call')} {q.buyerPhone}</a>}
                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" style={btn}>{tx('enq_whatsapp')}</a>}
                            <button type="button" style={btn} onClick={() => toggle(q)}>{q.status === 'read' ? tx('enq_mark_new') : tx('enq_mark_read')}</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LivestockInbox;
