import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { revealPhone } from './livestockService';
import { revealErrorKey, telUrl, whatsappChatUrl } from './logic';

const btn = { padding: '0.6rem 1.1rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', textDecoration: 'none', color: 'inherit', fontSize: '1rem' };

// "Show phone number": the number is fetched from the server function only after login, and each new animal counts against a daily allowance.
const RevealPhone = ({ listing, user, tx }) => {
    const [result, setResult] = useState(null);   // { phone, remaining, limit }
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const asking = useRef(false);                  // a fast double tap must not ask twice

    // Another animal, or another person: forget the number that was on screen.
    useEffect(() => { setResult(null); setError(''); }, [listing.id, user && user.uid]);

    if (!user) return <p style={{ marginTop: 18 }}><Link to="/login" state={{ from: { pathname: `/livestock/${listing.id}` } }}>{tx('reveal_login')}</Link></p>;
    if (user.uid === listing.ownerUid) return null; // the enquiry box already says "your own listing"

    const show = async () => {
        if (asking.current) return;
        asking.current = true; setBusy(true); setError('');
        try { setResult(await revealPhone(listing.id)); }
        catch (e) { console.error('reveal failed', e.reason || e.code || e); setError(tx(revealErrorKey(e.reason))); }
        asking.current = false; setBusy(false);
    };

    if (result) {
        const wa = whatsappChatUrl(result.phone, `Hello, I saw your ${listing.breed} ${listing.category} listing on KisanBazaar.`);
        return (
            <div style={{ marginTop: 18, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '0.8rem 1rem' }}>
                <div style={{ color: '#475569', fontSize: '0.85rem' }}>{tx('reveal_title')}</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', margin: '2px 0 10px' }}>{result.phone}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {telUrl(result.phone) && <a href={telUrl(result.phone)} style={btn}>{tx('enq_call')}</a>}
                    {wa && <a href={wa} target="_blank" rel="noopener noreferrer" style={btn}>{tx('enq_whatsapp')}</a>}
                </div>
                {result.remaining !== null && result.remaining !== undefined && (
                    <div style={{ marginTop: 8, color: '#64748b', fontSize: '0.8rem' }}>{tx('reveal_left', { n: result.remaining, max: result.limit })}</div>
                )}
            </div>
        );
    }

    return (
        <div style={{ marginTop: 18 }}>
            <button type="button" onClick={show} disabled={busy} style={{ width: '100%', padding: '0.8rem', fontSize: '1.05rem', borderRadius: 10, border: '2px solid var(--color-primary, #166534)', background: '#fff', color: 'var(--color-primary, #166534)', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
                {busy ? tx('reveal_loading') : tx('reveal_btn')}
            </button>
            {error && <div role="alert" style={{ color: '#b91c1c', marginTop: 8, fontSize: '0.95rem' }}>{error}</div>}
        </div>
    );
};

export default RevealPhone;
