import React, { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const SavedPlacesGoogleMapComponent = ({ savedPlaces }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [infoWindows, setInfoWindows] = useState([]);

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
            version: "weekly",
            libraries: ["places"]
        });

        loader.load().then(() => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 37.5665, lng: 126.978 },
                zoom: 14,
            });
            setMap(map);
        });
    }, []);

    const clearMarkers = () => {
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);
    };

    const createInfoWindowContent = (place) => {
        return `
      <div style="padding:10px;font-size:12px;display:flex;flex-direction:column;align-items:flex-start;width:150px;">
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%;">
          <strong>${place.place_name}</strong>
        </div>
        <div style="margin-bottom: 8px;">${place.road_address_name}</div>
        <a href="${place.place_url}" target="_blank" style="color:blue;text-decoration:underline;">상세보기</a>
      </div>
    `;
    };

    const displaySavedPlaces = () => {
        if (map && savedPlaces.length > 0) {
            clearMarkers();

            const newMarkers = [];
            const newInfoWindows = [];

            savedPlaces.forEach((place) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: place.Ma, lng: place.La },
                    map: map,
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: createInfoWindowContent(place),
                });

                marker.addListener("click", () => {
                    window.closeInfoWindows();
                    infoWindow.open(map, marker);
                });

                newMarkers.push(marker);
                newInfoWindows.push(infoWindow);
            });

            setMarkers(newMarkers);
            setInfoWindows(newInfoWindows);
        }
    };

    useEffect(() => {
        window.closeInfoWindows = () => {
            infoWindows.forEach((infoWindow) => infoWindow.close());
        };

        if (map) {
            displaySavedPlaces();
        }
    }, [map, savedPlaces]);

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <div
                ref={mapRef}
                className="flex-grow mb-4"
                style={{ width: "100%", height: "50vh" }}>
            </div>
        </div>
    );
};

export default SavedPlacesGoogleMapComponent;
