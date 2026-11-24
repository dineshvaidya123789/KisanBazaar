import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLivestockConfig } from '../livestock/useLivestockConfig';
import { displayState } from '../livestock/logic';
import {
    subscribeAllListings, subscribeAccounts, approveListing, rejectListing, deleteListing, getContactPhone, saveConfig, setAccountFlag,
} from '../livestock/livestockService';

const cell = { padding: '0.6rem', verticalAlign: 'top', borderBottom: '1px solid #e2e8f0' };

const LivestockAdminTab = () => {
    const { user } = useAuth();
    const { config, loaded } = useLivestockConfig();
    const [items, setItems] = useState([]);
    const [accounts, setAccounts] = useState({});
    const [filter, setFilter] = useState('pending');
    const [phones, setPhones] = useState({});
    const [msg, setMsg] = useState('');
    const [draft, setDraft] = useState(null);

    useEffect(() => {
        const a = subscribeAllListings(setItems);
        const b = subscribeAccounts(setAccounts);
        return () => { a(); b(); };
    }, []);
    useEffect(() => { if (loaded) setDraft({ ...config }); }, [loaded]);

    const run = async (fn, ok) => { setMsg(''); try { await fn(); if (ok) setMsg(ok); } catch (e) { console.error(e); setMsg('Failed: ' + (e.code || e.message)); } };
    const now = Date.now();
    const shown = items.filter((l) => filter === 'all' || displayState(l, now) === filter);
    const count = (s) => items.filter((l) => displayState(l, now) === s).length;

    const saveSettings = () => run(() => saveConfig({
        enabled: !!draft.enabled,
        categories: draft.categories,
        autoApproveAfterFirst: !!draft.autoApproveAfterFirst,
        expiryDays: Math.max(1, Math.min(60, Number(draft.expiryDays) || 30)),
        maxPhotos: Math.max(1, Math.min(6, Number(draft.maxPhotos) || 4)),
        revealLimitPerDay: Math.max(1, Math.min(500, Math.round(Number(draft.revealLimitPerDay)) || 20)),
        defaultState: draft.defaultState || '',
        defaultDistrict: draft.defaultDistrict || '',
    }), 'Settings saved.');

    return (
        <div style={{ padding: '1rem' }}>
            {draft && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', marginBottom: '1rem', background: '#f8fafc' }}>
                    <strong>Livestock settings</strong>
                    <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginTop: 10, alignItems: 'center' }}>
                        <label><input type="checkbox" checked={!!draft.enabled} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} /> <b>Module is ON for everyone</b> (off = only you can see it)</label>
                        {Object.keys(draft.categories).map((c) => (
                            <label key={c}><input type="checkbox" checked={!!draft.categories[c]} onChange={(e) => setDraft({ ...draft, categories: { ...draft.categories, [c]: e.target.checked } })} /> {c}</label>
                        ))}
                        <label><input type="checkbox" checked={!!draft.autoApproveAfterFirst} onChange={(e) => setDraft({ ...draft, autoApproveAfterFirst: e.target.checked })} /> Auto-approve a seller after the first approval</label>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 10 }}>
                        <label>Listing valid (days) <input type="number" style={{ width: 70 }} value={draft.expiryDays} onChange={(e) => setDraft({ ...draft, expiryDays: e.target.value })} /></label>
                        <label>Max photos <input type="number" style={{ width: 60 }} value={draft.maxPhotos} onChange={(e) => setDraft({ ...draft, maxPhotos: e.target.value })} /></label>
                        <label>Phone numbers a buyer can open per day <input type="number" style={{ width: 70 }} value={draft.revealLimitPerDay} onChange={(e) => setDraft({ ...draft, revealLimitPerDay: e.target.value })} /></label>
                        <label>Default state <input value={draft.defaultState} onChange={(e) => setDraft({ ...draft, defaultState: e.target.value })} /></label>
                        <label>Default district <input value={draft.defaultDistrict} onChange={(e) => setDraft({ ...draft, defaultDistrict: e.target.value })} /></label>
                        <button onClick={saveSettings}>Save settings</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
                {['pending', 'approved', 'rejected', 'sold', 'expired', 'all'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '4px 12px', borderRadius: 14, border: '1px solid #cbd5e1', background: filter === f ? '#dbeafe' : '#fff', cursor: 'pointer' }}>
                        {f}{f !== 'all' ? ` (${count(f)})` : ` (${items.length})`}
                    </button>
                ))}
                <Link to="/livestock/sell" style={{ marginLeft: 'auto' }}>+ Post for a farmer</Link>
            </div>
            {msg && <div style={{ margin: '6px 0', color: msg.startsWith('Failed') ? '#b91c1c' : '#166534' }}>{msg}</div>}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead style={{ background: '#f8fafc', color: '#64748b' }}>
                        <tr><th style={cell}>Animal</th><th style={cell}>Price</th><th style={cell}>Where</th><th style={cell}>Seller</th><th style={cell}>Status</th><th style={cell}>Actions</th></tr>
                    </thead>
                    <tbody>
                        {shown.length === 0 && <tr><td colSpan="6" style={{ ...cell, textAlign: 'center', color: '#94a3b8' }}>Nothing here.</td></tr>}
                        {shown.map((l) => {
                            const st = displayState(l, now);
                            const acct = accounts[l.ownerUid] || {};
                            return (
                                <tr key={l.id}>
                                    <td style={cell}>
                                        {l.photos && l.photos[0] && <img src={l.photos[0]} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, float: 'left', marginRight: 8 }} />}
                                        <b>{l.quantity} × {l.breed} {l.category}</b><br />{l.sex}, {l.ageMonths} mo, {l.purposeOfSale}
                                        {l.notForSlaughter && <><br /><small>not for slaughter ✔</small></>}
                                        {l.healthNote && <><br /><small>{l.healthNote}</small></>}
                                    </td>
                                    <td style={cell}>Rs {l.price}<br /><small>{l.priceType}</small></td>
                                    <td style={cell}>{l.district}, {l.state}</td>
                                    <td style={cell}>
                                        {l.sellerName || acct.businessName || l.ownerType}<br />
                                        {phones[l.id] ? <b>{phones[l.id]}</b> : <button onClick={() => run(async () => { const p = await getContactPhone(l.id); setPhones((m) => ({ ...m, [l.id]: p || 'n/a' })); })}>Show phone</button>}
                                        {l.postedByAdmin ? <><br /><small>posted by admin</small></> : (
                                            <><br />
                                                <label><input type="checkbox" checked={!!acct.verified} onChange={(e) => run(() => setAccountFlag(l.ownerUid, { verified: e.target.checked }))} /> verified</label><br />
                                                <label><input type="checkbox" checked={!!acct.autoApprove} onChange={(e) => run(() => setAccountFlag(l.ownerUid, { autoApprove: e.target.checked }))} /> auto-approve</label></>
                                        )}
                                    </td>
                                    <td style={cell}>{st}{l.rejectionReason && <><br /><small>{l.rejectionReason}</small></>}</td>
                                    <td style={cell}>
                                        {(st === 'pending' || st === 'rejected') && <button onClick={() => run(() => approveListing(l, user.uid, config), 'Approved.')}>Approve</button>}{' '}
                                        {(st === 'pending' || st === 'approved') && <button onClick={() => { const r = window.prompt('Reason for rejecting (the seller will see this):'); if (r && r.trim()) run(() => rejectListing(l, user.uid, r.trim()), 'Rejected.'); }}>Reject</button>}{' '}
                                        <Link to={`/livestock/edit/${l.id}`}>Edit</Link>{' '}
                                        <button style={{ color: '#b91c1c' }} onClick={() => { if (window.confirm('Delete this listing for good?')) run(() => deleteListing(l), 'Deleted.'); }}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LivestockAdminTab;
