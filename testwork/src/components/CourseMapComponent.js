import React, { useEffect, useState, useRef } from "react";

const CourseMapComponent = ({ onSave, selectedDayIndex, selectedPlaceIndex, isSelectPlace }) => {
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

      // 맵 생성
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      });
      setMap(map);

      // 클릭 이벤트 리스너 등록
      window.kakao.maps.event.addListener(map, "click", () => {
        window.closeInfoWindow();
        setSelectedPlace(null);
      });
    };
    const kakaoMapApi = process.env.REACT_APP_KAKAO_MAP_API_KEY
    console.log(kakaoMapApi)

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApi}&autoload=false&libraries=services`;
    script.async = false; // 스크립트 비동기 로드
    script.onload = () => {
      window.kakao.maps.load(initializeMap); // API 로드 후 초기화 함수 실행
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
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div
        ref={mapRef}
        className="flex-grow mb-4"
        style={{ width: "100%", height: "50vh" }} // 맵의 높이를 뷰포트 높이의 60%로 설정
      ></div>

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
  );
};

export default CourseMapComponent;
