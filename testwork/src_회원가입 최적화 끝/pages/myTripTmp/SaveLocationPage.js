import React, { useEffect, useState, useRef } from "react";

  

const SaveLocationPage = ({ onSave }) => {
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

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const clearInfoWindows = () => {
    infoWindows.forEach((infoWindow) => infoWindow.close());
    setInfoWindows([]);
  };

  //장소메모 데이터를 추가하기 위한 함수
  window.updatePlaceMemo = (placeId, memo) => {
    const updatedPlaces = places.map((place) => {
      if (place.id === placeId) {
        return {
          ...place,
          placeMemo: memo,
        };
      }
      return place;
    });
    setPlaces(updatedPlaces);
  };

  //검색한 결과 선택 시 렌더링 되는 박스
  const createInfoWindowContent = (place) => {
    const buttonLabel = "저장";
    const buttonOnClick = `window.savePlace('${place.place_name}')`;
    const textareaOnInput = `window.updatePlaceMemo('${place.id}', this.value)`;
  
    return `
      <div style="padding:10px;font-size:12px;display:flex;flex-direction:column;align-items:flex-start;width:100%;max-width:600px;">
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%;">
          <strong>${place.place_name}</strong>
        </div>
        <div style="margin-bottom: 8px;">${place.address_name}</div>
        <div style="margin-bottom: 8px;">전화번호: ${place.phone || '정보 없음'}</div>
        <div style="margin-bottom: 8px;"><a href="${place.place_url}" target="_blank">장소 링크</a></div>
        <textarea placeholder="장소 메모..." style="width: 100%; margin-bottom: 8px;" oninput="${textareaOnInput}">${place.placeMemo || ''}</textarea>
        <button
        onclick="${buttonOnClick}"
        style="width:100%;background-color:green;color:white;padding:5px;border:none;border-radius:5px;">
          ${buttonLabel}
        </button>
      </div>
    `;
  };

  window.closeInfoWindow = () => {
    infoWindows.forEach((infoWindow) => infoWindow.close());
  };

  window.savePlace = (placeName) => {
    const placeToSave = places.find((place) => place.place_name === placeName);
    if (placeToSave) {
      handleSave(placeToSave);
    }
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
                ...place,
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

  const handleSave = (place) => {
    if (place) {

      onSave(place); // 선택된 장소를 외부 컴포넌트로 전달
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
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div
        ref={mapRef}
        className="flex-grow mb-4 p-4"
        style={{ width: "100%", minHeight: "40vh", maxHeight: "60vh" }}
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

        <ul className="border border-gray-200 p-2 rounded max-h-60 overflow-y-auto custom-scrollbar">
          {places.map((place, index) => (
            <li
              className={`border-b last:border-none p-2 cursor-pointer hover:bg-gray-100 ${selectedPlace && selectedPlace.id === place.id ? "bg-blue-100" : ""
                }`}
              key={index}
              onClick={() => {
                const selectedPosition = new window.kakao.maps.LatLng(place.y, place.x);

                const placeData = {
                  ...place,
                  position: selectedPosition,
                };

                setSelectedPlace(placeData);
                handlePlaceClick(placeData);
              }}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SaveLocationPage;
