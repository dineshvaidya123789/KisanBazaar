export const serviceCategories = [
    { id: 'All', label: 'All Services (सभी सेवाएं)', icon: '🔍' },
    { id: 'Transport', label: 'Transport (परिवहन)', icon: '🚚' },
    { id: 'Tractor', label: 'Tractor Rental (ट्रैक्टर)', icon: '🚜' },
    { id: 'Harvesting', label: 'Harvesting (कटाई/बुवाई)', icon: '🌾' },
    { id: 'Inputs', label: 'Farm Inputs (खाद/बीज/दवाई)', icon: '🌱' },
];

export const services = [
    {
        id: 1,
        category: 'Transport',
        title: 'Bolero Pickup (1.5 Ton)',
        provider: 'Ramesh Yadav',
        location: 'Indore, MP',
        price: '₹15 / km',
        rating: 4.8,
        verified: true,
        image: 'https://images.unsplash.com/photo-1605218427368-35b0168939b4?auto=format&fit=crop&q=80&w=400',
        phone: '9876543210'
    },
    {
        id: 2,
        category: 'Tractor',
        title: 'John Deere 5310 (55HP)',
        provider: 'Suresh Patidar',
        location: 'Ujjain, MP',
        price: '₹900 / hour (with Rotavator)',
        rating: 4.5,
        verified: true,
        image: 'https://images.unsplash.com/photo-1599587428787-c1d0f5e19749?auto=format&fit=crop&q=80&w=400',
        phone: '9876543211'
    },
    {
        id: 3,
        category: 'Inputs',
        title: 'Organic Vermicompost (Kechua Khad)',
        provider: 'Green Earth Organics',
        location: 'Bhopal, MP',
        price: '₹350 / 50kg bag',
        rating: 4.9,
        verified: true,
        image: 'https://images.unsplash.com/photo-1628062137637-2abd895b6028?auto=format&fit=crop&q=80&w=400',
        phone: '9876543212'
    },
    {
        id: 4,
        category: 'Harvesting',
        title: 'Claas Harvester (Wheat/Soybean)',
        provider: 'Gurmeet Singh',
        location: 'Hoshangabad, MP',
        price: '₹1800 / acre',
        rating: 4.7,
        verified: true,
        image: 'https://plus.unsplash.com/premium_photo-1661962360522-d0216264d852?auto=format&fit=crop&q=80&w=400',
        phone: '9876543213'
    },
    {
        id: 5,
        category: 'Transport',
        title: 'Eicher Pro 2049 (Empty Return)',
        provider: 'MP Logistics',
        location: 'Dewas, MP',
        price: '₹25 / km',
        rating: 4.2,
        verified: false,
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
        phone: '9876543214'
    },
    {
        id: 6,
        category: 'Tractor',
        title: 'Mahindra Jivo (Mini Tractor)',
        provider: 'Lal Singh',
        location: 'Ratlam, MP',
        price: '₹500 / hour (Spraying)',
        rating: 4.6,
        verified: true,
        image: 'https://plus.unsplash.com/premium_photo-1664302152994-3aea9796e952?auto=format&fit=crop&q=80&w=400',
        phone: '9876543215'
    }
];
