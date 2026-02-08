import React, { useState, useEffect } from 'react';
import { getStates, getDistricts, getTehsils, getDistrictData } from '../data/locationData';
import { useLanguage } from '../context/LanguageContext';

const LocationSelector = ({
    selectedState,
    selectedDistrict,
    selectedTehsil,
    onLocationChange,
    showTehsil = true,
    vertical = false,
    stateRef = null // New prop
}) => {
    const { t } = useLanguage();
    // Local state for dropdown options
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [tehsils, setTehsils] = useState([]);

    // ... (Hooks remain unchanged) ...

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

    // ... (Other handlers remain unchanged) ...
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
                ref={stateRef} // Attach ref here
                name="state"
                value={selectedState}
                onChange={handleStateChange}
                style={selectStyle}
            >
                <option value="">{t('select_state_ph') || '-- State --'}</option>
                {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                ))}
            </select>

            {/* District Selector */}
            <select
                name="district"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                style={selectStyle}
                disabled={!selectedState}
            >
                <option value="">{t('select_district_ph') || '-- District --'}</option>
                {districts.map(district => {
                    // Get label if available
                    const label = (getDistrictData(selectedState, district) || {}).label || district;
                    return <option key={district} value={district}>{label}</option>
                })}
            </select>

            {/* Tehsil Selector */}
            {showTehsil && (
                <select
                    name="tehsil"
                    value={selectedTehsil}
                    onChange={handleTehsilChange}
                    style={selectStyle}
                    disabled={!selectedDistrict}
                >
                    <option value="">{t('select_tehsil_ph') || '-- Tehsil --'}</option>
                    {tehsils.map(tehsil => (
                        <option key={tehsil} value={tehsil}>{tehsil}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default LocationSelector;
