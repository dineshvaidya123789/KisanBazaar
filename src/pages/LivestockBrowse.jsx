import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LocationSelector from '../components/LocationSelector';
import SEO from '../components/SEO';
import { useLivestockConfig } from '../livestock/useLivestockConfig';
import { makeT } from '../livestock/texts';
import {
    EMPTY_FILTERS, enabledCategories, serverFilters, serverFilterKey, applyPageFilters, hasPageFilters,
    ageText, formatRupees, listingTitle,
} from '../livestock/logic';
import { fetchBrowsePage } from '../livestock/livestockService';

const box = { padding: '0.6rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box', width: '100%' };
const lab = { display: 'block', fontWeight: 600, margin: '0.8rem 0 0.25rem' };

const LivestockBrowse = () => {
    const { user, loading } = useAuth();
    const { language } = useLanguage();
    const tx = useMemo(() => makeT(language), [language]);
    const { config, loaded } = useLivestockConfig();
    const isAdmin = !!user && user.role === 'Admin';

    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [items, setItems] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [done, setDone] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const ticket = useRef(0); // a slow answer for old filters must never overwrite the answer for the current ones

    const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
    const key = serverFilterKey(filters);
    const visible = !loading && loaded && (config.enabled || isAdmin);

    const load = async (first) => {
        const mine = ++ticket.current;
        setBusy(true); setError('');
        try {
            const r = await fetchBrowsePage({ filters: serverFilters(filters), cursor: first ? null : cursor });
            if (mine !== ticket.current) return;
            setItems((cur) => (first ? r.items : [...cur, ...r.items]));
            setCursor(r.cursor); setDone(r.done);
        } catch (e) {
            if (mine !== ticket.current) return;
            console.error('livestock browse', e);
            setError(tx('load_failed') + (e && e.code ? ` (${e.code})` : ''));
        }
        if (mine === ticket.current) setBusy(false);
    };

    useEffect(() => {
        if (!visible) return;
        setItems([]); setCursor(null); setDone(false);
        load(true);
    }, [visible, key]);

    if (loading || !loaded) return <div style={{ padding: 20, textAlign: 'center' }}>...</div>;
    if (!config.enabled && !isAdmin) return <div style={{ padding: 30, textAlign: 'center' }}><h2>{tx('soon')}</h2></div>;

    const cats = enabledCategories(config);
    const breeds = filters.category
        ? (config.breeds[filters.category] || [])
        : [...new Set(cats.flatMap((c) => config.breeds[c] || []))];
    const shown = applyPageFilters(items, filters);
    const activeCount = Object.keys(EMPTY_FILTERS).filter((k) => filters[k] !== '' && !(k === 'district' && !filters.state)).length;
    const anyFilter = activeCount > 0;

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
            <SEO title={tx('browse_title')} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>{tx('browse_title')}</h2>
                <Link to="/livestock/sell">{tx('sell_cta')}</Link>
            </div>

            {/* Folded by default so a phone shows animals first; the summary says how many filters are on. */}
            <details style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 1rem 1rem', marginTop: 12 }}>
                <summary style={{ fontWeight: 700, cursor: 'pointer' }}>{tx('filters_title')}{activeCount > 0 ? ` (${activeCount})` : ''}</summary>
                <label style={lab}>{tx('f_animal')}</label>
                <select style={box} value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, breed: '' }))}>
                    <option value="">{tx('f_all')}</option>
                    {cats.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>

                <label style={lab}>{tx('f_breed')}</label>
                <select style={box} value={filters.breed} onChange={(e) => set('breed', e.target.value)}>
                    <option value="">{tx('f_all')}</option>
                    {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>

                <label style={lab}>{tx('f_where')}</label>
                <LocationSelector
                    selectedState={filters.state} selectedDistrict={filters.district} showTehsil={false} vertical
                    onLocationChange={(loc) => setFilters((f) => ({ ...f, state: loc.state, district: loc.district }))}
                />

                <label style={lab}>{tx('f_price')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input style={box} type="number" inputMode="numeric" min="0" placeholder={tx('f_min')} value={filters.minPrice} onChange={(e) => set('minPrice', e.target.value)} />
                    <input style={box} type="number" inputMode="numeric" min="0" placeholder={tx('f_max')} value={filters.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{tx('f_price_hint')}</div>

                <label style={lab}>{tx('f_age')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input style={box} type="number" inputMode="numeric" min="0" placeholder={tx('f_min')} value={filters.minAge} onChange={(e) => set('minAge', e.target.value)} />
                    <input style={box} type="number" inputMode="numeric" min="0" placeholder={tx('f_max')} value={filters.maxAge} onChange={(e) => set('maxAge', e.target.value)} />
                </div>

                {anyFilter && <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} style={{ marginTop: 12, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>{tx('f_reset')}</button>}
            </details>

            {error && <div role="alert" style={{ color: '#b91c1c', margin: '0.8rem 0' }}>{error}</div>}

            <div style={{ marginTop: 14 }}>
                {shown.map((l) => (
                    <Link key={l.id} to={`/livestock/${l.id}`} style={{ display: 'flex', gap: 12, border: '1px solid #e5e7eb', borderRadius: 12, padding: '0.8rem', marginTop: 12, background: '#fff', color: 'inherit', textDecoration: 'none' }}>
                        {l.photos && l.photos[0]
                            ? <img src={l.photos[0]} alt="" loading="lazy" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, flex: 'none' }} />
                            : <div style={{ width: 96, height: 96, background: '#f3f4f6', borderRadius: 8, flex: 'none' }} />}
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700 }}>{listingTitle(l)}</div>
                            <div style={{ color: '#166534', fontWeight: 700 }}>{formatRupees(l.price)} <span style={{ fontWeight: 400, color: '#475569', fontSize: '0.85rem' }}>/ {tx(l.priceType)}</span></div>
                            <div style={{ color: '#475569', fontSize: '0.9rem' }}>{l.district}, {l.state}</div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{tx(l.sex)} · {ageText(l.ageMonths)}{l.weightKg ? ` · ${l.weightKg} kg` : ''}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {!busy && !error && items.length === 0 && done && <p style={{ marginTop: 24, textAlign: 'center' }}>{tx('no_results')}</p>}
            {!busy && !error && items.length > 0 && shown.length === 0 && hasPageFilters(filters) && <p style={{ marginTop: 20, textAlign: 'center', color: '#475569' }}>{tx('no_match_page')}</p>}
            {busy && <p style={{ textAlign: 'center', marginTop: 16 }}>...</p>}
            {!busy && !done && !error && items.length > 0 && (
                <button type="button" onClick={() => load(false)} style={{ display: 'block', margin: '18px auto', padding: '0.7rem 2rem', borderRadius: 10, border: '1px solid #166534', background: '#fff', color: '#166534', cursor: 'pointer' }}>{tx('load_more')}</button>
            )}
        </div>
    );
};

export default LivestockBrowse;
