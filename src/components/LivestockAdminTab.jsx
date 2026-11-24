import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLivestockConfig } from '../livestock/useLivestockConfig';
import { displayState, newReportCount } from '../livestock/logic';
import {
    subscribeReports, setReportStatus, deleteReport,
    subscribeAllListings, subscribeAccounts, approveListing, rejectListing, deleteListing, getContactPhone, saveConfig, setAccountFlag,
} from '../livestock/livestockService';

const cell = { padding: '0.6rem', verticalAlign: 'top', borderBottom: '1px solid #e2e8f0' };
const nice = (s) => String(s == null ? '' : s).replace(/_/g, ' '); // per_animal -> per animal
const field = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.9rem' };
const wide = { width: '100%', boxSizing: 'border-box', padding: '0.4rem' };

const LivestockAdminTab = () => {
    const { user } = useAuth();
    const { config, loaded } = useLivestockConfig();
    const [items, setItems] = useState([]);
    const [accounts, setAccounts] = useState({});
    const [filter, setFilter] = useState('pending');
    const [phones, setPhones] = useState({});
    const [msg, setMsg] = useState('');
    const [draft, setDraft] = useState(null);

    const [reports, setReports] = useState([]);
    useEffect(() => {
        const a = subscribeAllListings(setItems);
        const b = subscribeAccounts(setAccounts);
        const c = subscribeReports(setReports);
        return () => { a(); b(); c(); };
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
                    {/* One field per row on a phone, several per row on a wide screen */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 12 }}>
                        <label style={field}>Listing valid (days) <input type="number" style={wide} value={draft.expiryDays} onChange={(e) => setDraft({ ...draft, expiryDays: e.target.value })} /></label>
                        <label style={field}>Max photos <input type="number" style={wide} value={draft.maxPhotos} onChange={(e) => setDraft({ ...draft, maxPhotos: e.target.value })} /></label>
                        <label style={field}>Phone numbers a buyer can open per day <input type="number" style={wide} value={draft.revealLimitPerDay} onChange={(e) => setDraft({ ...draft, revealLimitPerDay: e.target.value })} /></label>
                        <label style={field}>Default state <input style={wide} value={draft.defaultState} onChange={(e) => setDraft({ ...draft, defaultState: e.target.value })} /></label>
                        <label style={field}>Default district <input style={wide} value={draft.defaultDistrict} onChange={(e) => setDraft({ ...draft, defaultDistrict: e.target.value })} /></label>
                    </div>
                    <button onClick={saveSettings} style={{ marginTop: 12, padding: '0.6rem 1.4rem' }}>Save settings</button>
                </div>
            )}

            <div style={{ border: '1px solid #fecaca', borderRadius: 8, padding: '0.8rem 1rem', marginBottom: '1rem', background: reports.length ? '#fff7f7' : '#f8fafc' }}>
                <strong>Reports</strong> <span style={{ color: '#64748b' }}>({newReportCount(reports)} new, {reports.length} in all)</span>
                {reports.length === 0 && <div style={{ color: '#94a3b8', marginTop: 6 }}>No reports.</div>}
                {reports.map((r) => {
                    const target = items.find((l) => l.id === r.listingId);
                    const tst = target ? displayState(target, now) : 'deleted';
                    return (
                        <div key={r.id} style={{ borderTop: '1px solid #fee2e2', marginTop: 8, paddingTop: 8, opacity: r.status === 'reviewed' ? 0.6 : 1 }}>
                            <b>{r.listingTitle}</b> <small>({tst})</small> - <b>{nice(r.reason)}</b> <small>{new Date(r.createdAt).toLocaleDateString()}{r.status === 'reviewed' ? ' - reviewed' : ''}</small>
                            {r.note && <div style={{ whiteSpace: 'pre-wrap', margin: '4px 0' }}>{r.note}</div>}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                                {target && <Link to={`/livestock/${r.listingId}`}>Open listing</Link>}
                                {r.status !== 'reviewed' && <button onClick={() => run(() => setReportStatus(r.id, 'reviewed'), 'Marked reviewed.')}>Dismiss</button>}
                                {target && (tst === 'pending' || tst === 'approved') && <button onClick={() => { const why = window.prompt('Reason for rejecting (the seller will see this):'); if (why && why.trim()) run(async () => { await rejectListing(target, user.uid, why.trim()); await setReportStatus(r.id, 'reviewed'); }, 'Listing rejected.'); }}>Reject listing</button>}
                                <button style={{ color: '#b91c1c' }} onClick={() => { if (window.confirm('Delete this report?')) run(() => deleteReport(r.id), 'Report deleted.'); }}>Delete report</button>
                            </div>
                        </div>
                    );
                })}
            </div>

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
                                        <b>{l.quantity} × {l.breed} {l.category}</b><br />{l.sex}, {l.ageMonths} mo, {nice(l.purposeOfSale)}
                                        {l.notForSlaughter && <><br /><small>not for slaughter ✔</small></>}
                                        {l.healthNote && <><br /><small>{l.healthNote}</small></>}
                                    </td>
                                    <td style={cell}>Rs {l.price}<br /><small>{nice(l.priceType)}</small></td>
                                    <td style={cell}>{l.district}, {l.state}</td>
                                    <td style={cell}>
                                        {l.sellerName || acct.businessName || nice(l.ownerType)}<br />
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
