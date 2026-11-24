import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEnquiry, normalizePhone, ENQUIRY_MAX } from './logic';
import { getMyEnquiry, sendEnquiry, fetchListing } from './livestockService';

const box = { padding: '0.7rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const err = { color: '#b91c1c', fontSize: '0.85rem', marginTop: 4 };
const DEFAULT_NAMES = ['Kisan User', 'Administrator'];

// "Ask the seller" on the listing page. One enquiry per buyer per animal (the record id is listing + buyer).
const EnquiryBox = ({ listing, user, tx }) => {
    const [mine, setMine] = useState(undefined); // undefined = loading, null = none yet
    const [name, setName] = useState('');
    const [message, setMessage] = useState(tx('enq_default'));
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [note, setNote] = useState('');
    const sending = useRef(false); // guards a fast double tap before the screen has re-drawn

    const uid = user && user.uid;
    useEffect(() => {
        setMine(undefined); setNote('');
        if (!uid || uid === listing.ownerUid) return undefined;
        let alive = true;
        getMyEnquiry(listing.id, uid).then((q) => { if (alive) setMine(q); }).catch(() => { if (alive) setMine(null); });
        return () => { alive = false; };
    }, [uid, listing.id]);
    useEffect(() => { if (user && !DEFAULT_NAMES.includes(user.name)) setName((n) => n || user.name || ''); }, [user && user.name]);

    if (!user) {
        return <p style={{ marginTop: 18 }}><Link to="/login" state={{ from: { pathname: `/livestock/${listing.id}` } }}>{tx('enq_login')}</Link></p>;
    }
    if (user.uid === listing.ownerUid) return <p style={{ marginTop: 18, color: '#64748b' }}>{tx('enq_own')}</p>;
    if (mine === undefined) return <p style={{ marginTop: 18 }}>...</p>;

    if (mine) {
        return (
            <div style={{ marginTop: 18, background: '#ecfccb', borderRadius: 10, padding: '0.8rem 1rem' }}>
                <b>{note || tx('enq_already')}</b>
                <div style={{ marginTop: 6, fontSize: '0.9rem', color: '#475569' }}>{tx('enq_sent_on')} {new Date(mine.createdAt).toLocaleDateString()}</div>
                <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{mine.message}</div>
            </div>
        );
    }

    const submit = async (e) => {
        e.preventDefault();
        if (sending.current) return;
        const errs = validateEnquiry({ name, message, phone: user.phone });
        setErrors(errs);
        if (Object.keys(errs).length) return;
        sending.current = true; setBusy(true); setNote('');
        try {
            const q = await sendEnquiry({ listing, buyerUid: user.uid, name, phone: user.phone, message });
            setNote(tx('enq_sent')); setMine(q);
        } catch (ex) {
            console.error('enquiry failed', ex);
            // A second send for the same animal is refused by the rules (it would be an edit): show what was already sent.
            const existing = await getMyEnquiry(listing.id, user.uid).catch(() => null);
            if (existing) setMine(existing);
            else {
                // If the animal was sold, expired or removed while the buyer was typing, say so instead of "try again".
                const expired = Number(listing.expiresAt) <= Date.now();
                const stillThere = expired ? null : await fetchListing(listing.id, { fresh: true }).catch(() => listing);
                setNote(stillThere ? tx('enq_failed') + (ex && ex.code ? ` (${ex.code})` : '') : tx('unavailable'));
            }
        }
        sending.current = false; setBusy(false);
    };

    return (
        <form onSubmit={submit} noValidate style={{ marginTop: 18, border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.8rem 1rem 1rem' }}>
            <h3 style={{ margin: '0 0 6px' }}>{tx('enq_title')}</h3>
            <label style={{ display: 'block', fontWeight: 600, margin: '0.6rem 0 0.25rem' }}>{tx('enq_name')}</label>
            <input style={box} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
            {errors.name && <div role="alert" style={err}>{tx(errors.name, { n: ENQUIRY_MAX })}</div>}
            <label style={{ display: 'block', fontWeight: 600, margin: '0.8rem 0 0.25rem' }}>{tx('enq_message')}</label>
            <textarea style={{ ...box, minHeight: 80, fontFamily: 'inherit' }} value={message} maxLength={ENQUIRY_MAX} onChange={(e) => setMessage(e.target.value)} />
            {errors.message && <div role="alert" style={err}>{tx(errors.message, { n: ENQUIRY_MAX })}</div>}
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: 8 }}>{tx('enq_phone_note', { phone: normalizePhone(user.phone) || '' })}</div>
            {errors.phone && <div role="alert" style={err}>{tx(errors.phone, { n: ENQUIRY_MAX })}</div>}
            {note && <div role="alert" style={err}>{note}</div>}
            <button type="submit" disabled={busy} style={{ marginTop: 14, width: '100%', padding: '0.8rem', fontSize: '1.05rem', borderRadius: 10, border: 'none', background: 'var(--color-primary, #166534)', color: '#fff', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
                {busy ? tx('enq_sending') : tx('enq_send')}
            </button>
        </form>
    );
};

export default EnquiryBox;
