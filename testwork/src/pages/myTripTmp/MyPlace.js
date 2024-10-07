import axios from "axios"
import { useEffect, useState } from "react"
import SaveLocationPage from "./SaveLocationPage";
import ViewLocationsPage from "./ViewLocationsPage";
import { useNavigate } from "react-router";
import SavedPlacesMapComponent from "../../components/SavedPlacesKakaoMapComponent";


function MyPlace() {
    //저장된 장소 목록의 상태값
    const [placesInfo, setPlacesInfo] = useState([])
    //기본 좌표는 서울
    const [centerLocation, setCenterLocation] = useState({ Ma: 37.5665, La: 126.978 });
    //SaveLocationPage 렌더링 여부를 관리
    const [showPlaceSearch, setShowPlaceSearch] = useState(false)
    const navigate = useNavigate()

    //저장된 장소 목록 불러오기
    useEffect(() => {
        axios.get("/api/v1/places")
            .then(res => {
                console.log(res.data)
                setPlacesInfo(res.data)
            })
            .catch(error=>{
                alert("저장된 장소를 불러오지 못했습니다.")
                console.log(error)                
            })
    }, [])

    // 장소 검색 버튼 클릭 시 장소 검색 컴포넌트를 열기 위한 핸들러
    const handleOpenPlaceSearch = () => {
        setShowPlaceSearch(true);
    };

    // 장소 저장 후 호출되는 함수
    const handleSavePlace = (place) => {
        const placeInfo = {
            addressName: place.address_name,
            categoryGroupCode: place.category_group_code,
            categoryGroupName: place.category_group_name,
            categoryName: place.category_name,
            placeId: place.id,  // 여기서 placeId는 id 필드로 변경
            phone: place.phone,
            placeName: place.place_name,
            placeUrl: place.place_url,
            roadAddressName: place.road_address_name,
            latitude: parseFloat(place.y),  // y를 latitude로 변환
            longitude: parseFloat(place.x), // x를 longitude로 변환
        };
        axios.post("/api/v1/places", placeInfo)
            .then(res => {
                // 장소 저장 후 검색 컴포넌트를 닫습니다.
                setShowPlaceSearch(false)
            }).catch(error => {
                alert("장소를 저장하지 못했습니다.")
                console.log(error)
            })
    };

    //장소 클릭 시 맵 중심 이동
    const handlePlaceClick = (place) => {
        if (place.latitude && place.longitude) {
            setCenterLocation({ Ma: place.latitude, La: place.longitude });
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-screen-xl mx-auto p-4">
                {/* 상단 헤더 */}
                <h1 className="text-3xl font-bold mb-4 text-center">마이 플레이스</h1>

                {/* 장소 검색 버튼 */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleOpenPlaceSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition"
                    >
                        장소 추가
                    </button>
                </div>

                {/* 장소 목록 및 지도 */}
                <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
                    {/* 장소 목록 영역 */}
                    <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-bold mb-4">저장된 장소 목록</h2>
                        <ul>
                            {placesInfo.map((place, index) => (
                                <li
                                    key={index}
                                    className="mb-2 cursor-pointer hover:text-blue-600"
                                    onClick={() => {
                                        handlePlaceClick(place)
                                    }}
                                >
                                    {index + 1}. {place.placeName}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 지도 영역 */}
                    <div className="w-full lg:w-3/4 bg-white rounded-lg shadow-md">
                        <SavedPlacesMapComponent savedPlaces={placesInfo} centerLocation={centerLocation} />
                    </div>
                </div>

                {/* SaveLocationPage 모달 */}
                {showPlaceSearch && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
                            <SaveLocationPage onSave={handleSavePlace} />
                            <button
                                onClick={() => setShowPlaceSearch(false)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-400 transition"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyPlace