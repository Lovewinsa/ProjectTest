import React, { useState } from 'react';
import MapComponent from './MapComponent';

function MapComponentBox() {
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [map, setMap] = useState(null);

    const handleSavePlace = (place) => {
        setSavedPlaces([...savedPlaces, place]);
    };

    const handleMapLoad = (mapInstance) => {
        setMap(mapInstance);
    };
    return (
        <div>
            <MapComponent onSave={handleSavePlace} onLoad={handleMapLoad} />
        </div>
    );
}

export default MapComponentBox;