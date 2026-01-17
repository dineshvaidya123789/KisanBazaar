import React, { useState, useEffect } from 'react';
import { getStates, getDistricts, getTehsils } from '../data/locationData';

const LocationSelector = ({
    selectedState,
    selectedDistrict,
    selectedTehsil,
    onLocationChange,
    showTehsil = true,
    vertical = false
}) => {
    // Local state for dropdown options
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [tehsils, setTehsils] = useState([]);

    // Initialize States
    useEffect(() => {
        setStates(getStates());
    }, []);

    // Update Districts when State changes
    useEffect(() => {
        if (selectedState) {
            setDistricts(getDistricts(selectedState));
        } else {
            setDistricts([]);
        }
    }, [selectedState]);

    // Update Tehsils when District changes
    useEffect(() => {
        if (selectedState && selectedDistrict) {
            setTehsils(getTehsils(selectedState, selectedDistrict));
        } else {
            setTehsils([]);
        }
    }, [selectedState, selectedDistrict]);

    // Handlers
    const handleStateChange = (e) => {
        const newState = e.target.value;
        onLocationChange({
            state: newState,
            district: '', // Reset district
            tehsil: ''    // Reset tehsil
        });
    };

    const handleDistrictChange = (e) => {
        const newDistrict = e.target.value;
        onLocationChange({
            state: selectedState,
            district: newDistrict,
            tehsil: ''    // Reset tehsil
        });
    };

    const handleTehsilChange = (e) => {
        const newTehsil = e.target.value;
        onLocationChange({
            state: selectedState,
            district: selectedDistrict,
            tehsil: newTehsil
        });
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        gap: '1rem',
        width: '100%',
        flexWrap: 'wrap'
    };

    const selectStyle = {
        padding: '0.8rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        flex: 1,
        minWidth: '200px'
    };

    return (
        <div style={containerStyle}>
            {/* State Selector */}
            <select
                value={selectedState}
                onChange={handleStateChange}
                style={selectStyle}
            >
                <option value="">-- State (राज्य) --</option>
                {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                ))}
            </select>

            {/* District Selector */}
            <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                style={selectStyle}
                disabled={!selectedState}
            >
                <option value="">-- District (ज़िला) --</option>
                {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                ))}
            </select>

            {/* Tehsil Selector */}
            {showTehsil && (
                <select
                    value={selectedTehsil}
                    onChange={handleTehsilChange}
                    style={selectStyle}
                    disabled={!selectedDistrict}
                >
                    <option value="">-- Tehsil/Taluka (तहसील/तालुका) --</option>
                    {tehsils.map(tehsil => (
                        <option key={tehsil} value={tehsil}>{tehsil}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default LocationSelector;
