import React, { useEffect, useState, useRef } from "react";

const SavedPlacesMapComponent = ({ savedPlaces }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps API is not loaded.")
        return
      }

      // 맵 생성
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
      // 기존 마커 제거
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])

      const newMarkers = []
      savedPlaces.forEach((item) => {
        const markerPosition = new window.kakao.maps.LatLng(item.position.Ma, item.position.La)
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map,
        })
        
        // 마커 클릭 시 인포윈도우 표시
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${item.place_name}</div>`,
        });
        window.kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker)
        });

        newMarkers.push(marker)
      })
  }
  },[map, savedPlaces])


  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={mapRef}
        className="flex-grow"
        style={{ width: "70%", height: "35vh" }}>
      </div>
    </div>
  );
};

export default SavedPlacesMapComponent
