import React, { useEffect, useState, useRef } from "react";

const SavedPlacesMapComponent = ({ savedPlaces, centerLocation  }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps API is not loaded.")
        return
      }

      // 기본 좌표를 서울로 설정 (savedPlaces에 데이터가 없을 경우를 대비)
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 6,
      })
      setMap(map)
    }

    const kakaoMapApi = process.env.REACT_APP_KAKAO_MAP_API_KEY
    const script = document.createElement("script")
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApi}&autoload=false&libraries=services`
    script.async = false;
    script.onload = () => {
      window.kakao.maps.load(initializeMap)
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (map && savedPlaces.length > 0) {
      // 첫 번째 마커의 위치로 지도 중심을 설정
      const firstPlace = savedPlaces[0];
      if (firstPlace.position && firstPlace.position.Ma !== undefined && firstPlace.position.La !== undefined) {
        const firstMarkerPosition = new window.kakao.maps.LatLng(firstPlace.position.Ma, firstPlace.position.La);
        map.setCenter(firstMarkerPosition);  // 첫 번째 마커 위치로 중심 이동
      }
      
      // 기존 마커 제거
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])

      const newMarkers = []

      // savedPlaces 배열 검증 및 처리
      savedPlaces.forEach((item) => {
        if (item.position && item.position.Ma !== undefined && item.position.La !== undefined) {
          const markerPosition = new window.kakao.maps.LatLng(item.position.Ma, item.position.La);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map,
          });

          // 마커 클릭 시 인포윈도우 표시
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${item.place_name || "Unknown Place"}</div>`,
          });
          window.kakao.maps.event.addListener(marker, "click", () => {
            infoWindow.open(map, marker)
          });

          newMarkers.push(marker)
        } else {
          console.warn(`Invalid position for place: ${item.place_name}`);
        }
      })
    }
  }, [map, savedPlaces])

  useEffect(() => {
    // centerLocation이 업데이트될 때마다 지도 중심 이동
    if (map && centerLocation) {
      const { Ma, La } = centerLocation;
      const newCenter = new window.kakao.maps.LatLng(Ma, La);
      map.setCenter(newCenter);
    }
  }, [map, centerLocation]);

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={mapRef}
        className="flex-grow"
        style={{ width: "100%", height: "60vh" }}>
      </div>
    </div>
  );
};

export default SavedPlacesMapComponent