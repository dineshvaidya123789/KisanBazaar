import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LocationSelector from '../components/LocationSelector';
import SEO from '../components/SEO';
import { useLivestockConfig } from '../livestock/useLivestockConfig';
import { makeT } from '../livestock/texts';
import { OWNER_TYPES, PRICE_TYPES, PURPOSES, SEXES } from '../livestock/config';
import { enabledCategories, validateListing, statusForSellerSubmit } from '../livestock/logic';
import {
    subscribeAccount, ensureAccount, createListing, updateListing, getContactPhone,
} from '../livestock/livestockService';
import { isValidImageFile } from '../utils/imageCompression';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const box = { padding: '0.7rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const label = { display: 'block', fontWeight: 600, margin: '1rem 0 0.3rem' };
const errStyle = { color: '#b91c1c', fontSize: '0.85rem', marginTop: 4 };

const emptyForm = (config, user) => ({
    ownerType: 'individual', businessName: '', sellerName: '', category: enabledCategories(config)[0] || 'goat', breed: '', sex: '',
    ageMonths: '', weightKg: '', milkYieldPerDay: '', lactations: '', pregnancyMonths: '', quantity: '1', priceType: 'per_animal', price: '',
    state: config.defaultState || '', district: config.defaultDistrict || '', tehsil: '', earTagNo: '', healthNote: '', purposeOfSale: '',
    notForSlaughter: false, termsAccepted: false, phone: (user && user.role !== 'Admin' && user.phone) || '',
});

const LivestockSell = () => {
    const { id } = useParams(); // present when editing
    const { user, loading } = useAuth();
    const { language } = useLanguage();
    const tx = useMemo(() => makeT(language), [language]);
    const { config, loaded } = useLivestockConfig();
    const navigate = useNavigate();
    const isAdmin = !!user && user.role === 'Admin';

    const [account, setAccount] = useState(null);
    const [form, setForm] = useState(null);
    const [existing, setExisting] = useState(null);
    const [keepPhotos, setKeepPhotos] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => (user ? subscribeAccount(user.uid, setAccount) : undefined), [user && user.uid]);

    // Load the listing when editing; otherwise start a blank form.
    useEffect(() => {
        if (!loaded || !user) return;
        if (!id) { setForm((f) => f || emptyForm(config, user)); return; }
        (async () => {
            const snap = await getDoc(doc(db, 'livestockListings', id));
            if (!snap.exists()) { setMessage(tx('err_generic')); return; }
            const l = { id, ...snap.data() };
            const phone = await getContactPhone(id).catch(() => '');
            setExisting(l);
            setKeepPhotos(l.photos || []);
            setForm({
                ...emptyForm(config, user), ...Object.fromEntries(Object.entries(l).map(([k, v]) => [k, v == null ? '' : v])),
                phone, notForSlaughter: !!l.notForSlaughter, termsAccepted: true,
            });
        })();
    }, [loaded, user && user.uid, id]);

    if (loading || !loaded) return <div style={{ padding: 20, textAlign: 'center' }}>...</div>;
    if (!user) return (
        <div style={{ padding: 30, textAlign: 'center' }}>
            <p>{tx('login_needed')}</p>
            <Link to="/login" state={{ from: { pathname: id ? `/livestock/edit/${id}` : '/livestock/sell' } }}>Login</Link>
        </div>
    );
    if (!config.enabled && !isAdmin) return <div style={{ padding: 30, textAlign: 'center' }}><h2>{tx('soon')}</h2></div>;
    if (!form) return <div style={{ padding: 20, textAlign: 'center' }}>...</div>;

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const cats = enabledCategories(config);
    const breeds = config.breeds[form.category] || [];
    const isGoat = form.category === 'goat';
    const photoCount = keepPhotos.length + newFiles.length;

    const onPickPhotos = (e) => {
        const picked = Array.from(e.target.files || []).filter(isValidImageFile);
        const room = config.maxPhotos - photoCount;
        setNewFiles((cur) => [...cur, ...picked.slice(0, Math.max(0, room))]);
        e.target.value = '';
    };

    const submit = async (e) => {
        e.preventDefault();
        const errs = validateListing(form, config);
        setErrors(errs);
        if (Object.keys(errs).length) { window.scrollTo(0, 0); return; }
        setBusy(true); setMessage('');
        try {
            const byAdmin = isAdmin && !existing;
            if (!isAdmin) await ensureAccount(user.uid, account, { businessName: form.businessName.trim(), ownerType: form.ownerType });
            const status = byAdmin ? 'approved' : statusForSellerSubmit(account, config);
            if (existing) {
                await updateListing({ id, existing, form, newFiles, keepPhotos, uid: user.uid, config, status: isAdmin ? existing.status : status });
            } else {
                await createListing({ form, files: newFiles, uid: user.uid, config, status, byAdmin });
            }
            setMessage(status === 'approved' ? tx('done_live') : tx('done_pending'));
            setTimeout(() => navigate('/livestock/my'), 1200);
        } catch (err) {
            console.error('livestock save failed', err);
            setMessage(tx('err_generic') + (err && err.code ? ` (${err.code})` : ''));
        }
        setBusy(false);
    };

    const choice = (k, options, textOf) => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {options.map((o) => (
                <button type="button" key={o} onClick={() => set(k, o)} style={{
                    padding: '0.6rem 1rem', borderRadius: 20, cursor: 'pointer', fontSize: '1rem',
                    border: form[k] === o ? '2px solid var(--color-primary, #166534)' : '1px solid #ccc',
                    background: form[k] === o ? '#dcfce7' : '#fff',
                }}>{textOf(o)}</button>
            ))}
        </div>
    );

    return (
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '1rem' }}>
            <SEO title={tx('sell_title')} />
            <h2>{existing ? tx('edit_title') : tx('sell_title')}</h2>
            <p><Link to="/livestock/my">{tx('my_title')}</Link></p>
            {message && <div style={{ padding: '0.8rem', background: '#ecfccb', borderRadius: 8, margin: '0.5rem 0' }}>{message}</div>}

            <form onSubmit={submit} noValidate>
                {isAdmin && !existing && (
                    <>
                        <label style={label}>{tx('farmer_name')}</label>
                        <input style={box} value={form.sellerName} onChange={(e) => set('sellerName', e.target.value)} />
                    </>
                )}

                <label style={label}>{tx('who')}</label>
                {choice('ownerType', OWNER_TYPES, (o) => tx(o))}
                {errors.ownerType && <div style={errStyle}>{errors.ownerType}</div>}

                {form.ownerType !== 'individual' && (
                    <>
                        <label style={label}>{tx('business_name')}</label>
                        <input style={box} value={form.businessName} maxLength={120} onChange={(e) => set('businessName', e.target.value)} />
                    </>
                )}

                <label style={label}>{tx('animal')}</label>
                {choice('category', cats, (o) => o.charAt(0).toUpperCase() + o.slice(1))}
                {errors.category && <div style={errStyle}>{errors.category}</div>}

                <label style={label}>{tx('breed')}</label>
                <select style={box} value={form.breed} onChange={(e) => set('breed', e.target.value)}>
                    <option value="">{tx('choose')}</option>
                    {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.breed && <div style={errStyle}>{errors.breed}</div>}

                <label style={label}>{tx('sex')}</label>
                {choice('sex', SEXES, (o) => tx(o))}
                {errors.sex && <div style={errStyle}>{errors.sex}</div>}

                <label style={label}>{tx('age')}</label>
                <input style={box} type="number" inputMode="numeric" min="0" max="300" value={form.ageMonths} onChange={(e) => set('ageMonths', e.target.value)} />
                {errors.ageMonths && <div style={errStyle}>{errors.ageMonths}</div>}

                {isGoat ? (
                    <>
                        <label style={label}>{tx('weight')}</label>
                        <input style={box} type="number" inputMode="decimal" value={form.weightKg} onChange={(e) => set('weightKg', e.target.value)} />
                        {errors.weightKg && <div style={errStyle}>{errors.weightKg}</div>}
                    </>
                ) : (
                    <>
                        <label style={label}>{tx('milk')}</label>
                        <input style={box} type="number" inputMode="decimal" value={form.milkYieldPerDay} onChange={(e) => set('milkYieldPerDay', e.target.value)} />
                        <label style={label}>{tx('lactations')}</label>
                        <input style={box} type="number" inputMode="numeric" value={form.lactations} onChange={(e) => set('lactations', e.target.value)} />
                        <label style={label}>{tx('pregnancy')}</label>
                        <input style={box} type="number" inputMode="numeric" value={form.pregnancyMonths} onChange={(e) => set('pregnancyMonths', e.target.value)} />
                    </>
                )}

                <label style={label}>{tx('quantity')}</label>
                <input style={box} type="number" inputMode="numeric" min="1" max="1000" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
                {errors.quantity && <div style={errStyle}>{errors.quantity}</div>}

                <label style={label}>{tx('price')}</label>
                <input style={box} type="number" inputMode="numeric" min="1" value={form.price} onChange={(e) => set('price', e.target.value)} />
                {errors.price && <div style={errStyle}>{errors.price}</div>}
                <label style={label}>{tx('price_type')}</label>
                {choice('priceType', PRICE_TYPES, (o) => tx(o))}

                <label style={label}>{tx('purpose')}</label>
                {choice('purposeOfSale', PURPOSES, (o) => tx(o))}
                {errors.purposeOfSale && <div style={errStyle}>{errors.purposeOfSale}</div>}

                <label style={label}>{tx('location')}</label>
                <LocationSelector
                    selectedState={form.state} selectedDistrict={form.district} selectedTehsil={form.tehsil} vertical
                    onLocationChange={(loc) => setForm((f) => ({ ...f, state: loc.state, district: loc.district, tehsil: loc.tehsil }))}
                />
                {errors.location && <div style={errStyle}>{errors.location}</div>}

                <label style={label}>{tx('eartag')}</label>
                <input style={box} maxLength={20} value={form.earTagNo} onChange={(e) => set('earTagNo', e.target.value)} />

                <label style={label}>{tx('health')}</label>
                <textarea style={{ ...box, minHeight: 70 }} maxLength={500} value={form.healthNote} onChange={(e) => set('healthNote', e.target.value)} />

                <label style={label}>{tx('photos')}</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {keepPhotos.map((u) => (
                        <div key={u} style={{ position: 'relative' }}>
                            <img src={u} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                            <button type="button" aria-label="remove" onClick={() => setKeepPhotos((c) => c.filter((x) => x !== u))} style={{ position: 'absolute', top: -6, right: -6 }}>×</button>
                        </div>
                    ))}
                    {newFiles.map((f, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                            <img src={URL.createObjectURL(f)} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                            <button type="button" aria-label="remove" onClick={() => setNewFiles((c) => c.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6 }}>×</button>
                        </div>
                    ))}
                </div>
                {photoCount < config.maxPhotos && (
                    <input type="file" accept="image/*" multiple onChange={onPickPhotos} />
                )}
                <div style={{ fontSize: '0.85rem', color: '#555' }}>{tx('photo_hint', { n: config.maxPhotos })}</div>

                <label style={label}>{tx('phone')}</label>
                <input style={box} type="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                <div style={{ fontSize: '0.85rem', color: '#555' }}>{tx('phone_hint')}</div>
                {errors.phone && <div style={errStyle}>{errors.phone}</div>}

                {!isGoat && (
                    <label style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'flex-start' }}>
                        <input type="checkbox" checked={form.notForSlaughter} onChange={(e) => set('notForSlaughter', e.target.checked)} />
                        <span>{tx('not_slaughter')}</span>
                    </label>
                )}
                {errors.notForSlaughter && <div style={errStyle}>{errors.notForSlaughter}</div>}

                <label style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={form.termsAccepted} onChange={(e) => set('termsAccepted', e.target.checked)} />
                    <span>{tx('terms')}</span>
                </label>
                {errors.termsAccepted && <div style={errStyle}>{errors.termsAccepted}</div>}

                <button type="submit" disabled={busy} style={{
                    marginTop: 24, width: '100%', padding: '0.9rem', fontSize: '1.05rem', borderRadius: 10, border: 'none',
                    background: 'var(--color-primary, #166534)', color: '#fff', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1,
                }}>
                    {busy ? tx('saving') : existing ? tx('save') : isAdmin ? tx('submit_admin') : tx('submit')}
                </button>
                <button type="button" onClick={() => navigate('/livestock/my')} style={{ marginTop: 10, width: '100%', padding: '0.7rem', borderRadius: 10, border: '1px solid #ccc', background: '#fff' }}>
                    {tx('cancel')}
                </button>
            </form>
        </div>
    );
};

export default LivestockSell;
