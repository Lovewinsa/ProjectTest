import React, { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";

const MapComponent = ({ onSave, onLoad }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [selectedSavedPlace, setSelectedSavedPlace] = useState(null);
  const [showOnlySavedPlaces, setShowOnlySavedPlaces] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/map/googleKey`)
      .then(res => {
        setApiKey(res.data);
      })
      .catch(err => console.log(err));
  });

  useEffect(() => {
    if(!apiKey) return;
      
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["places"]
      });

      const google = await loader.load();
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 37.5665, lng: 126.978 },
        zoom: 14,
      });

      setMap(map);
      onLoad(map);

      google.maps.event.addListener(map, "click", () => {
        closeAllInfoWindows();
        setSelectedPlace(null);
        setSelectedSavedPlace(null);
      });
    };

    initializeMap();

    const loadedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]");
    setSavedPlaces(loadedPlaces);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("savedPlaces", JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  useEffect(() => {
    if (map && savedPlaces.length > 0) {
      clearMarkers();
      clearInfoWindows();

      const newMarkers = [];
      const newInfoWindows = [];

      savedPlaces.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.position,
          map: map,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(place),
        });

        marker.addListener("click", () => {
          closeAllInfoWindows();
          setSelectedSavedPlace(place);
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
        newInfoWindows.push(infoWindow);
      });

      setMarkers(newMarkers);
      setInfoWindows(newInfoWindows);
    }
  }, [map, savedPlaces]);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const clearInfoWindows = () => {
    infoWindows.forEach((infoWindow) => infoWindow.close());
    setInfoWindows([]);
  };

  const closeAllInfoWindows = () => {
    infoWindows.forEach((infoWindow) => infoWindow.close());
  };

  const createInfoWindowContent = (place) => {
    const isSaved = savedPlaces.some((savedPlace) => savedPlace.id === place.id);
    const buttonLabel = isSaved ? "삭제" : "저장";
    const buttonOnClick = isSaved ? `window.removePlace('${place.id}')` : `window.savePlace('${place}')`;

    return `
      <div style="padding:10px;font-size:12px;display:flex;flex-direction:column;align-items:flex-start;width:150px;">
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%;">
          <strong>${place.name}</strong>
        </div>
        <div style="margin-bottom: 8px;">${place.formatted_address}</div>
        <button onclick="${buttonOnClick}" style="width:100%;background-color:${isSaved ? "red" : "green"
      };color:white;padding:5px;border:none;border-radius:5px;">
          ${buttonLabel}
        </button>
      </div>
    `;
  };

  window.savePlace = (ePlace) => {
    handleSave(ePlace);
  };

  window.removePlace = (id) => {
    const newSavedPlaces = savedPlaces.filter((place) => place.id !== id);
    setSavedPlaces(newSavedPlaces);
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
          clearInfoWindows();

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
              closeAllInfoWindows();
              setSelectedPlace({
                id: place.place_id,
                name: place.name,
                formatted_address: place.formatted_address,
                position: place.geometry.location.toJSON(),
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
      setSelectedPlace(place);
    }

    if (selectedPlace) {
      const isAlreadySaved = savedPlaces.some((p) => p.id === selectedPlace.id);
      if (isAlreadySaved) {
        alert("이미 저장된 장소입니다.");
      } else {
        setSavedPlaces([...savedPlaces, selectedPlace]);
        onSave(selectedPlace);
        setSelectedPlace(null);
      }
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedSavedPlace(place);

    map.setCenter(place.position);
    map.setZoom(15);

    const marker = markers.find(
      (marker) =>
        marker.getPosition().lat().toFixed(10) === place.position.lat.toFixed(10) &&
        marker.getPosition().lng().toFixed(10) === place.position.lng.toFixed(10)
    );

    const infoWindow = infoWindows[markers.indexOf(marker)];

    if (infoWindow) {
      closeAllInfoWindows();
      infoWindow.open(map, marker);
    }
  };

  const handleShowSavedPlaces = () => {
    setShowOnlySavedPlaces(!showOnlySavedPlaces);

    if (!showOnlySavedPlaces) {
      clearMarkers();

      const savedMarkers = savedPlaces.map((place) => {
        return new window.google.maps.Marker({
          position: place.position,
          map: map,
        });
      });
      setMarkers(savedMarkers);
    } else {
      handleSearch();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteSavedPlace = () => {
    if (selectedSavedPlace) {
      const newSavedPlaces = savedPlaces.filter((place) => place.id !== selectedSavedPlace.id);
      setSavedPlaces(newSavedPlaces);
      setSelectedSavedPlace(null);
      alert("장소가 삭제되었습니다.");
    }
  };

  const urlPattern = new RegExp(/^(https?:\/\/)?([a-z\d-]+\.)+[a-z]{2,6}(:\d{1,5})?(\/.*)?$/i);

  return (
    <div className="flex h-screen bg-gray-100">
      <div ref={mapRef} className="w-1/2 h-full"></div>

      <div className="w-1/6 p-4 bg-white shadow-md">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="장소를 검색하세요"
          className="w-full p-2 mb-2 border rounded"
        />
        <button onClick={handleSearch} className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          검색
        </button>

        <ul className="mt-4 space-y-2">
          {places.map((place, index) => (
            <li
              key={index}
              onClick={() => {
                const placeData = {
                  id: place.place_id,
                  name: place.name,
                  formatted_address: place.formatted_address,
                  position: place.geometry.location.toJSON(),
                  //place: JSON.stringify(place),
                };

                map.setCenter(place.geometry.location);
                map.setZoom(15);

                setSelectedPlace(placeData);
                setSelectedSavedPlace(placeData);
                handlePlaceClick(placeData);
              }}
              className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${selectedPlace && selectedPlace.id === place.place_id ? "bg-blue-100 border border-blue-500" : ""
                }`}>
              {place.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-1/6 p-4 bg-white shadow-md">
        <h2 className="mb-2 text-xl font-bold">저장된 장소 목록</h2>
        <button
          onClick={handleShowSavedPlaces}
          className="w-full p-2 my-4 text-white bg-purple-500 rounded hover:bg-purple-600">
          {showOnlySavedPlaces ? "모든 장소 보기" : "저장한 장소만 보기"}
        </button>
        <ul className="space-y-2">
          {savedPlaces.map((place, index) => (
            <li
              key={index}
              onClick={() => handlePlaceClick(place)}
              className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${selectedSavedPlace && selectedSavedPlace.id === place.id ? "bg-blue-100 border border-blue-500" : ""
                }`}>
              {place.name}
            </li>
          ))}
        </ul>
      </div>

      {selectedSavedPlace && (
        <div className="w-1/6 p-4 bg-white shadow-md">
          <h3 className="mb-4 text-lg font-semibold">{selectedSavedPlace.name} 정보</h3>
          <ul className="space-y-2">
            {Object.entries(selectedSavedPlace).map(([key, value]) => {
              const valueString = value.toString();
              const isUrl = urlPattern.test(valueString);

              return (
                <li key={key} className="p-2 bg-gray-50 rounded">
                  <div>
                    <strong className="font-medium">{key}:</strong>
                  </div>
                  {isUrl ? (
                    <a href={valueString} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                      {valueString}
                    </a>
                  ) : (
                    valueString
                  )}
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleDeleteSavedPlace}
            className="w-full p-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600">
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;