import React, { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const CourseGoogleMapComponent = ({ onSave, selectedDayIndex, selectedPlaceIndex, isSelectPlace }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [places, setPlaces] = useState([]);
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

            map.addListener("click", () => {
                window.closeInfoWindows();
                setSelectedPlace(null);
            });
        });
    }, []);

    const clearMarkers = () => {
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);
    };

    window.closeInfoWindows = () => {
        infoWindows.forEach((infoWindow) => infoWindow.close());
    };

    const createInfoWindowContent = (place) => {
        return `
      <div style="padding:10px;font-size:12px;display:flex;flex-direction:column;align-items:flex-start;width:150px;">
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%;">
          <strong>${place.name}</strong>
        </div>
        <div style="margin-bottom: 8px;">${place.formatted_address}</div>
        <button onclick="window.savePlace('${place}')" style="width:100%;background-color:green;color:white;padding:5px;border:none;border-radius:5px;">
          저장
        </button>
      </div>
    `;
    };

    window.savePlace = (eplace) => {
        handleSave(eplace);
    };

    const handleSearch = () => {
        if (map && keyword) {
            const service = new window.google.maps.places.PlacesService(map);
            service.textSearch({ query: keyword }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setPlaces(results);
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(14);

                    clearMarkers();
                    window.closeInfoWindows();

                    const newMarkers = [];
                    const newInfoWindows = [];

                    results.forEach((place) => {
                        const marker = new window.google.maps.Marker({
                            position: place.geometry.location,
                            map: map,
                        });

                        const infoWindow = new window.google.maps.InfoWindow({
                            content: createInfoWindowContent(place),
                        });

                        marker.addListener("click", () => {
                            window.closeInfoWindows();
                            setSelectedPlace({
                                address_name: "",
                                category_group_code: "",
                                category_group_name: "",
                                category_name: place.types.join(" > "),
                                id: place.place_id,
                                phone: "",
                                place_name: place.name,
                                place_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                                road_address_name: place.formatted_address,
                                La: place.geometry.location.lng(),
                                Ma: place.geometry.location.lat(),

                                business_status: place.business_status,
                                open_now: place?.opening_hours?.open_now ?? "",
                                rating: place.rating,
                                user_ratings_total: place.user_ratings_total,
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
            onSave(newPlace);
            setSelectedPlace(null);
        }
    };

    const handlePlaceClick = (place) => {
        map.setCenter(place.position);
        map.setZoom(15);
        const marker = markers.find(
            (marker) =>
                marker.getPosition().lat().toFixed(10) === place.Ma.toFixed(10) &&
                marker.getPosition().lng().toFixed(10) === place.La.toFixed(10)
        );

        const infoWindow = infoWindows[markers.indexOf(marker)];

        if (infoWindow) {
            window.closeInfoWindows();
            infoWindow.open(map, marker);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <div
                ref={mapRef}
                className="flex-grow mb-4"
                // 맵의 높이를 뷰포트 높이의 60%로 설정
                style={{ width: "100%", height: "50vh" }}>
            </div>

            <div className="flex flex-col space-y-2 p-2 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="장소를 검색하세요"
                        className="border p-2 flex-grow"
                    />
                    <button
                        onClick={handleSearch}
                        className="text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-1.5 text-center w-1/5">
                        검색
                    </button>
                </div>
                <ul className="border border-gray-200 p-2 rounded max-h-60 overflow-y-auto">
                    {places.map((place, index) => (
                        <li
                            className="border-b last:border-none p-2 cursor-pointer hover:bg-gray-100"
                            key={index}
                            onClick={() => {
                                const placeData = {
                                    address_name: "",
                                    category_group_code: "",
                                    category_group_name: "",
                                    category_name: place.types.join(" > "),
                                    id: place.place_id,
                                    phone: "",
                                    place_name: place.name,
                                    place_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                                    road_address_name: place.formatted_address,
                                    La: place.geometry.location.lng(),
                                    Ma: place.geometry.location.lat(),

                                    business_status: place.business_status,
                                    open_now: place?.opening_hours?.open_now ?? "",
                                    rating: place.rating,
                                    user_ratings_total: place.user_ratings_total,
                                };
                                console.log(place)
                                console.log(placeData);

                                map.setCenter(place.geometry.location);
                                map.setZoom(15);

                                setSelectedPlace(placeData);
                                handlePlaceClick(placeData);
                            }}>
                            {place.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseGoogleMapComponent;