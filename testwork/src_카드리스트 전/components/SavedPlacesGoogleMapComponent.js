import React, { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const SavedPlacesGoogleMapComponent = ({ savedPlaces, centerLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        // 기본 좌표: 서울
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
        <div style="margin-bottom: 8px;">${place.road_address_name || ''}</div>
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
        if (place.Ma !== undefined && place.La !== undefined) {
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
        }
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

  useEffect(() => {
    // console.log(savedPlaces)
    // console.log(centerLocation)

    
    //map이 초기화되지 않았을 때는 바로 반환
    if (!map) return;
    // centerLocation이 업데이트될 때마다 지도 중심을 해당 위치로 이동
    if (map && centerLocation) {
      const { Ma, La } = centerLocation;
      const newCenter = new window.google.maps.LatLng(Ma, La);
    //   console.log('New center location:', newCenter)
      map.panTo(newCenter);
    }
  }, [map, centerLocation]);

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
