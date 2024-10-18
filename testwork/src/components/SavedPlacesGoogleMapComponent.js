import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react"; // 필수 훅들 임포트

const SavedPlacesGoogleMapComponent = forwardRef(({ savedPlaces, centerLocation, onMapReady }, ref) => {
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
        center: { lat: 37.5665, lng: 126.978 },
        zoom: 14,
      });
      setMap(map);
      if (onMapReady) {
        onMapReady(map); // 지도 준비 완료 후 부모에게 알림
      }
    });
  }, [onMapReady]);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const createInfoWindowContent = (place) => {
    return `
      <div style="padding:10px;font-size:12px;display:flex;flex-direction:column;align-items:flex-start;width:100%;max-width:600px;height:auto;">
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%;">
          <strong>${place.place_name}</strong>
        </div>
        <div style="margin-bottom: 8px;">${place.road_address_name}</div>
        <div style="margin-bottom: 16px;"><a href="${place.place_url}" target="_blank">장소 링크</a></div>
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

  // 외부에서 특정 장소의 InfoWindow를 열기 위한 함수
  useImperativeHandle(ref, () => ({
    openInfoWindowAtPlace: (place) => {
      const markerPosition = new window.google.maps.LatLng(place.Ma, place.La);

      // 기존 열린 infoWindow가 있다면 닫기
      infoWindows.forEach((infoWindow) => infoWindow.close());

      // 이미 있는 마커를 찾거나 새 마커를 생성
      let marker = markers.find(
        (m) => m.getPosition().lat() === place.Ma && m.getPosition().lng() === place.La
      );

      if (!marker) {
        // 마커가 없으면 새로 생성
        marker = new window.google.maps.Marker({
          position: markerPosition,
          map: map,
        });
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      }

      // 새로운 infoWindow 생성
      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(place),
      });

      // 마커에 infoWindow 열기
      infoWindow.open(map, marker);

      // 열린 infoWindow를 저장
      setInfoWindows((prevInfoWindows) => [...prevInfoWindows, infoWindow]);
    }
  }));

  useEffect(() => {
    if (map) {
      displaySavedPlaces();
    }
  }, [map, savedPlaces]);

  useEffect(() => {
    if (!map) return;
    if (map && centerLocation) {
      const { Ma, La } = centerLocation;
      const newCenter = new window.google.maps.LatLng(Ma, La);
      map.setCenter(newCenter); // 지도 중심을 바로 설정
    }
  }, [map, centerLocation]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div
        ref={mapRef}
        className="flex-grow mb-4"
        style={{ width: "100%", height: "60vh" }}> {/* 크기를 CourseBoardDetail과 맞춤 */}
      </div>
    </div>
  );
});

export default SavedPlacesGoogleMapComponent;
