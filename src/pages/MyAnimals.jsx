import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { useLivestockConfig } from '../livestock/useLivestockConfig';
import { makeT } from '../livestock/texts';
import { displayState, canRenew, statusForSellerSubmit } from '../livestock/logic';
import { subscribeMyListings, subscribeAccount, markSold, renewListing, deleteListing } from '../livestock/livestockService';

const chip = { pending: '#fef3c7', approved: '#dcfce7', rejected: '#fee2e2', sold: '#e5e7eb', expired: '#e5e7eb' };

const MyAnimals = () => {
    const { user, loading } = useAuth();
    const { language } = useLanguage();
    const tx = useMemo(() => makeT(language), [language]);
    const { config, loaded } = useLivestockConfig();
    const navigate = useNavigate();
    const [items, setItems] = useState(null);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return undefined;
        const a = subscribeMyListings(user.uid, setItems);
        const b = subscribeAccount(user.uid, setAccount);
        return () => { a(); b(); };
    }, [user && user.uid]);

    if (loading || !loaded) return <div style={{ padding: 20, textAlign: 'center' }}>...</div>;
    if (!user) return <div style={{ padding: 30, textAlign: 'center' }}><p>{tx('login_needed')}</p><Link to="/login" state={{ from: { pathname: '/livestock/my' } }}>Login</Link></div>;
    if (!config.enabled && user.role !== 'Admin') return <div style={{ padding: 30, textAlign: 'center' }}><h2>{tx('soon')}</h2></div>;

    const run = async (fn) => { setError(''); try { await fn(); } catch (e) { console.error(e); setError(tx('err_generic') + (e && e.code ? ` (${e.code})` : '')); } };
    const now = Date.now();

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
            <SEO title={tx('my_title')} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>{tx('my_title')}</h2>
                <button onClick={() => navigate('/livestock/sell')} style={{ padding: '0.7rem 1.2rem', borderRadius: 10, border: 'none', background: 'var(--color-primary, #166534)', color: '#fff', cursor: 'pointer' }}>{tx('post_new')}</button>
            </div>
            {error && <div style={{ color: '#b91c1c', margin: '0.6rem 0' }}>{error}</div>}
            {items && items.length === 0 && <p style={{ marginTop: 24 }}>{tx('none')}</p>}
            {(items || []).map((l) => {
                const st = displayState(l, now);
                return (
                    <div key={l.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '0.9rem', marginTop: 14, background: '#fff' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {l.photos && l.photos[0] ? <img src={l.photos[0]} alt="" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8 }} /> : <div style={{ width: 84, height: 84, background: '#f3f4f6', borderRadius: 8 }} />}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>{l.quantity} × {l.breed} {l.category}</div>
                                <div style={{ color: '#475569', fontSize: '0.9rem' }}>{l.district}, {l.state} · Rs {l.price} / {tx(l.priceType)}</div>
                                <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 12, fontSize: '0.8rem', background: chip[st] }}>{tx('status_' + st)}</span>
                                {st === 'approved' && l.expiresAt && <span style={{ marginLeft: 8, fontSize: '0.8rem', color: '#64748b' }}>{tx('expires')} {new Date(l.expiresAt).toLocaleDateString()}</span>}
                            </div>
                        </div>
                        {st === 'rejected' && l.rejectionReason && <div style={{ marginTop: 8, color: '#b91c1c', fontSize: '0.9rem' }}>{tx('reason')}: {l.rejectionReason}</div>}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                            {st !== 'sold' && <button onClick={() => navigate(`/livestock/edit/${l.id}`)}>{tx('edit')}</button>}
                            {canRenew(l, now) && <button onClick={() => run(() => renewListing(l, statusForSellerSubmit(account, config), config))}>{tx('renew')}</button>}
                            {(st === 'approved' || st === 'pending') && <button onClick={() => run(() => markSold(l.id))}>{tx('sold')}</button>}
                            <button style={{ color: '#b91c1c' }} onClick={() => { if (window.confirm(tx('confirm_delete'))) run(() => deleteListing(l)); }}>{tx('delete')}</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MyAnimals;
