import React from 'react';

// The first photo of an animal as a small square. When there is more than one photo, a "4 photos" label sits on its bottom edge,
// so a buyer or seller can tell there is more to see on the animal's own page. `label` is the ready-made text, e.g. "4 photos".
const PhotoThumb = ({ photos, size, radius = 8, label, style, lazy = false }) => {
    const list = (photos || []).filter(Boolean);
    if (!list.length) return null;
    return (
        <div style={{ position: 'relative', width: size, height: size, flex: 'none', ...style }}>
            <img src={list[0]} alt="" loading={lazy ? 'lazy' : undefined} style={{ width: size, height: size, objectFit: 'cover', borderRadius: radius, display: 'block' }} />
            {list.length > 1 && label && (
                <span style={{ position: 'absolute', left: 4, right: 4, bottom: 4, textAlign: 'center', background: 'rgba(15,23,42,0.75)', color: '#fff', fontSize: '0.7rem', lineHeight: 1.5, borderRadius: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
            )}
        </div>
    );
};

export default PhotoThumb;
