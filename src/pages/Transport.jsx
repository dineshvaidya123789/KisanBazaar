import React, { useState, useMemo } from 'react';
import { services, serviceCategories } from '../data/farmingServices';
import { mpLocations, getDistricts, getTehsils, getDistrictLabel } from '../data/mpData';

const Transport = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [selectedTehsil, setSelectedTehsil] = useState('All');

    // Pagination State
    const [visibleCount, setVisibleCount] = useState(6);

    // SCALABILITY: Enrich mock data with random structured locations for demo
    const [allServices, setAllServices] = useState(() => {
        // Create a larger dataset for demo (multiply original by 2 to avoid too many duplicates)
        let largeList = [];
        const districts = getDistricts();

        for (let i = 0; i < 2; i++) {
            services.forEach(service => {
                // Assign random district/tehsil
                const randomDist = districts[Math.floor(Math.random() * districts.length)];
                const tehsils = getTehsils(randomDist);
                const randomTehsil = tehsils.length > 0 ? tehsils[Math.floor(Math.random() * tehsils.length)] : 'Main City';

                largeList.push({
                    ...service,
                    id: `${service.id}-${i}`,
                    title: `${service.title}`, // Removed index from title for cleaner look
                    district: randomDist,
                    tehsil: randomTehsil,
                    location: `${randomTehsil}, ${randomDist}`
                });
            });
        }
        return largeList;
    });

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showAdForm, setShowAdForm] = useState(false);
    const [adFormData, setAdFormData] = useState({
        title: '',
        category: 'Tractor',
        marketingLine: '',

        district: '',
        tehsil: '',
        phone: '',
        price: '',
        unit: 'Hour',
        duration: '30'
    });

    const [selectedProvider, setSelectedProvider] = useState(null);

    const handleAdSubmit = (e) => {
        e.preventDefault();

        // Create new service object
        const newService = {
            id: `new-${Date.now()}`,
            title: adFormData.title,
            category: adFormData.category,
            district: adFormData.district,
            postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            expiryDate: new Date(Date.now() + parseInt(adFormData.duration) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            duration: adFormData.duration,
            tehsil: adFormData.tehsil || 'Main City',
            location: `${adFormData.tehsil || 'Main City'}, ${adFormData.district}`,
            price: `₹${adFormData.price} / ${adFormData.unit}`,
            phone: adFormData.phone,
            image: serviceCategories.find(c => c.id === adFormData.category)?.image || 'https://images.unsplash.com/photo-1595837021678-5d272996e382', // Fallback or dynamic
            provider: 'You (Farmer)',
            rating: 5.0,
            verified: true
        };

        // Prepend to list
        setAllServices(prev => [newService, ...prev]);

        setShowAdForm(false);
        alert('Ad Posted Successfully! (विज्ञापन सफलतापूर्वक पोस्ट किया गया!)');

        // Reset form
        setAdFormData({
            title: '',
            category: 'Tractor',
            marketingLine: '',
            price: '',
            unit: 'Hour',
            district: '',
            tehsil: '',
            phone: '',
            duration: '30'
        });
    };

    // Filter Logic
    const filteredServices = useMemo(() => {
        return allServices.filter(service => {
            const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
            const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDistrict = selectedDistrict === 'All' || service.district === selectedDistrict;
            const matchesTehsil = selectedTehsil === 'All' || service.tehsil === selectedTehsil;

            return matchesCategory && matchesSearch && matchesDistrict && matchesTehsil;
        });
    }, [selectedCategory, searchTerm, selectedDistrict, selectedTehsil, allServices]);

    const displayedServices = filteredServices.slice(0, visibleCount);
    const currentTehsils = selectedDistrict !== 'All' ? getTehsils(selectedDistrict) : [];

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0' }}>

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <h1>Farming Services Marketplace (कृषि सेवाएँ)</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                    Rent Tractors, Find Harvesters, Buy Inputs & Hire Logistics
                </p>
                <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', padding: '0.8rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)' }}
                    onClick={() => setShowPaymentModal(true)}
                >
                    📢 Post Your Ad (अपनी सेवा जोड़ें)
                </button>
            </div>

            {/* Filters & Search */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Location Filters */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                            📍 District (जिला):
                        </label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setSelectedTehsil('All');
                            }}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="All">All Districts</option>
                            {getDistricts().map(dist => (
                                <option key={dist} value={dist}>{getDistrictLabel(dist)}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                            🏘️ Tehsil (तहसील):
                        </label>
                        <select
                            value={selectedTehsil}
                            onChange={(e) => setSelectedTehsil(e.target.value)}
                            disabled={selectedDistrict === 'All'}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: selectedDistrict === 'All' ? '#eee' : 'white' }}
                        >
                            <option value="All">All Tehsils</option>
                            {currentTehsils.map(tehsil => (
                                <option key={tehsil} value={tehsil}>{tehsil}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search for 'Tractor', 'Harvester'..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
                </div>

                {/* Categories */}
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '5px' }}>
                    {serviceCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '25px',
                                border: '1px solid #eee',
                                backgroundColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'white',
                                color: selectedCategory === cat.id ? 'white' : '#555',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {displayedServices.map(service => (
                    <div key={service.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                        <div style={{ height: '160px', backgroundColor: '#eee', position: 'relative' }}>
                            <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {service.verified && (
                                <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    ✅ Verified
                                </span>
                            )}
                            <span style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                ⭐ {service.rating}
                            </span>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{service.title}</h3>
                                {service.duration && (
                                    <span style={{ fontSize: '0.7rem', color: '#e65100', backgroundColor: '#fff3e0', padding: '2px 6px', borderRadius: '4px' }}>
                                        Exp: {service.expiryDate || '30 days'}
                                    </span>
                                )}
                            </div>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                By: <span
                                    style={{ color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => setSelectedProvider({ name: service.provider, verified: service.verified })}
                                >
                                    {service.provider}
                                </span>
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '2px' }}>
                                Posted: {service.postedDate || '14 Dec'}
                            </p>

                            <div style={{ margin: '1rem 0', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <div style={{ marginBottom: '5px' }}>📍 {service.location}</div>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.1rem' }}>💰 {service.price}</div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                <a href={`tel:${service.phone}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>📞 Call</a>
                                <button className="btn btn-outline" style={{ padding: '0 10px', color: '#d32f2f', borderColor: '#d32f2f' }} onClick={() => alert('Reported for review! (रिपोर्ट भेजी गई)')}>🚩</button>
                                <a href="#" className="btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', backgroundColor: '#25D366', color: 'white', border: 'none' }}>💬 WhatsApp</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredServices.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    <h3>No services found.</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}

            {/* Load More Button */}
            {displayedServices.length < filteredServices.length && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={handleLoadMore} className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>
                        Load More Services (⬇️)
                    </button>
                    <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Showing {displayedServices.length} of {filteredServices.length}
                    </p>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowPaymentModal(false)}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '500px', width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h2>Post Ad for Free (मुफ्त विज्ञापन)</h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            We are currently offering free listings for all farmers and service providers!
                            <br /><br />
                            1. Get unlimited leads.<br />
                            2. Show "Verified" badge.<br />
                            3. Help other farmers.
                        </p>

                        <div style={{ border: '2px solid var(--color-primary)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', backgroundColor: '#e8f5e9' }}>
                            <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Free (मुफ्त)</h3>
                            <span style={{ fontSize: '0.9rem', color: '#555' }}>Limited Time Offer</span>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={() => {
                            setShowPaymentModal(false);
                            setShowAdForm(true);
                        }}>
                            Post Ad Now (अभी पोस्ट करें)
                        </button>
                        <button style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowPaymentModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {/* Ad Form Modal */}
            {showAdForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowAdForm(false)}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '10px', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                            Service Details (सेवा विवरण)
                        </h2>

                        <form onSubmit={handleAdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Service Title */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Service Title (सेवा का नाम) *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: John Tractor Services"
                                    value={adFormData.title}
                                    onChange={e => setAdFormData({ ...adFormData, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Category & District Row */}
                            {/* Category & District Row */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Category (श्रेणी) *</label>
                                    <select
                                        value={adFormData.category}
                                        onChange={e => setAdFormData({ ...adFormData, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option value="Tractor">Tractor (ट्रैक्टर)</option>
                                        <option value="Harvester">Harvester (हार्वेस्टर)</option>
                                        <option value="Drones">Drones (ड्रोन)</option>
                                        <option value="Transport">Transport (परिवहन)</option>
                                        <option value="Farm Inputs">Farm Inputs (खाद/बीज/दवाई)</option>
                                    </select>
                                </div>
                            </div>

                            {/* District & Tehsil Row */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>District (जिला) *</label>
                                    <select
                                        required
                                        value={adFormData.district}
                                        onChange={e => setAdFormData({ ...adFormData, district: e.target.value, tehsil: '' })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option value="">Select District</option>
                                        {getDistricts().map(d => <option key={d} value={d}>{getDistrictLabel(d)}</option>)}
                                    </select>
                                </div>

                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Tehsil (तहसील) *</label>
                                    <select
                                        required
                                        value={adFormData.tehsil}
                                        onChange={e => setAdFormData({ ...adFormData, tehsil: e.target.value })}
                                        disabled={!adFormData.district}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: !adFormData.district ? '#f0f0f0' : 'white' }}
                                    >
                                        <option value="">Select Tehsil</option>
                                        {adFormData.district && getTehsils(adFormData.district).map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Price Row */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 2, minWidth: '150px' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Price (कीमत) *</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Ex: 500"
                                        value={adFormData.price}
                                        onChange={e => setAdFormData({ ...adFormData, price: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: '100px' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Unit (इकाई)</label>
                                    <select
                                        value={adFormData.unit}
                                        onChange={e => setAdFormData({ ...adFormData, unit: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option>Hour</option>
                                        <option>Acre</option>
                                        <option>Day</option>
                                        <option>KM</option>
                                        <option>Bag</option>
                                        <option>Packet</option>
                                    </select>
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Duration of your post (पोस्ट की अवधि) *</label>
                                <select
                                    value={adFormData.duration}
                                    onChange={e => setAdFormData({ ...adFormData, duration: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                >
                                    <option value="7">7 Days (7 दिन)</option>
                                    <option value="15">15 Days (15 दिन)</option>
                                    <option value="30">30 Days (30 दिन)</option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Mobile Number (मोबाइल) *</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span style={{ padding: '0.8rem', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>+91</span>
                                    <input
                                        type="tel"
                                        required
                                        placeholder=""
                                        maxLength="10"
                                        value={adFormData.phone}
                                        onChange={e => setAdFormData({ ...adFormData, phone: e.target.value.replace(/\D/g, '') })}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowAdForm(false)} className="btn btn-outline" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.8rem' }}>
                                    Submit Ad (जमा करें)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Seller Profile Modal */}
            {
                selectedProvider && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedProvider(null)}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <h2 style={{ margin: 0 }}>{selectedProvider.name}</h2>
                                <button onClick={() => setSelectedProvider(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✖️</button>
                            </div>
                            {selectedProvider.verified && <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem' }}>✅ Verified User</span>}

                            <h3 style={{ fontSize: '1.1rem', color: '#666' }}>Active Listings ({allServices.filter(s => s.provider === selectedProvider.name).length})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {allServices.filter(s => s.provider === selectedProvider.name).map(service => (
                                    <div key={service.id} style={{ padding: '10px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <img src={service.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{service.title}</div>
                                            <div style={{ color: 'var(--color-primary)' }}>{service.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Transport;
