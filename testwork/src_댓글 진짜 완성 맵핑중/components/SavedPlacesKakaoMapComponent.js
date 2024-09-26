import React, { useEffect, useState, useRef } from "react";

const SavedPlacesKakaoMapComponent = ({ savedPlaces }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    // 1. 부모 컴포넌트에서 전달된 savedPlaces 초기 상태 확인
    useEffect(() => {
        console.log("초기 savedPlaces:", savedPlaces); // 빈 상태로 전달되는지 확인
    }, [savedPlaces]); // savedPlaces가 변경될 때마다 로그 출력

    useEffect(() => {
        const initializeMap = () => {
            if (!window.kakao || !window.kakao.maps) {
                console.error("Kakao Maps API is not loaded.");
                return;
            }

            // 맵 생성
            const map = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(30, 30),
                level: 3,
            });
            setMap(map);
        };

        const kakaoMapApi = process.env.REACT_APP_KAKAO_MAP_API_KEY;
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApi}&autoload=false&libraries=services`;
        script.async = false;
        script.onload = () => {
            window.kakao.maps.load(initializeMap);
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (map && savedPlaces.length > 0) {
            // 기존 마커 제거
            markers.forEach((marker) => marker.setMap(null));
            setMarkers([]);

            const newMarkers = [];

            savedPlaces.forEach((place) => {
                const markerPosition = new window.kakao.maps.LatLng(30, 30)
                // (place.position.La, place.position.Ma);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    map: map,
                });

                // 마커 클릭 시 인포윈도우 표시
                const infoWindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;">${place.place_name}</div>`,
                });
                window.kakao.maps.event.addListener(marker, "click", () => {
                    infoWindow.open(map, marker);
                });

                newMarkers.push(marker);
            });

            setMarkers(newMarkers);
        }
    }, [map, savedPlaces]);

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

export default SavedPlacesKakaoMapComponent;
