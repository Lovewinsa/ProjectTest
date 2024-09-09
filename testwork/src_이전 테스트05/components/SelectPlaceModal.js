import React, { useEffect, useState, useRef } from "react";

const SelectPlaceModal = ({ onSave, selectedDayIndex, selectedPlaceIndex, isSelectPlace, show, yes, no }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [places, setPlaces] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [infoWindows, setInfoWindows] = useState([]);

    useEffect(() => {
        const initializeMap = () => {
            if (!window.kakao || !window.kakao.maps) {
                console.error("Kakao Maps API is not loaded.");
                return;
            }

            if (!mapRef.current) {
                console.error("Map reference is not available.");
                return;
            }

            const map = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
            });
            setMap(map);

            window.kakao.maps.event.addListener(map, "click", () => {
                window.closeInfoWindow();
                setSelectedPlace(null);
            });
        };

        if (!window.kakao || !window.kakao.maps) {
            const script = document.createElement("script");
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=de8bb4ac88880a204a617a3e3f74d387&libraries=services`;
            script.onload = initializeMap;
            document.head.appendChild(script);
        } else {
            initializeMap();
        }
    }, [mapRef]);

    const clearMarkers = () => {
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);
    };

    const clearInfoWindows = () => {
        infoWindows.forEach((infoWindow) => infoWindow.close());
        setInfoWindows([]);
    };

    const createInfoWindowContent = (place) => {
        const buttonLabel = "저장";
        const buttonOnClick = `window.savePlace('${place}')`;

        return `
    <div style="padding:10px;font-size:12px;display:flex;flex-direction:column;align-items:flex-start;width:150px;">
      <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%;">
        <strong>${place.place_name}</strong>
      </div>
      <div style="margin-bottom: 8px;">${place.address_name}</div>
      <button onclick="${buttonOnClick}" style="width:100%;background-color:green;color:white;padding:5px;border:none;border-radius:5px;">
        ${buttonLabel}
      </button>
    </div>
  `;
    };

    window.closeInfoWindow = () => {
        infoWindows.forEach((infoWindow, idx) => {
            infoWindow.close();
        });
    };

    window.savePlace = (ePlace) => {
        handleSave(ePlace);
    };

    const handleSearch = () => {
        if (map && keyword) {
            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(keyword, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    setPlaces(data);
                    map.setCenter(new window.kakao.maps.LatLng(data[0].y, data[0].x));
                    map.setLevel(3);

                    clearMarkers();
                    clearInfoWindows();

                    const newMarkers = [];
                    const newInfoWindows = [];

                    data.forEach((place) => {
                        const marker = new window.kakao.maps.Marker({
                            position: new window.kakao.maps.LatLng(place.y, place.x),
                            map: map,
                        });

                        const infoWindow = new window.kakao.maps.InfoWindow({
                            content: createInfoWindowContent(place),
                        });

                        window.kakao.maps.event.addListener(marker, "click", () => {
                            window.closeInfoWindow();
                            setSelectedPlace({
                                address_name: place.address_name,
                                category_group_code: place.category_group_code,
                                category_group_name: place.category_group_name,
                                category_name: place.category_name,
                                id: place.id,
                                phone: place.phone,
                                place_name: place.place_name,
                                place_url: place.place_url,
                                road_address_name: place.road_address_name,
                                position: new window.kakao.maps.LatLng(place.y, place.x),
                            });
                            infoWindow.open(map, marker);
                        });

                        newMarkers.push(marker);
                        newInfoWindows.push(infoWindow);
                    });

                    setMarkers(newMarkers);
                    setInfoWindows(newInfoWindows);
                }
            });
        }
    };

    const handleSave = (ePlace) => {
        if (!isSelectPlace) {
            alert("일정에서 장소 선택 버튼을 눌러주세요!");
        } else {
            if (ePlace) {
                setSelectedPlace(ePlace);
            }

            const newPlace = {
                ...selectedPlace,
                dayIndex: selectedDayIndex,
                placeIndex: selectedPlaceIndex,
            };
            onSave(newPlace); // CourseForm에 장소 데이터 전달
            setSelectedPlace(null);
        }
    };

    const handlePlaceClick = (place) => {
        map.setCenter(place.position);
        map.setLevel(5);
        const marker = markers.find(
            (marker) =>
                marker.getPosition().getLat().toFixed(10) === place.position.getLat().toFixed(10) &&
                marker.getPosition().getLng().toFixed(10) === place.position.getLng().toFixed(10)
        );

        const infoWindow = infoWindows[markers.indexOf(marker)];

        if (infoWindow) {
            window.closeInfoWindow();
            infoWindow.open(map, marker);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        show && (
            <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg w-full max-w-4xl p-6">
                    <div className="flex text-xl text-blue-600 font-bold bg-green-200 justify-center my-3">
                        Day {selectedDayIndex + 1} : {selectedPlaceIndex + 1}번 장소 선택 중
                    </div>
                    <div className="flex">
                        <div ref={mapRef} className="flex-grow mb-4" style={{ width: "400px", height: "500px" }}></div>
                        <div className="ml-4">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="장소를 검색하세요"
                                className="border rounded-md p-2 mb-4 w-full"
                            />
                            <button
                                onClick={handleSearch}
                                className="text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-1.5 text-center">
                                검색
                            </button>

                            <ul className="mt-4">
                                {places.map((place, index) => (
                                    <li
                                        className="border p-2 cursor-pointer hover:bg-gray-100"
                                        key={index}
                                        onClick={() => {
                                            const selectedPosition = new window.kakao.maps.LatLng(place.y, place.x);

                                            const placeData = {
                                                address_name: place.address_name,
                                                category_group_code: place.category_group_code,
                                                category_group_name: place.category_group_name,
                                                category_name: place.category_name,
                                                id: place.id,
                                                phone: place.phone,
                                                place_name: place.place_name,
                                                place_url: place.place_url,
                                                road_address_name: place.road_address_name,
                                                position: selectedPosition,
                                            };

                                            map.setCenter(selectedPosition);
                                            map.setLevel(3);

                                            setSelectedPlace(placeData);

                                            handlePlaceClick(placeData);
                                        }}>
                                        {place.place_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={yes}
                            className="text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2 mr-2">
                            확인
                        </button>
                        <button
                            onClick={no}
                            className="text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2">
                            취소
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default SelectPlaceModal;
