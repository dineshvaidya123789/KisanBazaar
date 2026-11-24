import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { validateReport, REPORT_REASONS, REPORT_NOTE_MAX } from './logic';
import { getMyReport, sendReport } from './livestockService';

const box = { padding: '0.7rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const err = { color: '#b91c1c', fontSize: '0.85rem', marginTop: 4 };

// "Report this listing": a small link that opens a short form. One report per person per animal (the record id is listing + person).
const ReportBox = ({ listing, user, tx }) => {
    const [mine, setMine] = useState(undefined); // undefined = loading, null = none yet
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState('');
    const sending = useRef(false);

    const uid = user && user.uid;
    useEffect(() => {
        setMine(undefined); setOpen(false); setMsg('');
        if (!uid || uid === listing.ownerUid) return undefined;
        let alive = true;
        getMyReport(listing.id, uid).then((r) => { if (alive) setMine(r); }).catch(() => { if (alive) setMine(null); });
        return () => { alive = false; };
    }, [uid, listing.id]);

    const wrap = { marginTop: 22, paddingTop: 12, borderTop: '1px solid #e2e8f0', fontSize: '0.9rem' };
    if (!user) return <div style={wrap}><Link to="/login" state={{ from: { pathname: `/livestock/${listing.id}` } }}>{tx('rep_login')}</Link></div>;
    if (user.uid === listing.ownerUid || mine === undefined) return null;
    if (mine) return <div style={{ ...wrap, color: '#475569' }}>{msg || tx('rep_already')}</div>;
    if (!open) return <div style={wrap}><button type="button" onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', padding: 0, color: '#b91c1c', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>{tx('rep_link')}</button></div>;

    const submit = async (e) => {
        e.preventDefault();
        if (sending.current) return;
        const errs = validateReport({ reason, note });
        setErrors(errs);
        if (Object.keys(errs).length) return;
        sending.current = true; setBusy(true); setMsg('');
        try {
            const r = await sendReport({ listing, reporterUid: user.uid, reason, note });
            setMsg(tx('rep_sent')); setMine(r);
        } catch (ex) {
            console.error('report failed', ex);
            // A second report for the same animal is refused by the rules: if one exists, show that instead of an error.
            const existing = await getMyReport(listing.id, user.uid).catch(() => null);
            if (existing) setMine(existing); else setMsg(tx('rep_failed') + (ex && ex.code ? ` (${ex.code})` : ''));
        }
        sending.current = false; setBusy(false);
    };

    return (
        <form onSubmit={submit} noValidate style={{ ...wrap, border: '1px solid #fecaca', borderRadius: 12, padding: '0.8rem 1rem 1rem', background: '#fff7f7' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem' }}>{tx('rep_title')}</h3>
            <fieldset style={{ border: 'none', padding: 0, margin: '0.4rem 0' }}>
                <legend style={{ fontWeight: 600, marginBottom: 4 }}>{tx('rep_reason')}</legend>
                {REPORT_REASONS.map((r) => (
                    <label key={r} style={{ display: 'block', padding: '0.3rem 0' }}>
                        <input type="radio" name="report-reason" value={r} checked={reason === r} onChange={() => setReason(r)} /> {tx('rep_' + r)}
                    </label>
                ))}
            </fieldset>
            {errors.reason && <div role="alert" style={err}>{tx(errors.reason)}</div>}
            <label style={{ display: 'block', fontWeight: 600, margin: '0.6rem 0 0.25rem' }}>{tx('rep_note')}</label>
            <textarea style={{ ...box, minHeight: 60, fontFamily: 'inherit' }} value={note} maxLength={REPORT_NOTE_MAX} onChange={(e) => setNote(e.target.value)} />
            {errors.note && <div role="alert" style={err}>{tx(errors.note)}</div>}
            {msg && <div role="alert" style={err}>{msg}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" disabled={busy} style={{ flex: 1, padding: '0.7rem', fontSize: '1rem', borderRadius: 10, border: 'none', background: '#b91c1c', color: '#fff', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>{busy ? tx('rep_sending') : tx('rep_send')}</button>
                <button type="button" onClick={() => setOpen(false)} disabled={busy} style={{ padding: '0.7rem 1rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>{tx('rep_cancel')}</button>
            </div>
        </form>
    );
};

export default ReportBox;
