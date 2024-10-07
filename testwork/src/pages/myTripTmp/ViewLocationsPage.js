import React, { useEffect, useRef, useState } from "react"

const ViewLocationsPage = ({ savedPlaces }) => {
    const mapRef = useRef(null)
    const [map, setMap] = useState(null)

    useEffect(() => {
        const initializeMap = () => {
            if (!window.kakao || !window.kakao.maps) {
                console.error("Kakao Maps API is not loaded.");
                return;
            }

            const map = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
            });
            setMap(map);
        };

        const kakaoMapApi = process.env.REACT_APP_KAKAO_MAP_API_KEY;
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApi}&libraries=services`;
        script.onload = () => window.kakao.maps.load(initializeMap);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handlePlaceClick = (place) => {
        if (map) {
            map.setCenter(place.position)
            map.setLevel(3)  // 줌 레벨 조정
        }
    }

    return (
        <div>
            <h2>저장된 장소 목록</h2>
            <ul>
                {savedPlaces.map((place, index) => (
                    <li key={index} onClick={() => handlePlaceClick(place)}>
                        {place.name}
                    </li>
                ))}
            </ul>
            <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
        </div>
    )
}

export default ViewLocationsPage
