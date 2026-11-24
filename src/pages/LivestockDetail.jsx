import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { useLivestockConfig } from '../livestock/useLivestockConfig';
import { makeT } from '../livestock/texts';
import { ageText, displayState, formatRupees, listingTitle, shareMessage, whatsappShareUrl, detailUrl } from '../livestock/logic';
import { fetchListing } from '../livestock/livestockService';

const row = { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' };

const LivestockDetail = () => {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const { language } = useLanguage();
    const tx = useMemo(() => makeT(language), [language]);
    const { config, loaded } = useLivestockConfig();
    const isAdmin = !!user && user.role === 'Admin';

    const [listing, setListing] = useState(undefined); // undefined = loading, null = not available
    const [photo, setPhoto] = useState(0);
    const [badPhotos, setBadPhotos] = useState({});
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const visible = !loading && loaded && (config.enabled || isAdmin);
    useEffect(() => {
        if (!visible) return undefined;
        let alive = true;
        setListing(undefined); setPhoto(0); setBadPhotos({}); setCopied(false); setError('');
        fetchListing(id).then((l) => { if (alive) setListing(l); }).catch((e) => { console.error('livestock detail', e); if (alive) setError(tx('load_failed')); });
        return () => { alive = false; };
    }, [visible, id]);

    if (loading || !loaded) return <div style={{ padding: 20, textAlign: 'center' }}>...</div>;
    if (!config.enabled && !isAdmin) return <div style={{ padding: 30, textAlign: 'center' }}><h2>{tx('soon')}</h2></div>;
    if (error) return <div style={{ padding: 30, textAlign: 'center', color: '#b91c1c' }}>{error}</div>;
    if (listing === undefined) return <div style={{ padding: 20, textAlign: 'center' }}>...</div>;

    const back = <p style={{ marginTop: 20 }}><Link to="/livestock">{tx('back_list')}</Link></p>;
    if (listing === null) return <div style={{ maxWidth: 560, margin: '0 auto', padding: 30, textAlign: 'center' }}><h3>{tx('unavailable')}</h3>{back}</div>;

    const st = displayState(listing, Date.now());
    const isOwnerView = st !== 'approved'; // only the owner or the admin can ever load a listing that is not public
    const url = detailUrl(window.location.origin, listing.id);
    const text = shareMessage(listing, url);
    const photos = (listing.photos || []).filter((u) => !badPhotos[u]);
    const current = photos[Math.min(photo, Math.max(0, photos.length - 1))];

    const copy = async () => {
        try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); }
        catch { window.prompt(tx('copy_link'), url); }
    };

    return (
        <div style={{ maxWidth: 640, margin: '0.5rem auto', padding: '1rem', paddingBottom: 110, background: '#fff', borderRadius: 12 }}>
            <SEO title={listingTitle(listing)} />
            {back}
            {isOwnerView && <div style={{ background: '#fef3c7', padding: '0.6rem 0.8rem', borderRadius: 8, marginBottom: 10 }}>{tx('view_banner')} <b>{tx('status_' + st)}</b></div>}

            {current
                ? <img src={current} alt="" onError={() => setBadPhotos((m) => ({ ...m, [current]: true }))} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12 }} />
                : <div style={{ width: '100%', height: 200, background: '#f3f4f6', borderRadius: 12 }} />}
            {photos.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {photos.map((u, i) => (
                        <img key={u} src={u} alt="" onClick={() => setPhoto(i)} onError={() => setBadPhotos((m) => ({ ...m, [u]: true }))}
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: u === current ? '2px solid #166534' : '1px solid #ddd' }} />
                    ))}
                </div>
            )}

            <h2 style={{ marginBottom: 4 }}>{listingTitle(listing)}</h2>
            <div style={{ color: '#166534', fontWeight: 700, fontSize: '1.3rem' }}>{formatRupees(listing.price)} <span style={{ fontWeight: 400, color: '#475569', fontSize: '0.95rem' }}>/ {tx(listing.priceType)}</span></div>

            <div style={{ marginTop: 14, paddingRight: 84 }}>
                <div style={row}><span>{tx('location_label')}</span><b>{[listing.tehsil, listing.district, listing.state].filter(Boolean).join(', ')}</b></div>
                <div style={row}><span>{tx('sex_label')}</span><b>{tx(listing.sex)}</b></div>
                <div style={row}><span>{tx('age_label')}</span><b>{ageText(listing.ageMonths)}</b></div>
                <div style={row}><span>{tx('quantity_label')}</span><b>{listing.quantity}</b></div>
                {listing.weightKg ? <div style={row}><span>{tx('weight_label')}</span><b>{listing.weightKg} kg</b></div> : null}
                {listing.milkYieldPerDay ? <div style={row}><span>{tx('milk_label')}</span><b>{listing.milkYieldPerDay}</b></div> : null}
                {listing.lactations ? <div style={row}><span>{tx('lact_label')}</span><b>{listing.lactations}</b></div> : null}
                {listing.pregnancyMonths ? <div style={row}><span>{tx('preg_label')}</span><b>{listing.pregnancyMonths}</b></div> : null}
                <div style={row}><span>{tx('purpose_label')}</span><b>{tx(listing.purposeOfSale)}</b></div>
                {listing.earTagNo ? <div style={row}><span>{tx('eartag_label')}</span><b>{listing.earTagNo}</b></div> : null}
                <div style={row}><span>{tx('sold_by')}</span><b>{listing.businessName || listing.sellerName || tx(listing.ownerType)}</b></div>
            </div>
            {listing.healthNote && <p style={{ marginTop: 12, color: '#334155', whiteSpace: 'pre-wrap' }}>{listing.healthNote}</p>}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                <a href={whatsappShareUrl(text)} target="_blank" rel="noopener noreferrer" style={{ padding: '0.7rem 1.2rem', borderRadius: 10, background: '#16a34a', color: '#fff', textDecoration: 'none' }}>{tx('share_wa')}</a>
                <button type="button" onClick={copy} style={{ padding: '0.7rem 1.2rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>{copied ? tx('link_copied') : tx('copy_link')}</button>
            </div>
            <p style={{ marginTop: 18, color: '#64748b', fontSize: '0.9rem' }}>{tx('contact_soon')}</p>
        </div>
    );
};

export default LivestockDetail;
