import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router";

import { shallowEqual, useSelector } from "react-redux";
import LoadingAnimation from "../../components/LoadingAnimation";
import SavedPlacesGoogleMapComponent from "../../components/SavedPlacesGoogleMapComponent";
import GoogleSaveLocationPage from "./GoogleSaveLocationPage";

function MyPlace2() {
    //로딩 상태 추가
    const [loading, setLoading] = useState(false)
    // 로그인된 user 정보
    const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual)
    // 저장된 장소 목록의 상태값
    const [placesInfo, setPlacesInfo] = useState([])
    // 기본 좌표는 서울
    const [googleMapCenterLocation, setGoogleMapCenterLocation] = useState({ Ma: 41.4038996, La: 2.1748516 });
    // SaveLocationPage 렌더링 여부를 관리
    const [showPlaceSearch, setShowPlaceSearch] = useState(false)
    // 선택된 장소 메모
    const [selectedPlaceMemo, setSelectedPlaceMemo] = useState("")
    // SavedPlacesGoogleMapComponent를 참조할 ref 생성
    const savedPlacesGoogleMapComponentRef = useRef(null)
    // 변환된 장소 데이터
    const [transformedData, setTransformedData] = useState([])



    const navigate = useNavigate()

    // 저장된 장소 목록 불러오기
    useEffect(() => {
        // 로딩 애니메이션을 0.7초 동안만 표시
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 700)
        axios.get(`/api/v1/users/${loggedInUserId}/trips/saved-places`, {
            params: {
                di: "International"
            }
        })
            .then(res => {
                const savedPlacesList = res.data

                if (savedPlacesList.length > 0) {
                    setPlacesInfo(savedPlacesList)
                    setGoogleMapCenterLocation({
                        Ma: savedPlacesList[0].place.latitude,
                        La: savedPlacesList[0].place.longitude
                    })
                } else {
                    // 장소가 없을 때 기본 상태 유지
                    setPlacesInfo([]);
                }
            })
            .catch(error => {
                alert("저장된 장소를 불러오지 못했습니다.")
                console.log(error)
            })
    }, [loggedInUserId])

    // placesInfo가 변경될 때마다 transformedData를 업데이트
    useEffect(() => {
        const transformed = placesInfo.map(item => {
            return {
                dayIndex: 0,
                La: item.place.longitude,
                Ma: item.place.latitude,
                placeMemo: item.userMemo || "",
                place_url: item.place.placeUrl,
                placeIndex: item.place.id,
                place_name: item.place.placeName,
                address_name: item.place.addressName,
                category_name: item.place.categoryName,
                road_address_name: item.place.roadAddressName,
            };
        });
        setTransformedData(transformed);
    }, [placesInfo]);

    // 장소 검색 버튼 클릭 시 장소 검색 컴포넌트를 열기 위한 핸들러
    const handleOpenPlaceSearch = () => {
        setShowPlaceSearch(true);
    };

    // 장소 저장 후 호출되는 함수
    const handleSavePlace = (place) => {
        const placeInfo = {
            addressName: place.formatted_address,
            mapPlaceId: place.place_id,
            placeName: place.name,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            userId: loggedInUserId,
            userMemo: place.placeMemo || "",
            placeUrl: place.place_url,
            di: "International"
        }

        axios.post(`/api/v1/users/${loggedInUserId}/trips/saved-places`, placeInfo)
            .then(res => {
                console.log(res.data)
                // 장소 저장 후 placesInfo 상태 업데이트
                setPlacesInfo(prevPlacesInfo => [
                    ...prevPlacesInfo,
                    res.data
                ])

                // 저장된 장소의 좌표로 지도 중심 이동
                setGoogleMapCenterLocation({ Ma: placeInfo.latitude, La: placeInfo.longitude })

                // 메모 저장 시 해당 장소 메모도 업데이트
                setSelectedPlaceMemo(placesInfo.userMemo)

                // 장소 저장 후 검색 컴포넌트를 닫습니다.
                setShowPlaceSearch(false)
            }).catch(error => {
                alert("장소를 저장하지 못했습니다.")
                console.log(error)
            })
    };

    const transformPlaceItem = (placeItem) => {
        return {
            La: placeItem.place.longitude || 0,
            Ma: placeItem.place.latitude || 0,
            road_address_name: placeItem.place.addressName || "",
            dayIndex: placeItem.dayIndex || 0,  // dayIndex -> 기본값 0
            id: placeItem.place.mapPlaceId || "",  // mapPlaceId 또는 id -> id
            placeIndex: 0,  // 기본값 0
            placeMemo: placeItem.userMemo || "",  // userMemo -> placeMemo
            place_name: placeItem.place.placeName || "",  // placeName -> place_name
            place_url: placeItem.place.placeUrl || "",  // placeUrl -> place_url
        };
    };

    // 장소 클릭 시 맵 중심 이동, 장소 메모 표시, 인포윈도우 표시
    const handlePlaceClick = (placeItem) => {

        const transformedPlaceItem = transformPlaceItem(placeItem)

        if (savedPlacesGoogleMapComponentRef.current) {
            setGoogleMapCenterLocation({ Ma: placeItem.place.latitude, La: placeItem.place.longitude })
            savedPlacesGoogleMapComponentRef.current.openInfoWindowAtPlace(transformedPlaceItem);
        }

        setSelectedPlaceMemo(placeItem.userMemo || "메모가 없습니다.");
    };

    return (
        <div className="container mx-auto p-4 max-w-[1024px]">
            {/* 로딩 애니메이션 */}
            {loading && <LoadingAnimation />}
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-screen-xl mx-auto p-4">
                    <div className="flex justify-start">
                        <button
                            onClick={() => navigate(`/users/${loggedInUserId}`)}
                            className="text-white bg-tripDuoMint hover:bg-tripDuoGreen focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                            MyPage
                        </button>
                        <button
                            onClick={() => navigate("/private/myPlace")}
                            className="text-white bg-tripDuoMint hover:bg-tripDuoGreen focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                            국내
                        </button>
                    </div>
                    {/* 상단 헤더 */}
                    <h1 className="text-3xl font-bold mb-4 text-center">마이 플레이스(해외)</h1>

                    {/* 장소 검색 버튼 */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleOpenPlaceSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition"
                        >
                            장소 추가
                        </button>
                    </div>

                    {/* 장소 목록 및 지도, 선택된 장소 메모 */}
                    <div className="flex space-x-4">
                        {/* 장소 목록 영역 */}
                        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto top-0">
                            <h2 className="font-bold mb-4">저장된 장소 목록</h2>
                            <ul>
                                {placesInfo.map((placeItem, index) => (
                                    <li
                                        key={index}
                                        className="mb-2 cursor-pointer hover:text-blue-600"
                                        onClick={() => {
                                            handlePlaceClick(placeItem)
                                        }}
                                    >
                                        {index + 1}. {placeItem.place.placeName}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="w-3/4 flex flex-col space-y-4">
                            {/* 지도 영역 */}
                            <div className="flex-grow bg-white rounded-lg shadow-md">
                                <SavedPlacesGoogleMapComponent
                                    savedPlaces={transformedData}
                                    centerLocation={googleMapCenterLocation}
                                    ref={savedPlacesGoogleMapComponentRef}
                                />
                            </div>

                            {/* 선택된 장소 메모 표시 */}
                            {selectedPlaceMemo && (
                                <div className="p-4 bg-white rounded-lg shadow-md">
                                    <h3 className="font-bold mb-2">장소 메모</h3>
                                    <p>{selectedPlaceMemo}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SaveLocationPage 모달 */}
                    {showPlaceSearch && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-2/3 max-w-4xl"
                                style={{ maxHeight: "80vh", overflowY: "auto" }}>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowPlaceSearch(false)}
                                        className="text-red-600 hover:text-red-800 text-3xl font-bold"
                                        aria-label="Close">
                                        &times;
                                    </button>
                                </div>
                                <GoogleSaveLocationPage onSave={handleSavePlace} />
                                {/* <button
                                    onClick={() => setShowPlaceSearch(false)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-400 transition"
                                >
                                    닫기
                                </button> */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyPlace2;