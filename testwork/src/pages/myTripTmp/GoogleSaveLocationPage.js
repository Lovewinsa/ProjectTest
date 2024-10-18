import React, { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GoogleSaveLocationPage = ({ onSave }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  const [placeMemo, setPlaceMemo] = useState(""); // 장소 메모 상태 추가

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

      map.addListener("click", () => {
        closeInfoWindows();
        setSelectedPlace(null);
      });
    });
  }, []);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const closeInfoWindows = () => {
    infoWindows.forEach((infoWindow) => infoWindow.close());
  };

  const createInfoWindowContent = (place) => {
    return `
      <div style="padding:10px;font-size:14px;display:flex;flex-direction:column;align-items:flex-start;width:100%;max-width:300px;height:100%;max-height:600px;">
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%;">
          <strong>${place.name}</strong>
        </div>
        <div style="margin-bottom: 8px;">${place.formatted_address}</div>
        <textarea placeholder="장소 메모..." maxLength={100} style="width: 100%; margin-bottom: 8px;" oninput="updatePlaceMemo('${place.place_id}', this.value)">${placeMemo || ''}</textarea>
        <button
          onclick="savePlace('${place.place_id}')"
          style="width:100%;background-color:green;color:white;padding:5px;border:none;border-radius:5px;">
          저장
        </button>
      </div>
    `;
  };
  

  window.updatePlaceMemo = (placeId, memo) => {
    setPlaceMemo(memo); // 메모 상태 업데이트
  };

  window.savePlace = (placeId) => {
    const placeToSave = places.find((place) => place.place_id === placeId);
    if (placeToSave) {
      // console.log(placeToSave)
      handleSave(placeToSave);
    }
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
          closeInfoWindows();

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
              closeInfoWindows()

              setSelectedPlace({
                ...place,
                position: place.geometry.location,
                place_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
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

  const handleSave = (place) => {

    if (place) {
      setSelectedPlace(place)

      const placeToSave = {
        ...selectedPlace,
        placeMemo, // 메모 추가
      };
      onSave(placeToSave); // 선택된 장소와 메모를 외부 컴포넌트로 전달
      setSelectedPlace(null);
      setPlaceMemo(""); // 저장 후 메모 초기화
    }
  };

  const handlePlaceClick = (place) => {
    map.setCenter(place.position);
    map.setZoom(15);
    const marker = markers.find(
      (marker) =>
        marker.getPosition().lat().toFixed(10) === place.geometry.location.lat().toFixed(10) &&
        marker.getPosition().lng().toFixed(10) === place.geometry.location.lng().toFixed(10)
    );

    const infoWindow = infoWindows[markers.indexOf(marker)];

    if (infoWindow) {
      closeInfoWindows();
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
        style={{ width: "100%", height: "50vh" }}
      ></div>

      <div className="flex flex-col space-y-2 p-2 bg-white border-t border-gray-200">
        <div className="flex space-x-2 p-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="장소를 검색하세요"
            className="border p-2 rounded-l-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSearch}
            className="text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-r-lg text-sm px-4 py-2"
          >
            검색
          </button>
        </div>

        <ul className="border border-gray-200 p-2 rounded max-h-60 overflow-y-auto">
          {places.map((place, index) => (
            <li
              className={`border-b last:border-none p-2 cursor-pointer hover:bg-gray-100 ${
                selectedPlace && selectedPlace.place_id === place.place_id ? "bg-blue-100" : ""
              }`}
              key={index}
              onClick={() => {
                const selectedPosition = place.geometry.location;

                const placeData = {
                  ...place,
                  position: selectedPosition,
                  place_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                };

                setSelectedPlace(placeData);
                handlePlaceClick(placeData);
              }}
            >
              {place.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoogleSaveLocationPage;
